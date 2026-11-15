-- BloodRadar Seed Script: Realistic Dhaka Demo Dataset
-- Contains 40 demo donors distributed across Dhaka zones within cascading distances (3km, 5km, 10km, >10km)
-- Run this script in the Supabase SQL Editor after running the migrations.

-- Clear previous demo records to prevent duplicates
DELETE FROM public.donor_responses WHERE donor_id IN (SELECT id FROM public.donors WHERE is_demo = true);
DELETE FROM public.donation_history WHERE donor_id IN (SELECT id FROM public.donors WHERE is_demo = true);
DELETE FROM public.donors WHERE is_demo = true;

-- ==============================================================================
-- 1. INSERT 40 DEMO DONORS ACROSS DHAKA
-- Coordinates reference: Center = Square Hospital (23.7530° N, 90.3817° E)
-- ==============================================================================

-- TIER 1: Within 3 km (Immediate Vicinity - Stage 1 match)
-- Locations: Farmgate, Dhanmondi, Green Road, Shahbagh, Tejgaon
INSERT INTO public.donors (demo_name, demo_phone, blood_group, is_available, location, address_text, last_donation_date, cooldown_ends_at, is_demo) VALUES
('Dr. Tanvir Ahmed', '01711000001', 'O+', true, extensions.ST_SetSRID(extensions.ST_MakePoint(90.3860, 23.7565), 4326), 'Farmgate, Tejgaon, Dhaka (~0.6 km)', CURRENT_DATE - 120, NULL, true),
('Ayesha Siddiqua', '01811000002', 'A+', true, extensions.ST_SetSRID(extensions.ST_MakePoint(90.3830, 23.7490), 4326), 'Green Road, Panthapath, Dhaka (~0.5 km)', CURRENT_DATE - 110, NULL, true),
('Kazi Mushfiqur', '01911000003', 'B+', true, extensions.ST_SetSRID(extensions.ST_MakePoint(90.3750, 23.7510), 4326), 'Dhanmondi Road 27, Dhaka (~1.2 km)', CURRENT_DATE - 140, NULL, true),
('Nusrat Jahan', '01511000004', 'O-', true, extensions.ST_SetSRID(extensions.ST_MakePoint(90.3780, 23.7430), 4326), 'Dhanmondi Road 8/A, Dhaka (~1.5 km)', CURRENT_DATE - 130, NULL, true),
('Fahim Al-Mahmud', '01611000005', 'AB+', true, extensions.ST_SetSRID(extensions.ST_MakePoint(90.3920, 23.7450), 4326), 'Hatirpool, Motaleb Plaza, Dhaka (~1.4 km)', CURRENT_DATE - 100, NULL, true),
('Salma Parvin', '01711000006', 'A-', true, extensions.ST_SetSRID(extensions.ST_MakePoint(90.3957, 23.7388), 4326), 'BSMMU / Shahbagh, Dhaka (~1.8 km)', CURRENT_DATE - 150, NULL, true),
('Sabbir Hossain', '01811000007', 'B-', true, extensions.ST_SetSRID(extensions.ST_MakePoint(90.3910, 23.7620), 4326), 'Tejgaon Industrial Area, Dhaka (~1.5 km)', CURRENT_DATE - 160, NULL, true),
('Mehedi Hasan', '01911000008', 'O+', true, extensions.ST_SetSRID(extensions.ST_MakePoint(90.3710, 23.7540), 4326), 'Kalabagan 1st Lane, Dhaka (~1.3 km)', CURRENT_DATE - 95, NULL, true),

