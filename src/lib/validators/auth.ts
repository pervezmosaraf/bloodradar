import { z } from "zod";
import { BLOOD_GROUPS, BloodGroup } from "../constants/bloodGroups";

export const phoneSchema = z
  .string()
  .trim()
  .regex(
    /^01[3-9]\d{8}$/,
    "Phone number must be a valid 11-digit Bangladeshi number starting with 01 (e.g., 01712345678)"
  );

export const loginSchema = z.object({
  email: z.string().trim().email("Please provide a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters").max(100),
  phone: phoneSchema,
  email: z.string().trim().email("Please provide a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["donor", "requester"]).default("requester"),
});

/**
 * Calculates whether a person is at least 18 years old.
 */
export function isAtLeast18(dateOfBirthString: string): boolean {
  if (!dateOfBirthString) return false;
  const dob = new Date(dateOfBirthString);
  if (isNaN(dob.getTime())) return false;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age >= 18;
}

/**
 * Calculates 90-day cooldown end date if last donation was within 90 days.
 */
export function calculateCooldown(lastDonationDateStr?: string | null): string | null {
  if (!lastDonationDateStr) return null;
  const lastDate = new Date(lastDonationDateStr);
  if (isNaN(lastDate.getTime())) return null;

  const cooldownEnd = new Date(lastDate.getTime() + 90 * 24 * 60 * 60 * 1000);
  const now = new Date();
  if (cooldownEnd > now) {
    return cooldownEnd.toISOString();
  }
  return null;
}

export const donorRegistrationSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters").max(100),
  bloodGroup: z.enum(BLOOD_GROUPS, {
    errorMap: () => ({ message: "Please select a valid blood group" }),
  }),
  phone: phoneSchema,
  email: z.string().trim().email("Please provide a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine((dob) => isAtLeast18(dob), {
      message: "You must be at least 18 years old to register as a blood donor",
    }),
  weightConfirmed: z.boolean().refine((val) => val === true, {
    message: "You must confirm you weigh at least 50 kg for safe donation",
  }),
  lastDonationDate: z.string().optional().nullable(),
  latitude: z
    .number({ invalid_type_error: "Please select your location on the map" })
    .min(20, "Location must be within Bangladesh")
    .max(27, "Location must be within Bangladesh"),
  longitude: z
    .number({ invalid_type_error: "Please select your location on the map" })
    .min(88, "Location must be within Bangladesh")
    .max(93, "Location must be within Bangladesh"),
  addressText: z.string().trim().optional(),
  isAvailable: z.boolean().default(true),
  disclaimerAccepted: z.boolean().refine((val) => val === true, {
    message: "You must agree to the medical eligibility declaration",
  }),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type DonorRegistrationInput = z.infer<typeof donorRegistrationSchema>;
