"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Please provide a valid email address"),
  phone: z
    .string()
    .trim()
    .regex(/^01[3-9]\d{8}$/, "Phone number must be a valid 11-digit Bangladeshi number")
    .optional()
    .or(z.literal("")),
  message: z.string().trim().min(5, "Message must be at least 5 characters").max(1000),
});

export interface ContactActionResult {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

export async function submitContactMessage(
  prevState: ContactActionResult | null,
  formData: FormData
): Promise<ContactActionResult> {
  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    message: formData.get("message"),
  };

  const validation = contactSchema.safeParse(rawData);
  if (!validation.success) {
    const fieldErrors = validation.error.flatten().fieldErrors;
    return {
      success: false,
      message: "Please correct the form errors.",
      errors: fieldErrors,
    };
  }

  const { name, email, phone, message } = validation.data;

  // Check if Supabase keys are configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl || supabaseUrl.includes("placeholder")) {
    return {
      success: true,
      message:
        "Message received locally. (Database storage will activate as soon as Supabase credentials are configured in .env.local).",
    };
  }

  try {
    const supabase = createServerSupabaseClient();
    const { error } = await supabase.from("contact_messages").insert([
      {
        name,
        email,
        phone: phone || null,
        message,
      },
    ]);

    if (error) {
      console.error("Supabase contact_messages insert error:", error);
      return {
        success: false,
        message: "Failed to store message: " + error.message,
      };
    }

    return {
      success: true,
      message: "Thank you! Your message has been received and logged in the database.",
    };
  } catch (err) {
    console.error("Contact submission error:", err);
    return {
      success: false,
      message: "An unexpected error occurred while transmitting your message.",
    };
  }
}