-- Tier 1 Cooldown & Unavailable Donors (Within 3km, but should NOT be notified)
('Rahim Uddin (In Cooldown)', '01711000009', 'O+', true, extensions.ST_SetSRID(extensions.ST_MakePoint(90.3800, 23.7500), 4326), 'Panthapath, Dhaka (~0.4 km)', CURRENT_DATE - 40, now() + interval '50 days', true),
('Tasnim Khan (In Cooldown)', '01811000010', 'A+', true, extensions.ST_SetSRID(extensions.ST_MakePoint(90.3740, 23.7460), 4326), 'Dhanmondi 32, Dhaka (~1.1 km)', CURRENT_DATE - 20, now() + interval '70 days', true),
('Imran Nazir (Unavailable)', '01911000011', 'O-', false, extensions.ST_SetSRID(extensions.ST_MakePoint(90.3850, 23.7520), 4326), 'Kathalbagan, Dhaka (~0.8 km)', CURRENT_DATE - 180, NULL, true),

-- TIER 2: 3 km to 5 km (Expanded Vicinity - Stage 2 match)
-- Locations: Mohakhali, Mohammadpur, Moghbazar, Motijheel, Khilgaon
('Tamanna Haque', '01711000012', 'O+', true, extensions.ST_SetSRID(extensions.ST_MakePoint(90.4057, 23.7779), 4326), 'Mohakhali Wireless Gate, Dhaka (~3.6 km)', CURRENT_DATE - 105, NULL, true),
('Zubair Hossain', '01811000013', 'A+', true, extensions.ST_SetSRID(extensions.ST_MakePoint(90.3585, 23.7592), 4326), 'Mohammadpur Town Hall, Dhaka (~3.2 km)', CURRENT_DATE - 115, NULL, true),
('Nabil Mostafa', '01911000014', 'B+', true, extensions.ST_SetSRID(extensions.ST_MakePoint(90.4020, 23.7480), 4326), 'Moghbazar Wireless, Dhaka (~3.1 km)', CURRENT_DATE - 125, NULL, true),
('Sabrina Sultana', '01511000015', 'AB+', true, extensions.ST_SetSRID(extensions.ST_MakePoint(90.4080, 23.7650), 4326), 'Tejgaon Nabikhet, Dhaka (~3.4 km)', CURRENT_DATE - 135, NULL, true),
('Asif Mahmud', '01611000016', 'O-', true, extensions.ST_SetSRID(extensions.ST_MakePoint(90.3520, 23.7680), 4326), 'Ring Road, Shyamoli, Dhaka (~3.8 km)', CURRENT_DATE - 145, NULL, true),
('Jannatul Ferdous', '01711000017', 'A-', true, extensions.ST_SetSRID(extensions.ST_MakePoint(90.4176, 23.7330), 4326), 'Motijheel C/A, Dhaka (~4.4 km)', CURRENT_DATE - 155, NULL, true),
('Shakil Chowdhury', '01811000018', 'B-', true, extensions.ST_SetSRID(extensions.ST_MakePoint(90.4180, 23.7500), 4326), 'Malibagh Chowdhury Para, Dhaka (~4.1 km)', CURRENT_DATE - 165, NULL, true),
('Sadman Sakib', '01911000019', 'AB-', true, extensions.ST_SetSRID(extensions.ST_MakePoint(90.4278, 23.7533), 4326), 'Khilgaon Taltola, Dhaka (~4.8 km)', CURRENT_DATE - 175, NULL, true),
('Farhan Labib', '01711000020', 'O+', true, extensions.ST_SetSRID(extensions.ST_MakePoint(90.3550, 23.7740), 4326), 'Kallyanpur Bus Stand, Dhaka (~4.3 km)', CURRENT_DATE - 185, NULL, true),

-- Tier 2 Cooldown & Unavailable Donors (3km - 5km)
('Shafiqul Islam (In Cooldown)', '01811000021', 'B+', true, extensions.ST_SetSRID(extensions.ST_MakePoint(90.4070, 23.7700), 4326), 'Mohakhali TB Gate, Dhaka (~3.5 km)', CURRENT_DATE - 30, now() + interval '60 days', true),
('Rubina Akter (Unavailable)', '01911000022', 'A+', false, extensions.ST_SetSRID(extensions.ST_MakePoint(90.4150, 23.7380), 4326), 'Kakrail, Dhaka (~3.7 km)', CURRENT_DATE - 200, NULL, true),

