import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

import {
  HERO,
  facilities,
  patients,
  patientMap,
  users,
  userMap,
  slots,
  slotMap,
  appointments,
  appointmentMap,
  heroAppointment,
  medicines,
  medicineMap,
  stockItems,
  ledgerEntries,
  queueStates,
  queueEntries,
  heroQueueState,
  heroQueueEntries,
  records,
  recordMap,
  complaints,
  complaintMap,
  heroComplaint,
  analytics,
  auditLogs,
} from '../index';

describe('Lane B Mock Data Cross-File Integrity Tests', () => {

  // Invariant 1: Every foreign ID in every collection resolves
  it('Invariant 1: Every foreign ID in every collection resolves', () => {
    const facilityIds = new Set(facilities.map(f => f.id));
    const patientIds = new Set(patients.map(p => p.id));
    const userIds = new Set(users.map(u => u.id));
    const slotIds = new Set(slots.map(s => s.id));
    const medicineIds = new Set(medicines.map(m => m.id));
    const appointmentIds = new Set(appointments.map(a => a.id));

    // Check users
    for (const u of users) {
      if (u.facilityId) {
        expect(facilityIds.has(u.facilityId), `User ${u.id} facilityId ${u.facilityId} not found`).toBe(true);
      }
      if (u.patientIds) {
        for (const pid of u.patientIds) {
          expect(patientIds.has(pid), `User ${u.id} patientId ${pid} not found`).toBe(true);
        }
      }
    }

    // Check slots
    for (const s of slots) {
      expect(facilityIds.has(s.facilityId), `Slot ${s.id} facilityId ${s.facilityId} not found`).toBe(true);
    }

    // Check appointments
    for (const a of appointments) {
      expect(patientIds.has(a.patientId), `Appointment ${a.id} patientId ${a.patientId} not found`).toBe(true);
      expect(facilityIds.has(a.facilityId), `Appointment ${a.id} facilityId ${a.facilityId} not found`).toBe(true);
      expect(slotIds.has(a.slotId), `Appointment ${a.id} slotId ${a.slotId} not found`).toBe(true);
    }

    // Check stockItems & ledgerEntries
    for (const item of stockItems) {
      expect(facilityIds.has(item.facilityId), `StockItem facilityId ${item.facilityId} not found`).toBe(true);
      expect(medicineIds.has(item.medicineId), `StockItem medicineId ${item.medicineId} not found`).toBe(true);
    }
    for (const entry of ledgerEntries) {
      expect(facilityIds.has(entry.facilityId), `LedgerEntry facilityId ${entry.facilityId} not found`).toBe(true);
      expect(medicineIds.has(entry.medicineId), `LedgerEntry medicineId ${entry.medicineId} not found`).toBe(true);
    }

    // Check queue
    for (const q of queueStates) {
      expect(facilityIds.has(q.facilityId), `QueueState facilityId ${q.facilityId} not found`).toBe(true);
    }
    for (const q of queueEntries) {
      expect(facilityIds.has(q.facilityId), `QueueEntry facilityId ${q.facilityId} not found`).toBe(true);
      expect(patientIds.has(q.patientId), `QueueEntry patientId ${q.patientId} not found`).toBe(true);
      if (q.appointmentId) {
        expect(appointmentIds.has(q.appointmentId), `QueueEntry appointmentId ${q.appointmentId} not found`).toBe(true);
      }
    }

    // Check records
    for (const r of records) {
      expect(patientIds.has(r.patientId), `Record ${r.id} patientId ${r.patientId} not found`).toBe(true);
      expect(facilityIds.has(r.facilityId), `Record ${r.id} facilityId ${r.facilityId} not found`).toBe(true);
      expect(userIds.has(r.authorUserId), `Record ${r.id} authorUserId ${r.authorUserId} not found`).toBe(true);
      if (r.type === 'prescription' && r.data && 'medicines' in r.data) {
        for (const m of (r.data as any).medicines) {
          expect(medicineIds.has(m.medicineId), `Record ${r.id} medicineId ${m.medicineId} not found`).toBe(true);
        }
      }
    }

    // Check complaints
    for (const c of complaints) {
      expect(patientIds.has(c.patientId), `Complaint ${c.id} patientId ${c.patientId} not found`).toBe(true);
      expect(facilityIds.has(c.facilityId), `Complaint ${c.id} facilityId ${c.facilityId} not found`).toBe(true);
      for (const t of c.timeline) {
        expect(userIds.has(t.updatedByUserId), `Complaint ${c.id} timeline updatedByUserId ${t.updatedByUserId} not found`).toBe(true);
      }
    }

    // Check audit logs
    for (const a of auditLogs) {
      expect(userIds.has(a.actorUserId), `Audit log ${a.id} actorUserId ${a.actorUserId} not found`).toBe(true);
    }
  });

  // Invariant 2: Non-cancelled appointments never exceed slot capacity
  it('Invariant 2: Non-cancelled appointments never exceed slot capacity', () => {
    const countsBySlot = new Map<string, number>();
    for (const a of appointments) {
      if (a.status !== 'cancelled') {
        countsBySlot.set(a.slotId, (countsBySlot.get(a.slotId) || 0) + 1);
      }
    }

    for (const [sId, count] of countsBySlot.entries()) {
      const slot = slotMap.get(sId as any);
      expect(slot).toBeDefined();
      if (slot) {
        expect(count, `Slot ${slot.id} has ${count} appointments which exceeds capacity ${slot.capacity}`).toBeLessThanOrEqual(slot.capacity);
      }
    }
  });

  // Invariant 3: Token numbers per facility/department/day are unique and gapless
  it('Invariant 3: Token numbers per facility/department/day are unique and gapless', () => {
    const grouped = new Map<string, number[]>();
    for (const entry of queueEntries) {
      const key = `${entry.facilityId}:${entry.departmentCode}:${entry.date}`;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)!.push(entry.tokenNumber);
    }

    for (const [key, tokens] of grouped.entries()) {
      tokens.sort((a, b) => a - b);
      // Gapless 1..N
      for (let i = 0; i < tokens.length; i++) {
        expect(tokens[i], `Queue ${key} token at index ${i} is ${tokens[i]}, expected ${i + 1}`).toBe(i + 1);
      }
    }
  });

  // Invariant 4: Inventory currentQuantity equals the sum of its ledger deltas, is never negative, and idempotency keys are unique
  it('Invariant 4: Inventory currentQuantity equals the sum of its ledger deltas, is never negative, and idempotency keys are unique', () => {
    // Idempotency keys unique
    const idemKeys = new Set<string>();
    for (const l of ledgerEntries) {
      expect(idemKeys.has(l.idempotencyKey), `Duplicate idempotency key ${l.idempotencyKey}`).toBe(false);
      idemKeys.add(l.idempotencyKey);
    }

    // Ledger sum check
    const ledgerSum = new Map<string, number>();
    for (const l of ledgerEntries) {
      const key = `${l.facilityId}:${l.medicineId}`;
      ledgerSum.set(key, (ledgerSum.get(key) || 0) + l.delta);
    }

    for (const item of stockItems) {
      expect(item.currentQuantity, `StockItem for ${item.facilityId} ${item.medicineId} is negative`).toBeGreaterThanOrEqual(0);
      const key = `${item.facilityId}:${item.medicineId}`;
      const sum = ledgerSum.get(key) || 0;
      expect(item.currentQuantity, `StockItem ${key} qty ${item.currentQuantity} != ledger sum ${sum}`).toBe(sum);
    }
  });

  // Invariant 5: Every patient belongs to exactly one user, and every CITIZEN user has at least 1 patient
  it('Invariant 5: Every patient belongs to exactly one user, and every CITIZEN user has at least 1 patient', () => {
    const patientOwnerCount = new Map<string, number>();
    for (const p of patients) {
      patientOwnerCount.set(p.id, 0);
    }

    for (const u of users) {
      if (u.role === 'CITIZEN') {
        expect(u.patientIds && u.patientIds.length >= 1, `Citizen user ${u.id} has no patientIds`).toBe(true);
        if (u.patientIds) {
          for (const pid of u.patientIds) {
            patientOwnerCount.set(pid, (patientOwnerCount.get(pid) || 0) + 1);
          }
        }
      } else {
        expect(!u.patientIds || u.patientIds.length === 0, `Staff user ${u.id} has patientIds`).toBe(true);
      }
    }

    for (const [pid, count] of patientOwnerCount.entries()) {
      expect(count, `Patient ${pid} belongs to ${count} users, expected exactly 1`).toBe(1);
    }
  });

  // Invariant 6: A doctor only has clinical records/postings at facilities they are posted to
  it('Invariant 6: A doctor only has clinical records at facilities they are posted to', () => {
    for (const rec of records) {
      const author = userMap.get(rec.authorUserId);
      if (author && author.role === 'DOCTOR' && author.facilityId) {
        expect(rec.facilityId, `Record ${rec.id} facility ${rec.facilityId} != doctor facility ${author.facilityId}`).toBe(author.facilityId);
      }
    }
  });

  // Invariant 7: Analytics totals equal counts recomputed from the detail collections
  it('Invariant 7: Analytics totals equal counts recomputed from the detail collections', () => {
    for (const a of analytics) {
      const dayAppts = appointments.filter(apt => apt.facilityId === a.facilityId && apt.updatedAt.startsWith(a.date));
      const footfall = dayAppts.filter(apt => ['checked_in', 'in_consultation', 'completed'].includes(apt.status)).length;
      const noShow = dayAppts.filter(apt => apt.status === 'no_show').length;

      const stockOuts = stockItems.filter(s => s.facilityId === a.facilityId && s.status === 'out').length;
      const dayComplaints = complaints.filter(c => c.facilityId === a.facilityId && c.createdAt.startsWith(a.date));

      expect(a.stockOutCount, `Stock out mismatch for ${a.facilityId} on ${a.date}`).toBe(stockOuts);
      expect(a.footfall, `Footfall mismatch for ${a.facilityId} on ${a.date}`).toBe(footfall);
      expect(a.noShowCount, `No show count mismatch for ${a.facilityId} on ${a.date}`).toBe(noShow);
      expect(a.complaintCount, `Complaint count mismatch for ${a.facilityId} on ${a.date}`).toBe(dayComplaints.length);
    }
  });

  // Invariant 8: No string anywhere in mock data matches Aadhaar regex
  it('Invariant 8: No string anywhere in mock data matches Aadhaar regex', () => {
    const aadhaarRegex = /\b\d{4}\s?\d{4}\s?\d{4}\b/;
    const mockDir = path.resolve(process.cwd(), 'src/lib/mock-data');
    const files = fs.readdirSync(mockDir).filter(f => f.endsWith('.ts') && !f.includes('test'));

    for (const file of files) {
      const content = fs.readFileSync(path.join(mockDir, file), 'utf-8');
      const linesWithoutDocRegex = content
        .split('\n')
        .filter(l => !l.includes('/\\b\\d{4}') && !l.includes('Aadhaar'))
        .join('\n');
      const match = linesWithoutDocRegex.match(aadhaarRegex);
      expect(match, `File ${file} contains text matching Aadhaar regex: ${match?.[0]}`).toBeNull();
    }
  });

  // Invariant 9: The hero story state matches hero.ts
  it('Invariant 9: Hero story state matches hero.ts specifications', () => {
    // Sunita's appointment token 19
    expect(heroAppointment.tokenNumber).toBe(19);
    expect(heroAppointment.patientId).toBe(HERO.sunita.patientId);

    // Hero queue state: now serving 14
    expect(heroQueueState.nowServing).toBe(14);
    expect(heroQueueState.facilityId).toBe(HERO.phcId);

    // Hero medicine out at PHC and available at CHC
    const phcStock = stockItems.find(s => s.facilityId === HERO.medicine.outAtFacility && s.medicineId === HERO.medicine.id);
    expect(phcStock).toBeDefined();
    expect(phcStock?.status).toBe('out');
    expect(phcStock?.currentQuantity).toBe(0);

    const chcStock = stockItems.find(s => s.facilityId === HERO.medicine.availableAtFacility && s.medicineId === HERO.medicine.id);
    expect(chcStock).toBeDefined();
    expect(chcStock?.status).toBe('available');
    expect(chcStock!.currentQuantity).toBeGreaterThan(0);

    // Hero complaint in_review
    expect(heroComplaint.id).toBe(HERO.complaint.id);
    expect(heroComplaint.status).toBe('in_review');
    expect(heroComplaint.category).toBe('medicine_unavailable');
    expect(heroComplaint.patientId).toBe(HERO.sunita.patientId);
    expect(heroComplaint.facilityId).toBe(HERO.phcId);
  });

  // Invariant 10: Collection counts snapshot
  it('Invariant 10: Collection counts match snapshots', () => {
    expect(facilities.length).toBe(23);
    expect(patients.length).toBeGreaterThanOrEqual(100);
    expect(users.length).toBeGreaterThanOrEqual(60);
    expect(medicines.length).toBe(80);
    expect(slots.length).toBeGreaterThan(0);
    expect(appointments.length).toBeGreaterThan(0);
    expect(stockItems.length).toBe(23 * 80);
    expect(ledgerEntries.length).toBeGreaterThan(0);
    expect(queueStates.length).toBeGreaterThan(0);
    expect(queueEntries.length).toBeGreaterThan(0);
    expect(records.length).toBeGreaterThan(0);
    expect(complaints.length).toBeGreaterThan(0);
    expect(auditLogs.length).toBeGreaterThan(0);
  });
});

