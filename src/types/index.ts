/**
 * src/types/index.ts — Lane B Data Contracts v1
 * The single source of truth for all data shapes across every lane.
 * DO NOT edit without going through the B9 change process.
 */

// ─────────────────────────────────────────────
// ID Types — template literals catch wrong-type mistakes at compile time
// ─────────────────────────────────────────────

export type FacilityId    = `fac_${string}`;
export type PatientId     = `pat_${string}`;
export type UserId        = `usr_${string}`;
export type AppointmentId = `appt_${string}`;
export type SlotId        = `slot_${string}`;
export type MedicineId    = `med_${string}`;
export type ComplaintId   = `cmp_${string}`;
export type RecordId      = `rec_${string}`;
export type AuditId       = `aud_${string}`;
export type DepartmentCode = string;

// ─────────────────────────────────────────────
// Date / Time — always strings, always +05:30
// ─────────────────────────────────────────────

/** Plain date string, e.g. "2026-09-15" */
export type IsoDate = string;
/** Date-time string with IST offset, e.g. "2026-09-15T09:30:00+05:30" */
export type IsoDateTime = string;

// ─────────────────────────────────────────────
// Enum Constants — every union comes from an as const array
// ─────────────────────────────────────────────

export const USER_ROLES = [
  'CITIZEN', 'DOCTOR', 'PHARMACIST', 'FACILITY_ADMIN', 'DISTRICT_ADMIN', 'STATE_ADMIN'
] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const FACILITY_TIERS = ['sub_centre', 'phc', 'chc', 'sdh', 'dh'] as const;
export type FacilityTier = (typeof FACILITY_TIERS)[number];

export const APPOINTMENT_STATUSES = [
  'booked', 'checked_in', 'in_consultation', 'completed', 'cancelled', 'no_show'
] as const;
export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];

export const STOCK_STATUSES = ['available', 'low', 'out'] as const;
export type StockStatus = (typeof STOCK_STATUSES)[number];

export const COMPLAINT_STATUSES = ['open', 'in_review', 'escalated', 'resolved', 'closed'] as const;
export type ComplaintStatus = (typeof COMPLAINT_STATUSES)[number];

export const COMPLAINT_CATEGORIES = [
  'medicine_unavailable', 'long_wait', 'staff_behaviour', 'cleanliness',
  'equipment_failure', 'billing', 'other'
] as const;
export type ComplaintCategory = (typeof COMPLAINT_CATEGORIES)[number];

export const SEVERITY_LEVELS = ['low', 'medium', 'high', 'critical'] as const;
export type SeverityLevel = (typeof SEVERITY_LEVELS)[number];

export const LEDGER_EVENT_TYPES = ['receipt', 'dispense', 'adjustment', 'expiry'] as const;
export type LedgerEventType = (typeof LEDGER_EVENT_TYPES)[number];

export const AUDIT_ACTION_TYPES = [
  'record_read', 'record_write', 'queue_transition', 'stock_change', 'break_glass'
] as const;
export type AuditActionType = (typeof AUDIT_ACTION_TYPES)[number];

export const URGENCY_BANDS = ['self_care', 'routine', 'urgent', 'emergency'] as const;
export type UrgencyBand = (typeof URGENCY_BANDS)[number];

export const SEX_VALUES = ['M', 'F', 'O'] as const;
export type Sex = (typeof SEX_VALUES)[number];

// Triage vocabulary — mirrors docs/triage/vocabulary.md
export const DEPARTMENT_CODES = [
  'general_opd', 'maternal_child_health', 'paediatrics',
  'obstetrics', 'general_surgery', 'dental', 'emergency'
] as const;

export const SYMPTOM_IDS = [
  'fever', 'cough', 'breathlessness', 'chest_pain', 'headache',
  'vomiting', 'diarrhoea', 'abdominal_pain', 'rash', 'injury',
  'bleeding', 'unconscious', 'convulsion', 'eye_problem', 'ear_problem'
] as const;
export type SymptomId = (typeof SYMPTOM_IDS)[number];

export const RED_FLAG_RULE_IDS = [
  'unconscious_adult', 'convulsion_child', 'heavy_bleeding',
  'breathlessness_severe', 'chest_pain_adult'
] as const;
export type RedFlagRuleId = (typeof RED_FLAG_RULE_IDS)[number];

