export const BLOOD_GROUPS = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
] as const;

export type BloodGroup = (typeof BLOOD_GROUPS)[number];

// Standard red blood cell compatibility: Recipient -> Compatible Donors
export const BLOOD_COMPATIBILITY: Record<BloodGroup, BloodGroup[]> = {
  "A+": ["A+", "A-", "O+", "O-"],
  "A-": ["A-", "O-"],
  "B+": ["B+", "B-", "O+", "O-"],
  "B-": ["B-", "O-"],
  "AB+": ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], // Universal recipient
  "AB-": ["AB-", "A-", "B-", "O-"],
  "O+": ["O+", "O-"],
  "O-": ["O-"], // Universal donor
};

export function getCompatibleDonorGroups(recipientGroup: BloodGroup): BloodGroup[] {
  return BLOOD_COMPATIBILITY[recipientGroup] || [recipientGroup];
}

export function isBloodCompatible(recipientGroup: BloodGroup, donorGroup: BloodGroup): boolean {
  return BLOOD_COMPATIBILITY[recipientGroup]?.includes(donorGroup) ?? false;
}
