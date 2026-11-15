# BloodRadar — Security & Privacy Architecture

**Course:** CSE 3292 – Website Development  
**Project:** BloodRadar (Emergency Blood Response Network)  
**Team:** Digital Pioneers  

---

## 1. Core Security Principles

### A. Zero Secret Exposure
- Public keys (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) are restricted by PostgreSQL Row Level Security (RLS).
- The `SUPABASE_SERVICE_ROLE_KEY` is strictly confined to server-side code (`src/lib/supabase/admin.ts`) and is never delivered to the client browser.
- `.env.local` is permanently git-ignored.

### B. Privacy Masking & Geolocation Obfuscation
- Donors' exact residential GPS coordinates are **never** returned to public API consumers or other users.
- Search queries use `search_donors()`, which returns:
  - An anonymous identifier (e.g. `Donor #A14`).
  - An approximate distance rounded to the nearest 0.5 km (e.g. `~2.5 km away`).
- The Live Radar page renders only geographic radius rings around the target hospital. No donor pins or individual markers are ever rendered.

### C. Contact Disclosure Control
- A donor's name and phone number are visible **only** to the requester whose emergency request was accepted by that specific donor.
- Contact disclosure is enforced at the database level using the `get_accepted_donor_contact(p_request_id)` SECURITY DEFINER function, which verifies that `auth.uid() = blood_requests.requester_id` before returning contact info.

---

## 2. Row Level Security (RLS) Summary

| Table | `anon` Role | `authenticated` Role | Notes |
|---|---|---|---|
| `profiles` | Read only | Read own, Update own | Profile details protected. |
| `donors` | Anonymous search via RPC | Read own profile, update availability | Exact coordinates masked. |
| `blood_requests` | Read open requests | Create request, read own, cancel own | Requester isolated. |
| `donor_responses` | No access | Accept/decline via RPC | RPC enforced. |
| `notifications` | No access | Read own rows, mark own as read | User isolated. |
| `donation_history` | No access | Read own rows, confirm via RPC | Immutable audit log. |
| `admin_logs` | No access | Read only for `admin` role | Append-only. |
| `contact_messages` | Insert only | No read access (Admins read via dashboard) | Anti-spam protected. |
