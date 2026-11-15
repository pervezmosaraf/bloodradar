export const APP_CONFIG = {
  name: "BloodRadar",
  tagline: "Emergency Blood Response Network",
  version: "1.0.0",
  // Cascading Stage Config (km)
  stages: {
    stage1: { stage: 1, radiusKm: 3, label: "Immediate Vicinity (3 km)" },
    stage2: { stage: 2, radiusKm: 5, label: "Expanded Vicinity (5 km)" },
    stage3: { stage: 3, radiusKm: 10, label: "Max Emergency Radius (10 km)" },
  },
  // Default stage duration in seconds
  // Standard production: 600s (10 min)
  // Demo mode: 30s for live presentation testing
  stageDurations: {
    standardSeconds: 600,
    demoSeconds: 30,
  },
  // Donor Cooldown duration in days
  donorCooldownDays: 90,
  // Default Map Viewport
  defaultMapCenter: {
    lat: 23.7530, // Dhaka center (Panthapath/Square Hospital area)
    lng: 90.3817,
    zoom: 13,
  },
  // Bangladesh Phone Regex (01XXXXXXXXX)
  bangladeshPhoneRegex: /^01[3-9]\d{8}$/,
} as const;
