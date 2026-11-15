"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Search, Heart, Sparkles } from "lucide-react";
import { BLOOD_GROUPS, BloodGroup } from "@/lib/constants/bloodGroups";

export function BloodGroupSearch() {
  const router = useRouter();
  const [selectedGroup, setSelectedGroup] = useState<string>("O+");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedGroup) {
      router.push(`/find-donors?group=${encodeURIComponent(selectedGroup)}`);
    } else {
      router.push("/find-donors");
    }
  };

  const quickGroups: { group: BloodGroup; note: string }[] = [
    { group: "O-", note: "Universal Donor" },
    { group: "O+", note: "Highest Demand" },
    { group: "B+", note: "Common" },
    { group: "A+", note: "Common" },
    { group: "AB-", note: "Rare" },
  ];

  return (
    <Card className="border-slate-200/90 shadow-sm overflow-hidden bg-white">
      <CardContent className="p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Header */}
          <div className="space-y-1.5 max-w-md">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-600">
              <Heart className="w-3.5 h-3.5 fill-brand-600 text-brand-600" />
              <span>Immediate Compatibility Match</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Find Donors by Blood Group
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Select the patient&apos;s blood type to search for active, verified donors currently available near you.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md w-full flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
            <div className="flex-1">
              <Select
                label="Required Blood Group"
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
              >
                {BLOOD_GROUPS.map((group) => (
                  <option key={group} value={group}>
                    {group} Blood Group
                  </option>
                ))}
              </Select>
            </div>
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="gap-2 font-bold whitespace-nowrap h-10"
            >
              <Search className="w-4 h-4" />
              Search Donors
            </Button>
          </form>
        </div>

        {/* Quick Click Badges */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Quick Select:
          </span>
          {quickGroups.map((item) => (
            <button
              key={item.group}
              type="button"
              onClick={() => setSelectedGroup(item.group)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all border ${
                selectedGroup === item.group
                  ? "bg-brand-600 text-white border-brand-600 shadow-sm"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:border-brand-300 hover:bg-brand-50/50"
              }`}
            >
              <span className="font-bold">{item.group}</span>
              <span className={`text-[10px] ${selectedGroup === item.group ? "text-brand-100" : "text-slate-400"}`}>
                ({item.note})
              </span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