// ─────────────────────────────────────────────
// Core Entities
// ─────────────────────────────────────────────

/** A patient managed within a citizen account */
export interface Patient {
  id: PatientId;
  /** Display name */
  name: string;
  /** Date of birth as ISO date string */
  dob: IsoDate;
  sex: Sex;
  /** Only last 4 digits. Never the full Aadhaar number. */
  aadhaarLast4?: string;
  /** Primary language for communications */
  preferredLanguage: string;
}

/** A registered user account */
export interface User {
  id: UserId;
  phone: string;
  role: UserRole;
  /** Only present when role === 'CITIZEN'. At least 1 patient. */
  patientIds?: PatientId[];
  /** Only present for staff roles */
  facilityId?: FacilityId;
  /** Department the staff member works in */
  departmentCode?: DepartmentCode;
  registeredAt: IsoDateTime;
}

/** A government health facility */
export interface Facility {
  id: FacilityId;
  name: string;
  tier: FacilityTier;
  district: string;
  taluka: string;
  pincode: string;
  latitude: number;
  longitude: number;
  /** Departments active at this facility */
  departments: DepartmentCode[];
  /** False means name was not verified on an official government source */
  verified: boolean;
}

/** A session-block appointment slot */
export interface Slot {
  id: SlotId;
  facilityId: FacilityId;
  departmentCode: DepartmentCode;
  date: IsoDate;
  startTime: string; // "HH:MM"
  endTime: string;   // "HH:MM"
  /** Maximum patients this session can serve */
  capacity: number;
  bookedCount: number;
}

