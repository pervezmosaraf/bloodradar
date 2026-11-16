"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CooldownRing } from "@/components/ui/CooldownRing";
import { createClient } from "@/lib/supabase/client";
import { Heart, Activity, MapPin, Bell, Calendar, User, ShieldCheck, Search } from "lucide-react";

export default function DonorDashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [donorProfile, setDonorProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/login");
        return;
      }
      setUser(data.user);

      // Fetch donor profile
      const { data: donor } = await supabase
        .from("donors")
        .select("*")
        .eq("profile_id", data.user.id)
        .single();

      setDonorProfile(donor);
      setLoading(false);
    }
    loadData();
  }, [router, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-12 flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-slate-500 font-medium">Loading your donor portal...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Calculate cooldown days remaining
  let remainingCooldownDays = 0;
  if (donorProfile?.cooldown_ends_at) {
    const diff = new Date(donorProfile.cooldown_ends_at).getTime() - Date.now();
    if (diff > 0) {
      remainingCooldownDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Welcome, {user?.user_metadata?.full_name || "Volunteer Donor"}
              </span>
              <Badge variant="danger" size="md">
                Blood Group: {donorProfile?.blood_group || user?.user_metadata?.blood_group || "O+"}
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Your registered coverage is actively monitored for emergency response broadcasts in Dhaka.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/find-donors">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <Search className="w-3.5 h-3.5" />
                Find Donors
              </Button>
            </Link>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cooldown Ring Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="w-4 h-4 text-brand-600" />
                90-Day Medical Cooldown
              </CardTitle>
              <CardDescription>
                Enforces medical safety between whole blood donations.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center pt-2 pb-6">
              <CooldownRing cooldownEndsAt={donorProfile?.cooldown_ends_at || null} size={150} />
            </CardContent>
          </Card>

          {/* Availability Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Availability Status
              </CardTitle>
              <CardDescription>
                Controls whether you receive emergency broadcasts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-700">Broadcast Reception</p>
                  <p className="text-sm font-bold text-slate-900">
                    {remainingCooldownDays > 0
                      ? "In Cooldown (Paused)"
                      : donorProfile?.is_available !== false
                      ? "Active & Available"
                      : "Temporarily Paused"}
                  </p>
                </div>
                <Badge
                  variant={
                    remainingCooldownDays > 0
                      ? "default"
                      : donorProfile?.is_available !== false
                      ? "success"
                      : "warning"
                  }
                >
                  {remainingCooldownDays > 0
                    ? "In Cooldown"
                    : donorProfile?.is_available !== false
                    ? "Available"
                    : "Unavailable"}
                </Badge>
              </div>

              <div className="text-xs text-slate-500 space-y-1 leading-relaxed">
                <p>
                  📍 <strong>Location Coverage:</strong> Dhaka metropolitan radius (PostGIS Point).
                </p>
                <p>
                  🔒 <strong>Privacy:</strong> Requesters cannot see your phone or GPS coordinates until you accept an emergency request.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Heart className="w-4 h-4 text-brand-600" />
                Donation Summary
              </CardTitle>
              <CardDescription>
                Track your life-saving impact on BloodRadar.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 rounded-xl bg-brand-50/60 border border-brand-100">
                  <p className="text-2xl font-black text-brand-700">0</p>
                  <p className="text-[11px] font-semibold text-slate-600">Donations Completed</p>
                </div>
                <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100">
                  <p className="text-2xl font-black text-blue-700">0</p>
                  <p className="text-[11px] font-semibold text-slate-600">Pending Requests</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                <p className="font-semibold text-slate-800">Ready for Emergency Calls</p>
                <p className="text-[11px] text-slate-500">
                  When a patient in your blood group broadcasts an alert near you, it will appear here instantly.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
