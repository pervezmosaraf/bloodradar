-- Migration: 20261116000001_auth_and_search.sql
-- Description: PostGIS donor search function, RLS updates for registration, and trigger hardening.

-- 1. Enable PostGIS extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. PostGIS Donor Search Function
CREATE OR REPLACE FUNCTION public.search_donors(
  p_lat double precision,
  p_lng double precision,
  p_radius_km integer DEFAULT 5,
  p_blood_group text DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  label text,
  blood_group text,
  is_available boolean,
  distance_km numeric,
  is_demo boolean
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_search_point geography;
BEGIN
  -- Strict validation on radius: only 3, 5, or 10 km permitted
  IF p_radius_km NOT IN (3, 5, 10) THEN
    RAISE EXCEPTION 'Invalid radius: %. Only 3, 5, or 10 km are supported.', p_radius_km;
  END IF;

  -- Validate Bangladesh geographic bounds
  IF p_lat < 20.0 OR p_lat > 27.0 OR p_lng < 88.0 OR p_lng > 93.0 THEN
    RAISE EXCEPTION 'Search coordinates are outside Bangladesh boundaries.';
  END IF;

  -- Construct spherical geography point (Longitude first, Latitude second)
  v_search_point := ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography;

  RETURN QUERY
  SELECT
    d.id,
    ('Donor #' || upper(substr(d.id::text, 1, 4)))::text AS label,
    d.blood_group::text,
    d.is_available,
    -- Distance rounded to nearest 0.5 km (zero exact coordinate disclosure)
    (round((ST_Distance(d.location, v_search_point) / 500.0)::numeric) * 0.5)::numeric AS distance_km,
    COALESCE(d.is_demo, false) AS is_demo
  FROM public.donors d
  WHERE
    d.location IS NOT NULL
    AND d.is_available = true
    AND (d.cooldown_ends_at IS NULL OR d.cooldown_ends_at <= now())
    AND (p_blood_group IS NULL OR p_blood_group = 'All' OR d.blood_group = p_blood_group)
    AND ST_DWithin(d.location, v_search_point, p_radius_km * 1000)
  ORDER BY ST_Distance(d.location, v_search_point) ASC
  LIMIT 50;
END;
$$;

-- Grant execute permissions to public anon and authenticated users
GRANT EXECUTE ON FUNCTION public.search_donors(double precision, double precision, integer, text) TO anon, authenticated;

-- 3. RLS Permissions: Ensure authenticated users can register and manage their profile
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can insert own profile'
  ) THEN
    CREATE POLICY "Users can insert own profile" ON public.profiles
      FOR INSERT TO authenticated
      WITH CHECK (id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile" ON public.profiles
      FOR UPDATE TO authenticated
      USING (id = auth.uid());
  END IF;
END $$;

-- 4. RLS Permissions: Ensure authenticated donors can insert/update their donor profile
ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'donors' AND policyname = 'Donors can insert own record'
  ) THEN
    CREATE POLICY "Donors can insert own record" ON public.donors
      FOR INSERT TO authenticated
      WITH CHECK (profile_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'donors' AND policyname = 'Donors can update own record'
  ) THEN
    CREATE POLICY "Donors can update own record" ON public.donors
      FOR UPDATE TO authenticated
      USING (profile_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'donors' AND policyname = 'Anyone can view active donors via search'
  ) THEN
    CREATE POLICY "Anyone can view active donors via search" ON public.donors
      FOR SELECT TO anon, authenticated
      USING (is_available = true);
  END IF;
END $$;

-- 5. Trigger Hardening: Ensure handle_new_user defaults role to requester if unspecified
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role user_role;
  v_full_name text;
  v_phone text;
BEGIN
  -- Extract user metadata
  v_full_name := COALESCE(new.raw_user_meta_data->>'full_name', '');
  v_phone := new.raw_user_meta_data->>'phone';
  
  -- Prevent privilege escalation: only 'donor' or 'requester' can be assigned via metadata
  IF new.raw_user_meta_data->>'role' = 'donor' THEN
    v_role := 'donor'::user_role;
  ELSE
    v_role := 'requester'::user_role;
  END IF;

  INSERT INTO public.profiles (id, email, full_name, phone, role)
  VALUES (
    new.id,
    new.email,
    v_full_name,
    v_phone,
    v_role
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = CASE WHEN profiles.full_name = '' THEN EXCLUDED.full_name ELSE profiles.full_name END,
    phone = COALESCE(profiles.phone, EXCLUDED.phone),
    role = profiles.role,
    updated_at = now();

  RETURN new;
END;
$$;
