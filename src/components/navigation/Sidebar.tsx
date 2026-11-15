"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { UserRole } from "@/types/database.types";
import {
  LayoutDashboard,
  Radio,
  Clock,
  History,
  Settings,
  PlusCircle,
  Users,
  ShieldAlert,
  FileText,
  Activity,
  HeartHandshake,
} from "lucide-react";

export interface SidebarProps {
  role: UserRole;
  userEmail?: string;
  userName?: string;
  className?: string;
}

export function Sidebar({ role, userEmail, userName, className }: SidebarProps) {
  const pathname = usePathname();

  const donorLinks = [
    { label: "Overview", href: "/donor", icon: LayoutDashboard },
    { label: "Incoming Requests", href: "/donor/requests", icon: Radio },
    { label: "Donation History", href: "/donor/history", icon: History },
    { label: "Cooldown Status", href: "/donor/cooldown", icon: Clock },
    { label: "Profile & Area", href: "/donor/profile", icon: Settings },
  ];

  const requesterLinks = [
    { label: "Active Requests", href: "/requester", icon: LayoutDashboard },
    { label: "Post Emergency SOS", href: "/requester/create", icon: PlusCircle },
    { label: "Request History", href: "/requester/history", icon: History },
    { label: "Settings", href: "/requester/settings", icon: Settings },
  ];

  const adminLinks = [
    { label: "Platform Analytics", href: "/admin", icon: LayoutDashboard },
    { label: "Users & Roles", href: "/admin/users", icon: Users },
    { label: "Active Radar Requests", href: "/admin/requests", icon: ShieldAlert },
    { label: "Donation Records", href: "/admin/donations", icon: HeartHandshake },
    { label: "Audit Logs", href: "/admin/logs", icon: FileText },
  ];

  const links = role === "admin" ? adminLinks : role === "donor" ? donorLinks : requesterLinks;

  const roleLabels: Record<UserRole, { label: string; badgeClass: string }> = {
    donor: { label: "Blood Donor", badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    requester: { label: "Requester", badgeClass: "bg-blue-50 text-blue-700 border-blue-200" },
    admin: { label: "Administrator", badgeClass: "bg-brand-50 text-brand-700 border-brand-200" },
  };

  return (
    <aside
      className={cn(
        "w-64 shrink-0 bg-white border-r border-slate-200 flex flex-col justify-between h-[calc(100vh-4rem)] sticky top-16",
        className
      )}
    >
      <div className="p-4 space-y-6">
        {/* User Badge */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center shrink-0">
              {userName ? userName.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-900 truncate">{userName || "User"}</p>
              <p className="text-[11px] text-slate-500 truncate">{userEmail || ""}</p>
            </div>
          </div>
          <div className="mt-2.5">
            <span
              className={cn(
                "inline-flex text-[10px] uppercase font-bold px-2 py-0.5 rounded border tracking-wide",
                roleLabels[role].badgeClass
              )}
            >
              {roleLabels[role].label}
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Navigation Menu
          </p>
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== `/${role}` && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-brand-600 text-white font-semibold shadow-sm shadow-brand-600/20"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-white" : "text-slate-400")} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Emergency Reminder */}
      <div className="p-4 border-t border-slate-100">
        <div className="p-3 rounded-lg bg-red-50/70 border border-red-100 flex items-center gap-2.5">
          <Activity className="w-4 h-4 text-brand-600 shrink-0 animate-pulse" />
          <span className="text-xs font-semibold text-brand-800">Live Radar Status: Active</span>
        </div>
      </div>
    </aside>
  );
}