-- TIER 3: 5 km to 10 km (Max Emergency Radius - Stage 3 match)
-- Locations: Gulshan, Banani, Badda, Mirpur 10, Old Dhaka
('Rezaul Karim', '01711000023', 'O+', true, extensions.ST_SetSRID(extensions.ST_MakePoint(90.4172, 23.7808), 4326), 'Gulshan-1 Circle, Dhaka (~5.4 km)', CURRENT_DATE - 120, NULL, true),
('Nazia Hassan', '01811000024', 'A+', true, extensions.ST_SetSRID(extensions.ST_MakePoint(90.4043, 23.7937), 4326), 'Banani Block C, Dhaka (~5.7 km)', CURRENT_DATE - 130, NULL, true),
('Mominul Islam', '01911000025', 'B+', true, extensions.ST_SetSRID(extensions.ST_MakePoint(90.4149, 23.7925), 4326), 'Gulshan-2 Circle, Dhaka (~6.1 km)', CURRENT_DATE - 140, NULL, true),
('Sharmin Akhter', '01511000026', 'AB+', true, extensions.ST_SetSRID(extensions.ST_MakePoint(90.4267, 23.7806), 4326), 'Middle Badda, Dhaka (~6.2 km)', CURRENT_DATE - 150, NULL, true),
('Ashikur Rahman', '01611000027', 'O-', true, extensions.ST_SetSRID(extensions.ST_MakePoint(90.3686, 23.8071), 4326), 'Mirpur-10 Roundabout, Dhaka (~7.2 km)', CURRENT_DATE - 160, NULL, true),
('Rashedul Haque', '01711000028', 'A-', true, extensions.ST_SetSRID(extensions.ST_MakePoint(90.3510, 23.7960), 4326), 'Mirpur-1 Sony Cinema, Dhaka (~6.8 km)', CURRENT_DATE - 170, NULL, true),
('Farzana Yasmin', '01811000029', 'B-', true, extensions.ST_SetSRID(extensions.ST_MakePoint(90.4071, 23.7099), 4326), 'Old Dhaka (Sadarghat), Dhaka (~6.6 km)', CURRENT_DATE - 180, NULL, true),
('Kamrul Hasan', '01911000030', 'O+', true, extensions.ST_SetSRID(extensions.ST_MakePoint(90.3950, 23.7120), 4326), 'Armanitola, Old Dhaka (~5.8 km)', CURRENT_DATE - 190, NULL, true),
('Shahnaz Begum', '01711000031', 'AB-', true, extensions.ST_SetSRID(extensions.ST_MakePoint(90.4350, 23.7900), 4326), 'Shahjadpur, Badda, Dhaka (~7.1 km)', CURRENT_DATE - 200, NULL, true),
('Tanvir Mokaddem', '01811000032', 'O+', true, extensions.ST_SetSRID(extensions.ST_MakePoint(90.3650, 23.8220), 4326), 'Mirpur-11 Bus Stand, Dhaka (~8.5 km)', CURRENT_DATE - 100, NULL, true),

-- Tier 3 Cooldown & Unavailable Donors (5km - 10km)
('Shahadat Hossain (In Cooldown)', '01911000033', 'O+', true, extensions.ST_SetSRID(extensions.ST_MakePoint(90.4120, 23.7850), 4326), 'Gulshan South Ave, Dhaka (~5.6 km)', CURRENT_DATE - 15, now() + interval '75 days', true),
('Mahfuzur Rahman (Unavailable)', '01711000034', 'B+', false, extensions.ST_SetSRID(extensions.ST_MakePoint(90.3700, 23.8100), 4326), 'Mirpur-12, Dhaka (~7.6 km)', CURRENT_DATE - 210, NULL, true),