/** A patient appointment */
export interface Appointment {
  id: AppointmentId;
  slotId: SlotId;
  patientId: PatientId;
  facilityId: FacilityId;
  departmentCode: DepartmentCode;
  /** Token number in the facility's daily sequence */
  tokenNumber: number;
  status: AppointmentStatus;
  /** True if patient walked in without prior booking */
  isWalkIn: boolean;
  bookedAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

/** A medicine from India's National List of Essential Medicines */
export interface Medicine {
  id: MedicineId;
  genericName: string;
  strength: string;
  dosageForm: string;
  therapeuticCategory: string;
  /** NLEM schedule level */
  nlemLevel: string;
}

/** Stock of a medicine at a facility */
export interface StockItem {
  medicineId: MedicineId;
  facilityId: FacilityId;
  currentQuantity: number;
  status: StockStatus;
  lastUpdatedAt: IsoDateTime;
  /** Idempotency key for the last ledger event */
  lastIdempotencyKey: string;
}

/** A single entry in the stock ledger */
export interface LedgerEntry {
  id: string;
  medicineId: MedicineId;
  facilityId: FacilityId;
  eventType: LedgerEventType;
  /** Positive for receipt, negative for dispense/expiry/adjustment */
  delta: number;
  idempotencyKey: string;
  recordedAt: IsoDateTime;
}

/** Current queue state for a facility/department on a given day */
export interface QueueState {
  facilityId: FacilityId;
  departmentCode: DepartmentCode;
  date: IsoDate;
  /** Token number currently being served */
  nowServing: number;
  /** Last token issued today */
  lastToken: number;
  /** Rolling average minutes per patient in the last hour */
  avgServiceTimeMinutes: number;
  updatedAt: IsoDateTime;
}

/** A queue entry for one token */
export interface QueueEntry {
  facilityId: FacilityId;
  departmentCode: DepartmentCode;
  date: IsoDate;
  tokenNumber: number;
  patientId: PatientId;
  appointmentId?: AppointmentId; // absent for walk-ins
  calledAt?: IsoDateTime;
  completedAt?: IsoDateTime;
}

/** A patient health record: consultation, prescription, lab report, or vaccination */
export interface HealthRecord {
  id: RecordId;
  patientId: PatientId;
  facilityId: FacilityId;
  authorUserId: UserId;
  appointmentId?: AppointmentId;
  type: 'consultation' | 'prescription' | 'lab_report' | 'vaccination';
  recordedAt: IsoDateTime;
  /** Structured clinical data — shape depends on type */
  data: ConsultationData | PrescriptionData | LabReportData | VaccinationData;
}

export interface ConsultationData {
  chiefComplaint: string;
  vitals: {
    weightKg?: number;
    heightCm?: number;
    tempCelsius?: number;
    bpSystolic?: number;
    bpDiastolic?: number;
    pulsePerMin?: number;
    spo2Percent?: number;
  };
  clinicalNotes?: string;
  diagnosisCodes?: string[];
}

export interface PrescriptionData {
  medicines: Array<{
    medicineId: MedicineId;
    dosage: string;
    frequency: string;
    durationDays: number;
    instructions?: string;
  }>;
}

export interface LabReportData {
  testName: string;
  results: Array<{ parameter: string; value: string; unit: string; referenceRange: string }>;
  reportedAt: IsoDateTime;
}

export interface VaccinationData {
  vaccineName: string;
  /** Age at which vaccine was given, in months */
  ageMonths: number;
  batchNumber: string;
  nextDoseDate?: IsoDate;
}

/** A citizen complaint about a facility or service */
export interface Complaint {
  id: ComplaintId;
  patientId: PatientId;
  facilityId: FacilityId;
  category: ComplaintCategory;
  severity: SeverityLevel;
  status: ComplaintStatus;
  description: string;
  /** SLA deadline for resolution */
  slaDueAt: IsoDate;
  /** Append-only list of status updates */
  timeline: Array<{
    status: ComplaintStatus;
    note: string;
    updatedAt: IsoDateTime;
    updatedByUserId: UserId;
  }>;
  createdAt: IsoDateTime;
}

/** An audit log entry for DPDP compliance */
export interface AuditLogEntry {
  id: AuditId;
  action: AuditActionType;
  actorUserId: UserId;
  targetEntityId: string;
  targetEntityType: string;
  /** Required when action === 'break_glass' */
  breakGlassReason?: string;
  ipAddress?: string;
  occurredAt: IsoDateTime;
}

// ─────────────────────────────────────────────
// Triage Types
// ─────────────────────────────────────────────

export interface TriageInput {
  patientId: PatientId;
  /** Patient age in months (handles infants precisely) */
  ageMonths: number;
  sex: Sex;
  pregnant?: boolean;
  symptomIds: SymptomId[];
  /** Optional free text in patient's language — for display only, never parsed */
  freeText?: string;
  language: string;
  location?: { latitude: number; longitude: number };
}

/**
 * TriageResult — NO free-text clinical string fields.
 * All outputs are structured IDs and numbers so they can be validated,
 * translated, and audited. See Decision 9 in docs/decisions.md.
 */
export interface TriageResult {
  urgency: UrgencyBand;
  departmentCode: DepartmentCode;
  /** Confidence of the recommendation, 0 (low) to 1 (high) */
  confidence: number;
  recommendedFacilityIds: FacilityId[];
  firedRuleIds: RedFlagRuleId[];
  matchedSymptomIds: SymptomId[];
}

// ─────────────────────────────────────────────
// Analytics Aggregates
// ─────────────────────────────────────────────

/** Daily analytics aggregate for admin dashboards */
export interface DailyAnalytics {
  date: IsoDate;
  facilityId: FacilityId;
  footfall: number;
  avgWaitMinutes: number;
  noShowCount: number;
  noShowRate: number;
  stockOutCount: number;
  complaintCount: number;
  complaintSlaBreachCount: number;
}

// ─────────────────────────────────────────────
// Deferred Screens (minimal stubs — to be expanded post-P0)
// ─────────────────────────────────────────────

export interface TeleconsultSession {
  id: `tele_${string}`;
  patientId: PatientId;
  doctorUserId: UserId;
  scheduledAt: IsoDateTime;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
}

export interface DiagnosticOrder {
  id: `diag_${string}`;
  patientId: PatientId;
  facilityId: FacilityId;
  testName: string;
  orderedAt: IsoDateTime;
  status: 'ordered' | 'sample_collected' | 'processing' | 'reported';
}

export interface FollowUp {
  id: `fu_${string}`;
  patientId: PatientId;
  facilityId: FacilityId;
  relatedRecordId: RecordId;
  scheduledDate: IsoDate;
  notes?: string;
}
