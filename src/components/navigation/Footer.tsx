import React from "react";
import Link from "next/link";
import { Activity, Heart, Shield, PhoneCall } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-navy-950 text-slate-300 border-t border-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <Activity className="w-4 h-4" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                Blood<span className="text-brand-500">Radar</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automated cascading geolocation emergency blood response network. Connecting patients with verified proximate donors across Dhaka.
            </p>
            <div className="pt-2 text-[11px] text-slate-500 border-t border-navy-900">
              <p className="font-semibold text-slate-400">CSE 3292 — Website Development</p>
              <p>Team: Digital Pioneers</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/emergency-request" className="hover:text-brand-400 transition-colors text-brand-400 font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-ping" />
                  Emergency SOS Request
                </Link>
              </li>
              <li>
                <Link href="/find-donors" className="hover:text-white transition-colors">
                  Find Compatible Donors
                </Link>
              </li>
              <li>
                <Link href="/register-donor" className="hover:text-white transition-colors">
                  Donor Registration
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-white transition-colors">
                  How BloodRadar Works
                </Link>
              </li>
              <li>
                <Link href="/design-system" className="hover:text-white transition-colors text-slate-400">
                  Design System Sandbox
                </Link>
              </li>
            </ul>
          </div>

          {/* Core Features */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">4 Differentiators</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-brand-500" />
                Cascading Radius (3km → 5km → 10km)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-brand-500" />
                Live Countdown & DB Expiry Lock
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-brand-500" />
                Atomic `SELECT FOR UPDATE` Locking
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-brand-500" />
                90-Day Verified Donor Cooldown
              </li>
            </ul>
          </div>

          {/* Emergency Helpline & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Urgent Assistance</h4>
            <div className="p-3 rounded-lg bg-navy-900 border border-navy-800 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <PhoneCall className="w-3.5 h-3.5 text-brand-400" />
                <span>Bangladesh Emergency: 999</span>
              </div>
              <p className="text-[11px] text-slate-400">
                In critical clinical scenarios, always notify emergency services first.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Strict Privacy: GPS Coordinates Hidden</span>
            </div>
          </div>
        </div>

        {/* Disclaimer Banner */}
        <div className="pt-6 border-t border-navy-900/80 text-[11px] text-slate-400 text-center leading-relaxed">
          <p>
            <strong className="text-slate-300">Medical Notice:</strong> BloodRadar is an algorithmic proximity matching and communication platform. It does not replace clinical screening. Compatibility, cross-matching, infectious screening, and final clinical eligibility must always be confirmed on-site by certified medical personnel before transfusion.
          </p>
          <p className="mt-2 text-slate-400">
            &copy; {new Date().getFullYear()} BloodRadar (Digital Pioneers). Academic project for CSE 3292.
          </p>
        </div>
      </div>
    </footer>
  );
}
