# BLOODRADAR — MASTER PROJECT BRIEF & SPECIFICATION

## Course & Project Information
- **Project:** BloodRadar, Emergency Blood Response Network
- **Course:** CSE 3292 – Website Development
- **Team:** Digital Pioneers (Individual Project, 1 member)
- **Goal:** Connect blood requesters with nearby eligible donors faster and more reliably than a standard blood directory.

---

## The Four Core Differentiators
1. **Cascading Geolocation Notification:** 3km → 5km → 10km
2. **Emergency Deadline + Live Countdown**
3. **Response Locking:** Atomic acceptance preventing duplicate/conflicting acceptances
4. **90-Day Donor Cooldown Tracking**

---

## Technical Stack & Constraints
- **Framework:** Next.js (App Router) + React + TypeScript
- **Styling:** Tailwind CSS
- **Database & Auth:** Supabase (PostgreSQL 15+, Auth SSR, Realtime Channels, Row-Level Security)
- **Spatial Engine:** PostgreSQL PostGIS extension (`geography(Point, 4326)` + GIST spatial index)
- **Scheduled Tasks:** Supabase `pg_cron` (do NOT use Vercel Cron for radius expansion due to daily limitations on Hobby plan)
- **Maps:** Leaflet + OpenStreetMap
- **Validation:** Zod (Bangladesh phone format `01XXXXXXXXX`: 11 digits, starts with 01)
- **Deployment:** Git + GitHub, deploy on Vercel
- **Spatial Query Rule:** Use PostGIS `ST_DWithin` for radius queries. Do NOT do manual Haversine in JavaScript.
- **Localization:** UI text in English, structured i18n-ready.

---

## Design Direction & System Tokens
- **Primary Color:** Deep Red `#DC2626`
- **Secondary Color:** Dark Navy `#111827`
- **Background:** White / Light Gray (`#F9FAFB`)
- **Aesthetic:** Modern, premium, healthcare-tech feel. Clean dashboards, consistent spacing, responsive.
- **Design System Components:** Button, Card, Input, Select, Badge, Modal, Navbar, Sidebar, DataTable, StatCard, CountdownTimer, CooldownRing.
- **Signature Page:** Request Tracking page (requester side) = live radar view with hospital location, animated pulse, 3km/5km/10km rings, countdown ring, and live activity feed.

---

## Roles and Security
- **Roles:** `donor`, `requester`, `admin`.
- **Admin Assignment:** Direct via SQL/database ONLY. Never through registration or public API.
- **Route Protection:** Middleware + server checks.
- **Row Level Security:** Explicit RLS policies on every table.
- **Server Validation:** Strict Zod validation on server.
- **Submission Guard:** Prevent duplicate form submissions.

### Privacy Rules (Strict)
1. Donor exact coordinates are never shown to other users. Requesters see only approximate distance (e.g. `~2.4 km away`).
2. Donor contact number is revealed to the requester ONLY after that donor accepts that specific request.
3. The map shows radius circles and the hospital location, never individual donor pins.
4. Visible clinical disclaimer on all relevant views: actual medical eligibility must be confirmed by a qualified medical professional.

---

## Database Architecture
- **Tables:** `profiles`, `donors`, `blood_requests`, `donor_responses`, `notifications`, `donation_history`, `admin_logs`.
- **Integrity:** Primary/foreign keys, CHECK constraints (blood groups, units > 0, deadline > now()), created_at/updated_at triggers, GIST indexes on geography columns, RLS policies.
- **blood_requests fields:** requester_id, patient_name, contact_number, blood_group, units_needed, hospital_name, location (geography point), needed_by, deadline, current_stage (0-3), current_radius_km, stage_started_at, status (open, locked, completed, expired, cancelled), single_donor boolean, notes.
- **donor_responses fields:** unique (request_id, donor_id).
- **Seed Script:** 30-50 realistic DEMO donors across Dhaka (varied blood groups and locations, some in cooldown) marked `is_demo = true`, plus 1 demo requester and admin SQL instructions.

---

## Core Feature Specifications
### Feature 1: Cascading Geolocation Notification
- Stage 1: eligible donors within 3km (matching blood group, available, not in cooldown).
- Stage 2: expand to 5km and notify ONLY donors not already notified.
- Stage 3: expand to 10km, same deduplication rule.
- Implemented as PostgreSQL functions: `notify_stage(request_id, stage)` and `expand_request_radius()`.
- Scheduled via Supabase `pg_cron` every minute.
- Stage duration configurable (default 10 minutes; 30-second demo mode for presentations).
- In-app notification on stage expansion.

### Feature 2: Deadline and Countdown
- Stored in DB, live client countdown timer.
- Database enforcement: `now()` determines expiry. `pg_cron` marks overdue requests as `expired`. Acceptance attempts on expired requests rejected by database function.
- Requester notified on expiry.

### Feature 3: Response Locking
- Atomic PostgreSQL RPC function: `accept_request(request_id)`.
- Uses `SELECT ... FOR UPDATE` row lock, verifies open status and future deadline, verifies donor eligibility, inserts response, updates request to `locked` (if single_donor), and dispatches notifications in one transaction.
- Duplicate responses rejected.
- Concurrency test simulating simultaneous accepts.

### Feature 4: 90-Day Cooldown
- Triggered when requester presses "Confirm donation" on a locked request.
- Inserts into `donation_history`, marks request completed, sets `cooldown_ends_at = donation_date + INTERVAL '90 days'`.
- Donors in cooldown excluded from notification queries and shown unavailable.
- Donor dashboard displays cooldown ring with remaining days and next eligible date.

---

## Execution Phases
- **Phase 1:** Workspace inspection, Implementation Plan, project setup, design system, folder structure.
- **Phase 2:** Public website (homepage, about, contact) with responsive layout.
- **Phase 3:** Supabase setup, database migrations, PostGIS, RLS, seed script.
- **Phase 4:** Authentication, roles, protected routes, donor registration.
- **Phase 5:** Emergency request creation + Find Donors (with PostGIS search and privacy rules).
- **Phase 6:** Cascading notification (Feature 1) + pg_cron + notifications + Realtime.
- **Phase 7:** Countdown/deadline (Feature 2) + response locking (Feature 3) + concurrency test.
- **Phase 8:** Donation confirmation + 90-day cooldown (Feature 4).
- **Phase 9:** Donor, Requester (signature radar page) and Admin dashboards polish.
- **Phase 10:** Full testing, README, diagrams, GitHub workflow, Vercel deployment guide.
