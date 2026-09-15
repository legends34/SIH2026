/**
 * patients.ts — 100 mock patients across 6 NCR districts
 * Hero patients (pat_0001..pat_0003) must match hero.ts exactly.
 * // TODO(backend): GET /api/v1/patients/:id
 */

import type { Patient } from '@/types';
import { patientId } from './_ids';
import { createRng } from './_rng';
import { daysFromToday } from './_clock';

const rng = createRng('patients-v1');

const MALE_NAMES = [
  'Ramesh', 'Suresh', 'Rajesh', 'Mahesh', 'Dinesh', 'Mukesh', 'Naresh', 'Ganesh',
  'Vikram', 'Arun', 'Ravi', 'Ajay', 'Vijay', 'Sanjay', 'Rohit', 'Amit',
  'Deepak', 'Manoj', 'Rakesh', 'Pankaj', 'Aarav', 'Arjun', 'Dev', 'Kabir',
  'Harish', 'Girish', 'Pradeep', 'Yogesh', 'Bharat', 'Shyam',
];
const FEMALE_NAMES = [
  'Sunita', 'Kavita', 'Anita', 'Geeta', 'Seema', 'Neeta', 'Reeta', 'Meena',
  'Pushpa', 'Usha', 'Asha', 'Lata', 'Rekha', 'Kiran', 'Nisha', 'Pooja',
  'Priya', 'Deepa', 'Suman', 'Radha', 'Anjali', 'Rani', 'Shanti', 'Parvati',
  'Savita', 'Sarita', 'Mamta', 'Lalita', 'Kamla', 'Durga',
];
const SURNAMES = [
  'Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Yadav', 'Patel', 'Chauhan',
  'Malik', 'Rajput', 'Jat', 'Saini', 'Rao', 'Mishra', 'Tiwari', 'Dubey',
  'Srivastava', 'Pandey', 'Joshi', 'Mehra',
];
const LANGUAGES = ['hi', 'hi', 'hi', 'hi', 'hi', 'hi', 'pa', 'ur', 'braj', 'en'];
const DISTRICTS = ['Gurugram', 'Faridabad', 'Gautam Buddha Nagar', 'Ghaziabad', 'Sonipat', 'Rohtak'];

function randomDob(ageYears: number): string {
  const offsetDays = -(ageYears * 365 + rng.int(0, 364));
  return daysFromToday(offsetDays);
}

function makePatient(n: number): Patient {
  const sex = rng.chance(0.52) ? 'F' : 'M';
  const name = sex === 'F'
    ? `${rng.pick(FEMALE_NAMES)} ${rng.pick(SURNAMES)}`
    : `${rng.pick(MALE_NAMES)} ${rng.pick(SURNAMES)}`;
  const ageYears = rng.int(1, 80);
  return {
    id: patientId(n),
    name,
    dob: randomDob(ageYears),
    sex,
    aadhaarLast4: rng.chance(0.7) ? String(rng.int(1000, 9999)) : undefined,
    preferredLanguage: rng.pick(LANGUAGES),
  };
}

// Build patients 4–100 (hero patients 1–3 are fixed below)
const generatedPatients: Patient[] = Array.from({ length: 97 }, (_, i) => makePatient(i + 4));

/** Hero patients — must match hero.ts */
const heroPatients: Patient[] = [
  {
    id: 'pat_0001',
    name: 'Sunita Sharma',
    dob: daysFromToday(-(34 * 365 + 42)),
    sex: 'F',
    aadhaarLast4: '7834',
    preferredLanguage: 'hi',
  },
  {
    id: 'pat_0002',
    name: 'Ramesh Sharma',
    dob: daysFromToday(-(61 * 365 + 120)),
    sex: 'M',
    aadhaarLast4: '2291',
    preferredLanguage: 'hi',
  },
  {
    id: 'pat_0003',
    name: 'Aarav Sharma',
    dob: daysFromToday(-(6 * 365 + 10)),
    sex: 'M',
    aadhaarLast4: undefined,
    preferredLanguage: 'hi',
  },
];

export const patients: Patient[] = [...heroPatients, ...generatedPatients];

/** Lookup by ID */
export const patientMap = new Map(patients.map(p => [p.id, p]));

// Unused import guard
void DISTRICTS;
