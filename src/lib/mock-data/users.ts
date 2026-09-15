/**
 * users.ts — 40 citizen accounts + 20 staff accounts
 * Hero users (usr_0001..usr_0004) must match hero.ts exactly.
 * Decision 1: One account can manage multiple family members.
 * // TODO(backend): GET /api/v1/users/:id
 */

import type { User, UserRole } from '@/types';
import { userId, patientId, facilityId } from './_ids';
import { createRng } from './_rng';
import { at } from './_clock';
import { HERO } from './hero';

const rng = createRng('users-v1');

const DEPARTMENT_CODES = [
  'general_opd', 'maternal_child_health', 'paediatrics',
  'obstetrics', 'general_surgery', 'dental', 'emergency',
] as const;

// ── Hero users (fixed, must match hero.ts) ────────────────────────────────────

const heroUsers: User[] = [
  {
    id: HERO.sunita.userId,        // usr_0001
    phone: '+91 98100 00001',
    role: 'CITIZEN',
    patientIds: [HERO.sunita.patientId, HERO.ramesh.patientId, HERO.aarav.patientId],
    registeredAt: at(-120, '10:30'),
  },
  {
    id: HERO.doctor.userId,        // usr_0002
    phone: '+91 98100 00002',
    role: 'DOCTOR',
    facilityId: HERO.phcId,
    departmentCode: 'general_opd',
    registeredAt: at(-365, '09:00'),
  },
  {
    id: HERO.pharmacist.userId,    // usr_0003
    phone: '+91 98100 00003',
    role: 'PHARMACIST',
    facilityId: HERO.phcId,
    registeredAt: at(-300, '09:00'),
  },
  {
    id: HERO.districtAdmin.userId, // usr_0004
    phone: '+91 98100 00004',
    role: 'DISTRICT_ADMIN',
    registeredAt: at(-400, '09:00'),
  },
];

// ── 36 more citizen accounts (usr_0005..usr_0040) ────────────────────────────

// Patient IDs 4–100 (97 patients total) assigned across 36 citizen accounts
// 25 citizens get 3, 11 citizens get 2 (25*3 + 11*2 = 97)
const PATIENT_POOL = Array.from({ length: 97 }, (_, i) => patientId(i + 4));
let patientCursor = 0;

const familySizes: number[] = [];
for (let i = 0; i < 36; i++) {
  familySizes.push(i < 25 ? 3 : 2);
}
// Deterministic shuffle
for (let i = familySizes.length - 1; i > 0; i--) {
  const j = rng.int(0, i);
  const temp = familySizes[i];
  familySizes[i] = familySizes[j];
  familySizes[j] = temp;
}

const citizenUsers: User[] = [];
for (let i = 0; i < 36; i++) {
  const n = i + 5; // usr_0005 … usr_0040
  const size = familySizes[i];
  const ids = PATIENT_POOL.slice(patientCursor, patientCursor + size);
  patientCursor += size;

  citizenUsers.push({
    id: userId(n),
    phone: `+91 98100 ${String(n).padStart(5, '0')}`,
    role: 'CITIZEN' as UserRole,
    patientIds: ids,
    registeredAt: at(-rng.int(10, 400), '10:00'),
  });
}

// ── 20 staff accounts across 6 districts (usr_0041..usr_0060) ────────────────

const STAFF_ROLES: UserRole[] = ['DOCTOR', 'PHARMACIST', 'FACILITY_ADMIN', 'DISTRICT_ADMIN', 'STATE_ADMIN'];
const FAC_RANGE = 23; // 23 facilities total

const staffUsers: User[] = Array.from({ length: 20 }, (_, i) => {
  const n = i + 41;
  const role = rng.pick(STAFF_ROLES);
  const fid = facilityId(rng.int(1, FAC_RANGE));
  const dept = rng.pick(DEPARTMENT_CODES);
  return {
    id: userId(n),
    phone: `+91 98200 ${String(n).padStart(5, '0')}`,
    role,
    facilityId: fid,
    departmentCode: ['DOCTOR', 'NURSE'].includes(role) ? dept : undefined,
    registeredAt: at(-rng.int(100, 500), '09:00'),
  };
});

export const users: User[] = [...heroUsers, ...citizenUsers, ...staffUsers];
export const userMap = new Map(users.map(u => [u.id, u]));
