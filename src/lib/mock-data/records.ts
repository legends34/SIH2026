/**
 * records.ts — Patient health records: consultations, prescriptions, lab reports, vaccinations
 * Rich history for Sunita (pat_0001), Ramesh (pat_0002), Aarav (pat_0003).
 * // TODO(backend): GET /api/v1/records?patientId=
 */

import type { HealthRecord } from '@/types';
import { recordId, facilityId } from './_ids';
import { at, daysFromToday } from './_clock';
import { createRng } from './_rng';
import { HERO } from './hero';
import { users } from './users';
import { patientId } from './_ids';

const doctors = users.filter(u => u.role === 'DOCTOR' && u.facilityId);

const rng = createRng('records-v1');
let recCounter = 1;
const records: HealthRecord[] = [];

// ── Ramesh (pat_0002) — 61yo, hypertension + diabetes, rich timeline ─────────

records.push(
  // 6 months ago — initial diagnosis
  {
    id: recordId(recCounter++),
    patientId: HERO.ramesh.patientId,
    facilityId: HERO.phcId,
    authorUserId: HERO.doctor.userId,
    type: 'consultation',
    recordedAt: at(-180, '10:15'),
    data: {
      chiefComplaint: 'Persistent headache, dizziness for 2 weeks',
      vitals: { weightKg: 78, heightCm: 168, bpSystolic: 158, bpDiastolic: 96, pulsePerMin: 82, spo2Percent: 97 },
      clinicalNotes: 'BP consistently elevated. No prior diagnosis. Fundoscopy normal. Advise lifestyle changes and start antihypertensive.',
      diagnosisCodes: ['I10'],
    },
  },
  {
    id: recordId(recCounter++),
    patientId: HERO.ramesh.patientId,
    facilityId: HERO.phcId,
    authorUserId: HERO.doctor.userId,
    type: 'prescription',
    recordedAt: at(-180, '10:30'),
    data: {
      medicines: [
        { medicineId: 'med_0008', dosage: '1 tablet', frequency: 'Once daily morning', durationDays: 30, instructions: 'Take with water' },
        { medicineId: 'med_0013', dosage: '1 tablet', frequency: 'Once daily morning', durationDays: 30 },
      ],
    },
  },
  // Lab report — blood sugar high
  {
    id: recordId(recCounter++),
    patientId: HERO.ramesh.patientId,
    facilityId: HERO.phcId,
    authorUserId: HERO.doctor.userId,
    type: 'lab_report',
    recordedAt: at(-175, '11:00'),
    data: {
      testName: 'Fasting Blood Glucose + HbA1c',
      results: [
        { parameter: 'Fasting Glucose', value: '142', unit: 'mg/dL', referenceRange: '70–100' },
        { parameter: 'HbA1c',           value: '7.8',  unit: '%',     referenceRange: '<5.7' },
      ],
      reportedAt: at(-174, '16:00'),
    },
  },
  // Diabetes added to treatment
  {
    id: recordId(recCounter++),
    patientId: HERO.ramesh.patientId,
    facilityId: HERO.phcId,
    authorUserId: HERO.doctor.userId,
    type: 'consultation',
    recordedAt: at(-170, '09:45'),
    data: {
      chiefComplaint: 'Follow-up: blood sugar results',
      vitals: { bpSystolic: 148, bpDiastolic: 90, pulsePerMin: 78, spo2Percent: 97 },
      clinicalNotes: 'Blood glucose elevated. HbA1c 7.8% — Type 2 DM confirmed. Add Metformin. Continue antihypertensive.',
      diagnosisCodes: ['I10', 'E11'],
    },
  },
  {
    id: recordId(recCounter++),
    patientId: HERO.ramesh.patientId,
    facilityId: HERO.phcId,
    authorUserId: HERO.doctor.userId,
    type: 'prescription',
    recordedAt: at(-170, '10:00'),
    data: {
      medicines: [
        { medicineId: HERO.medicine.id, dosage: '1 tablet', frequency: 'Twice daily with meals', durationDays: 90, instructions: 'Do not skip doses' },
        { medicineId: 'med_0008',       dosage: '1 tablet', frequency: 'Once daily morning',     durationDays: 90 },
        { medicineId: 'med_0015',       dosage: '1 tablet', frequency: 'Once daily',             durationDays: 90, instructions: 'Aspirin for cardioprotection' },
      ],
    },
  },
  // 3-month follow-up
  {
    id: recordId(recCounter++),
    patientId: HERO.ramesh.patientId,
    facilityId: HERO.phcId,
    authorUserId: HERO.doctor.userId,
    type: 'consultation',
    recordedAt: at(-80, '10:00'),
    data: {
      chiefComplaint: 'Routine follow-up — HTN + DM',
      vitals: { weightKg: 76, bpSystolic: 136, bpDiastolic: 84, pulsePerMin: 74, spo2Percent: 98 },
      clinicalNotes: 'BP improving. HbA1c reduced to 6.9%. Continue current medicines. Advise diet and walking.',
      diagnosisCodes: ['I10', 'E11'],
    },
  }
);

