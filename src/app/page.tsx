import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { HeroRadarVisual } from "@/components/radar/HeroRadarVisual";
import { BloodGroupSearch } from "@/components/home/BloodGroupSearch";
import {
  Activity,
  ShieldAlert,
  Radio,
  Clock,
  Lock,
  Heart,
  Users,
  CheckCircle2,
  Database,
  ArrowRight,
  PhoneCall,
  MapPin,
} from "lucide-react";
import { getPlatformStatistics } from "@/lib/services/stats";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const stats = await getPlatformStatistics();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-12 lg:space-y-16">
        {/* ================================================================= */}
        {/* 1. HERO SECTION: Dark navy-to-deep-red gradient with Radar visual */}
        {/* ================================================================= */}
        <section className="bg-gradient-to-r from-navy-950 via-slate-900 to-brand-950 rounded-3xl p-6 sm:p-10 lg:p-14 text-white shadow-2xl relative overflow-hidden border border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-300 text-xs font-semibold">
                <Activity className="w-3.5 h-3.5 animate-pulse text-brand-400" />
                <span>Emergency Blood Response Network</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight leading-tight sm:leading-tight">
                Seconds Save Lives When Blood Is Needed Most
              </h1>

              <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl">
                When an emergency strikes, BloodRadar automatically finds and alerts eligible blood donors near the hospital in expanding stages. Once a donor accepts, the request instantly locks to prevent double-booking.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <Link href="/emergency-request">
                  <Button
                    variant="danger"
                    size="lg"
                    className="gap-2 font-bold shadow-lg shadow-brand-600/30 text-base px-6 py-3"
                  >
                    <ShieldAlert className="w-5 h-5" />
                    Emergency Request
                  </Button>
                </Link>

                <Link href="/find-donors">
                  <Button
                    variant="outline"
                    size="lg"
                    className="bg-white/10 text-white border-white/20 hover:bg-white/20 text-base px-6 py-3"
                  >
                    Find Donors
                  </Button>
                </Link>
              </div>

              <div className="pt-3 flex items-center gap-6 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  No duplicate bookings
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand-400" />
                  Donor coordinates kept private
                </span>
              </div>
            </div>

            {/* Right Visual: Animated Radar */}
            <div className="lg:col-span-5 flex items-center justify-center pt-4 lg:pt-0">
              <div className="w-full max-w-[340px] flex flex-col items-center">
                <HeroRadarVisual />
                <p className="mt-2 text-center text-xs text-slate-400 font-medium">
                  Live proximity scan: 3 km → 5 km → 10 km
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 2. BLOOD GROUP QUICK SEARCH SECTION                                */}
        {/* ================================================================= */}
        <section aria-label="Quick Blood Group Search">
          <BloodGroupSearch />
        </section>

        {/* ================================================================= */}
        {/* 3. HOW BLOODRADAR WORKS: 3-Step Visual                            */}
        {/* ================================================================= */}
        <section id="how-it-works" className="space-y-8 scroll-mt-20">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Simple, Fast & Reliable
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              How BloodRadar Works
            </h2>
            <p className="text-slate-600 text-sm max-w-xl mx-auto">
              Connecting patients with nearby eligible donors in minutes rather than hours.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm relative flex flex-col justify-between hover:border-slate-300 transition-all">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-black text-lg">
                    1
                  </div>
                  <Badge variant="outline">Step 1</Badge>
                </div>
                <h3 className="text-lg font-bold text-slate-900">Request Created</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  The hospital location, required blood group, units, and an emergency deadline countdown are submitted to start the response.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-500">
                <Clock className="w-4 h-4 text-brand-600" />
                <span>Live countdown starts</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm relative flex flex-col justify-between hover:border-slate-300 transition-all">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-lg">
                    2
                  </div>
                  <Badge variant="warning">Step 2</Badge>
                </div>
                <h3 className="text-lg font-bold text-slate-900">Radius Expands (3 → 5 → 10 km)</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  The network immediately notifies verified, available donors within 3 km. If more help is needed, alerts expand to 5 km, then 10 km.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-500">
                <Radio className="w-4 h-4 text-amber-600" />
                <span>Only new donors are notified</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm relative flex flex-col justify-between hover:border-slate-300 transition-all">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-lg">
                    3
                  </div>
                  <Badge variant="success">Step 3</Badge>
                </div>
                <h3 className="text-lg font-bold text-slate-900">Donor Accepts & Locks</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  As soon as a donor accepts, the request instantly locks to prevent double-booking. Other donors are notified that the need is filled.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-500">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span>Instant lock & contact reveal</span>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 4. FOUR CORE FEATURE CARDS                                        */}
        {/* ================================================================= */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Built for Real Emergencies
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Why BloodRadar is Different
            </h2>
            <p className="text-slate-600 text-sm max-w-xl mx-auto">
              Four key features that solve the problems of standard blood group directories.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-3 hover:border-slate-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <Radio className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Cascading Radius</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Alerts donors in concentric rings (3 km → 5 km → 10 km) so nearby donors respond first without alarming the entire city.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-3 hover:border-slate-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Emergency Countdown</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every request carries a clear deadline with a live countdown timer. Requests that pass their deadline are closed automatically.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-3 hover:border-slate-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-navy-50 text-navy-900 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Response Locking</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Only one donor can accept a single-unit request, ensuring nobody is double-booked and multiple donors don&apos;t travel for the same patient.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-3 hover:border-slate-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">90-Day Cooldown</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                After donating, donors enter a 90-day rest period. The system automatically excludes them from new alerts until they are eligible.
              </p>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 5. LIVE STATISTICS (Real counts only; no invented numbers)          */}
        {/* ================================================================= */}
        <section className="space-y-6 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Database className="w-5 h-5 text-brand-600" />
                Live Network Statistics
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Real-time counts reflected directly from current database activity.
              </p>
            </div>

            {stats.isDbConnected ? (
              <Badge variant="success" dot pulse>
                {stats.isDemoData ? "Live Database (Demo Dataset)" : "Live Database Active"}
              </Badge>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                Awaiting Supabase connection
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <StatCard
              title="Registered Donors"
              value={stats.totalDonors}
              description={
                stats.totalDonors > 0
                  ? "Eligible community donors on standby"
                  : "No donors registered yet"
              }
              icon={<Users className="w-5 h-5 text-brand-600" />}
              accentColor="brand"
            />

            <StatCard
              title="Active Emergency Requests"
              value={stats.activeRequests}
              description={
                stats.activeRequests > 0
                  ? "Open requests currently in proximity search"
                  : "No open emergencies at this moment"
              }
              icon={<Radio className="w-5 h-5 text-emerald-600" />}
              accentColor="emerald"
            />

            <StatCard
              title="Completed Donations"
              value={stats.completedDonations}
              description={
                stats.completedDonations > 0
                  ? "Verified transfusions successfully coordinated"
                  : "Awaiting first confirmed donation"
              }
              icon={<Heart className="w-5 h-5 text-navy-800" />}
              accentColor="navy"
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
