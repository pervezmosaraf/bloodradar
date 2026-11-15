# BloodRadar — System Architecture

**Course:** CSE 3292 – Website Development  
**Project:** BloodRadar (Emergency Blood Response Network)  
**Team:** Digital Pioneers (Individual Project)  

---

## 1. High-Level Architecture Diagram

```mermaid
flowchart TD
    subgraph Client ["Client Tier (Browser)"]
        UI["Next.js 14 App Router UI"]
        Rad["Live Radar Canvas (Leaflet/SVG)"]
        RT_Client["Supabase Realtime Client"]
    end

    subgraph Hosting ["Hosting Tier (Vercel)"]
        SSR["Server Components (SSR)"]
        SA["Server Actions (Next.js)"]
        Mid["Role Middleware (RBAC)"]
    end

    subgraph Backend ["Backend & Database Tier (Supabase)"]
        Auth["Supabase Auth (JWT)"]
        DB[(PostgreSQL 15+)]
        GIS["PostGIS Spatial Engine"]
        Cron["pg_cron Background Engine"]
        RT_Server["Supabase Realtime Engine"]
        RLS["Row Level Security (RLS)"]
    end

    UI -->|HTTPS / REST| SSR
    UI -->|Mutations| SA
    SA -->|Server Key / RLS| DB
    Mid -->|Session Verification| Auth
    RT_Client <-->|WebSockets| RT_Server
    RT_Server <-->|WAL Events| DB

    DB --- GIS
    DB --- Cron
    DB --- RLS
```

---

## 2. Component Explanations

### A. Next.js 14 App Router (Frontend & Server Layer)
- **React Server Components (RSC):** Render fast, SEO-friendly initial pages (`/`, `/about`, `/contact`, `/find-donors`) without client-side JavaScript bloat.
- **Server Actions:** Handle form submissions (emergency request creation, contact messages) with server-side Zod validation.
- **Edge Middleware:** Protects authenticated routes (`/dashboard/donor`, `/dashboard/requester`, `/dashboard/admin`), validating session cookies before rendering pages.

### B. Supabase Backend Tier
- **Supabase Auth:** Issues signed JWT tokens storing user roles (`donor`, `requester`, `admin`) in user metadata.
- **PostgreSQL Database:** Enforces schema integrity, foreign keys, `CHECK` constraints, and transactions.
- **PostGIS (`ST_DWithin`):** Calculates geographic proximity directly within SQL on spatial `geography(Point, 4326)` columns using GIST indexing. Manual Haversine math is strictly avoided.
- **pg_cron Engine:** Runs automated background jobs entirely inside the database:
  - `expand_request_radius()`: Runs every minute to advance requests from 3km → 5km → 10km.
  - `expire_overdue_requests()`: Marks requests past their deadline as `expired`.
  - `release_cooldowns()`: Resets expired donor cooldown periods.
- **Row Level Security (RLS):** Ensures that no user can read or modify another user's personal phone number, exact GPS location, or emergency request history.

---

## 3. Data Flow of an Emergency Request

```mermaid
sequenceDiagram
    autonumber
    actor Requester as Requester
    participant App as Next.js App / Server Action
    participant DB as PostgreSQL + PostGIS
    participant Cron as pg_cron Scheduler
    actor Donor as Eligible Donor

    Requester->>App: Submits Emergency Request (Blood Group, Hospital, Units, Deadline)
    App->>DB: INSERT into blood_requests (status = 'open', current_stage = 1, current_radius_km = 3)
    DB->>DB: Trigger notify_stage(request_id, stage=1)
    DB->>DB: ST_DWithin locates available donors within 3 km
    DB->>Donor: In-app Notification: "Emergency Request near your location"
    
    opt Radius Expansion (No response within stage duration)
        Cron->>DB: expand_request_radius() executes every minute
        DB->>DB: Checks stage_started_at + stage_duration < now()
        DB->>DB: Advances current_stage to 2 (5 km)
        DB->>DB: Trigger notify_stage(request_id, stage=2)
        DB->>Donor: New donors between 3km and 5km notified
    end

    Donor->>App: Clicks "Accept Request"
    App->>DB: Calls RPC accept_request(request_id)
    Note over DB: SELECT ... FOR UPDATE (Row Locked)
    DB->>DB: Validates deadline, availability, and single_donor status
    DB->>DB: Sets status = 'locked', accepted_donor_id = donor.id
    DB->>Requester: Realtime Alert: "Donor Matched! Contact details revealed."
    DB->>Donor: Request locked exclusively to this donor (no double-booking)
```
