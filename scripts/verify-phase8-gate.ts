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

async function verifyPhase8Gate() {
  console.log("=== Phase 8 Gate Verification Check ===");
  const env = loadEnvLocal();

  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error("FAIL: .env.local not found or missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY.");
    console.error("CRITICAL: Cannot verify Phase 8 live queries (confirm_donation RPC, donation_history, 90-day cooldown) without an active database.");
    process.exit(1);
  }

  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  console.log("1. Checking confirm_donation RPC...");
  const { data: rpcRes, error: rpcErr } = await supabase.rpc("confirm_donation", {
    p_request_id: "00000000-0000-0000-0000-000000000000",
    p_donor_id: "00000000-0000-0000-0000-000000000000"
  });
  if (rpcErr) {
    console.error("RPC check response:", rpcErr.message);
  } else {
    console.log("RPC responded:", rpcRes);
  }
}

verifyPhase8Gate().catch((err) => {
  console.error("Unexpected error:", err.message);
  process.exit(1);
});
