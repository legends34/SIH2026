/**
 * audit.ts — DPDP Act compliance audit trail
 * Reads users, records, queue, inventory to maintain actor and timestamp consistency.
 * Includes exactly one break-glass emergency access record.
 * // TODO(backend): GET /api/v1/audit (endpoint pending Lane D)
 */

import type { AuditLogEntry, UserId } from '@/types';
import { auditId } from './_ids';
import { createRng } from './_rng';
import { at } from './_clock';
import { HERO } from './hero';
import { users } from './users';
import { records } from './records';
import { queueEntries } from './queue';
import { ledgerEntries } from './inventory';

const rng = createRng('audit');

let currentCounter = 1;
const logs: AuditLogEntry[] = [];

// 1. Record writes — each recorded health record has a corresponding audit write
for (const rec of records.slice(0, 45)) {
  logs.push({
    id: auditId(currentCounter++),
    action: 'record_write',
    actorUserId: rec.authorUserId,
    targetEntityId: rec.id,
    targetEntityType: 'health_record',
    ipAddress: `10.24.${rng.int(1, 20)}.${rng.int(10, 200)}`,
    occurredAt: rec.recordedAt,
  });
}

// 2. Record reads — doctors and citizen users viewing records
const staffDoctors = users.filter(u => u.role === 'DOCTOR');
for (const rec of records.slice(0, 35)) {
  const doctor = staffDoctors.length > 0 ? rng.pick(staffDoctors) : { id: HERO.doctor.userId };
  logs.push({
    id: auditId(currentCounter++),
    action: 'record_read',
    actorUserId: doctor.id,
    targetEntityId: rec.id,
    targetEntityType: 'health_record',
    ipAddress: `10.24.${rng.int(1, 20)}.${rng.int(10, 200)}`,
    occurredAt: rec.recordedAt,
  });
}

// 3. Queue transitions — clinic staff updating token queue states
const facilityAdmins = users.filter(u => u.role === 'FACILITY_ADMIN');
for (const qEntry of queueEntries.slice(0, 30)) {
  const actorId: UserId = facilityAdmins.length > 0 ? rng.pick(facilityAdmins).id : HERO.doctor.userId;
  const hour = rng.pick(['09:15', '10:00', '11:30', '12:15', '16:00', '17:15']);
  logs.push({
    id: auditId(currentCounter++),
    action: 'queue_transition',
    actorUserId: actorId,
    targetEntityId: `${qEntry.facilityId}:${qEntry.departmentCode}:${qEntry.date}:${qEntry.tokenNumber}`,
    targetEntityType: 'queue_entry',
    ipAddress: `10.24.${rng.int(1, 20)}.${rng.int(10, 200)}`,
    occurredAt: at(0, hour),
  });
}

// 4. Stock changes — pharmacist dispensing or receiving ledger events
const pharmacists = users.filter(u => u.role === 'PHARMACIST');
for (const entry of ledgerEntries.slice(0, 30)) {
  const actorId: UserId = pharmacists.length > 0 ? rng.pick(pharmacists).id : HERO.pharmacist.userId;
  logs.push({
    id: auditId(currentCounter++),
    action: 'stock_change',
    actorUserId: actorId,
    targetEntityId: entry.id,
    targetEntityType: 'stock_ledger',
    ipAddress: `10.24.${rng.int(1, 20)}.${rng.int(10, 200)}`,
    occurredAt: entry.recordedAt,
  });
}

// 5. Exactly ONE break-glass emergency access
logs.push({
  id: auditId(currentCounter++),
  action: 'break_glass',
  actorUserId: HERO.doctor.userId,
  targetEntityId: HERO.ramesh.patientId,
  targetEntityType: 'patient_record',
  breakGlassReason: 'Emergency acute hypertensive crisis: unconscious patient arrived without next-of-kin consent',
  ipAddress: '10.24.5.12',
  occurredAt: at(-2, '11:45'),
});

// Sort audit logs chronologically
logs.sort((a, b) => a.occurredAt.localeCompare(b.occurredAt));

// TODO(backend): GET /api/v1/audit (endpoint pending Lane D)
export const auditLogs: AuditLogEntry[] = logs;

// TODO(backend): GET /api/v1/audit/:id (endpoint pending Lane D)
export const auditMap: Map<string, AuditLogEntry> = new Map(logs.map(a => [a.id, a]));

// TODO(backend): GET /api/v1/audit?targetEntityId=:id (endpoint pending Lane D)
export function getAuditLogsForEntity(entityId: string): AuditLogEntry[] {
  return auditLogs.filter(a => a.targetEntityId === entityId);
}

// TODO(backend): GET /api/v1/audit?actorUserId=:id (endpoint pending Lane D)
export function getAuditLogsByActor(actorUserId: UserId): AuditLogEntry[] {
  return auditLogs.filter(a => a.actorUserId === actorUserId);
}
