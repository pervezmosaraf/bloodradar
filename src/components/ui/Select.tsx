"use client";

import React, { SelectHTMLAttributes, forwardRef, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { ChevronDown } from "lucide-react";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, helperText, error, leftIcon, children, id, ...props }, ref) => {
    const generatedId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={generatedId} className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400">
              {leftIcon}
            </div>
          )}
          <select
            id={generatedId}
            ref={ref}
            className={cn(
              "w-full appearance-none rounded-lg border bg-white px-3.5 py-2.5 pr-10 text-sm text-slate-900 transition-colors cursor-pointer",
              "focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600",
              "disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed",
              error
                ? "border-red-500 focus:border-red-600 focus:ring-red-500/20"
                : "border-slate-300 hover:border-slate-400",
              leftIcon && "pl-10",
              className
            )}
            {...props}
          >
            {children}
          </select>
          <div className="absolute right-3.5 flex items-center pointer-events-none text-slate-400">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error ? (
          <p className="text-xs font-medium text-red-600 mt-1">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-slate-500 mt-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = "Select";
