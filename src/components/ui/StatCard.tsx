import React, { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  accentColor?: "brand" | "navy" | "emerald" | "amber";
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  accentColor = "brand",
  className,
}: StatCardProps) {
  const accentClasses = {
    brand: "bg-brand-50 text-brand-600 border-brand-100",
    navy: "bg-navy-50 text-navy-800 border-navy-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
  };

  return (
    <div
      className={cn(
        "relative bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm overflow-hidden flex flex-col justify-between hover:border-slate-300 transition-all",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <p className="text-2xl lg:text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
            {value}
          </p>
        </div>
        {icon && (
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center border shrink-0",
              accentClasses[accentColor]
            )}
          >
            {icon}
          </div>
        )}
      </div>

      {(description || trend) && (
        <div className="mt-4 flex items-center gap-2 text-xs">
          {trend && (
            <span
              className={cn(
                "inline-flex items-center font-semibold",
                trend.isPositive ? "text-emerald-600" : "text-red-600"
              )}
            >
              {trend.isPositive ? (
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
              )}
              {trend.value}%
            </span>
          )}
          {description && <span className="text-slate-500">{description}</span>}
        </div>
      )}
    </div>
  );
}
