-- BloodRadar Migration 04: Triggers & Automated Auth Integration
-- Automatically creates a user profile on auth signup and manages updated_at timestamps

-- 1. Generic updated_at timestamp function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to all relevant tables
DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON public.profiles;
CREATE TRIGGER trigger_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_donors_updated_at ON public.donors;
CREATE TRIGGER trigger_donors_updated_at
  BEFORE UPDATE ON public.donors
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_blood_requests_updated_at ON public.blood_requests;
CREATE TRIGGER trigger_blood_requests_updated_at
  BEFORE UPDATE ON public.blood_requests
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_system_settings_updated_at ON public.system_settings;
CREATE TRIGGER trigger_system_settings_updated_at
  BEFORE UPDATE ON public.system_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 2. Auth User Creation Trigger
-- Security Constraint: New users get role 'donor' or 'requester' only.
-- 'admin' role CANNOT be assigned via signup metadata or public API under any circumstance.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  assigned_role TEXT;
  user_phone TEXT;
  user_full_name TEXT;
BEGIN
  -- Extract role from metadata, strictly sanitizing against 'admin'
  assigned_role := COALESCE(NEW.raw_user_meta_data->>'role', 'requester');
  IF assigned_role NOT IN ('donor', 'requester') THEN
    assigned_role := 'requester'; -- Reject and downgrade any 'admin' attempt
  END IF;

  user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', 'BloodRadar User');
  user_phone := COALESCE(NEW.raw_user_meta_data->>'phone', '01700000000');

  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    phone,
    role,
    is_active
  )
  VALUES (
    NEW.id,
    NEW.email,
    user_full_name,
    user_phone,
    assigned_role,
    true
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
