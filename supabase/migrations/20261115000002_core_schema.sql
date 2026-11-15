-- BloodRadar Migration 02: Core Database Schema
-- Implements profiles, donors, blood_requests, donor_responses, notifications, donation_history, admin_logs, system_settings, contact_messages

-- 1. Profiles Table (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL CHECK (phone ~ '^01[3-9][0-9]{8}$'),
  role TEXT NOT NULL DEFAULT 'requester' CHECK (role IN ('donor', 'requester', 'admin')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Donors Table
-- profile_id is NULL for seeded demo donors without auth records, populated for real registered users
CREATE TABLE IF NOT EXISTS public.donors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NULL,
  demo_name TEXT NULL,
  demo_phone TEXT NULL,
  blood_group TEXT NOT NULL CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  is_available BOOLEAN NOT NULL DEFAULT true,
  location extensions.geography(Point, 4326) NOT NULL,
  address_text TEXT NOT NULL,
  last_donation_date DATE NULL,
  cooldown_ends_at TIMESTAMPTZ NULL,
  is_demo BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT check_donor_identity CHECK (
    (profile_id IS NOT NULL) OR (is_demo = true AND demo_name IS NOT NULL)
  )
);

-- 3. Blood Requests Table
CREATE TABLE IF NOT EXISTS public.blood_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  patient_name TEXT NOT NULL,
  contact_number TEXT NOT NULL CHECK (contact_number ~ '^01[3-9][0-9]{8}$'),
  blood_group TEXT NOT NULL CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  units_needed INT NOT NULL CHECK (units_needed > 0 AND units_needed <= 10),
  hospital_name TEXT NOT NULL,
  location extensions.geography(Point, 4326) NOT NULL,
  address_text TEXT NOT NULL,
  needed_by TIMESTAMPTZ NOT NULL,
  deadline TIMESTAMPTZ NOT NULL,
  current_stage INT NOT NULL DEFAULT 0 CHECK (current_stage BETWEEN 0 AND 3),
  current_radius_km NUMERIC(4, 1) NOT NULL DEFAULT 3.0 CHECK (current_radius_km >= 0),
  stage_duration_seconds INT NOT NULL DEFAULT 600 CHECK (stage_duration_seconds >= 10),
  stage_started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'locked', 'completed', 'expired', 'cancelled')),
  single_donor BOOLEAN NOT NULL DEFAULT true,
  notes TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT check_future_deadline CHECK (deadline > created_at)
);

-- 4. Donor Responses Table (Unique request_id + donor_id prevents duplicate responses)
CREATE TABLE IF NOT EXISTS public.donor_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES public.blood_requests(id) ON DELETE CASCADE NOT NULL,
  donor_id UUID REFERENCES public.donors(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  responded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes TEXT NULL,
  CONSTRAINT uq_request_donor_response UNIQUE (request_id, donor_id)
);

-- 5. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('stage_expansion', 'request_locked', 'request_expired', 'donation_confirmed', 'emergency_alert', 'system')),
  link TEXT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Donation History Table (Permanent verified audit record of completed donations)
CREATE TABLE IF NOT EXISTS public.donation_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES public.blood_requests(id) ON DELETE SET NULL NULL,
  donor_id UUID REFERENCES public.donors(id) ON DELETE CASCADE NOT NULL,
  requester_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  units_donated INT NOT NULL DEFAULT 1 CHECK (units_donated > 0),
  donation_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  hospital_name TEXT NOT NULL,
  notes TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Admin Activity Logs Table
CREATE TABLE IF NOT EXISTS public.admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id UUID NULL,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. System Settings Table (Configurable stage durations and presentation demo switches)
CREATE TABLE IF NOT EXISTS public.system_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insert default system settings
INSERT INTO public.system_settings (key, value, description)
VALUES 
  ('stage_durations', '{"stage1_sec": 600, "stage2_sec": 600, "stage3_sec": 600}'::jsonb, 'Standard production stage durations in seconds (10 minutes each)'),
  ('demo_mode', '{"enabled": false, "stage_duration_sec": 30}'::jsonb, 'Demo mode switch for rapid 30-second live cascading presentations'),
  ('cooldown_policy', '{"cooldown_days": 90}'::jsonb, 'Mandatory donor recovery period in days')
ON CONFLICT (key) DO NOTHING;

-- 9. Contact Messages Table (Public inquiry and clinical feedback storage)
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
