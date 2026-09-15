/**
 * complaints.ts — Citizen complaints with timelines
 * Hero complaint (cmp_0001) — Sunita, medicine_unavailable, in_review.
 * // TODO(backend): GET /api/v1/complaints
 */

import type { Complaint } from '@/types';
import { complaintId, facilityId, patientId } from './_ids';
import { at, daysFromToday } from './_clock';
import { createRng } from './_rng';
import { HERO } from './hero';

const rng = createRng('complaints-v1');

/** Hero complaint — must match hero.ts */
export const heroComplaint: Complaint = {
  id: HERO.complaint.id,            // cmp_0001
  patientId: HERO.complaint.patientId,
  facilityId: HERO.complaint.facilityId,
  category: HERO.complaint.category, // medicine_unavailable
  severity: 'high',
  status: HERO.complaint.status,      // in_review
  description: 'Metformin 500mg has been out of stock at Wazirabad PHC for the past 3 weeks. My father (Ramesh Sharma, diabetic) cannot get his regular medication. Please restock urgently.',
  slaDueAt: daysFromToday(1),
  timeline: [
    {
      status: 'open',
      note: 'Complaint registered by citizen via portal.',
      updatedAt: at(-3, '14:30'),
      updatedByUserId: HERO.sunita.userId,
    },
    {
      status: 'in_review',
      note: 'Complaint acknowledged. Pharmacy team notified. Checking stock request with district supply chain.',
      updatedAt: at(-1, '11:00'),
      updatedByUserId: HERO.districtAdmin.userId,
    },
  ],
  createdAt: at(-3, '14:30'),
};

// ── 30 more complaints across other facilities ────────────────────────────────

const CATEGORIES = ['medicine_unavailable', 'long_wait', 'staff_behaviour', 'cleanliness', 'equipment_failure', 'billing', 'other'] as const;
const SEVERITIES = ['low', 'medium', 'high', 'critical'] as const;
const SEV_WEIGHTS = [0.3, 0.4, 0.2, 0.1];

const generatedComplaints: Complaint[] = Array.from({ length: 30 }, (_, i) => {
  const n = i + 2;
  const dayOffset = -rng.int(1, 60);
  const category = rng.pick(CATEGORIES);
  const severity = rng.pickWeighted(SEVERITIES, SEV_WEIGHTS);
  const r = rng.float();
  const status: Complaint['status'] = r < 0.2 ? 'open' : r < 0.4 ? 'in_review' : r < 0.6 ? 'escalated' : r < 0.8 ? 'resolved' : 'closed';

  const timeline: Complaint['timeline'] = [
    {
      status: 'open',
      note: 'Complaint registered.',
      updatedAt: at(dayOffset, '10:00'),
      updatedByUserId: HERO.sunita.userId,
    },
  ];
  if (status !== 'open') {
    timeline.push({
      status: 'in_review',
      note: 'Under review by facility admin.',
      updatedAt: at(dayOffset + 1, '12:00'),
      updatedByUserId: HERO.districtAdmin.userId,
    });
  }
  if (status === 'resolved' || status === 'closed') {
    timeline.push({
      status: 'resolved',
      note: 'Issue resolved. Corrective action taken.',
      updatedAt: at(dayOffset + rng.int(2, 7), '15:00'),
      updatedByUserId: HERO.districtAdmin.userId,
    });
  }
  if (status === 'closed') {
    timeline.push({
      status: 'closed',
      note: 'Citizen confirmed satisfaction. Closed.',
      updatedAt: at(dayOffset + rng.int(8, 14), '16:00'),
      updatedByUserId: HERO.districtAdmin.userId,
    });
  }

  return {
    id: complaintId(n),
    patientId: patientId(rng.int(4, 100)),
    facilityId: facilityId(rng.int(1, 23)),
    category,
    severity,
    status,
    description: `Complaint regarding ${category.replace('_', ' ')} at the facility.`,
    slaDueAt: daysFromToday(dayOffset + 7),
    timeline,
    createdAt: at(dayOffset, '10:00'),
  };
});

export const complaints: Complaint[] = [heroComplaint, ...generatedComplaints];
export const complaintMap = new Map(complaints.map(c => [c.id, c]));

/** Get complaints for a patient */
export function getPatientComplaints(pid: string) {
  return complaints.filter(c => c.patientId === pid);
}
