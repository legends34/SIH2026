// ─── Namespace registry ─────────────────────────────────────────────────────

export const NAMESPACES = [
  'common',
  'auth',
  'patientHome',
  'triage',
  'emergency',
  'facilities',
  'booking',
  'queue',
  'doctor',
  'records',
  'medicines',
  'pharmacist',
  'complaints',
  'profile',
  'admin',
  'states',
] as const;

export type Namespace = (typeof NAMESPACES)[number];
