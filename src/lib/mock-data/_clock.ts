/**
 * _clock.ts — Time utilities for mock data
 * DEMO_TODAY is computed ONCE at module load from the real system date in Asia/Kolkata.
 * The single use of Date is intentional and documented here.
 * // TODO(backend): endpoint pending Lane D
 */

import type { IsoDate, IsoDateTime } from '@/types';

/** Today's date in Asia/Kolkata timezone, set once at module load */
export const DEMO_TODAY: IsoDate = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Kolkata',
}).format(new Date()); // "2026-09-15"

/** OPD session windows */
export const OPD_SESSIONS = {
  morning: { start: '09:00', end: '13:00' },
  evening: { start: '16:00', end: '18:00' },
} as const;

/**
 * Return an IsoDate n days from DEMO_TODAY.
 * Negative n = past, positive = future.
 */
export function daysFromToday(n: number): IsoDate {
  const [y, m, d] = DEMO_TODAY.split('-').map(Number);
  const date = new Date(y, m - 1, d + n);
  return date.toLocaleDateString('en-CA'); // "YYYY-MM-DD"
}

/**
 * Return an IsoDateTime for DEMO_TODAY + dayOffset at a specific time.
 * @param dayOffset - number of days relative to DEMO_TODAY
 * @param time - "HH:MM" in IST
 */
export function at(dayOffset: number, time: string): IsoDateTime {
  const date = daysFromToday(dayOffset);
  return `${date}T${time}:00+05:30`;
}

/** Return an IsoDateTime for a specific date string at a specific time */
export function atDate(date: IsoDate, time: string): IsoDateTime {
  return `${date}T${time}:00+05:30`;
}

/**
 * Generate an array of dates from startOffset to endOffset (inclusive).
 * E.g. dateRange(-7, 0) = last 7 days including today.
 */
export function dateRange(startOffset: number, endOffset: number): IsoDate[] {
  const dates: IsoDate[] = [];
  for (let i = startOffset; i <= endOffset; i++) {
    dates.push(daysFromToday(i));
  }
  return dates;
}

/** Format minutes as "HH:MM" */
export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60).toString().padStart(2, '0');
  const m = (minutes % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
}
