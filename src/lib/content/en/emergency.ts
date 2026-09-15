// SAFETY-CRITICAL: reviewed string only. Do NOT soften or add reassurance.

export const emergency = {
  overlay: {
    headline: 'Call for help right now.',
    call108: 'Call 108 — Ambulance',
    call112: 'Call 112 — Emergency',
    nearestFacility: 'Nearest emergency: {facilityName} ({distance} km)',
    disclaimer:
      'If someone is with you, ask them to help. Do not drive yourself in an emergency.',
  },
  // First-aid steps intentionally omitted.
  // Official first-aid guidance reference required before adding.
  // See: MoHFW guidelines or WHO first-aid recommendations.
} as const;
