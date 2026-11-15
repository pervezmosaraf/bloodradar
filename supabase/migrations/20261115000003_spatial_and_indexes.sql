-- BloodRadar Migration 03: Spatial & Performance Indexes
-- Creates GIST spatial indexes for PostGIS ST_DWithin queries and B-Tree indexes for fast dashboard lookups

-- 1. PostGIS GIST Spatial Indexes (Mandatory for high-speed ST_DWithin radius searches)
CREATE INDEX IF NOT EXISTS idx_donors_location_gist 
  ON public.donors USING GIST(location);

CREATE INDEX IF NOT EXISTS idx_blood_requests_location_gist 
  ON public.blood_requests USING GIST(location);

-- 2. Blood Requests Indexes
CREATE INDEX IF NOT EXISTS idx_blood_requests_status 
  ON public.blood_requests(status);

CREATE INDEX IF NOT EXISTS idx_blood_requests_deadline 
  ON public.blood_requests(deadline);

CREATE INDEX IF NOT EXISTS idx_blood_requests_blood_group 
  ON public.blood_requests(blood_group);

CREATE INDEX IF NOT EXISTS idx_blood_requests_requester_id 
  ON public.blood_requests(requester_id);

CREATE INDEX IF NOT EXISTS idx_blood_requests_active_sweep 
  ON public.blood_requests(status, stage_started_at) 
  WHERE status = 'open';

-- 3. Donors Indexes
CREATE INDEX IF NOT EXISTS idx_donors_blood_group 
  ON public.donors(blood_group);

CREATE INDEX IF NOT EXISTS idx_donors_availability 
  ON public.donors(is_available);

CREATE INDEX IF NOT EXISTS idx_donors_cooldown 
  ON public.donors(cooldown_ends_at);

CREATE INDEX IF NOT EXISTS idx_donors_profile_id 
  ON public.donors(profile_id);

-- 4. Responses & History Indexes
CREATE INDEX IF NOT EXISTS idx_donor_responses_request_id 
  ON public.donor_responses(request_id);

CREATE INDEX IF NOT EXISTS idx_donor_responses_donor_id 
  ON public.donor_responses(donor_id);

CREATE INDEX IF NOT EXISTS idx_donation_history_donor_id 
  ON public.donation_history(donor_id);

CREATE INDEX IF NOT EXISTS idx_donation_history_requester_id 
  ON public.donation_history(requester_id);

-- 5. Notifications & Contact Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread 
  ON public.notifications(user_id, is_read);

CREATE INDEX IF NOT EXISTS idx_contact_messages_created 
  ON public.contact_messages(created_at DESC);
