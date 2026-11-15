# BloodRadar — Vercel & Supabase Deployment Guide

**Course:** CSE 3292 – Website Development  
**Project:** BloodRadar (Emergency Blood Response Network)  
**Team:** Digital Pioneers  

---

## 1. Supabase Cloud Configuration

1. **Create Free Project:**  
   Go to [supabase.com](https://supabase.com), click **New Project**, and select region **Singapore (`ap-southeast-1`)** for optimal latency from Bangladesh.
2. **Execute Migrations:**  
   Open the **SQL Editor**, create a **New Query**, and run files `01` through `05` from `/supabase/migrations/` and `/supabase/seed.sql`.
3. **Configure Auth Redirects:**  
   - Go to **Authentication** → **URL Configuration**.
   - Set **Site URL** to your Vercel deployment URL (e.g. `https://bloodradar.vercel.app`) or `http://localhost:3000` for local dev.
   - Under **Redirect URLs**, add:
     - `http://localhost:3000/**`
     - `https://your-vercel-domain.vercel.app/**`

---

## 2. Vercel Deployment Steps

1. **Import Project into Vercel:**  
   - Visit [vercel.com](https://vercel.com) and log in with GitHub.
   - Click **Add New...** → **Project**, and import your `bloodradar` repository.
2. **Configure Environment Variables:**  
   In Vercel's **Environment Variables** panel, add the following variables from your Supabase Dashboard (**Project Settings** → **API**):

| Variable Name | Environment | Value Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Production & Preview | Your Supabase project URL (`https://xyz.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production & Preview | Public `anon` key |
| `SUPABASE_SERVICE_ROLE_KEY` | Production only | Secret `service_role` key (Server-side only!) |
| `NEXT_PUBLIC_APP_URL` | Production & Preview | Your Vercel production URL |

3. **Deploy:**  
   Click **Deploy**. Vercel will run `npm run build` and launch your live production application.

---

## 3. Important Notes on Free Tiers

- **`pg_cron` Runs Inside Supabase:** Because background automation is managed inside PostgreSQL, cascading expansions and request expirations execute reliably even when Vercel functions are idle.
- **Inactivity Pausing:** Free Supabase projects pause after 7 days of complete inactivity. Before your academic presentation or grading demo, log into your Supabase dashboard the day before to ensure the database is active.
