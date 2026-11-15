import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface PlatformStats {
  totalDonors: number;
  activeRequests: number;
  completedDonations: number;
  isDemoData: boolean;
  isDbConnected: boolean;
}

export async function getPlatformStatistics(): Promise<PlatformStats> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  // Fallback state if database credentials are not configured yet
  if (!supabaseUrl || supabaseUrl.includes("placeholder")) {
    return {
      totalDonors: 0,
      activeRequests: 0,
      completedDonations: 0,
      isDemoData: false,
      isDbConnected: false,
    };
  }

  try {
    const supabase = createServerSupabaseClient();

    // Query 1: Total donors count
    const { count: donorCount, error: donorErr } = await supabase
      .from("donors")
      .select("*", { count: "exact", head: true });

    // Query 2: Open active requests count
    const { count: requestCount, error: reqErr } = await supabase
      .from("blood_requests")
      .select("*", { count: "exact", head: true })
      .eq("status", "open");

    // Query 3: Completed donations count
    const { count: donationCount, error: donErr } = await supabase
      .from("donation_history")
      .select("*", { count: "exact", head: true });

    // Check if demo data flag is set
    const { count: demoCount } = await supabase
      .from("donors")
      .select("*", { count: "exact", head: true })
      .eq("is_demo", true);

    const hasErrors = Boolean(donorErr || reqErr || donErr);

    return {
      totalDonors: donorCount ?? 0,
      activeRequests: requestCount ?? 0,
      completedDonations: donationCount ?? 0,
      isDemoData: Boolean(demoCount && demoCount > 0),
      isDbConnected: !hasErrors,
    };
  } catch (err) {
    console.error("Error reading platform statistics from Supabase:", err);
    return {
      totalDonors: 0,
      activeRequests: 0,
      completedDonations: 0,
      isDemoData: false,
      isDbConnected: false,
    };
  }
}
