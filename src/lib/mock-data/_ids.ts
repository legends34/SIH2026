/**
 * _ids.ts — Deterministic ID builders
 * All IDs are template-literal types so TypeScript catches type mismatches.
 * // TODO(backend): endpoint pending Lane D
 */

import type {
  FacilityId, PatientId, UserId, AppointmentId,
  SlotId, MedicineId, ComplaintId, RecordId, AuditId
} from '@/types';

const pad = (n: number, len = 4) => n.toString().padStart(len, '0');

/** fac_0001, fac_0002, ... */
export const facilityId  = (n: number): FacilityId    => `fac_${pad(n)}` as FacilityId;
/** pat_0001, pat_0002, ... */
export const patientId   = (n: number): PatientId     => `pat_${pad(n)}` as PatientId;
/** usr_0001, usr_0002, ... */
export const userId      = (n: number): UserId        => `usr_${pad(n)}` as UserId;
/** appt_0001, appt_0002, ... */
export const appointmentId = (n: number): AppointmentId => `appt_${pad(n, 6)}` as AppointmentId;
/** slot_0001, slot_0002, ... */
export const slotId      = (n: number): SlotId        => `slot_${pad(n, 6)}` as SlotId;
/** med_0001, med_0002, ... */
export const medicineId  = (n: number): MedicineId    => `med_${pad(n)}` as MedicineId;
/** cmp_0001, cmp_0002, ... */
export const complaintId = (n: number): ComplaintId   => `cmp_${pad(n)}` as ComplaintId;
/** rec_0001, rec_0002, ... */
export const recordId    = (n: number): RecordId      => `rec_${pad(n, 6)}` as RecordId;
/** aud_0001, aud_0002, ... */
export const auditId     = (n: number): AuditId       => `aud_${pad(n, 6)}` as AuditId;

/** Counter factory — returns a function that auto-increments */
export function counter(start = 1) {
  let n = start;
  return () => n++;
}
