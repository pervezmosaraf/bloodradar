# BloodRadar — Background Job & Scheduler Architecture (`pg_cron`)

**Course:** CSE 3292 – Website Development  
**Project:** BloodRadar (Emergency Blood Response Network)  
**Team:** Digital Pioneers  

---

## 1. Why `pg_cron`?

Traditional web applications rely on external cron services (such as Vercel Cron or Node.js timers) to handle background jobs. This introduces critical vulnerabilities:
1. **Network Failure:** If Vercel Cron fails to reach the server, an emergency request does not expand.
2. **Cold Starts & Serverless Limits:** Serverless functions can time out while processing large donor pools.
3. **Database Consistency:** Running scheduling inside PostgreSQL guarantees transaction safety and zero network latency.

BloodRadar runs all background automation directly inside PostgreSQL using the official **`pg_cron`** extension.

---

## 2. Scheduled Jobs & Functions

### A. Cascading Radius Expansion (`expand_request_radius()`)
- **Schedule:** `* * * * *` (Every 1 minute)
- **Logic:**
  ```sql
  SELECT * FROM blood_requests 
  WHERE status = 'open' 
    AND deadline > now() 
    AND current_stage < 3 
    AND stage_started_at + (SELECT stage_duration FROM system_settings) < now()
  FOR UPDATE SKIP LOCKED;
  ```
- **Action:**
  - Stage 1 (3 km) advances to Stage 2 (5 km).
  - Stage 2 (5 km) advances to Stage 3 (10 km).
  - Calls `notify_stage(request_id, new_stage)` using PostGIS `ST_DWithin`.
  - Notifies requester: *"Your request radius expanded to 5 km — 7 new donors notified."*

### B. Overdue Request Expiry (`expire_overdue_requests()`)
- **Schedule:** `* * * * *` (Every 1 minute)
- **Logic:**
  ```sql
  UPDATE blood_requests
  SET status = 'expired'
  WHERE status = 'open' AND deadline <= now();
  ```
- **Action:**
  - Marks overdue requests as `expired`.
  - Sends in-app notification to requester.
  - Automatically unlocks any pending holds.

### C. Cooldown Release (`release_cooldowns()`)
- **Schedule:** `0 * * * *` (Every hour)
- **Logic:**
  ```sql
  UPDATE donors
  SET cooldown_ends_at = NULL
  WHERE cooldown_ends_at <= now();
  ```
- **Important Safety Rule:** Does **NOT** silently set `is_available = true`. The donor must explicitly re-confirm medical eligibility on their dashboard before receiving new requests.

---

## 3. Demo Mode vs Production Timing

| Setting | Production Mode | Presentation / Demo Mode |
|---|---|---|
| Stage Duration | 10 minutes | 30 seconds (or 1 minute via cron) |
| Total Expansion Time (3km to 10km) | 20 minutes | 1 to 2 minutes |
| How to Toggle | Admin Settings or SQL: `UPDATE system_settings SET demo_mode = true, stage_duration = interval '30 seconds';` |