// ── Sunita (pat_0001) — 34yo, today's appointment with complaint about Metformin stock ──

records.push(
  // Antenatal visit 2 years ago
  {
    id: recordId(recCounter++),
    patientId: HERO.sunita.patientId,
    facilityId: HERO.phcId,
    authorUserId: HERO.doctor.userId,
    type: 'consultation',
    recordedAt: at(-730, '09:30'),
    data: {
      chiefComplaint: 'First antenatal visit',
      vitals: { weightKg: 58, heightCm: 156, bpSystolic: 110, bpDiastolic: 70, pulsePerMin: 80, spo2Percent: 99 },
      clinicalNotes: 'G2P1, 10 weeks pregnant. All vitals normal. Iron + Folic Acid prescribed. Next visit at 20 weeks.',
      diagnosisCodes: ['Z34'],
    },
  },
  {
    id: recordId(recCounter++),
    patientId: HERO.sunita.patientId,
    facilityId: HERO.phcId,
    authorUserId: HERO.doctor.userId,
    type: 'prescription',
    recordedAt: at(-730, '09:45'),
    data: {
      medicines: [
        { medicineId: 'med_0032', dosage: '1 tablet', frequency: 'Once daily', durationDays: 90, instructions: 'Take after meals' },
        { medicineId: 'med_0033', dosage: '1 tablet', frequency: 'Once daily', durationDays: 90 },
      ],
    },
  },
  // Recent routine checkup (last month)
  {
    id: recordId(recCounter++),
    patientId: HERO.sunita.patientId,
    facilityId: HERO.phcId,
    authorUserId: HERO.doctor.userId,
    type: 'consultation',
    recordedAt: at(-30, '10:30'),
    data: {
      chiefComplaint: 'Routine checkup, fatigue for 2 weeks',
      vitals: { weightKg: 62, bpSystolic: 118, bpDiastolic: 74, pulsePerMin: 76, spo2Percent: 99 },
      clinicalNotes: 'Slight anaemia. No major issues. Continue normal diet. Iron supplement prescribed.',
      diagnosisCodes: ['D50'],
    },
  }
);

// ── Aarav (pat_0003) — 6yo, childhood vaccinations ───────────────────────────

