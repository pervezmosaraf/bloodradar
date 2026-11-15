# BloodRadar — Response Locking & Concurrency Protection

**Course:** CSE 3292 – Website Development  
**Project:** BloodRadar (Emergency Blood Response Network)  
**Team:** Digital Pioneers  

---

## 1. The Double-Booking Problem

In traditional blood donation platforms or social media groups, an urgent request is broadcast publicly. When multiple donors volunteer simultaneously:
- Multiple donors travel to the same hospital, only to be turned away.
- One donor donates, while others waste critical time.
- Donors become frustrated and disengage from future emergency calls.

BloodRadar solves this permanently with **Atomic Database Response Locking**.

---

## 2. Technical Implementation: `SELECT ... FOR UPDATE`

When a donor clicks **"Accept Request"**, the application calls a PostgreSQL function: `accept_request(p_request_id uuid)` via Supabase RPC.

The function operates within a single isolated database transaction:

```sql
CREATE OR REPLACE FUNCTION accept_request(p_request_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_request blood_requests%ROWTYPE;
  v_donor_id uuid;
BEGIN
  -- 1. Identify caller strictly from authenticated session
  SELECT id INTO v_donor_id FROM donors WHERE profile_id = auth.uid();
  IF v_donor_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Only registered donors can accept requests.');
  END IF;

  -- 2. Lock the target request row immediately
  SELECT * INTO v_request 
  FROM blood_requests 
  WHERE id = p_request_id 
  FOR UPDATE;

  -- 3. Verify request is still open and unexpired
  IF v_request.status != 'open' THEN
    RETURN jsonb_build_object('success', false, 'error', 'This request is already locked or filled by another donor.');
  END IF;

  IF v_request.deadline <= now() THEN
    RETURN jsonb_build_object('success', false, 'error', 'This emergency request has expired.');
  END IF;

  -- 4. Record the acceptance
  INSERT INTO donor_responses (request_id, donor_id, status)
  VALUES (p_request_id, v_donor_id, 'accepted');

  -- 5. Atomic Lock (Single donor requests)
  IF v_request.single_donor = true THEN
    UPDATE blood_requests
    SET status = 'locked',
        accepted_donor_id = v_donor_id,
        locked_at = now()
    WHERE id = p_request_id;
  END IF;

  RETURN jsonb_build_object('success', true, 'message', 'Request successfully accepted and locked.');
END;
$$;
```

---

## 3. Concurrency Protection Verification

1. **Transaction Isolation:** Row locking guarantees that parallel requests are evaluated sequentially by PostgreSQL's transaction manager.
2. **First-Come, First-Served:** The first donor transaction commits and sets `status = 'locked'`.
3. **Graceful Rejection:** Subsequent parallel transactions immediately encounter `status != 'open'` and return a friendly error message (`"This request has been filled by another donor"`), without throwing database exceptions or crashing.
