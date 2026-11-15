"use client";

import React, { useState, useCallback } from "react";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { CooldownRing } from "@/components/ui/CooldownRing";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Activity, Radio, ShieldAlert, Heart, RefreshCw } from "lucide-react";
import { BLOOD_GROUPS } from "@/lib/constants/bloodGroups";

interface DemoRow {
  id: string;
  patient: string;
  bloodGroup: string;
  stage: string;
  radius: string;
  status: string;
}

const sampleColumns: Column<DemoRow>[] = [
  { header: "ID", accessorKey: "id", className: "font-mono text-xs" },
  { header: "Patient", accessorKey: "patient", className: "font-medium" },
  {
    header: "Blood Group",
    cell: (row) => <Badge variant="blood">{row.bloodGroup}</Badge>,
  },
  { header: "Stage", accessorKey: "stage" },
  {
    header: "Active Radius",
    cell: (row) => <Badge variant="info">{row.radius}</Badge>,
  },
  {
    header: "Status",
    cell: (row) => (
      <Badge variant="warning" dot pulse>
        {row.status}
      </Badge>
    ),
  },
];

const sampleData: DemoRow[] = [
  {
    id: "REQ-7821",
    patient: "Amina Begum",
    bloodGroup: "O+",
    stage: "Stage 2",
    radius: "5 km",
    status: "Cascading",
  },
  {
    id: "REQ-7822",
    patient: "Rafiqul Islam",
    bloodGroup: "AB-",
    stage: "Stage 1",
    radius: "3 km",
    status: "Matching",
  },
];

