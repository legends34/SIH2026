/**
 * slots.ts — Session-block slots for the last 30 days and the next 7 days across all facilities
 * Decision 2: Capacity-N session blocks with tokens (not fixed time slots).
 * // TODO(backend): GET /api/v1/slots
 */

import type { Slot } from '@/types';
import { slotId, facilityId } from './_ids';
import { daysFromToday, OPD_SESSIONS } from './_clock';
import { createRng } from './_rng';
import { HERO } from './hero';

const rng = createRng('slots-v1');

const DEPARTMENT_CONFIGS: Array<{ dept: Slot['departmentCode']; morningCap: number; eveningCap: number }> = [
  { dept: 'general_opd',          morningCap: 40, eveningCap: 20 },
  { dept: 'maternal_child_health', morningCap: 20, eveningCap: 10 },
  { dept: 'paediatrics',          morningCap: 25, eveningCap: 12 },
  { dept: 'obstetrics',           morningCap: 15, eveningCap: 0  },
  { dept: 'general_surgery',      morningCap: 10, eveningCap: 0  },
  { dept: 'dental',               morningCap: 12, eveningCap: 8  },
  { dept: 'emergency',            morningCap: 60, eveningCap: 60 },
];

const FAC_RANGE = 23;
let slotCounter = 2; // Reserve 1 for HERO_SLOT
const generatedSlots: Slot[] = [];

/** Hero slot: Sunita's slot today at Wazirabad PHC (fac_0005) general_opd morning */
export const HERO_SLOT: Slot = {
  id: slotId(1),
  facilityId: HERO.phcId,
  departmentCode: 'general_opd',
  date: daysFromToday(0),
  startTime: OPD_SESSIONS.morning.start,
  endTime: OPD_SESSIONS.morning.end,
  capacity: 40,
  bookedCount: 32,
};

for (let dayOffset = -30; dayOffset <= 7; dayOffset++) {
  const date = daysFromToday(dayOffset);
  for (let facN = 1; facN <= FAC_RANGE; facN++) {
    const fid = facilityId(facN);
    for (const { dept, morningCap, eveningCap } of DEPARTMENT_CONFIGS) {
      if (morningCap > 0) {
        if (dayOffset === 0 && fid === HERO.phcId && dept === 'general_opd') {
          // Handled by HERO_SLOT
          continue;
        }
        const booked = rng.int(0, morningCap);
        generatedSlots.push({
          id: slotId(slotCounter++),
          facilityId: fid,
          departmentCode: dept,
          date,
          startTime: OPD_SESSIONS.morning.start,
          endTime: OPD_SESSIONS.morning.end,
          capacity: morningCap,
          bookedCount: dayOffset < 0 ? morningCap : booked,
        });
      }
      if (eveningCap > 0) {
        const booked = rng.int(0, eveningCap);
        generatedSlots.push({
          id: slotId(slotCounter++),
          facilityId: fid,
          departmentCode: dept,
          date,
          startTime: OPD_SESSIONS.evening.start,
          endTime: OPD_SESSIONS.evening.end,
          capacity: eveningCap,
          bookedCount: dayOffset < 0 ? eveningCap : booked,
        });
      }
    }
  }
}

export const slots: Slot[] = [HERO_SLOT, ...generatedSlots];
export const slotMap = new Map(slots.map(s => [s.id, s]));