-- TIER 4: Beyond 10 km (> 10 km - Outside stage 3 sweep)
-- Locations: Uttara, Ashulia, Gazipur Border
('Tareq Monowar', '01811000035', 'O+', true, extensions.ST_SetSRID(extensions.ST_MakePoint(90.3982, 23.8681), 4326), 'Uttara Sector 3, Dhaka (~13.2 km)', CURRENT_DATE - 120, NULL, true),
('Rifat Bin Sayeed', '01911000036', 'A+', true, extensions.ST_SetSRID(extensions.ST_MakePoint(90.4010, 23.8750), 4326), 'Uttara Sector 7, Dhaka (~13.8 km)', CURRENT_DATE - 130, NULL, true),
('Momena Khatun', '01511000037', 'B+', true, extensions.ST_SetSRID(extensions.ST_MakePoint(90.3850, 23.8790), 4326), 'Uttara Sector 11, Dhaka (~14.2 km)', CURRENT_DATE - 140, NULL, true),
('Emon Mahmud', '01611000038', 'O-', true, extensions.ST_SetSRID(extensions.ST_MakePoint(90.4200, 23.8500), 4326), 'Khilkhet DOHS, Dhaka (~11.5 km)', CURRENT_DATE - 150, NULL, true),
('Ariful Islam', '01711000039', 'AB+', true, extensions.ST_SetSRID(extensions.ST_MakePoint(90.4150, 23.8350), 4326), 'Nikunja 2, Dhaka (~10.4 km)', CURRENT_DATE - 160, NULL, true),
('Sultana Razia', '01811000040', 'A-', true, extensions.ST_SetSRID(extensions.ST_MakePoint(90.3920, 23.8850), 4326), 'Uttara Sector 14, Dhaka (~14.9 km)', CURRENT_DATE - 170, NULL, true);

-- ==============================================================================
-- 2. CREATE DEMO REQUESTER PROFILE (FOR TESTING BLOOD REQUESTS)
-- Uses a stable deterministic UUID: '00000000-0000-0000-0000-000000000001'
-- ==============================================================================

-- If the dummy auth user does not exist in auth.users, we insert it safely for local/test SQL environments
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-0000-0000-000000000001',
  'authenticated',
  'authenticated',
  'demo.requester@bloodradar.internal',
  extensions.crypt('DemoPassword123!', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"Sultana Kamal (Demo Requester)","phone":"01799887766","role":"requester"}'::jsonb,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;

-- Insert or update the requester profile
INSERT INTO public.profiles (
  id,
  email,
  full_name,
  phone,
  role,
  is_active
)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'demo.requester@bloodradar.internal',
  'Sultana Kamal (Demo Requester)',
  '01799887766',
  'requester',
  true
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone;

-- Create a sample open request created by the demo requester
INSERT INTO public.blood_requests (
  id,
  requester_id,
  patient_name,
  contact_number,
  blood_group,
  units_needed,
  hospital_name,
  location,
  address_text,
  needed_by,
  deadline,
  current_stage,
  current_radius_km,
  stage_duration_seconds,
  stage_started_at,
  status,
  single_donor,
  notes
)
VALUES (
  '00000000-0000-0000-0000-000000000101',
  '00000000-0000-0000-0000-000000000001',
  'Kamal Hossain',
  '01799887766',
  'O+',
  2,
  'Square Hospital',
  extensions.ST_SetSRID(extensions.ST_MakePoint(90.3817, 23.7530), 4326),
  'Panthapath, Dhaka',
  now() + interval '6 hours',
  now() + interval '4 hours',
  1,
  3.0,
  600,
  now(),
  'open',
  true,
  'Urgent surgical requirement. Patient undergoing cardiac intervention.'
)
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- 3. SQL SNIPPET TO PROMOTE YOUR OWN USER ACCOUNT TO ADMIN
-- ==============================================================================
-- Run the following line after signing up with your real email address:
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'YOUR_EMAIL_HERE';
