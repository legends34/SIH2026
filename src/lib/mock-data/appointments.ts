/**
 * appointments.ts — Bookings for today + next 7 days + past 30 days for analytics
 * Hero appointment (appt_000001) must match hero.ts exactly.
 * // TODO(backend): GET /api/v1/appointments
 */

import type { Appointment, AppointmentStatus } from '@/types';
import { appointmentId, patientId } from './_ids';
import { at, daysFromToday } from './_clock';
import { createRng } from './_rng';
import { HERO } from './hero';
import { HERO_SLOT, slots } from './slots';

const rng = createRng('appointments-v1');

/** Hero appointment — Sunita, token 19, today */
export const heroAppointment: Appointment = {
  id: HERO.appointment.id,          // appt_000001
  slotId: HERO_SLOT.id,
  patientId: HERO.appointment.patientId,
  facilityId: HERO.appointment.facilityId,
  departmentCode: HERO.appointment.department,
  tokenNumber: HERO.appointment.tokenNumber, // 19
  status: 'checked_in',
  isWalkIn: false,
  bookedAt: at(-3, '14:22'),
  updatedAt: at(0, '09:45'),
};

// Track slot appointments to ensure capacity is NEVER exceeded (Invariant 2)
const slotBookings = new Map<string, number>();
slotBookings.set(HERO_SLOT.id, 1);

let apptCounter = 2;
const generatedAppointments: Appointment[] = [];

// Index slots by date for fast lookup
const slotsByDate = new Map<string, typeof slots>();
for (const s of slots) {
  if (!slotsByDate.has(s.date)) slotsByDate.set(s.date, []);
  slotsByDate.get(s.date)!.push(s);
}

// 1. Historical appointments (-30 to -1) — ~500 appointments for analytics
for (let dayOffset = -30; dayOffset <= -1; dayOffset++) {
  const date = daysFromToday(dayOffset);
  const daySlots = slotsByDate.get(date) || [];
  if (daySlots.length === 0) continue;

  const dayCount = rng.int(14, 20);
  for (let i = 0; i < dayCount; i++) {
    const slot = rng.pick(daySlots);
    const currentBooked = slotBookings.get(slot.id) || 0;
    if (currentBooked >= slot.capacity) continue;

    // Realistic historical statuses: completed 80%, no_show 12%, cancelled 8%
    const status: AppointmentStatus = rng.pickWeighted(
      ['completed', 'no_show', 'cancelled'],
      [0.80, 0.12, 0.08]
    );

    if (status !== 'cancelled') {
      slotBookings.set(slot.id, currentBooked + 1);
    }

    const hour = rng.pick(['09:15', '10:00', '10:45', '11:30', '12:15', '16:00', '16:45', '17:15']);

    generatedAppointments.push({
      id: appointmentId(apptCounter++),
      slotId: slot.id,
      patientId: patientId(rng.int(1, 100)),
      facilityId: slot.facilityId,
      departmentCode: slot.departmentCode,
      tokenNumber: (slotBookings.get(slot.id) || 1),
      status,
      isWalkIn: rng.chance(0.2),
      bookedAt: at(dayOffset - rng.int(1, 5), '10:00'),
      updatedAt: at(dayOffset, hour),
    });
  }
}

// 2. Recent and upcoming appointments (today to +7) — ~40 appointments across all statuses
const UPCOMING_STATUSES: AppointmentStatus[] = [
  'booked', 'checked_in', 'in_consultation', 'completed', 'cancelled', 'no_show'
];
const UPCOMING_WEIGHTS = [0.45, 0.15, 0.10, 0.15, 0.10, 0.05];

for (let dayOffset = 0; dayOffset <= 7; dayOffset++) {
  const date = daysFromToday(dayOffset);
  const daySlots = slotsByDate.get(date) || [];
  if (daySlots.length === 0) continue;

  const countForDay = dayOffset === 0 ? 10 : rng.int(4, 7);
  for (let i = 0; i < countForDay; i++) {
    const slot = rng.pick(daySlots);
    const currentBooked = slotBookings.get(slot.id) || 0;
    if (currentBooked >= slot.capacity) continue;

    const status: AppointmentStatus = dayOffset === 0
      ? rng.pickWeighted(UPCOMING_STATUSES, UPCOMING_WEIGHTS)
      : 'booked';

    if (status !== 'cancelled') {
      slotBookings.set(slot.id, currentBooked + 1);
    }

    const hour = rng.pick(['09:00', '10:00', '11:00', '12:00', '16:00', '17:00']);

    generatedAppointments.push({
      id: appointmentId(apptCounter++),
      slotId: slot.id,
      patientId: patientId(rng.int(1, 100)),
      facilityId: slot.facilityId,
      departmentCode: slot.departmentCode,
      tokenNumber: (slotBookings.get(slot.id) || 1),
      status,
      isWalkIn: rng.chance(0.15),
      bookedAt: at(dayOffset - rng.int(1, 4), '11:00'),
      updatedAt: at(dayOffset, hour),
    });
  }
}

export const appointments: Appointment[] = [heroAppointment, ...generatedAppointments];
export const appointmentMap = new Map(appointments.map(a => [a.id, a]));

/** Get all appointments for a patient */
export function getPatientAppointments(pid: string) {
  return appointments.filter(a => a.patientId === pid);
}

/** Get today's appointments for a facility/dept */
export function getTodayQueue(fid: string, dept: string) {
  const today = daysFromToday(0);
  return appointments
    .filter(a => a.facilityId === fid && a.departmentCode === dept && a.updatedAt.startsWith(today))
    .sort((a, b) => a.tokenNumber - b.tokenNumber);
}
