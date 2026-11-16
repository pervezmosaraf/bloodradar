"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { donorRegistrationSchema, calculateCooldown, isAtLeast18 } from "@/lib/validators/auth";
import { BLOOD_GROUPS, BloodGroup } from "@/lib/constants/bloodGroups";
import {
  Heart,
  User,
  Mail,
  Lock,
  Phone,
  Calendar,
  Weight,
  MapPin,
  Shield,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowRight,
  Info,
} from "lucide-react";

// Client-only dynamic Leaflet map import
const LocationPickerMap = dynamic(() => import("@/components/map/LocationPickerMap"), {
  ssr: false,
  loading: () => (
    <div className="h-64 sm:h-72 w-full rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center gap-2 text-xs text-slate-500 animate-pulse">
      <MapPin className="w-6 h-6 text-slate-400 animate-bounce" />
      <span>Loading interactive Dhaka map...</span>
    </div>
  ),
});

export default function BecomeADonorPage() {
  const router = useRouter();
  const supabase = createClient();

  const [formData, setFormData] = useState({
    fullName: "",
    bloodGroup: "O+" as BloodGroup,
    phone: "",
    email: "",
    password: "",
    dateOfBirth: "",
    weightConfirmed: false,
    lastDonationDate: "",
    latitude: 0,
    longitude: 0,
    addressText: "",
    isAvailable: true,
    disclaimerAccepted: false,
  });

  const [hasSelectedLocation, setHasSelectedLocation] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMissingSupabase = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    setFormError(null);
  };

  const handleLocationChange = (lat: number, lng: number) => {
    setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));
    setHasSelectedLocation(true);
    if (fieldErrors.latitude || fieldErrors.longitude) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next.latitude;
        delete next.longitude;
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

    if (isMissingSupabase) {
      setFormError("Supabase Database is not connected! .env.local is missing with your Supabase credentials. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.");
      return;
    }

    // 1. Check location selection first
    if (!hasSelectedLocation || formData.latitude === 0 || formData.longitude === 0) {
      setFieldErrors((prev) => ({
        ...prev,
        latitude: "Please select your location on the map by clicking or using GPS.",
      }));
      setFormError("A coverage location on the map is required so nearby emergencies can find you.");
      return;
    }

    // 2. Zod Validation
    const validation = donorRegistrationSchema.safeParse({
      ...formData,
      lastDonationDate: formData.lastDonationDate ? formData.lastDonationDate : null,
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
      setFormError("Please correct the errors in the registration form.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 3. Check if user is already signed in (logged-in donor profile completion flow)
      const { data: sessionData } = await supabase.auth.getSession();
      let userId = sessionData?.session?.user?.id;

      if (!userId) {
        // Sign up new user
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email.trim(),
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName.trim(),
              phone: formData.phone.trim(),
              role: "donor",
            },
          },
        });

        if (authError) {
          if (
            authError.message.toLowerCase().includes("already registered") ||
            authError.message.toLowerCase().includes("unique constraint") ||
            authError.status === 422
          ) {
            setFormError(
              "This email is already registered. If you already have a requester account, please sign in first to become a donor from your account."
            );
          } else if (authError.message.toLowerCase().includes("fetch failed") || authError.message.toLowerCase().includes("failed to fetch")) {
            setFormError("Connection Error: Cannot reach Supabase database. Please verify your internet connection and .env.local configuration.");
          } else {
            setFormError(authError.message || "Sign up failed. Please check your credentials.");
          }
          setIsSubmitting(false);
          return;
        }

        userId = authData.user?.id;
      }

      if (!userId) {
        // Confirmation required before session is returned
        setSuccessMessage(
          "Registration initiated! Please check your email to verify your account, then sign in to complete your donor profile."
        );
        setIsSubmitting(false);
        return;
      }

      // 4. Calculate Cooldown
      const cooldownEndsAt = calculateCooldown(formData.lastDonationDate);
      const isAvailableFinal = cooldownEndsAt ? false : formData.isAvailable;

      // 5. Upsert profile with role = donor
      await supabase.from("profiles").upsert({
        id: userId,
        email: formData.email.trim(),
        full_name: formData.fullName.trim(),
        phone: formData.phone.trim(),
        role: "donor",
      });

      // 6. Save donor row with PostGIS Point (Longitude first, Latitude second!)
      // Format: POINT(longitude latitude)
      const postgisPoint = `POINT(${formData.longitude} ${formData.latitude})`;

      const { error: donorError } = await supabase.from("donors").upsert({
        profile_id: userId,
        blood_group: formData.bloodGroup,
        location: postgisPoint,
        address_text: formData.addressText?.trim() || null,
        is_available: isAvailableFinal,
        last_donation_date: formData.lastDonationDate || null,
        cooldown_ends_at: cooldownEndsAt,
      });

      if (donorError) {
        console.error("Donor profile insert error:", donorError);
        // Inform user without leaving broken state
        setFormError(
          `Account registered, but saving donor details encountered an issue: ${donorError.message}. Please sign in to your dashboard to finalize your location.`
        );
        setIsSubmitting(false);
        return;
      }

      // Success! Redirect to donor dashboard
      router.push("/dashboard/donor");
    } catch (err: any) {
      setFormError(err?.message || "An unexpected error occurred. Please verify your connection.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-10">
        <Card className="shadow-lg border-slate-200">
          <CardHeader className="text-center">
            <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-2 shadow-inner">
              <Heart className="w-6 h-6 fill-brand-600 text-brand-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900">Register as a Blood Donor</CardTitle>
            <CardDescription className="max-w-md mx-auto text-xs sm:text-sm">
              Set your coverage area on the map to receive emergency alerts when someone near you needs blood.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-2">
            {successMessage ? (
              <div className="space-y-4 py-4">
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold text-emerald-800">Registration Received!</p>
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
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {/* Supabase Missing Configuration Notice */}
                {isMissingSupabase && (
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-amber-900">Database Connection Required</p>
                      <p className="text-amber-800 mt-0.5">
                        Supabase credentials not detected in <code>.env.local</code>. Please configure your project URL and Anon Key to activate live donor registration.
                      </p>
                    </div>
                  </div>
                )}

                {/* Form Error Banner */}
                {formError && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2.5 animate-shake">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div className="flex-1 font-medium">{formError}</div>
                  </div>
                )}

                {/* Section 1: Personal & Blood Group */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-xs border-b pb-1 text-slate-400">
                    1. Donor Identity
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      placeholder="e.g. Shakil Hossain"
                      value={formData.fullName}
                      onChange={(e) => handleChange("fullName", e.target.value)}
                      error={fieldErrors.fullName}
                      required
                      leftIcon={<User className="w-4 h-4 text-slate-400" />}
                    />

                    <Select
                      label="Blood Group"
                      value={formData.bloodGroup}
                      onChange={(e) => handleChange("bloodGroup", e.target.value)}
                      error={fieldErrors.bloodGroup}
                      required
                    >
                      {BLOOD_GROUPS.map((bg) => (
                        <option key={bg} value={bg}>
                          {bg}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Phone Number"
                      placeholder="01712345678"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      error={fieldErrors.phone}
                      helperText="11-digit Bangladeshi mobile number"
                      required
                      leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
                    />

                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="shakil@example.com"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      error={fieldErrors.email}
                      required
                      leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                    />
                  </div>

                  <Input
                    label="Password"
                    type="password"
                    placeholder="Minimum 8 characters"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    error={fieldErrors.password}
                    helperText="At least 8 characters"
                    required
                    leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                  />
                </div>

                {/* Section 2: Medical & Eligibility */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-xs border-b pb-1 text-slate-400">
                    2. Medical Eligibility & Cooldown Check
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Date of Birth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                      error={fieldErrors.dateOfBirth}
                      helperText="Must be 18 years or older"
                      required
                      leftIcon={<Calendar className="w-4 h-4 text-slate-400" />}
                    />

                    <Input
                      label="Last Donation Date (Optional)"
                      type="date"
                      value={formData.lastDonationDate}
                      onChange={(e) => handleChange("lastDonationDate", e.target.value)}
                      error={fieldErrors.lastDonationDate}
                      helperText="Leave blank if never donated before"
                      leftIcon={<Heart className="w-4 h-4 text-slate-400" />}
                    />
                  </div>

                  <div className="space-y-3 pt-1">
                    {/* Weight Checkbox */}
                    <label className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs cursor-pointer transition-colors ${fieldErrors.weightConfirmed ? "border-red-300 bg-red-50/50" : "border-slate-200 bg-slate-50/70 hover:bg-slate-50"}`}>
                      <input
                        type="checkbox"
                        checked={formData.weightConfirmed}
                        onChange={(e) => handleChange("weightConfirmed", e.target.checked)}
                        className="mt-0.5 rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
                      />
                      <span className="text-slate-700 leading-relaxed">
                        <strong>Weight Confirmation:</strong> I confirm that I weigh at least 50 kg (110 lbs), meeting safe donation criteria.
                      </span>
                    </label>
                    {fieldErrors.weightConfirmed && (
                      <p className="text-xs text-red-600 font-medium pl-1">{fieldErrors.weightConfirmed}</p>
                    )}

                    {/* Medical Disclaimer Checkbox */}
                    <label className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs cursor-pointer transition-colors ${fieldErrors.disclaimerAccepted ? "border-red-300 bg-red-50/50" : "border-slate-200 bg-slate-50/70 hover:bg-slate-50"}`}>
                      <input
                        type="checkbox"
                        checked={formData.disclaimerAccepted}
                        onChange={(e) => handleChange("disclaimerAccepted", e.target.checked)}
                        className="mt-0.5 rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
                      />
                      <span className="text-slate-700 leading-relaxed">
                        <strong>Medical Health Declaration:</strong> I declare that I am feeling in good health, do not carry transmissible blood infections, and acknowledge that final donation eligibility is subject to on-site hospital screening.
                      </span>
                    </label>
                    {fieldErrors.disclaimerAccepted && (
                      <p className="text-xs text-red-600 font-medium pl-1">{fieldErrors.disclaimerAccepted}</p>
                    )}
                  </div>
                </div>

                {/* Section 3: Interactive Map Location Picker */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-xs border-b pb-1 text-slate-400">
                    3. Proximity Location (Required)
                  </h3>

                  <LocationPickerMap
                    initialLat={formData.latitude || 23.8103}
                    initialLng={formData.longitude || 90.4125}
                    onChange={handleLocationChange}
                    error={fieldErrors.latitude || fieldErrors.longitude}
                  />

                  <Input
                    label="Area / Landmark Note (Optional)"
                    placeholder="e.g. Near Dhanmondi 27 or Uttara Sector 4"
                    value={formData.addressText}
                    onChange={(e) => handleChange("addressText", e.target.value)}
                    helperText="A general neighborhood note (not your exact home address)"
                    leftIcon={<MapPin className="w-4 h-4 text-slate-400" />}
                  />
                </div>

                {/* Privacy Safeguard Notice */}
                <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200 text-xs text-blue-800 flex items-start gap-2.5">
                  <Shield className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">
                    <strong>Zero Coordinate Disclosure:</strong> Your exact GPS location and phone number are never exposed in public search results. Proximity search displays only approximate distance rounded to 0.5 km.
                  </span>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  size="lg"
                  disabled={isSubmitting}
                  className="font-bold text-sm shadow-md"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Registering Donor Profile...
                    </span>
                  ) : (
                    "Complete Donor Registration"
                  )}
                </Button>

                <p className="text-center text-xs text-slate-500 pt-1">
                  Already registered?{" "}
                  <Link href="/login" className="font-semibold text-brand-600 hover:underline">
                    Sign In
                  </Link>
                </p>
              </form>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
