"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { CheckCircle2, ShieldAlert } from "lucide-react";

export interface CooldownRingProps {
  cooldownEndsAt: string | null;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function CooldownRing({
  cooldownEndsAt,
  size = 140,
  strokeWidth = 10,
  className,
}: CooldownRingProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!cooldownEndsAt) {
    return (
      <div className={cn("flex flex-col items-center justify-center p-4 text-center", className)}>
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mb-2">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <span className="text-sm font-bold text-emerald-700">Ready to Donate</span>
        <span className="text-xs text-slate-500 mt-0.5">No active cooldown</span>
      </div>
    );
  }

  const now = Date.now();
  const targetDate = new Date(cooldownEndsAt).getTime();
  const diffMs = targetDate - now;

  const isComplete = diffMs <= 0;

  if (isComplete) {
    return (
      <div className={cn("flex flex-col items-center justify-center p-4 text-center", className)}>
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mb-2">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <span className="text-sm font-bold text-emerald-700">Cooldown Complete</span>
        <span className="text-xs text-slate-500 mt-0.5">Eligible to donate blood</span>
      </div>
    );
  }

  const remainingDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  const totalCooldownDays = 90;
  const daysCompleted = Math.max(0, Math.min(totalCooldownDays, totalCooldownDays - remainingDays));
  const percentage = (daysCompleted / totalCooldownDays) * 100;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const formattedDate = mounted
    ? new Date(cooldownEndsAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "90 days";

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="rotate-[-90deg]">
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-100"
            fill="transparent"
          />
          {/* Progress Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="text-amber-500 transition-all duration-500"
            fill="transparent"
          />
        </svg>

        {/* Center Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
            {remainingDays}
          </span>
          <span className="text-[10px] uppercase font-bold text-slate-400 mt-1">Days Left</span>
        </div>
      </div>

      <div className="mt-3 text-center">
        <div className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Active 90-Day Cooldown</span>
        </div>
        <p className="text-[11px] text-slate-500 mt-1">Eligible on {formattedDate}</p>
      </div>
    </div>
  );
}
