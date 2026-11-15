import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

// Simple manual .env.local parser without external dependencies
function loadEnvLocal() {
  const envLocalPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envLocalPath)) {
    return false;
  }
  const content = fs.readFileSync(envLocalPath, "utf-8");
  content.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
      process.env[key] = val;
    }
  });
  return true;
}

async function verifyDatabase() {
  const envFound = loadEnvLocal();

  if (!envFound) {
    console.log("STATUS: .env.local file NOT FOUND on disk.");
    console.log("GATE RESULT: FAIL — Please create .env.local with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
    process.exit(1);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || url.includes("placeholder") || url.includes("your-project")) {
    console.log("STATUS: .env.local contains placeholder credentials.");
    console.log("GATE RESULT: FAIL — Valid Supabase credentials are required.");
    process.exit(1);
  }

  console.log("Connecting to Supabase project...");
  const supabase = createClient(url, key);

  // Check 1: profiles table
  const { data: profiles, error: profErr } = await supabase.from("profiles").select("id").limit(1);
  if (profErr) {
    console.error("FAIL: profiles table query failed:", profErr.message);
  } else {
    console.log("PASS: profiles table exists and responded.");
  }

  // Check 2: donors table
  const { data: donors, error: donErr } = await supabase.from("donors").select("id, blood_group, is_demo").limit(5);
  if (donErr) {
    console.error("FAIL: donors table query failed:", donErr.message);
  } else {
    console.log(`PASS: donors table exists. Found ${donors?.length ?? 0} records.`);
  }

  // Check 3: blood_requests table
  const { data: requests, error: reqErr } = await supabase.from("blood_requests").select("id").limit(1);
  if (reqErr) {
    console.error("FAIL: blood_requests table query failed:", reqErr.message);
  } else {
    console.log("PASS: blood_requests table exists and responded.");
  }

  // Check 4: contact_messages table
  const { data: contact, error: contErr } = await supabase.from("contact_messages").select("id").limit(1);
  if (contErr) {
    console.error("FAIL: contact_messages table query failed:", contErr.message);
  } else {
    console.log("PASS: contact_messages table exists and responded.");
  }

  if (profErr || donErr || reqErr || contErr) {
    console.log("GATE RESULT: FAIL — Some Phase 3 tables are missing or not created yet.");
    process.exit(1);
  } else {
    console.log("GATE RESULT: PASS — All Phase 3 tables exist and responded to live queries.");
  }
}

verifyDatabase().catch((err) => {
  console.error("Unexpected error verifying database:", err);
  process.exit(1);
});
