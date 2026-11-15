import React from "react";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Activity, ShieldCheck, Heart, Radio } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="text-center space-y-3">
          <Badge variant="blood">About BloodRadar</Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Emergency Blood Response Network
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            BloodRadar is designed to connect blood requesters with nearby eligible donors faster and more reliably than standard passive blood directories.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
                  <Radio className="w-4 h-4" />
                </div>
                <CardTitle className="text-base">The Core Problem</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 leading-relaxed">
                Traditional blood donation groups rely on manual phone calls, social media broadcasts, and static directories. In critical emergencies, families waste precious hours dialing unavailable donors or donors who are already in a 90-day cooldown period.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <CardTitle className="text-base">The Algorithmic Solution</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 leading-relaxed">
                BloodRadar automates the response lifecycle: cascading notifications from 3km to 5km to 10km using PostGIS spatial indexing, server-enforced countdown deadlines, and atomic response locking to prevent conflicting acceptances.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Course & Project Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            <p><strong>Course:</strong> CSE 3292 — Website Development</p>
            <p><strong>Team:</strong> Digital Pioneers (Individual Project)</p>
            <p><strong>Architecture:</strong> Next.js App Router, TypeScript, Tailwind CSS, Supabase PostGIS spatial engine, and pg_cron scheduler.</p>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
