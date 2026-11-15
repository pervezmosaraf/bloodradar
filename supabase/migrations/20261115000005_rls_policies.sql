-- BloodRadar Migration 05: Row Level Security (RLS) & Privacy Shield
-- Enforces strict multi-tenant access control and protects donor GPS coordinates and contact numbers

-- 1. Helper Security Functions (SECURITY DEFINER to avoid circular RLS queries)
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT (public.current_user_role() = 'admin');
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 2. Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donor_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 3. PROFILES POLICIES
-- ==============================================================================
-- Policy: Users can read their own profile; admins can read all profiles.
CREATE POLICY "profiles_select_own_or_admin" ON public.profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id OR public.is_admin());

-- Policy: Users can update their own profile (role cannot be escalated to admin by user).
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND 
    (role = (SELECT role FROM public.profiles WHERE id = auth.uid()) OR public.is_admin())
  );

-- ==============================================================================
-- 4. DONORS POLICIES
-- ==============================================================================
-- Policy: Donors can read/update their own donor record.
CREATE POLICY "donors_manage_own" ON public.donors
  FOR ALL TO authenticated
  USING (profile_id = auth.uid() OR public.is_admin())
  WITH CHECK (profile_id = auth.uid() OR public.is_admin());

-- Policy: Seed demo donors are publicly readable for proximity search calculations.
CREATE POLICY "donors_select_demo" ON public.donors
  FOR SELECT TO anon, authenticated
  USING (is_demo = true);

-- ==============================================================================
-- 5. BLOOD REQUESTS POLICIES
-- ==============================================================================
-- Policy: Requesters can insert their own requests.
CREATE POLICY "requests_insert_requester" ON public.blood_requests
  FOR INSERT TO authenticated
  WITH CHECK (requester_id = auth.uid());

-- Policy: Requesters can update their own requests; admins can update any request.
CREATE POLICY "requests_update_own" ON public.blood_requests
  FOR UPDATE TO authenticated
  USING (requester_id = auth.uid() OR public.is_admin());

-- Policy: Requesters can see their own requests; notified donors or open requests can be seen.
CREATE POLICY "requests_select_relevant" ON public.blood_requests
  FOR SELECT TO authenticated
  USING (
    requester_id = auth.uid() OR 
    status = 'open' OR 
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.donor_responses dr
      JOIN public.donors d ON d.id = dr.donor_id
      WHERE dr.request_id = blood_requests.id AND d.profile_id = auth.uid()
    )
  );

-- Policy: Public anon users can see basic active request counts for homepage metrics.
CREATE POLICY "requests_select_public_counts" ON public.blood_requests
  FOR SELECT TO anon
  USING (status IN ('open', 'completed'));

-- ==============================================================================
-- 6. DONOR RESPONSES POLICIES
-- ==============================================================================
-- Policy: Donors can insert and manage their own responses.
CREATE POLICY "responses_insert_donor" ON public.donor_responses
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.donors WHERE id = donor_id AND profile_id = auth.uid())
  );

CREATE POLICY "responses_select_relevant" ON public.donor_responses
  FOR SELECT TO authenticated
  USING (
    -- Donor can see their own response
    EXISTS (SELECT 1 FROM public.donors WHERE id = donor_id AND profile_id = auth.uid()) OR
    -- Requester of the request can see all responses for their request
    EXISTS (SELECT 1 FROM public.blood_requests WHERE id = request_id AND requester_id = auth.uid()) OR
    public.is_admin()
  );

-- ==============================================================================
-- 7. NOTIFICATIONS POLICIES
-- ==============================================================================
-- Policy: Users can view and update (mark read) only their own notifications.
CREATE POLICY "notifications_manage_own" ON public.notifications
  FOR ALL TO authenticated
  USING (user_id = auth.uid() OR public.is_admin())
  WITH CHECK (user_id = auth.uid() OR public.is_admin());

-- ==============================================================================
-- 8. DONATION HISTORY POLICIES
-- ==============================================================================
-- Policy: Donors and Requesters can see records they are parties to; admins see all.
CREATE POLICY "history_select_involved" ON public.donation_history
  FOR SELECT TO authenticated
  USING (
    requester_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.donors WHERE id = donor_id AND profile_id = auth.uid()) OR
    public.is_admin()
  );

-- Policy: Anon can read total count for platform impact metrics.
CREATE POLICY "history_select_anon" ON public.donation_history
  FOR SELECT TO anon
  USING (true);

-- ==============================================================================
-- 9. ADMIN LOGS & SETTINGS POLICIES
-- ==============================================================================
-- Policy: Only admins can view or insert admin audit logs.
CREATE POLICY "admin_logs_admin_only" ON public.admin_logs
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Policy: Anyone can read system settings (stage durations, demo mode); only admins can update.
CREATE POLICY "settings_select_all" ON public.system_settings
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "settings_update_admin" ON public.system_settings
  FOR UPDATE TO authenticated
  USING (public.is_admin());

-- ==============================================================================
-- 10. CONTACT MESSAGES POLICIES
-- ==============================================================================
-- Policy: Anyone (anon or authenticated) can submit a contact message.
CREATE POLICY "contact_insert_anyone" ON public.contact_messages
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Policy: Only admins can read contact inquiries.
CREATE POLICY "contact_select_admin" ON public.contact_messages
  FOR SELECT TO authenticated
  USING (public.is_admin());

-- ==============================================================================
-- 11. PRIVACY SHIELD: SECURE CONTACT REVEAL FUNCTION
-- ==============================================================================
-- Donor phone number is revealed to the requester ONLY after that donor accepted that specific request.
CREATE OR REPLACE FUNCTION public.get_accepted_donor_contact(
  p_request_id UUID,
  p_donor_id UUID
)
RETURNS TABLE (
  donor_id UUID,
  full_name TEXT,
  phone TEXT,
  blood_group TEXT,
  responded_at TIMESTAMPTZ
) AS $$
DECLARE
  v_requester_id UUID;
BEGIN
  -- Verify the calling user is the actual requester of this request (or admin)
  SELECT requester_id INTO v_requester_id
  FROM public.blood_requests
  WHERE id = p_request_id;

  IF v_requester_id != auth.uid() AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access Denied: You are not the authorized requester of this blood request.';
  END IF;

  -- Return contact details ONLY IF the donor accepted this request
  RETURN QUERY
  SELECT 
    d.id AS donor_id,
    COALESCE(p.full_name, d.demo_name, 'Anonymous Donor') AS full_name,
    COALESCE(p.phone, d.demo_phone) AS phone,
    d.blood_group,
    dr.responded_at
  FROM public.donor_responses dr
  JOIN public.donors d ON d.id = dr.donor_id
  LEFT JOIN public.profiles p ON p.id = d.profile_id
  WHERE dr.request_id = p_request_id
    AND dr.donor_id = p_donor_id
    AND dr.status = 'accepted';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
