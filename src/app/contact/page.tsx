"use client";

import React, { useTransition, useState } from "react";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { submitContactMessage, ContactActionResult } from "./actions";

export default function ContactPage() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<ContactActionResult | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formElement = e.currentTarget;

    startTransition(async () => {
      const res = await submitContactMessage(null, formData);
      setResult(res);
      if (res.success) {
        formElement.reset();
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="text-center space-y-2">
          <Badge variant="outline">Support & Inquiries</Badge>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Contact BloodRadar</h1>
          <p className="text-slate-600 text-sm max-w-lg mx-auto">
            Need assistance, have technical feedback, or want to report a clinical issue? Reach out to our emergency network operations team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-5 flex flex-col items-center text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Emergency Hotline</h3>
            <p className="text-xs text-slate-500">24/7 National Emergency</p>
            <p className="text-sm font-semibold text-brand-600 font-mono">999 (Bangladesh)</p>
          </Card>

          <Card className="p-5 flex flex-col items-center text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Project Lead</h3>
            <p className="text-xs text-slate-500">Academic / CSE 3292</p>
            <p className="text-sm font-semibold text-slate-700">support@bloodradar.internal</p>
          </Card>

          <Card className="p-5 flex flex-col items-center text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Operations Hub</h3>
            <p className="text-xs text-slate-500">Dhaka Medical Grid</p>
            <p className="text-sm font-semibold text-slate-700">Dhaka, Bangladesh</p>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Send an Inquiry</CardTitle>
            <CardDescription>
              Messages are saved directly to the database <code className="text-xs bg-slate-100 px-1 py-0.5 rounded text-brand-600">contact_messages</code> table.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result?.success && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Message Sent Successfully</p>
                  <p className="text-xs text-emerald-700 mt-0.5">{result.message}</p>
                </div>
              </div>
            )}

            {result && !result.success && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Transmission Error</p>
                  <p className="text-xs text-red-700 mt-0.5">{result.message}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Your Name *"
                  name="name"
                  required
                  placeholder="e.g. Dr. Sadia Rahman"
                  error={result?.errors?.name?.[0]}
                />
                <Input
                  label="Phone Number"
                  name="phone"
                  placeholder="01712345678"
                  helperText="11-digit Bangladeshi number (Optional)"
                  error={result?.errors?.phone?.[0]}
                />
              </div>

              <Input
                label="Email Address *"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                error={result?.errors?.email?.[0]}
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Message / Feedback *
                </label>
                <textarea
                  name="message"
                  rows={4}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600"
                  placeholder="Describe your inquiry, bug report, or feedback..."
                />
                {result?.errors?.message?.[0] && (
                  <p className="text-xs font-medium text-red-600 mt-1">{result.errors.message[0]}</p>
                )}
              </div>

              <Button type="submit" variant="primary" isLoading={isPending} className="gap-2">
                <Send className="w-4 h-4" />
                Submit Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
