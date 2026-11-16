# BloodRadar — Project Progress Log

**Course:** CSE 3292 – Website Development  
**Team:** Digital Pioneers (Individual Project)  
**Current Status:** End-to-End Registration, Map Location Picker, Login & Proximity Search Completed & Verified  

---

### Phase 1: Workspace Inspection & Design System Foundation
- [x] Initialized Next.js 14 (App Router) + React 18 + TypeScript + Tailwind CSS.
- [x] Built and verified reusable UI component system on `/design-system`:
  - `Button`, `Card`, `Input`, `Select`, `Badge`, `Modal`, `DataTable`, `StatCard`, `CountdownTimer`, `CooldownRing`.
- [x] Zod validation schemas for Bangladeshi phone numbers (`01XXXXXXXXX`), donor onboarding, and emergency blood requests.
- [x] Dhaka geographic hubs (`BSMMU`, `DMCH`, `Square`, `Evercare`, `United`, etc.).
- [x] Automated unit test suite (`tests/phase1-verification.test.ts`): 22/22 passing.
- [x] Zero console errors across desktop, tablet, and mobile viewports.

---

### Phase 2: Navigation & Core Public Routes
- [x] Clean placeholder and navigation architecture established.
- [x] Restored homepage design with navy-to-crimson hero and CSS/SVG animated radar visual.
- [x] Core routes created and returning HTTP 200:
  - `/`
  - `/about`
  - `/contact`
  - `/find-donors`
  - `/emergency-request` (and `/emergency` alias)
  - `/login`
  - `/register`
  - `/become-a-donor` (and `/register-donor` alias)
  - `/design-system`
  - `/dashboard/donor`
  - `/dashboard/requester`
  - `/dashboard/admin`
- [x] Contact form connected to server action with live validation.
- [x] Production build passes cleanly with zero lint or TypeScript warnings.

---

### Phase 3 & 4: Auth, Database & Spatial Search
- [x] Root Cause Diagnosed & Fixed:
  - Previous registration pages were static JSX templates lacking form elements, event listeners, and Supabase integration.
  - Replaced static zone dropdown with interactive Leaflet + OpenStreetMap location picker.
  - Enforced 8+ character password rule, 18+ age requirement, 50kg weight confirmation, and medical health declaration.
- [x] Created interactive requester registration (`/register`) with field-level errors and loading states.
- [x] Created interactive donor registration (`/become-a-donor`) saving location as PostGIS `POINT(longitude latitude)` with 90-day cooldown calculation.
- [x] Created interactive login (`/login`) with role-based routing (`donor` → `/dashboard/donor`, `requester` → `/dashboard/requester`, `admin` → `/dashboard/admin`).
- [x] Dynamic Navbar auth state listener showing user name, role badge, dashboard button, and functional logout.
- [x] End-to-end donor search (`/find-donors`) with 3km, 5km, 10km radius selector and privacy masking.
- [x] Authored SQL migration `supabase/migrations/20261116000001_auth_and_search.sql` containing `search_donors()` function and RLS policies.
