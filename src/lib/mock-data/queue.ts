/**
 * queue.ts — Live queue state and queue entries for today
 * Hero: Sunita is token 19, now serving is 14 at fac_0005 general_opd.
 * // TODO(backend): GET /api/v1/queue/:facilityId/:dept
 */

import type { QueueState, QueueEntry } from '@/types';
import { patientId, facilityId } from './_ids';
import { at, daysFromToday } from './_clock';
import { createRng } from './_rng';
import { HERO } from './hero';
import { heroAppointment, appointments } from './appointments';

const rng = createRng('queue-v1');
const TODAY = daysFromToday(0);

// ── Hero queue state ─────────────────────────────────────────────────────────

export const heroQueueState: QueueState = {
  facilityId: HERO.phcId,
  departmentCode: 'general_opd',
  date: TODAY,
  nowServing: HERO.appointment.nowServing, // 14
  lastToken: 32,
  avgServiceTimeMinutes: 8,
  updatedAt: at(0, '10:47'),
};

// ── Hero queue entries (tokens 1..32 at Sunita's PHC today) ─────────────────

export const heroQueueEntries: QueueEntry[] = Array.from({ length: 32 }, (_, i) => {
  const token = i + 1;
  const isSunita = token === HERO.appointment.tokenNumber;
  const isCompleted = token < HERO.appointment.nowServing;
  const isInProgress = token === HERO.appointment.nowServing;

  return {
    facilityId: HERO.phcId,
    departmentCode: 'general_opd',
    date: TODAY,
    tokenNumber: token,
    patientId: isSunita ? HERO.appointment.patientId : patientId(rng.int(4, 100)),
    appointmentId: isSunita ? heroAppointment.id : undefined,
    calledAt:     isCompleted || isInProgress ? at(0, `0${8 + Math.floor(token / 5)}:${(token % 6) * 10}`) : undefined,
    completedAt:  isCompleted ? at(0, `0${8 + Math.floor(token / 5)}:${(token % 6) * 10 + 8}`) : undefined,
  };
});

// ── Other facilities queues ──────────────────────────────────────────────────

const DEPTS = ['general_opd', 'maternal_child_health', 'paediatrics', 'emergency'] as const;

export const queueStates: QueueState[] = [heroQueueState];
const additionalQueueEntries: QueueEntry[] = [];

// For 5 additional active facilities, generate gapless queues
for (let facN = 1; facN <= 5; facN++) {
  const fid = facilityId(facN);
  if (fid === HERO.phcId) continue;

  const dept = 'general_opd';
  const totalTokens = rng.int(10, 20);
  const nowServing = rng.int(1, Math.floor(totalTokens * 0.7));

  queueStates.push({
    facilityId: fid,
    departmentCode: dept,
    date: TODAY,
    nowServing,
    lastToken: totalTokens,
    avgServiceTimeMinutes: rng.int(6, 14),
    updatedAt: at(0, '10:30'),
  });

  // Gapless 1..totalTokens entries
  for (let t = 1; t <= totalTokens; t++) {
    const isDone = t < nowServing;
    const isNow = t === nowServing;
    additionalQueueEntries.push({
      facilityId: fid,
      departmentCode: dept,
      date: TODAY,
      tokenNumber: t,
      patientId: patientId(rng.int(4, 100)),
      calledAt: isDone || isNow ? at(0, '10:00') : undefined,
      completedAt: isDone ? at(0, '10:12') : undefined,
    });
  }
}

// ── All queue entries ───────────────────────────────────────────────────────

export const queueEntries: QueueEntry[] = [
  ...heroQueueEntries,
  ...additionalQueueEntries,
];
