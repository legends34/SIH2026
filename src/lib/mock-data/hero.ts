/**
 * hero.ts — Fixed hero story fixtures for the demo path.
 * These IDs must appear EXACTLY in every domain mock data file.
 * Never regenerate. Never randomise.
 * // TODO(backend): endpoint pending Lane D
 */

import type { UserId, PatientId, FacilityId, AppointmentId, MedicineId, ComplaintId } from '@/types';

/** Sunita's PHC (Wazirabad, Gurugram) — fac_0005 */
const SUNITA_PHC_ID = 'fac_0005' as FacilityId;
/** CHC 11 km away from Sunita's PHC — Farrukhnagar CHC, fac_0004 */
const SUNITA_NEARBY_CHC_ID = 'fac_0004' as FacilityId;

export const HERO = {
  /** Sunita, 34 — account holder */
  sunita: {
    userId:    'usr_0001' as UserId,
    patientId: 'pat_0001' as PatientId,
    name:      'Sunita Sharma',
    age:       34,
    district:  'Gurugram',
    language:  'hi', // Hindi
  },

  /** Ramesh, 61 — dependent with hypertension and rich medical timeline */
  ramesh: {
    patientId: 'pat_0002' as PatientId,
    name:      'Ramesh Sharma',
    age:       61,
  },

  /** Aarav, 6 — child dependent */
  aarav: {
    patientId: 'pat_0003' as PatientId,
    name:      'Aarav Sharma',
    age:       6,
  },

  /** Dr. Sharma — Medical officer at Sunita's PHC */
  doctor: {
    userId:     'usr_0002' as UserId,
    name:       'Dr. Rakesh Sharma',
    facilityId: SUNITA_PHC_ID,
  },

  /** Pharmacist Mehta — same PHC */
  pharmacist: {
    userId:     'usr_0003' as UserId,
    name:       'Mehta Ramesh',
    facilityId: SUNITA_PHC_ID,
  },

  /** District Admin — Gurugram */
  districtAdmin: {
    userId: 'usr_0004' as UserId,
    name:   'Priya Singh',
    district: 'Gurugram',
  },

  /** Today's appointment: Sunita, token 19, now serving 14 */
  appointment: {
    id:          'appt_000001' as AppointmentId,
    patientId:   'pat_0001' as PatientId,
    facilityId:  SUNITA_PHC_ID,
    tokenNumber: 19,
    nowServing:  14,
    department:  'general_opd',
  },

  /** Hero medicine: Metformin 500mg — out at PHC, available at CHC */
  medicine: {
    id:           'med_0042' as MedicineId,
    name:         'Metformin',
    strength:     '500 mg',
    dosageForm:   'Tablet',
    outAtFacility: SUNITA_PHC_ID,
    availableAtFacility: SUNITA_NEARBY_CHC_ID,
    distanceKm:   11,
  },

  /** Hero complaint: medicine unavailable, status in_review, SLA due tomorrow */
  complaint: {
    id:       'cmp_0001' as ComplaintId,
    status:   'in_review' as const,
    category: 'medicine_unavailable' as const,
    patientId: 'pat_0001' as PatientId,
    facilityId: SUNITA_PHC_ID,
  },

  /** Facility references */
  phcId:  SUNITA_PHC_ID,
  chcId:  SUNITA_NEARBY_CHC_ID,
} as const;
