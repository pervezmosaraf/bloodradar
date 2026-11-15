import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  BLOOD_GROUPS,
  BLOOD_COMPATIBILITY,
  isBloodCompatible,
  getCompatibleDonorGroups,
  BloodGroup,
} from "../src/lib/constants/bloodGroups";
import {
  phoneSchema,
  loginSchema,
  registerSchema,
  donorRegistrationSchema,
} from "../src/lib/validators/auth";
import { bloodRequestSchema } from "../src/lib/validators/request";
import { DHAKA_AREAS, DHAKA_HOSPITALS } from "../src/lib/constants/dhakaAreas";
import { APP_CONFIG } from "../src/lib/constants/config";

describe("Phase 1 Verification Suite", () => {
  describe("1. Blood Compatibility & Matrix Tests", () => {
    it("should verify universal donor O- can donate to all blood groups", () => {
      const recipientGroups = BLOOD_GROUPS;
      for (const recipient of recipientGroups) {
        assert.equal(
          isBloodCompatible(recipient, "O-"),
          true,
          `O- should be compatible with recipient ${recipient}`
        );
      }
    });

    it("should verify universal recipient AB+ can receive from all blood groups", () => {
      const compatibleWithABPos = getCompatibleDonorGroups("AB+");
      assert.equal(compatibleWithABPos.length, 8);
      for (const donor of BLOOD_GROUPS) {
        assert.equal(
          isBloodCompatible("AB+", donor),
          true,
          `AB+ recipient should receive from donor ${donor}`
        );
      }
    });

    it("should verify O- can only receive from O-", () => {
      const compatibleWithONeg = getCompatibleDonorGroups("O-");
      assert.deepEqual(compatibleWithONeg, ["O-"]);
      assert.equal(isBloodCompatible("O-", "O-"), true);
      assert.equal(isBloodCompatible("O-", "O+"), false);
      assert.equal(isBloodCompatible("O-", "A-"), false);
    });

    it("should verify B+ recipient compatibility", () => {
      const compatible = getCompatibleDonorGroups("B+");
      assert.deepEqual(compatible.sort(), ["B+", "B-", "O+", "O-"].sort());
      assert.equal(isBloodCompatible("B+", "B+"), true);
      assert.equal(isBloodCompatible("B+", "O-"), true);
      assert.equal(isBloodCompatible("B+", "A+"), false);
    });
  });

  describe("2. Bangladesh Phone Number & Zod Validation Tests", () => {
    it("should accept valid 11-digit Bangladeshi phone numbers starting with 01", () => {
      const validNumbers = [
        "01712345678",
        "01812345678",
        "01912345678",
        "01512345678",
        "01612345678",
        "01312345678",
        "01412345678",
      ];
      for (const phone of validNumbers) {
        const result = phoneSchema.safeParse(phone);
        assert.equal(result.success, true, `Phone ${phone} should be valid`);
      }
    });

    it("should reject invalid phone numbers", () => {
      const invalidNumbers = [
        "02712345678", // starts with 02
        "0171234567", // 10 digits
        "017123456789", // 12 digits
        "01212345678", // operator 2 does not exist in BD (only 3-9)
        "+8801712345678", // has country code prefix instead of 01XXXXXXXXX
        "0171234567a", // contains non-digits
        "",
      ];
      for (const phone of invalidNumbers) {
        const result = phoneSchema.safeParse(phone);
        assert.equal(result.success, false, `Phone ${phone} should be rejected`);
      }
    });

    it("should validate donor registration schema with valid Bangladesh coordinates", () => {
      const validDonor = {
        fullName: "Dr. Tanvir Ahmed",
        email: "tanvir.donor@example.com",
        phone: "01711223344",
        password: "securepassword123",
        bloodGroup: "O+",
        latitude: 23.7465, // Dhanmondi
        longitude: 90.376,
        addressText: "Dhanmondi 27, Dhaka",
        isAvailable: true,
      };
      const result = donorRegistrationSchema.safeParse(validDonor);
      assert.equal(result.success, true);
    });

    it("should reject donor registration with out-of-bounds coordinates", () => {
      const invalidDonor = {
        fullName: "Out of Bounds User",
        email: "oob@example.com",
        phone: "01711223344",
        password: "securepassword123",
        bloodGroup: "O+",
        latitude: 40.7128, // New York latitude
        longitude: -74.006,
        addressText: "New York, USA",
        isAvailable: true,
      };
      const result = donorRegistrationSchema.safeParse(invalidDonor);
      assert.equal(result.success, false);
    });

    it("should validate emergency blood request schema", () => {
      const validRequest = {
        patientName: "Nazmul Huda",
        contactNumber: "01819283746",
        bloodGroup: "B+",
        unitsNeeded: 2,
        hospitalName: "Square Hospital",
        addressText: "Panthapath, Dhaka",
        latitude: 23.753,
        longitude: 90.3817,
        neededBy: new Date(Date.now() + 6 * 3600 * 1000).toISOString(),
        deadlineHours: 4,
        singleDonor: true,
        notes: "Emergency post-operative bypass requirement",
        isDemoMode: false,
      };
      const result = bloodRequestSchema.safeParse(validRequest);
      assert.equal(result.success, true);
    });

    it("should reject blood request with 0 units or negative units", () => {
      const invalidRequest = {
        patientName: "Nazmul Huda",
        contactNumber: "01819283746",
        bloodGroup: "B+",
        unitsNeeded: 0, // Invalid: must be >= 1
        hospitalName: "Square Hospital",
        addressText: "Panthapath, Dhaka",
        latitude: 23.753,
        longitude: 90.3817,
        neededBy: new Date().toISOString(),
        deadlineHours: 4,
        singleDonor: true,
      };
      const result = bloodRequestSchema.safeParse(invalidRequest);
      assert.equal(result.success, false);
    });
  });

  describe("3. Cooldown Mathematics & Edge Cases", () => {
    function computeCooldown(nowMs: number, cooldownEndsAtMs: number | null) {
      if (!cooldownEndsAtMs) {
        return { isComplete: true, remainingDays: 0, percentage: 100, label: "Ready to Donate" };
      }
      const diffMs = cooldownEndsAtMs - nowMs;
      if (diffMs <= 0) {
        return { isComplete: true, remainingDays: 0, percentage: 100, label: "Cooldown Complete" };
      }
      const remainingDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      const totalCooldownDays = 90;
      const daysCompleted = Math.max(0, Math.min(totalCooldownDays, totalCooldownDays - remainingDays));
      const percentage = (daysCompleted / totalCooldownDays) * 100;
      return { isComplete: false, remainingDays, percentage, label: "Active 90-Day Cooldown" };
    }

    it("should handle null cooldown (never donated or clean state)", () => {
      const state = computeCooldown(Date.now(), null);
      assert.equal(state.isComplete, true);
      assert.equal(state.label, "Ready to Donate");
    });

    it("should handle expired cooldown (donation was 95 days ago)", () => {
      const now = Date.now();
      const pastCooldown = now - 5 * 86400 * 1000; // 5 days past
      const state = computeCooldown(now, pastCooldown);
      assert.equal(state.isComplete, true);
      assert.equal(state.label, "Cooldown Complete");
    });

    it("should calculate exact remaining days and percentage at halfway (45 days left)", () => {
      const now = Date.now();
      const fortyFiveDaysLater = now + 45 * 86400 * 1000;
      const state = computeCooldown(now, fortyFiveDaysLater);
      assert.equal(state.isComplete, false);
      assert.equal(state.remainingDays, 45);
      assert.equal(state.percentage, 50); // 45/90 = 50%
    });

    it("should handle 1 day left of cooldown", () => {
      const now = Date.now();
      const oneDayLater = now + 1 * 86400 * 1000;
      const state = computeCooldown(now, oneDayLater);
      assert.equal(state.isComplete, false);
      assert.equal(state.remainingDays, 1);
      assert.equal(Math.round(state.percentage), 99); // 89/90 = 98.88%
    });

    it("should handle freshly started cooldown (90 days left)", () => {
      const now = Date.now();
      const ninetyDaysLater = now + 90 * 86400 * 1000;
      const state = computeCooldown(now, ninetyDaysLater);
      assert.equal(state.isComplete, false);
      assert.equal(state.remainingDays, 90);
      assert.equal(state.percentage, 0); // 0/90 = 0%
    });

    it("should compute SVG strokeDashoffset correctly", () => {
      const size = 140;
      const strokeWidth = 10;
      const radius = (size - strokeWidth) / 2;
      const circumference = 2 * Math.PI * radius;

      // At 50% progress:
      const percentage = 50;
      const strokeDashoffset = circumference - (percentage / 100) * circumference;
      assert.equal(strokeDashoffset, circumference / 2);
    });
  });

  describe("4. Live Countdown Time Calculation & Urgency Tiers", () => {
    function computeCountdown(nowMs: number, targetMs: number) {
      const difference = targetMs - nowMs;
      if (difference <= 0) {
        return { isExpired: true, hours: 0, minutes: 0, seconds: 0, totalMs: 0, tier: "expired" };
      }
      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      const isCritical = difference < 30 * 60 * 1000;
      const isUrgent = difference < 2 * 60 * 60 * 1000;

      const tier = isCritical ? "critical" : isUrgent ? "urgent" : "normal";

      return { isExpired: false, hours, minutes, seconds, totalMs: difference, tier };
    }

    it("should accurately break down hours, minutes, seconds", () => {
      const now = 1000000000;
      const target = now + (2 * 3600 + 15 * 60 + 30) * 1000; // 2h 15m 30s
      const cd = computeCountdown(now, target);
      assert.equal(cd.isExpired, false);
      assert.equal(cd.hours, 2);
      assert.equal(cd.minutes, 15);
      assert.equal(cd.seconds, 30);
      assert.equal(cd.tier, "normal");
    });

    it("should identify urgent tier (< 2 hours remaining)", () => {
      const now = 1000000000;
      const target = now + (1 * 3600 + 45 * 60) * 1000; // 1h 45m
      const cd = computeCountdown(now, target);
      assert.equal(cd.tier, "urgent");
    });

    it("should identify critical tier (< 30 minutes remaining)", () => {
      const now = 1000000000;
      const target = now + 18 * 60 * 1000; // 18m
      const cd = computeCountdown(now, target);
      assert.equal(cd.tier, "critical");
    });

    it("should identify expired state when difference <= 0", () => {
      const now = 1000000000;
      const target = now - 5000; // 5 seconds past
      const cd = computeCountdown(now, target);
      assert.equal(cd.isExpired, true);
      assert.equal(cd.tier, "expired");
      assert.equal(cd.hours, 0);
      assert.equal(cd.minutes, 0);
      assert.equal(cd.seconds, 0);
    });
  });

  describe("5. Dhaka Geographic Coverage & Configuration", () => {
    it("should include major Dhaka zones and essential hospitals", () => {
      assert.ok(DHAKA_AREAS.length >= 10, "Should have at least 10 Dhaka areas");
      assert.ok(DHAKA_HOSPITALS.length >= 6, "Should have key Dhaka hospitals");

      // Verify DMCH and BSMMU are present
      const hospitalNames = DHAKA_HOSPITALS.map((h) => h.name);
      assert.ok(
        hospitalNames.some((n) => n.includes("Dhaka Medical")),
        "DMCH should be present"
      );
      assert.ok(
        hospitalNames.some((n) => n.includes("BSMMU")),
        "BSMMU should be present"
      );

      // Verify cascading stages config
      assert.equal(APP_CONFIG.stages.stage1.radiusKm, 3);
      assert.equal(APP_CONFIG.stages.stage2.radiusKm, 5);
      assert.equal(APP_CONFIG.stages.stage3.radiusKm, 10);
      assert.equal(APP_CONFIG.donorCooldownDays, 90);
    });
  });
});
