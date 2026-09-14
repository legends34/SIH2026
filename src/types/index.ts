// ─── App-wide shared types ──────────────────────────────────────────────────

export type UrgencyBand =
  | 'EMERGENCY'
  | 'URGENT'
  | 'SOON'
  | 'ROUTINE'
  | 'SELF_CARE';

export const SYMPTOM_IDS = [
  'chest_pain',
  'difficulty_breathing',
  'severe_headache',
  'high_fever',
  'vomiting',
  'diarrhea',
  'abdominal_pain',
  'dizziness',
  'weakness',
  'rash',
  'eye_pain',
  'toothache',
  'back_pain',
  'joint_pain',
  'cough',
  'cold',
  'skin_wound',
  'pregnancy_concern',
  'child_not_eating',
  'child_fever',
] as const;
export type SymptomId = (typeof SYMPTOM_IDS)[number];

export const DEPARTMENT_CODES = [
  'GENERAL',
  'EMERGENCY',
  'PAEDIATRICS',
  'GYNAECOLOGY',
  'CARDIOLOGY',
  'ORTHOPAEDICS',
  'ENT',
  'OPHTHALMOLOGY',
  'DERMATOLOGY',
  'DENTAL',
  'PSYCHIATRY',
  'PHARMACY',
] as const;
export type DepartmentCode = (typeof DEPARTMENT_CODES)[number];
