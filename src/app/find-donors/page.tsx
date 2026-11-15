import React from "react";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Search, MapPin, Shield, Heart } from "lucide-react";
import { BLOOD_GROUPS } from "@/lib/constants/bloodGroups";
import { DHAKA_AREAS } from "@/lib/constants/dhakaAreas";

export default function FindDonorsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold">
            <Heart className="w-3.5 h-3.5 fill-brand-600 text-brand-600" />
            <span>Donor Search Directory</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Find Compatible Blood Donors
          </h1>
          <p className="text-slate-600 text-sm max-w-2xl">
            Search for eligible, active donors by blood group and proximity across Dhaka zones.
          </p>
        </div>

        {/* Filter Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <Select label="Required Blood Group">
                <option value="">All Blood Groups</option>
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </Select>

              <Select label="Dhaka Area / Zone">
                <option value="">All Zones</option>
                {DHAKA_AREAS.map((area) => (
                  <option key={area.name} value={area.name}>
                    {area.name} ({area.zone})
                  </option>
                ))}
              </Select>

              <Button variant="primary" className="gap-2">
                <Search className="w-4 h-4" />
                Search Available Donors
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Notice Banner */}
        <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 text-xs text-blue-800 flex items-start gap-3">
          <Shield className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Privacy Safeguard:</strong> Individual donor GPS coordinates and personal phone numbers are never publicly disclosed. The directory renders only approximate distance (e.g. <code>~2.3 km away</code>). Direct contact is revealed strictly upon bilateral acceptance of an emergency request.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
