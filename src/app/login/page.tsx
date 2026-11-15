import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LogIn, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-md w-full mx-auto px-4 py-16 flex flex-col justify-center">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-2">
              <LogIn className="w-5 h-5" />
            </div>
            <CardTitle>Sign in to BloodRadar</CardTitle>
            <CardDescription>
              Enter your credentials to access your donor or requester portal.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              leftIcon={<Mail className="w-4 h-4" />}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
            />
            <Button variant="primary" fullWidth size="md">
              Sign In
            </Button>

            <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500 space-y-2">
              <p>
                Don&apos;t have an account?{" "}
                <Link href="/register" className="font-semibold text-brand-600 hover:underline">
                  Create Account
                </Link>
              </p>
              <p>
                Want to save lives?{" "}
                <Link href="/register-donor" className="font-semibold text-emerald-600 hover:underline">
                  Register as Blood Donor
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
