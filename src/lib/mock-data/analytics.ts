/**
 * analytics.ts — Daily analytics aggregates for admin dashboard
 * Computed strictly from the detail collections (appointments, inventory, complaints).
 * Covers last 30 days for all 23 facilities.
 * // TODO(backend): GET /api/v1/analytics/daily
 */

import type { DailyAnalytics } from '@/types';
import { facilityId } from './_ids';
import { daysFromToday } from './_clock';
import { appointments } from './appointments';
import { stockItems } from './inventory';
import { complaints } from './complaints';

const analytics: DailyAnalytics[] = [];

// Index appointments by facility and date (from updatedAt)
const apptsByFacAndDate = new Map<string, typeof appointments>();
for (const apt of appointments) {
  const date = apt.updatedAt.slice(0, 10);
  const key = `${apt.facilityId}:${date}`;
  if (!apptsByFacAndDate.has(key)) apptsByFacAndDate.set(key, []);
  apptsByFacAndDate.get(key)!.push(apt);
}

// Index stockOuts by facility
const stockOutsByFac = new Map<string, number>();
for (const s of stockItems) {
  if (s.status === 'out') {
    stockOutsByFac.set(s.facilityId, (stockOutsByFac.get(s.facilityId) || 0) + 1);
  }
}

// Index complaints by facility and date (from createdAt)
const complaintsByFacAndDate = new Map<string, typeof complaints>();
for (const c of complaints) {
  const date = c.createdAt.slice(0, 10);
  const key = `${c.facilityId}:${date}`;
  if (!complaintsByFacAndDate.has(key)) complaintsByFacAndDate.set(key, []);
  complaintsByFacAndDate.get(key)!.push(c);
}

for (let dayOffset = -30; dayOffset <= 0; dayOffset++) {
  const date = daysFromToday(dayOffset);
  for (let facN = 1; facN <= 23; facN++) {
    const fac = facilityId(facN);
    const key = `${fac}:${date}`;
    const dayAppts = apptsByFacAndDate.get(key) || [];
    const footfall = dayAppts.filter(a => ['checked_in', 'in_consultation', 'completed'].includes(a.status)).length;
    const noShowCount = dayAppts.filter(a => a.status === 'no_show').length;
    const noShowRate = dayAppts.length > 0 ? parseFloat((noShowCount / dayAppts.length).toFixed(2)) : 0;
    const stockOutCount = stockOutsByFac.get(fac) || 0;
    const dayComplaints = complaintsByFacAndDate.get(key) || [];
    const complaintCount = dayComplaints.length;
    const slaBreaches = dayComplaints.filter(c =>
      c.timeline.some(t => t.note?.toLowerCase().includes('sla') || t.status === 'escalated') || c.status === 'escalated'
    ).length;

    analytics.push({
      date,
      facilityId: fac,
      footfall,
      avgWaitMinutes: footfall > 0 ? 12 + ((footfall * 3) % 20) : 0,
      noShowCount,
      noShowRate,
      stockOutCount,
      complaintCount,
      complaintSlaBreachCount: slaBreaches,
    });
  }
}

export { analytics };

/** Get analytics for a specific facility (sorted newest first) */
export function getFacilityAnalytics(fac: string) {
  return analytics
    .filter(a => a.facilityId === fac)
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** Aggregate district-level totals for today */
export function getDistrictSummary(district: string, facilityIds: string[]) {
  const today = daysFromToday(0);
  const totals = analytics
    .filter(a => a.date === today && facilityIds.includes(a.facilityId))
    .reduce(
      (acc, a) => ({
        totalFootfall: acc.totalFootfall + a.footfall,
        totalComplaints: acc.totalComplaints + a.complaintCount,
        totalStockOuts: acc.totalStockOuts + a.stockOutCount,
        slaBreaches: acc.slaBreaches + a.complaintSlaBreachCount,
      }),
      { totalFootfall: 0, totalComplaints: 0, totalStockOuts: 0, slaBreaches: 0 }
    );
  return { ...totals, district };
}
