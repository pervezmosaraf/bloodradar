import { z } from "zod";
import { BLOOD_GROUPS } from "../constants/bloodGroups";
import { phoneSchema } from "./auth";

export const bloodRequestSchema = z.object({
  patientName: z.string().trim().min(2, "Patient name must be at least 2 characters").max(100),
  contactNumber: phoneSchema,
  bloodGroup: z.enum(BLOOD_GROUPS),
  unitsNeeded: z.number().int().min(1, "At least 1 unit is required").max(10, "Maximum 10 units per request"),
  hospitalName: z.string().trim().min(2, "Hospital name is required").max(150),
  addressText: z.string().trim().min(3, "Hospital area/address is required"),
  latitude: z.number().min(20).max(27, "Hospital location must be within Bangladesh"),
  longitude: z.number().min(88).max(93, "Hospital location must be within Bangladesh"),
  neededBy: z.string().refine((val) => !isNaN(Date.parse(val)), "Valid needed-by datetime required"),
  deadlineHours: z.number().min(0.25).max(72).default(4), // helper for form
  singleDonor: z.boolean().default(true),
  notes: z.string().trim().max(500).optional(),
  isDemoMode: z.boolean().default(false), // 30s per stage cascade for live presentation
});

export type BloodRequestInput = z.infer<typeof bloodRequestSchema>;
