"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { LogIn, Lock, Mail, AlertCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMissingSupabase = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isMissingSupabase) {
      setError("Supabase Database is not connected! .env.local is missing with your Supabase credentials. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.");
      return;
    }

    if (!email.trim() || !password) {
      setError("Please provide both email address and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        if (
          authError.message.toLowerCase().includes("invalid login credentials") ||
          authError.message.toLowerCase().includes("invalid grant")
        ) {
          setError("Invalid email or password. Please verify your credentials and try again.");
        } else if (authError.message.toLowerCase().includes("email not confirmed")) {
          setError(
            "Your email address has not been confirmed yet. Please check your inbox for the activation link."
          );
        } else if (authError.message.toLowerCase().includes("fetch failed") || authError.message.toLowerCase().includes("failed to fetch")) {
          setError("Connection Error: Cannot reach Supabase database. Please check your .env.local configuration.");
        } else {
          setError(authError.message || "Sign in failed. Please try again.");
        }
        setIsSubmitting(false);
        return;
      }

      const user = data.user;
      if (!user) {
        setError("Unable to authenticate user session.");
        setIsSubmitting(false);
        return;
      }

      // Query user role from profiles table
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      const userRole = profile?.role || user.user_metadata?.role || "requester";

      // Role-based redirect
      if (userRole === "donor") {
        router.push("/dashboard/donor");
      } else if (userRole === "admin") {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard/requester");
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred during sign in.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-md w-full mx-auto px-4 py-16 flex flex-col justify-center">
        <Card className="shadow-lg border-slate-200">
          <CardHeader className="text-center">
            <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-2 shadow-inner">
              <LogIn className="w-6 h-6" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900">Sign in to BloodRadar</CardTitle>
            <CardDescription>
              Access your donor or requester portal to manage emergency response actions.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {error && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2.5 animate-shake">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span className="flex-1 font-medium leading-relaxed">{error}</span>
                </div>
              )}

              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                required
                leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                required
                leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
              />

              <Button
                type="submit"
                variant="primary"
                fullWidth
                size="md"
                disabled={isSubmitting}
                className="font-bold text-sm shadow-md"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>

              <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500 space-y-2">
                <p>
                  Don&apos;t have an account?{" "}
                  <Link href="/register" className="font-semibold text-brand-600 hover:underline">
                    Create Requester Account
                  </Link>
                </p>
                <p>
                  Want to save lives?{" "}
                  <Link href="/become-a-donor" className="font-semibold text-emerald-600 hover:underline">
                    Register as Blood Donor
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
