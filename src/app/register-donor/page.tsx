import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Heart, User, Mail, Lock, Phone, MapPin, Shield } from "lucide-react";
import { BLOOD_GROUPS } from "@/lib/constants/bloodGroups";
import { DHAKA_AREAS } from "@/lib/constants/dhakaAreas";

export default function RegisterDonorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-xl w-full mx-auto px-4 py-12 flex flex-col justify-center">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-2">
              <Heart className="w-5 h-5 fill-brand-600 text-brand-600" />
            </div>
            <CardTitle>Register as a Blood Donor</CardTitle>
            <CardDescription>
              Join the emergency proximity network and respond to critical local requests.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <Input
              label="Full Name"
              placeholder="e.g. Shakil Hossain"
              leftIcon={<User className="w-4 h-4" />}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select label="Your Blood Group">
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </Select>
              <Input
                label="Phone Number"
                placeholder="017XXXXXXXX"
                helperText="Revealed only after acceptance"
                leftIcon={<Phone className="w-4 h-4" />}
              />
            </div>

            <Select label="Primary Dhaka Zone">
              {DHAKA_AREAS.map((area) => (
                <option key={area.name} value={area.name}>
                  {area.name} ({area.zone})
                </option>
              ))}
            </Select>

            <Input
              label="Detailed Address / Area"
              placeholder="e.g. House 14, Road 7, Dhanmondi, Dhaka"
              leftIcon={<MapPin className="w-4 h-4" />}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="shakil@example.com"
                leftIcon={<Mail className="w-4 h-4" />}
              />
              <Input
                label="Password"
                type="password"
                placeholder="At least 6 characters"
                leftIcon={<Lock className="w-4 h-4" />}
              />
            </div>

            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
              <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Privacy Guaranteed:</strong> Your exact GPS coordinates are stored privately in PostGIS for proximity matching. Only approximate distance is shown to requesters.
              </span>
            </div>

            <Button variant="primary" fullWidth size="lg" className="font-bold">
              Complete Donor Registration
            </Button>

            <p className="text-center text-xs text-slate-500 pt-2">
              Already registered?{" "}
              <Link href="/login" className="font-semibold text-brand-600 hover:underline">
                Sign In
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
