import { z } from "zod";
import { BLOOD_GROUPS } from "../constants/bloodGroups";

export const phoneSchema = z
  .string()
  .trim()
  .regex(/^01[3-9]\d{8}$/, "Phone number must be a valid 11-digit Bangladeshi number starting with 01 (e.g., 01712345678)");

export const loginSchema = z.object({
  email: z.string().trim().email("Please provide a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters").max(100),
  email: z.string().trim().email("Please provide a valid email address"),
  phone: phoneSchema,
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["donor", "requester"]),
});

export const donorRegistrationSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters").max(100),
  email: z.string().trim().email("Please provide a valid email address"),
  phone: phoneSchema,
  password: z.string().min(6, "Password must be at least 6 characters"),
  bloodGroup: z.enum(BLOOD_GROUPS),
  latitude: z.number().min(20).max(27, "Location must be within Bangladesh"),
  longitude: z.number().min(88).max(93, "Location must be within Bangladesh"),
  addressText: z.string().trim().min(3, "Please provide your general area / address"),
  isAvailable: z.boolean().default(true),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type DonorRegistrationInput = z.infer<typeof donorRegistrationSchema>;
