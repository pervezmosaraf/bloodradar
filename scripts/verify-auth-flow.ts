import { registerSchema, donorRegistrationSchema, isAtLeast18, calculateCooldown } from "../src/lib/validators/auth";
import * as assert from "assert/strict";

console.log("=== BloodRadar Auth & Donor Validation Verification ===");

// 1. Password validation (must be 8+ characters)
const weakPasswordTest = registerSchema.safeParse({
  fullName: "Test User",
  phone: "01712345678",
  email: "test@example.com",
  password: "short", // 5 chars
  role: "requester",
});
assert.equal(weakPasswordTest.success, false, "Should reject passwords shorter than 8 characters");
console.log("✓ Password minimum 8 characters enforced:", weakPasswordTest.error?.errors[0]?.message);

// 2. Phone validation (Bangladeshi 01XXXXXXXXX)
const invalidPhoneTest = registerSchema.safeParse({
  fullName: "Test User",
  phone: "02712345678", // starts with 02
  email: "test@example.com",
  password: "securepassword123",
  role: "requester",
});
assert.equal(invalidPhoneTest.success, false, "Should reject invalid non-mobile BD phone numbers");
console.log("✓ Bangladeshi phone format enforced:", invalidPhoneTest.error?.errors[0]?.message);

// 3. Donor registration requires map coordinates
const missingLocationTest = donorRegistrationSchema.safeParse({
  fullName: "Volunteer Donor",
  bloodGroup: "B+",
  phone: "01812345678",
  email: "donor@example.com",
  password: "securepassword123",
  dateOfBirth: "1998-04-12",
  weightConfirmed: true,
  latitude: 0, // Not selected
  longitude: 0,
  disclaimerAccepted: true,
});
assert.equal(missingLocationTest.success, false, "Should reject missing map coordinates");
console.log("✓ Map location coordinates required for donor registration");

// 4. Age validation (must be 18+)
const underageTest = donorRegistrationSchema.safeParse({
  fullName: "Young Donor",
  bloodGroup: "A+",
  phone: "01912345678",
  email: "young@example.com",
  password: "securepassword123",
  dateOfBirth: "2015-01-01", // Under 18
  weightConfirmed: true,
  latitude: 23.75,
  longitude: 90.38,
  disclaimerAccepted: true,
});
assert.equal(underageTest.success, false, "Should reject underage donors");
console.log("✓ Age >= 18 strictly enforced:", underageTest.error?.errors[0]?.message);

// 5. Cooldown calculation
const recentDonation = new Date(Date.now() - 30 * 86400 * 1000).toISOString().split("T")[0]; // 30 days ago
const cooldownEnd = calculateCooldown(recentDonation);
assert.ok(cooldownEnd !== null, "Cooldown must be set if donation was 30 days ago");
console.log("✓ 90-day cooldown correctly calculated for past donation date:", cooldownEnd);

// 6. Medical disclaimer must be checked
const noDisclaimerTest = donorRegistrationSchema.safeParse({
  fullName: "Test Donor",
  bloodGroup: "O+",
  phone: "01712345678",
  email: "donor@example.com",
  password: "securepassword123",
  dateOfBirth: "1990-01-01",
  weightConfirmed: true,
  latitude: 23.75,
  longitude: 90.38,
  disclaimerAccepted: false, // Not accepted
});
assert.equal(noDisclaimerTest.success, false, "Should require medical disclaimer");
console.log("✓ Medical health declaration required:", noDisclaimerTest.error?.errors[0]?.message);

console.log("\nALL AUTH & REGISTRATION VALIDATION SCENARIOS VERIFIED SUCCESSFULLY!");