describe('Lane B Wave Contract & Distribution Checks', () => {

  // Check that every status in every status enum appears at least once
  it('Every status in relevant as const arrays appears at least once', () => {
    // 1. Appointment statuses
    const apptStatuses = new Set(appointments.map(a => a.status));
    for (const st of ['booked', 'checked_in', 'in_consultation', 'completed', 'cancelled', 'no_show'] as const) {
      expect(apptStatuses.has(st), `Appointment status ${st} missing from appointments`).toBe(true);
    }

    // 2. Stock statuses
    const stockStatuses = new Set(stockItems.map(s => s.status));
    for (const st of ['available', 'low', 'out'] as const) {
      expect(stockStatuses.has(st), `Stock status ${st} missing from stockItems`).toBe(true);
    }

    // 3. Complaint statuses
    const complaintStatuses = new Set(complaints.map(c => c.status));
    for (const st of ['open', 'in_review', 'escalated', 'resolved', 'closed'] as const) {
      expect(complaintStatuses.has(st), `Complaint status ${st} missing from complaints`).toBe(true);
    }

    // 4. User roles
    const userRoles = new Set(users.map(u => u.role));
    for (const r of ['CITIZEN', 'DOCTOR', 'PHARMACIST', 'FACILITY_ADMIN', 'DISTRICT_ADMIN', 'STATE_ADMIN'] as const) {
      expect(userRoles.has(r), `User role ${r} missing from users`).toBe(true);
    }

    // 5. Facility tiers
    const facilityTiers = new Set(facilities.map(f => f.tier));
    for (const t of ['sub_centre', 'phc', 'chc', 'sdh', 'dh'] as const) {
      expect(facilityTiers.has(t), `Facility tier ${t} missing from facilities`).toBe(true);
    }

    // 6. Audit action types
    const auditActions = new Set(auditLogs.map(a => a.action));
    for (const act of ['record_read', 'record_write', 'queue_transition', 'stock_change', 'break_glass'] as const) {
      expect(auditActions.has(act), `Audit action ${act} missing from auditLogs`).toBe(true);
    }
  });

  // Source scan: verify no Math.random or Date.now in any mock data source file
  it('Source scan: no Math.random or Date.now used in mock data files', () => {
    const mockDir = path.resolve(process.cwd(), 'src/lib/mock-data');
    const files = fs.readdirSync(mockDir).filter(f => f.endsWith('.ts') && !f.includes('test'));

    for (const file of files) {
      const content = fs.readFileSync(path.join(mockDir, file), 'utf-8');
      const lines = content.split('\n').filter(l => !l.startsWith(' *') && !l.startsWith('//'));
      const codeOnly = lines.join('\n');

      expect(codeOnly.includes('Math.random()'), `${file} contains Math.random()`).toBe(false);
      expect(codeOnly.includes('Date.now()'), `${file} contains Date.now()`).toBe(false);
    }
  });

  // Distribution check: no single hour holds > 25% of timed rows
  it('Distribution check: no single hour of the day holds > 25% of timed rows', () => {
    const hourCounts = new Map<string, number>();
    let totalTimed = 0;

    for (const apt of appointments) {
      if (apt.updatedAt && apt.updatedAt.includes('T')) {
        const hour = apt.updatedAt.split('T')[1]?.slice(0, 2);
        if (hour) {
          hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);
          totalTimed++;
        }
      }
    }

    expect(totalTimed).toBeGreaterThan(0);
    for (const [hour, count] of hourCounts.entries()) {
      const share = count / totalTimed;
      expect(share, `Hour ${hour} holds ${(share * 100).toFixed(1)}% of appointments, expected <= 25%`).toBeLessThanOrEqual(0.25);
    }
  });

  // Audit log check: exactly ONE break-glass entry with a reason
  it('Audit log check: exactly one break-glass entry with a reason', () => {
    const breakGlassEntries = auditLogs.filter(a => a.action === 'break_glass');
    expect(breakGlassEntries.length).toBe(1);
    expect(breakGlassEntries[0].breakGlassReason).toBeDefined();
    expect(breakGlassEntries[0].breakGlassReason!.length).toBeGreaterThan(10);
  });
});
