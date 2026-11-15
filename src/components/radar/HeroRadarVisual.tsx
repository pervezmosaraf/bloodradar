import React from "react";
import { Building2 } from "lucide-react";

export function HeroRadarVisual() {
  return (
    <div className="relative w-full max-w-[340px] aspect-square mx-auto flex items-center justify-center select-none">
      {/* Outer Glow */}
      <div className="absolute inset-0 rounded-full bg-brand-600/10 blur-2xl" />

      {/* SVG Canvas for concentric rings */}
      <svg
        viewBox="0 0 320 320"
        className="w-full h-full relative z-10 overflow-visible"
        aria-label="Concentric 3km, 5km, and 10km radar search rings"
      >
        <defs>
          <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#DC2626" stopOpacity="0.25" />
            <stop offset="60%" stopColor="#DC2626" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#111827" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="sweepBeam" x1="50%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#DC2626" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#DC2626" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Ambient Radar Background */}
        <circle cx="160" cy="160" r="145" fill="url(#radarGlow)" />

        {/* Axis Crosshairs */}
        <line
          x1="160"
          y1="15"
          x2="160"
          y2="305"
          stroke="#475569"
          strokeWidth="1"
          strokeDasharray="3 3"
          strokeOpacity="0.4"
        />
        <line
          x1="15"
          y1="160"
          x2="305"
          y2="160"
          stroke="#475569"
          strokeWidth="1"
          strokeDasharray="3 3"
          strokeOpacity="0.4"
        />

        {/* Ring 3: 10 km Maximum Radius */}
        <circle
          cx="160"
          cy="160"
          r="145"
          fill="none"
          stroke="#EF4444"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          className="radar-ring-3"
        />

        {/* Ring 2: 5 km Expanded Radius */}
        <circle
          cx="160"
          cy="160"
          r="98"
          fill="none"
          stroke="#F87171"
          strokeWidth="1.5"
          strokeDasharray="3 3"
          className="radar-ring-2"
        />

        {/* Ring 1: 3 km Immediate Vicinity */}
        <circle
          cx="160"
          cy="160"
          r="52"
          fill="none"
          stroke="#FCA5A5"
          strokeWidth="2"
          className="radar-ring-1"
        />

        {/* Sweeping Radar Beam */}
        <path
          d="M 160 160 L 305 160 A 145 145 0 0 0 262 57 Z"
          fill="url(#sweepBeam)"
          className="radar-sweep-beam origin-[160px_160px] opacity-40 pointer-events-none"
        />

        {/* Ring Distance Tags */}
        <text
          x="165"
          y="112"
          fill="#FCA5A5"
          fontSize="9"
          fontWeight="bold"
          letterSpacing="0.5"
          className="select-none font-mono"
        >
          3 km
        </text>
        <text
          x="165"
          y="66"
          fill="#F87171"
          fontSize="9"
          fontWeight="bold"
          letterSpacing="0.5"
          className="select-none font-mono"
        >
          5 km
        </text>
        <text
          x="165"
          y="22"
          fill="#EF4444"
          fontSize="9"
          fontWeight="bold"
          letterSpacing="0.5"
          className="select-none font-mono"
        >
          10 km
        </text>
      </svg>

      {/* Center Request Location (Hospital Anchor) */}
      <div className="absolute z-20 flex flex-col items-center pointer-events-none">
        <div className="relative flex items-center justify-center">
          <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-brand-500 opacity-60" />
          <div className="relative w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-lg shadow-brand-600/50 border-2 border-white">
            <Building2 className="w-4 h-4" />
          </div>
        </div>
        <span className="mt-1.5 px-2 py-0.5 rounded-full bg-navy-950/90 border border-brand-500/40 text-[10px] font-bold text-white tracking-wider uppercase shadow-md">
          Request Point
        </span>
      </div>
    </div>
  );
}
