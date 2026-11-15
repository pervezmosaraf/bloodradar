# BloodRadar — 5–7 Minute Presentation & Demo Script

**Course:** CSE 3292 – Website Development  
**Project:** BloodRadar (Emergency Blood Response Network)  
**Presenter:** Digital Pioneers  

---

## 1. Pre-Demo Checklist (Before Stepping on Stage)
- [ ] Ensure Supabase database is unpaused and active.
- [ ] Run seed script so demo donors exist around Dhaka.
- [ ] Open two browser windows:
  - **Window 1 (Requester):** Normal Chrome window logged in as demo requester.
  - **Window 2 (Donor):** Incognito Chrome window logged in as an eligible B+ donor in Dhanmondi.
- [ ] Enable **Demo Mode** in SQL:
  ```sql
  UPDATE system_settings SET demo_mode = true, stage_duration = interval '30 seconds';
  ```

---

## 2. Walkthrough Script (5–7 Minutes)

### Minute 0:00 – 1:00: Problem & Mission
- *"Good morning, faculty and fellow students. Every minute counts when a patient experiences acute hemorrhage. Traditional blood requests on social media broadcast phone numbers publicly, cause multiple donors to travel simultaneously, and waste critical time. BloodRadar solves this with intelligent cascading geolocation, emergency countdowns, atomic response locking, and medical cooldown enforcement."*

### Minute 1:00 – 2:30: The Emergency Request & Cascading Radar
- Open **Window 1** and go to `/emergency-request`.
- Select hospital (e.g. BSMMU / PG Hospital), Blood Group **B+**, 1 unit needed, 1-hour deadline.
- Click **"Broadcast Emergency Request"**.
- Navigate to the **Live Radar Tracking Page** (`/dashboard/requester/requests/[id]/radar`).
- Highlight:
  - The pulsing red hospital marker.
  - The **3 km active radar ring** softly animating.
  - The activity feed showing: *"Stage 1: 5 donors notified within 3 km"*.
  - Explain: *"Notice no individual donor coordinates or personal phone numbers are shown. Donors are completely anonymous."*

### Minute 2:30 – 3:30: Radius Expansion (Demo Mode in Action)
- As 30 seconds elapse, observe the live expansion without a page refresh:
  - The ring animates outward to **5 km**.
  - The activity feed updates in real-time: *"Radius expanded to 5 km: 7 new donors notified."*

### Minute 3:30 – 4:30: Atomic Response Locking (No Double Bookings)
- Switch to **Window 2** (Eligible Donor in Dhanmondi).
- Open `/dashboard/donor/requests`.
- Show the incoming emergency notification.
- Click **"Accept Request"**.
- Switch back to **Window 1**:
  - The Live Radar immediately transitions to **"Matched!"**.
  - The accepted donor's name, blood group, and contact number are securely revealed to the requester.
  - Explain: *"Because this is a single-unit request, the request row is locked atomically with SELECT ... FOR UPDATE. No other donor can double-book it."*

### Minute 4:30 – 5:30: Donation Confirmation & 90-Day Cooldown
- On the requester's page, click **"Confirm Donation"**.
- Switch back to **Window 2** (Donor):
  - Open `/dashboard/donor/history`.
  - Point to the **90-Day Cooldown Ring**:
  - *"The donor is now marked as in recovery for 90 days. During this period, the database automatically excludes them from search queries and incoming emergency broadcasts, protecting their health."*

### Minute 5:30 – 6:00: Conclusion & Q&A
- Summarize the tech stack (Next.js 14, PostgreSQL, PostGIS, pg_cron, Supabase SSR).
- Invite questions from faculty.

---

## 3. Fallback Plan (If Internet Fails)
- If live Supabase connection drops during the presentation, switch to the static component demonstration on `http://localhost:3000/design-system`, where all 10 UI components (countdown timer, cooldown ring, responsive cards, modals) run offline.