export default function DesignSystemPage() {
  // Interactive test state for Countdown Timer
  const [deadline, setDeadline] = useState<string>(() =>
    new Date(Date.now() + 3 * 3600 * 1000 + 42 * 60 * 1000).toISOString()
  );
  const [expiredCount, setExpiredCount] = useState<number>(0);

  const handleExpire = useCallback(() => {
    setExpiredCount((prev) => prev + 1);
  }, []);

  // Interactive test state for Cooldown Ring
  const [cooldownDaysLeft, setCooldownDaysLeft] = useState<number>(64);
  const cooldownDate =
    cooldownDaysLeft > 0
      ? new Date(Date.now() + cooldownDaysLeft * 86400 * 1000).toISOString()
      : null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Showcase Header */}
        <div className="bg-gradient-to-r from-brand-900 via-navy-950 to-navy-900 rounded-3xl p-8 lg:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-300 text-xs font-semibold">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span>Design System Sandbox</span>
            </div>
            <h1 className="text-3xl lg:text-5xl font-black tracking-tight leading-tight">
              Blood<span className="text-brand-500">Radar</span> Component Library
            </h1>
            <p className="text-slate-300 text-base lg:text-lg leading-relaxed">
              Interactive testbed for buttons, inputs, badges, countdown timers, and cooldown tracking components.
            </p>
          </div>
        </div>

        {/* Four Core Differentiators Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Differentiator 1"
            value="3-5-10 km"
            description="Cascading Geolocation notifications via PostGIS"
            icon={<Radio className="w-5 h-5 text-brand-600" />}
            accentColor="brand"
          />
          <StatCard
            title="Differentiator 2"
            value="Countdown"
            description="Live client countdown + DB now() deadline lock"
            icon={<Activity className="w-5 h-5 text-emerald-600" />}
            accentColor="emerald"
          />
          <StatCard
            title="Differentiator 3"
            value="Locking"
            description="SELECT FOR UPDATE single-acceptance concurrency"
            icon={<ShieldAlert className="w-5 h-5 text-navy-800" />}
            accentColor="navy"
          />
          <StatCard
            title="Differentiator 4"
            value="90-Day"
            description="Requester-confirmed cooldown tracking"
            icon={<Heart className="w-5 h-5 text-amber-600" />}
            accentColor="amber"
          />
        </div>

        {/* Design System Playground */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Card & Controls */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Reusable UI Components</CardTitle>
              <CardDescription>
                Live preview of buttons, inputs, selects, badges, and real-time timers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Buttons */}
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase text-slate-500">Buttons</p>
                <div className="flex flex-wrap items-center gap-2.5">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="danger">Danger</Button>
                  <Button variant="success">Success</Button>
                  <Button variant="primary" isLoading>
                    Loading
                  </Button>
                </div>
              </div>

              {/* Badges */}
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase text-slate-500">Badges</p>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="blood">O+ Universal</Badge>
                  <Badge variant="blood">AB- Rare</Badge>
                  <Badge variant="success" dot>
                    Available
                  </Badge>
                  <Badge variant="danger" dot pulse>
                    Live Emergency
                  </Badge>
                  <Badge variant="warning">Stage 2 (5km)</Badge>
                  <Badge variant="info">3 Donors Notified</Badge>
                </div>
              </div>

              {/* Form Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Bangladesh Phone (01XXXXXXXXX)"
                  placeholder="01712345678"
                  helperText="Validated strictly with Zod"
                />
                <Select label="Blood Group">
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Live Countdown & Interactive Verification Controls */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-700">
                      Live Countdown Component (Differentiator 2)
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Ticks every second. Urgency styling: &lt;30m Red/Pulse, &lt;2h Amber, &ge;2h Normal.
                    </p>
                  </div>
                  <CountdownTimer
                    deadline={deadline}
                    size="md"
                    onExpire={handleExpire}
                  />
                </div>

                {/* Interactive Test Triggers for Countdown */}
                <div className="flex flex-wrap items-center gap-2 pt-1 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
                  <span className="text-[11px] font-semibold text-slate-600">Test Triggers:</span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs py-1 h-7"
                    onClick={() => setDeadline(new Date(Date.now() + 10 * 1000).toISOString())}
                  >
                    10s Fast Countdown
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs py-1 h-7"
                    onClick={() => setDeadline(new Date(Date.now() + 20 * 60 * 1000).toISOString())}
                  >
                    &lt;30m Critical (Red)
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs py-1 h-7"
                    onClick={() => setDeadline(new Date(Date.now() + 90 * 60 * 1000).toISOString())}
                  >
                    &lt;2h Urgent (Amber)
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs py-1 h-7 text-red-600"
                    onClick={() => setDeadline(new Date(Date.now() - 5000).toISOString())}
                  >
                    Immediate Expired
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-xs py-1 h-7"
                    onClick={() =>
                      setDeadline(new Date(Date.now() + 3 * 3600 * 1000 + 42 * 60 * 1000).toISOString())
                    }
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Reset
                  </Button>
                  {expiredCount > 0 && (
                    <span className="text-[11px] font-bold text-red-600 ml-auto">
                      Expired callback fired: {expiredCount} time(s)
                    </span>
                  )}
                </div>

                <DataTable columns={sampleColumns} data={sampleData} />
              </div>
            </CardContent>
            <CardFooter>
              <span className="text-xs text-slate-500">Component Sandbox Mode</span>
              <span className="text-xs text-slate-400">Route: /design-system</span>
            </CardFooter>
          </Card>

          {/* Differentiator 4 Cooldown Widget Preview */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>90-Day Cooldown Ring</CardTitle>
                <CardDescription>
                  Differentiator 4 interactive visual component
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <CooldownRing cooldownEndsAt={cooldownDate} />

                {/* Interactive Test Triggers for Cooldown */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <p className="text-[11px] font-semibold text-slate-600 text-center">
                    Interactive Cooldown States:
                  </p>
                  <div className="grid grid-cols-3 gap-1.5">
                    <Button
                      size="sm"
                      variant={cooldownDaysLeft === 90 ? "primary" : "outline"}
                      className="text-xs py-1 h-7 px-1"
                      onClick={() => setCooldownDaysLeft(90)}
                    >
                      90 Days (0%)
                    </Button>
                    <Button
                      size="sm"
                      variant={cooldownDaysLeft === 45 ? "primary" : "outline"}
                      className="text-xs py-1 h-7 px-1"
                      onClick={() => setCooldownDaysLeft(45)}
                    >
                      45 Days (50%)
                    </Button>
                    <Button
                      size="sm"
                      variant={cooldownDaysLeft === 0 ? "primary" : "outline"}
                      className="text-xs py-1 h-7 px-1"
                      onClick={() => setCooldownDaysLeft(0)}
                    >
                      0 Days (Eligible)
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-center">
                <span className="text-xs text-slate-500">Tracked via donation_history</span>
              </CardFooter>
            </Card>

            <Card className="bg-gradient-to-br from-slate-900 to-navy-950 text-white border-0">
              <CardContent className="space-y-3 pt-6">
                <h4 className="font-bold text-sm">Design System Specifications</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Tailwind CSS design tokens, custom components, PostGIS spatial models, and Zod schemas established for Phase 2 implementation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
