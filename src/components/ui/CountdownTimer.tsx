"use client";

import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils/cn";
import { Clock, AlertTriangle } from "lucide-react";

export interface CountdownTimerProps {
  deadline: string | Date;
  onExpire?: () => void;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function CountdownTimer({
  deadline,
  onExpire,
  showIcon = true,
  size = "md",
  className,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    totalMs: number;
    isExpired: boolean;
  }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalMs: 0,
    isExpired: false,
  });

  const [mounted, setMounted] = useState(false);
  const onExpireRef = useRef(onExpire);
  const hasFiredForDeadlineRef = useRef<string | null>(null);

  // Keep latest onExpire callback reference without triggering the timer effect
  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    setMounted(true);
    const deadlineStr = typeof deadline === "string" ? deadline : deadline.toISOString();
    const targetDate = new Date(deadline).getTime();

    const calculateTimeLeft = () => {
      const now = Date.now();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, totalMs: 0, isExpired: true });
        // Guarantee onExpire is called strictly ONCE per unique deadline
        if (hasFiredForDeadlineRef.current !== deadlineStr) {
          hasFiredForDeadlineRef.current = deadlineStr;
          onExpireRef.current?.();
        }
        return false;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds, totalMs: difference, isExpired: false });
      return true;
    };

    const isRunning = calculateTimeLeft();
    if (!isRunning) return;

    const interval = setInterval(() => {
      const stillRunning = calculateTimeLeft();
      if (!stillRunning) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [deadline]);

  if (!mounted) {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg border font-mono tracking-tight text-navy-900 bg-slate-50 border-slate-200 opacity-60",
          size === "sm" ? "text-xs px-2 py-0.5" : size === "lg" ? "text-base px-4 py-2 font-bold" : "text-sm px-3 py-1 font-semibold",
          className
        )}
      >
        {showIcon && <Clock className="w-4 h-4 shrink-0 opacity-70" />}
        <span>--:--:--</span>
      </div>
    );
  }

  if (timeLeft.isExpired) {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-1.5 font-bold text-red-600 bg-red-50 border border-red-200 rounded-lg px-2.5 py-1 text-xs",
          className
        )}
      >
        <AlertTriangle className="w-3.5 h-3.5" />
        <span>EXPIRED</span>
      </div>
    );
  }

  // Urgency tiers:
  // Critical: < 30 minutes (red + pulse)
  // Urgent: < 2 hours (amber)
  // Normal: >= 2 hours (navy/slate)
  const isCritical = timeLeft.totalMs < 30 * 60 * 1000;
  const isUrgent = timeLeft.totalMs < 2 * 60 * 60 * 1000;

  const colorStyles = isCritical
    ? "text-red-700 bg-red-50 border-red-200 animate-pulse"
    : isUrgent
    ? "text-amber-700 bg-amber-50 border-amber-200"
    : "text-navy-900 bg-slate-50 border-slate-200";

  const sizeStyles = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1 font-semibold",
    lg: "text-base px-4 py-2 font-bold",
  };

  const formatNumber = (num: number) => String(num).padStart(2, "0");

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border font-mono tracking-tight",
        colorStyles,
        sizeStyles[size],
        className
      )}
      title="Remaining time before emergency deadline"
    >
      {showIcon && <Clock className="w-4 h-4 shrink-0 opacity-70" />}
      <span>
        {formatNumber(timeLeft.hours)}:{formatNumber(timeLeft.minutes)}:
        {formatNumber(timeLeft.seconds)}
      </span>
    </div>
  );
}
