import React from "react";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ShieldAlert, AlertTriangle, Radio } from "lucide-react";
import { BLOOD_GROUPS } from "@/lib/constants/bloodGroups";
import { DHAKA_HOSPITALS } from "@/lib/constants/dhakaAreas";

export default function EmergencyRequestPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="space-y-2 text-center">
          <Badge variant="danger" dot pulse>
            High Urgency Protocol
          </Badge>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Broadcast Emergency Blood Request
          </h1>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            Dispatches automated cascading geolocation notifications to matching, available donors within 3km, expanding to 5km and 10km.
          </p>
        </div>

        <Card className="border-red-200/80 shadow-md">
          <CardHeader className="bg-red-50/50 border-b border-red-100">
            <div className="flex items-center gap-2 text-brand-700">
              <ShieldAlert className="w-5 h-5" />
              <CardTitle className="text-base text-brand-900">Patient & Clinical Details</CardTitle>
            </div>
            <CardDescription>
              All inputs are validated server-side. Medical compatibility must be verified at the clinical site.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Patient Full Name" placeholder="e.g. Farhana Yasmin" />
              <Input label="Emergency Contact Number" placeholder="017XXXXXXXX" helperText="11-digit Bangladeshi number" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select label="Blood Group Required">
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </Select>
              <Input label="Units Required" type="number" min={1} max={10} defaultValue={1} />
            </div>

            <Select label="Hospital / Clinical Center">
              {DHAKA_HOSPITALS.map((hospital) => (
                <option key={hospital.name} value={hospital.name}>
                  {hospital.name} ({hospital.address})
                </option>
              ))}
            </Select>

            <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>PostGIS Cascading Notice:</strong> When broadcast, the algorithm will first notify eligible donors within 3 km. If unfilled, it expands automatically to 5 km and 10 km via scheduled sweeps.
              </span>
            </div>

            <Button variant="danger" size="lg" fullWidth className="gap-2 font-bold shadow-md shadow-brand-600/20">
              <Radio className="w-4 h-4" />
              Broadcast Emergency Request Now
            </Button>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
