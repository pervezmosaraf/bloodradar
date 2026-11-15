import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { UserPlus, User, Mail, Lock, Phone } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-md w-full mx-auto px-4 py-12 flex flex-col justify-center">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2">
              <UserPlus className="w-5 h-5" />
            </div>
            <CardTitle>Create an Account</CardTitle>
            <CardDescription>
              Register to post and track emergency blood requests.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <Input
              label="Full Name"
              placeholder="e.g. Mahbub Alam"
              leftIcon={<User className="w-4 h-4" />}
            />
            <Input
              label="Phone Number"
              placeholder="01712345678"
              helperText="11-digit Bangladeshi number"
              leftIcon={<Phone className="w-4 h-4" />}
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="mahbub@example.com"
              leftIcon={<Mail className="w-4 h-4" />}
            />
            <Input
              label="Password"
              type="password"
              placeholder="At least 6 characters"
              leftIcon={<Lock className="w-4 h-4" />}
            />
            <Button variant="secondary" fullWidth size="md">
              Create Requester Account
            </Button>

            <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500 space-y-2">
              <p>
                Looking to register as a donor?{" "}
                <Link href="/register-donor" className="font-semibold text-brand-600 hover:underline">
                  Donor Registration with Location
                </Link>
              </p>
              <p>
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-slate-700 hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
