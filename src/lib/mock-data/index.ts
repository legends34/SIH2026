/**
 * index.ts — Single import point for all mock data
 * Usage: import { patients, appointments, heroComplaint } from '@/lib/mock-data'
 * // TODO(backend): replace each export with real API calls (Lane D)
 */

export { HERO }                            from './hero';
export { facilities }                      from './facilities';
export { patients, patientMap }            from './patients';
export { users, userMap }                  from './users';
export { slots, slotMap, HERO_SLOT }       from './slots';
export { appointments, appointmentMap,
         heroAppointment,
         getPatientAppointments,
         getTodayQueue }                   from './appointments';
export { medicines, medicineMap,
         stockItems, ledgerEntries }       from './inventory';
export { queueStates, queueEntries,
         heroQueueState, heroQueueEntries } from './queue';
export { records, recordMap,
         getPatientRecords }               from './records';
export { complaints, complaintMap,
         heroComplaint,
         getPatientComplaints }            from './complaints';
export { analytics,
         getFacilityAnalytics,
         getDistrictSummary }             from './analytics';
export { auditLogs, auditMap,
         getAuditLogsForEntity,
         getAuditLogsByActor }             from './audit';
