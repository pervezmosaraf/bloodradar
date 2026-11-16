"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { createClient } from "@/lib/supabase/client";
import { ShieldAlert, PlusCircle, Search, Clock, CheckCircle, AlertTriangle } from "lucide-react";

export default function RequesterDashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/login");
        return;
      }
      setUser(data.user);
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
            <p className="text-xs text-slate-500 font-medium">Loading your requester portal...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
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
                Welcome, {user?.user_metadata?.full_name || "Requester"}
              </span>
              <Badge variant="info" size="md">
                Requester Portal
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Post emergency blood requests, trigger 3km → 5km → 10km cascading radar, and track donors.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/emergency-request">
              <Button variant="danger" size="sm" className="gap-1.5 text-xs font-bold shadow-md animate-pulse hover:animate-none">
                <ShieldAlert className="w-3.5 h-3.5" />
                Post Emergency Request
              </Button>
            </Link>
            <Link href="/find-donors">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <Search className="w-3.5 h-3.5" />
                Find Donors
              </Button>
            </Link>
          </div>
        </div>

        {/* Status Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-xs font-semibold text-slate-500">Active Requests</p>
              <p className="text-2xl font-extrabold text-brand-600 mt-1">0</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-xs font-semibold text-slate-500">Donors Matched</p>
              <p className="text-2xl font-extrabold text-emerald-600 mt-1">0</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-xs font-semibold text-slate-500">Fulfilled Donations</p>
              <p className="text-2xl font-extrabold text-blue-600 mt-1">0</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-xs font-semibold text-slate-500">Expired / Cancelled</p>
              <p className="text-2xl font-extrabold text-slate-400 mt-1">0</p>
            </CardContent>
          </Card>
        </div>

        {/* Active Emergency Requests Table / Empty State */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Your Emergency Requests</span>
              <Link href="/emergency-request">
                <Button variant="ghost" size="sm" className="gap-1 text-xs text-brand-600 hover:text-brand-700">
                  <PlusCircle className="w-3.5 h-3.5" />
                  New Request
                </Button>
              </Link>
            </CardTitle>
            <CardDescription>
              Real-time monitoring of expanding concentric search rings (3km → 5km → 10km).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Clock className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-800">No active emergency requests</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  When you or a patient needs urgent blood units, submit a request to notify eligible nearby donors.
                </p>
              </div>
              <Link href="/emergency-request">
                <Button variant="primary" size="sm" className="gap-1.5 mt-2 text-xs">
                  <PlusCircle className="w-3.5 h-3.5" />
                  Create Emergency Request
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
