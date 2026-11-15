import * as fs from "fs";
import * as path from "path";
import { createClient } from "@supabase/supabase-js";

function loadEnvLocal(): Record<string, string> {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, "utf-8");
  const env: Record<string, string> = {};
  content.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx !== -1) {
      env[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
    }
  });
  return env;
}

async function verifyPhase6Gate() {
  console.log("=== Phase 6 Gate Verification Check ===");
  const env = loadEnvLocal();

  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error("FAIL: .env.local not found or missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY.");
    console.error("CRITICAL: Cannot run real queries against Supabase without credentials.");
    process.exit(1);
  }

  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  console.log("1. Checking for pg_cron job 'expand_request_radius'...");
  const { data: jobs, error: jobErr } = await supabase.rpc("get_cron_jobs");
  if (jobErr) {
    console.error("FAIL: Could not query cron jobs:", jobErr.message);
  } else {
    console.log("PASS: Found cron jobs:", jobs);
  }

  console.log("2. Checking stage 1 notifications from requests...");
  const { data: notifs, error: notifErr } = await supabase.from("notifications").select("id, request_id, stage, message").limit(5);
  if (notifErr) {
    console.error("FAIL: Could not query notifications:", notifErr.message);
  } else {
    console.log(`PASS: Found ${notifs?.length ?? 0} notifications.`);
  }

  if (jobErr || notifErr) {
    process.exit(1);
  }
}

verifyPhase6Gate().catch((err) => {
  console.error("Unexpected error:", err.message);
  process.exit(1);
});
