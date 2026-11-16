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
import { registerSchema } from "@/lib/validators/auth";
import { UserPlus, User, Mail, Lock, Phone, AlertCircle, CheckCircle2, Loader2, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field error on change
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);
    setFieldErrors({});

    // 1. Zod Validation
    const validation = registerSchema.safeParse({
      ...formData,
      role: "requester",
    });

    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        const field = err.path[0] as string;
        if (!errors[field]) {
          errors[field] = err.message;
        }
      });
      setFieldErrors(errors);
      setFormError("Please correct the highlighted errors before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 2. Supabase Sign Up
      const { data, error } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName.trim(),
            phone: formData.phone.trim(),
            role: "requester",
          },
        },
      });

      if (error) {
        // Human-readable error translation
        if (
          error.message.toLowerCase().includes("already registered") ||
          error.message.toLowerCase().includes("unique constraint") ||
          error.status === 422
        ) {
          setFormError("This email is already registered. Please sign in instead.");
        } else if (error.message.toLowerCase().includes("weak password") || error.message.toLowerCase().includes("least 8 characters")) {
          setFormError("Password is too weak. Please use at least 8 characters with numbers and letters.");
        } else {
          setFormError(error.message || "Failed to create account. Please check your connection and try again.");
        }
        setIsSubmitting(false);
        return;
      }

      // Check if session created immediately or email confirmation is required
      if (data.session) {
        // Logged in immediately! Ensure profile exists
        try {
          await supabase.from("profiles").upsert({
            id: data.user!.id,
            email: formData.email.trim(),
            full_name: formData.fullName.trim(),
            phone: formData.phone.trim(),
            role: "requester",
          });
        } catch {
          // Trigger will handle or fallback
        }
        router.push("/dashboard/requester");
      } else {
        // Confirmation required
        setSuccessMessage(
          "Account created! Please check your email to confirm your account, then sign in to access BloodRadar."
        );
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setFormError(
        err?.message || "An unexpected error occurred during registration. Please verify your internet connection."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-md w-full mx-auto px-4 py-12 flex flex-col justify-center">
        <Card className="shadow-lg border-slate-200">
          <CardHeader className="text-center">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <UserPlus className="w-6 h-6" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900">Create Requester Account</CardTitle>
            <CardDescription>
              Register to post emergency blood requests and track response status in real time.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            {successMessage ? (
              <div className="space-y-4 py-4">
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold text-emerald-800">Registration Successful!</p>
                    <p className="text-emerald-700 leading-relaxed">{successMessage}</p>
                  </div>
                </div>
                <Link href="/login">
                  <Button variant="primary" fullWidth className="gap-2">
                    Proceed to Sign In
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {/* Form-level Error Banner */}
                {formError && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2.5 animate-shake">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div className="flex-1 font-medium">{formError}</div>
                  </div>
                )}

                <Input
                  label="Full Name"
                  placeholder="e.g. Mahbub Alam"
                  value={formData.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  error={fieldErrors.fullName}
                  required
                  leftIcon={<User className="w-4 h-4 text-slate-400" />}
                />

                <Input
                  label="Phone Number"
                  placeholder="01712345678"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  error={fieldErrors.phone}
                  helperText="11-digit Bangladeshi mobile number starting with 01"
                  required
                  leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
                />

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="mahbub@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  error={fieldErrors.email}
                  required
                  leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                />

                <Input
                  label="Password"
                  type="password"
                  placeholder="Minimum 8 characters"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  error={fieldErrors.password}
                  helperText="Must be at least 8 characters"
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
                      Creating Account...
                    </span>
                  ) : (
                    "Create Requester Account"
                  )}
                </Button>

                <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500 space-y-2">
                  <p>
                    Want to register as a donor?{" "}
                    <Link href="/become-a-donor" className="font-semibold text-brand-600 hover:underline">
                      Donor Registration with Map
                    </Link>
                  </p>
                  <p>
                    Already have an account?{" "}
                    <Link href="/login" className="font-semibold text-slate-700 hover:underline">
                      Sign In
                    </Link>
                  </p>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
