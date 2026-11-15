-- BloodRadar Verification Suite: PostGIS Spatial Queries & Integrity Checks
-- Run this script in the Supabase SQL Editor to verify that PostGIS, constraints, and RLS are functioning.

-- ==============================================================================
-- 1. VERIFY POSTGIS ST_DWithin CASCADING RADIUS QUERIES
-- Center: Square Hospital, Panthapath (90.3817° E, 23.7530° N)
-- Target Blood Group: O+ (Available & not in cooldown)
-- ==============================================================================

-- A. Stage 1 Radius: Within 3,000 meters (3 km)
-- Expected: ~3-5 eligible O+ donors (e.g. Farmgate, Kalabagan). Donors in cooldown must be excluded!
SELECT 
  'Stage 1 (3 km)' AS stage_test,
  id,
  demo_name,
  blood_group,
  round((extensions.ST_Distance(location, extensions.ST_SetSRID(extensions.ST_MakePoint(90.3817, 23.7530), 4326)) / 1000)::numeric, 2) AS distance_km,
  address_text
FROM public.donors
WHERE blood_group = 'O+'
  AND is_available = true
  AND (cooldown_ends_at IS NULL OR cooldown_ends_at <= now())
  AND extensions.ST_DWithin(
    location,
    extensions.ST_SetSRID(extensions.ST_MakePoint(90.3817, 23.7530), 4326),
    3000
  )
ORDER BY distance_km ASC;

-- B. Stage 2 Radius: Within 5,000 meters (5 km)
SELECT 
  'Stage 2 (5 km)' AS stage_test,
  id,
  demo_name,
  blood_group,
  round((extensions.ST_Distance(location, extensions.ST_SetSRID(extensions.ST_MakePoint(90.3817, 23.7530), 4326)) / 1000)::numeric, 2) AS distance_km,
  address_text
FROM public.donors
WHERE blood_group = 'O+'
  AND is_available = true
  AND (cooldown_ends_at IS NULL OR cooldown_ends_at <= now())
  AND extensions.ST_DWithin(
    location,
    extensions.ST_SetSRID(extensions.ST_MakePoint(90.3817, 23.7530), 4326),
    5000
  )
ORDER BY distance_km ASC;

-- C. Stage 3 Radius: Within 10,000 meters (10 km)
SELECT 
  'Stage 3 (10 km)' AS stage_test,
  id,
  demo_name,
  blood_group,
  round((extensions.ST_Distance(location, extensions.ST_SetSRID(extensions.ST_MakePoint(90.3817, 23.7530), 4326)) / 1000)::numeric, 2) AS distance_km,
  address_text
FROM public.donors
WHERE blood_group = 'O+'
  AND is_available = true
  AND (cooldown_ends_at IS NULL OR cooldown_ends_at <= now())
  AND extensions.ST_DWithin(
    location,
    extensions.ST_SetSRID(extensions.ST_MakePoint(90.3817, 23.7530), 4326),
    10000
  )
ORDER BY distance_km ASC;

-- ==============================================================================
-- 2. VERIFY EXCLUSION OF DONORS IN ACTIVE 90-DAY COOLDOWN
-- ==============================================================================
-- 'Rahim Uddin (In Cooldown)' is 0.4 km away from Square Hospital, but must be excluded from active queries
SELECT 
  id,
  demo_name,
  cooldown_ends_at,
  (cooldown_ends_at > now()) AS is_in_cooldown
FROM public.donors
WHERE demo_name LIKE '%Cooldown%'
LIMIT 5;

-- ==============================================================================
-- 3. VERIFY CONSTRAINT INTEGRITY (All should fail with CHECK constraint violation)
-- ==============================================================================
DO $$
BEGIN
  -- Test 1: Invalid Phone Number format
  BEGIN
    INSERT INTO public.profiles (id, email, full_name, phone, role)
    VALUES ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'badphone@test.com', 'Bad Phone', '02123456789', 'requester');
    RAISE EXCEPTION 'FAIL: Invalid phone number was accepted!';
  EXCEPTION WHEN check_violation THEN
    RAISE NOTICE 'PASS: Invalid phone number was rejected by CHECK constraint.';
  END;

  -- Test 2: Invalid Units Needed (0 units)
  BEGIN
    INSERT INTO public.blood_requests (
      requester_id, patient_name, contact_number, blood_group, units_needed,
      hospital_name, location, address_text, needed_by, deadline
    )
    VALUES (
      '00000000-0000-0000-0000-000000000001', 'Test Patient', '01711223344', 'O+', 0,
      'Test Hospital', extensions.ST_SetSRID(extensions.ST_MakePoint(90.38, 23.75), 4326),
      'Dhaka', now() + interval '2 hours', now() + interval '1 hour'
    );
    RAISE EXCEPTION 'FAIL: Zero units needed was accepted!';
  EXCEPTION WHEN check_violation THEN
    RAISE NOTICE 'PASS: Zero units needed was rejected by CHECK constraint.';
  END;
END $$;
