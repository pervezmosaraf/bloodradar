# BloodRadar — Emergency Blood Response Network

> **Course:** CSE 3292 – Website Development  
> **Team:** Digital Pioneers (Individual Project)  
> **Institution:** Department of Computer Science & Engineering  

BloodRadar is a full-stack emergency blood donation response platform designed to connect patients with nearby eligible blood donors in Dhaka, Bangladesh, within minutes.

---

## 1. Core Technical Differentiators

1. **Cascading Geolocation Notification (3 km → 5 km → 10 km):**  
   Uses **PostGIS `ST_DWithin`** to identify donors in expanding concentric radius rings. Automated by PostgreSQL `pg_cron` background jobs without external cron dependencies.
2. **Emergency Deadline & Live Countdown:**  
   Calculated and enforced strictly by server-side `now()` timestamps to prevent expired request fulfillment.
3. **Atomic Response Locking (`SELECT ... FOR UPDATE`):**  
   Guarantees that when a donor accepts a single-donor request, the request locks atomically in one database transaction, preventing double-bookings.
4. **90-Day Medical Donor Cooldown:**  
   Automatically calculated upon donation confirmation, excluding donors from search and broadcasts until their medical recovery period elapses.

---

## 2. Technology Stack

- **Frontend:** Next.js 14.2.35 (App Router), React 18, TypeScript, Tailwind CSS, Lucide React
- **Validation:** Zod 3.23.8
- **Backend & Database:** Supabase, PostgreSQL 15+, PostGIS 3.x, `pg_cron`
- **Mapping:** Leaflet & OpenStreetMap (open-source, zero API cost)
- **Deployment:** Vercel

---

## 3. Project Structure

```
BloodRadar/
├── docs/                     # System documentation & university submission guides
│   ├── ARCHITECTURE.md       # Mermaid architecture diagrams & request data flow
│   ├── DATABASE.md           # Database ER diagram & schema documentation
│   ├── SCHEDULER.md          # pg_cron background scheduler architecture
│   ├── LOCKING.md            # SELECT FOR UPDATE concurrency protection
│   ├── COOLDOWN.md           # 90-day medical recovery rules
│   ├── TESTING.md            # 18 test scenarios with Pass/Fail/Not tested status
│   ├── TECH_STACK.md         # Technology choices and justification
│   ├── SECURITY.md           # Row Level Security (RLS) & privacy rules
│   ├── GIT_WORKFLOW.md       # Beginner Git and GitHub instructions
│   ├── DEPLOYMENT.md         # Vercel & Supabase deployment walkthrough
│   └── DEMO_SCRIPT.md        # 5–7 minute presentation script & checklist
├── src/
│   ├── app/                  # Next.js App Router pages and server actions
│   │   ├── page.tsx          # Homepage with animated radar visual
│   │   ├── about/            # Mission and technical architecture
│   │   ├── contact/          # Contact form with database action
│   │   ├── find-donors/      # Public donor search directory
│   │   ├── emergency-request/# Emergency request submission
│   │   ├── design-system/    # Design system interactive sandbox
│   │   ├── login/            # Authentication portal
│   │   └── register/         # User & donor registration
│   ├── components/           # Reusable UI & navigation components
│   └── lib/                  # Supabase clients, validators, and constants
├── supabase/
│   ├── migrations/           # Numbered SQL migrations (01 through 05)
│   ├── seed.sql              # 40 realistic demo donors across Dhaka
│   └── verify.sql            # SQL verification queries
└── tests/                    # Automated unit tests
```

---

## 4. Local Setup Guide

### Prerequisites
- Node.js 18.17+ or Node.js 20+
- npm 9+
- A free account on [supabase.com](https://supabase.com)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/bloodradar.git
   cd bloodradar
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Copy `.env.example` to `.env.local` and fill in your Supabase project keys:
   ```bash
   cp .env.example .env.local
   ```
4. Run migrations in Supabase SQL Editor:
   Execute files in `supabase/migrations/` in sequential order (`01` through `05`), followed by `supabase/seed.sql`.
5. Start local development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 5. Automated Verification & Testing

Run the test suite:
```bash
# Type check
npx tsc --noEmit

# Code linting
npm run lint

# Automated unit tests
npm test

# Production build test
npm run build
```

---

## 6. Academic Integrity Note

This project is an original academic submission by **Digital Pioneers** for **CSE 3292 (Website Development)**. All spatial algorithms utilize native PostGIS SQL functions. All privacy constraints strictly isolate personal identification data.