records.push(
  {
    id: recordId(recCounter++),
    patientId: HERO.aarav.patientId,
    facilityId: HERO.phcId,
    authorUserId: HERO.doctor.userId,
    type: 'vaccination',
    recordedAt: at(-365 * 5, '10:00'),
    data: { vaccineName: 'BCG', ageMonths: 1, batchNumber: 'BCG-2021-A01' },
  },
  {
    id: recordId(recCounter++),
    patientId: HERO.aarav.patientId,
    facilityId: HERO.phcId,
    authorUserId: HERO.doctor.userId,
    type: 'vaccination',
    recordedAt: at(-365 * 5 + 42, '10:00'),
    data: { vaccineName: 'OPV-1', ageMonths: 1.5, batchNumber: 'OPV-2021-B04' },
  },
  {
    id: recordId(recCounter++),
    patientId: HERO.aarav.patientId,
    facilityId: HERO.phcId,
    authorUserId: HERO.doctor.userId,
    type: 'vaccination',
    recordedAt: at(-365 * 4, '10:00'),
    data: { vaccineName: 'Measles-Rubella', ageMonths: 9, batchNumber: 'MR-2022-C07' },
  },
  // Recent: cold + fever
  {
    id: recordId(recCounter++),
    patientId: HERO.aarav.patientId,
    facilityId: HERO.phcId,
    authorUserId: HERO.doctor.userId,
    type: 'consultation',
    recordedAt: at(-14, '09:00'),
    data: {
      chiefComplaint: 'Fever and cough for 3 days',
      vitals: { weightKg: 20, tempCelsius: 38.4, pulsePerMin: 96, spo2Percent: 98 },
      clinicalNotes: 'Viral URTI. No breathlessness. Rest and hydration advised. Paracetamol for fever.',
      diagnosisCodes: ['J06'],
    },
  },
  {
    id: recordId(recCounter++),
    patientId: HERO.aarav.patientId,
    facilityId: HERO.phcId,
    authorUserId: HERO.doctor.userId,
    type: 'prescription',
    recordedAt: at(-14, '09:15'),
    data: {
      medicines: [
        { medicineId: 'med_0001', dosage: '250 mg', frequency: 'Thrice daily', durationDays: 5, instructions: 'Syrup form if tablet unavailable' },
        { medicineId: 'med_0030', dosage: '1 sachet', frequency: 'Thrice daily', durationDays: 3, instructions: 'Mix in 200ml water' },
      ],
    },
  }
);

// ── ~80 miscellaneous records for other patients ──────────────────────────────

for (let i = 0; i < 80; i++) {
  const patNum = rng.int(4, 100);
  const doc = doctors.length > 0 ? rng.pick(doctors) : { id: HERO.doctor.userId, facilityId: HERO.phcId };
  const type = rng.pick(['consultation', 'prescription', 'lab_report', 'vaccination'] as const);
  const dayOffset = -rng.int(1, 365);

  let data: HealthRecord['data'];
  if (type === 'consultation') {
    data = {
      chiefComplaint: rng.pick(['Fever', 'Cough', 'Headache', 'Abdominal pain', 'Back pain', 'Rash']),
      vitals: {
        weightKg: rng.int(40, 90),
        bpSystolic: rng.int(110, 160),
        bpDiastolic: rng.int(70, 100),
        pulsePerMin: rng.int(60, 100),
        spo2Percent: rng.int(95, 100),
      },
      clinicalNotes: 'Routine visit. Symptoms assessed. Medication prescribed.',
      diagnosisCodes: [rng.pick(['J06', 'I10', 'E11', 'K30', 'M54', 'R21'])],
    };
  } else if (type === 'prescription') {
    data = {
      medicines: [{
        medicineId: medicineId(rng.int(1, 80)),
        dosage: '1 tablet',
        frequency: rng.pick(['Once daily', 'Twice daily', 'Thrice daily']),
        durationDays: rng.int(3, 30),
      }],
    };
  } else if (type === 'lab_report') {
    data = {
      testName: rng.pick(['CBC', 'Blood Glucose', 'Urine Routine', 'Lipid Profile']),
      results: [{ parameter: 'Haemoglobin', value: String(rng.int(9, 16)), unit: 'g/dL', referenceRange: '12–16' }],
      reportedAt: at(dayOffset + 1, '16:00'),
    };
  } else {
    data = {
      vaccineName: rng.pick(['Tetanus Toxoid', 'Hepatitis B', 'BCG', 'OPV']),
      ageMonths: rng.int(1, 120),
      batchNumber: `BATCH-${rng.int(1000, 9999)}`,
    };
  }

  records.push({
    id: recordId(recCounter++),
    patientId: patientId(patNum),
    facilityId: doc.facilityId!,
    authorUserId: doc.id,
    type,
    recordedAt: at(dayOffset, `${rng.int(9, 16)}:${rng.int(0, 5)}0`),
    data,
  } as HealthRecord);
}

export { records };
export const recordMap = new Map(records.map(r => [r.id, r]));

/** Get all records for a patient, sorted newest first */
export function getPatientRecords(pid: string) {
  return records
    .filter(r => r.patientId === pid)
    .sort((a, b) => b.recordedAt.localeCompare(a.recordedAt));
}

// Helper needed inside this file
function medicineId(n: number) {
  return `med_${n.toString().padStart(4, '0')}` as import('@/types').MedicineId;
}
void daysFromToday;
