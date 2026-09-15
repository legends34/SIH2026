/**
 * e2e/routes.ts — the single source of truth for every route the prototype must have.
 *
 * Owner: Lane F. Lane A implements these paths.
 * If Lane A needs a different path, change it HERE in the same PR, so tests and app never drift.
 *
 * status:
 *   'not_built'   → tests are marked fixme (reported, not failed)
 *   'placeholder' → page renders, but isn't a real screen yet: load / errors / overflow / axe only
 *   'built'       → full Definition-of-Done checks, including locale and <html lang>
 *
 * Flip a route's status in the same PR that builds the screen.
 */
import { HERO } from '@/lib/mock-data/hero';

export type Role = 'CITIZEN' | 'DOCTOR' | 'PHARMACIST' | 'DISTRICT_ADMIN' | null;
export type RouteStatus = 'not_built' | 'placeholder' | 'built';

export interface RouteSpec {
  /** Stable key used by demo-path.spec.ts and docs/qa/matrix.md */
  key: string;
  /** Concrete path to visit (dynamic segments filled with hero fixtures) */
  path: string;
  /** Screen name as written in docs/DELEGATION_BRIEF.md §5 */
  screen: string;
  /** Who must be signed in to view it; null = public */
  role: Role;
  /** Demo-path step number from the brief, or null if not on the demo path */
  demoStep: number | null;
  /** P0 = on the demo path or required; deferred = after P0 */
  priority: 'P0' | 'deferred';
  status: RouteStatus;
}

export const ROUTES: readonly RouteSpec[] = [
  // ── Scaffold ────────────────────────────────────────────────────────────────
  { key: 'root', path: '/', screen: 'Root (redirects to language select)', role: null, demoStep: null, priority: 'P0', status: 'placeholder' },

  // ── Auth ────────────────────────────────────────────────────────────────────
  { key: 'auth.language', path: '/auth/language', screen: 'Language select', role: null, demoStep: 1, priority: 'P0', status: 'not_built' },
  { key: 'auth.login', path: '/auth/login', screen: 'Login', role: null, demoStep: 1, priority: 'P0', status: 'not_built' },
  { key: 'auth.otp', path: '/auth/otp', screen: 'OTP', role: null, demoStep: 1, priority: 'P0', status: 'not_built' },

  // ── Patient ─────────────────────────────────────────────────────────────────
  { key: 'patient.home', path: '/patient', screen: 'Patient home', role: 'CITIZEN', demoStep: 2, priority: 'P0', status: 'not_built' },
  { key: 'patient.triage', path: '/patient/triage', screen: 'Triage input', role: 'CITIZEN', demoStep: 3, priority: 'P0', status: 'not_built' },
  { key: 'patient.triageResult', path: '/patient/triage/result', screen: 'Triage result + emergency overlay', role: 'CITIZEN', demoStep: 4, priority: 'P0', status: 'not_built' },
  { key: 'patient.facilities', path: '/patient/facilities', screen: 'Facility list', role: 'CITIZEN', demoStep: 5, priority: 'P0', status: 'not_built' },
  { key: 'patient.facilityDetail', path: `/patient/facilities/${HERO.phcId}`, screen: 'Facility detail', role: 'CITIZEN', demoStep: 5, priority: 'P0', status: 'not_built' },
  { key: 'patient.book', path: `/patient/book/${HERO.phcId}`, screen: 'Booking wizard', role: 'CITIZEN', demoStep: 6, priority: 'P0', status: 'not_built' },
  { key: 'patient.appointment', path: `/patient/appointments/${HERO.appointment.id}`, screen: 'Token receipt', role: 'CITIZEN', demoStep: 6, priority: 'P0', status: 'not_built' },
  { key: 'patient.queue', path: `/patient/queue/${HERO.phcId}`, screen: 'Live queue', role: 'CITIZEN', demoStep: 7, priority: 'P0', status: 'not_built' },
  { key: 'patient.records', path: '/patient/records', screen: 'Records timeline', role: 'CITIZEN', demoStep: 10, priority: 'P0', status: 'not_built' },
  { key: 'patient.medicines', path: '/patient/medicines', screen: 'Medicine search', role: 'CITIZEN', demoStep: 11, priority: 'P0', status: 'not_built' },
  { key: 'patient.complaintNew', path: '/patient/complaints/new', screen: 'File complaint', role: 'CITIZEN', demoStep: 13, priority: 'P0', status: 'not_built' },
  { key: 'patient.complaintPreview', path: '/patient/complaints/new/preview', screen: 'Complaint preview', role: 'CITIZEN', demoStep: 13, priority: 'P0', status: 'not_built' },
  { key: 'patient.complaintTrack', path: `/patient/complaints/${HERO.complaint.id}`, screen: 'Complaint tracker', role: 'CITIZEN', demoStep: 13, priority: 'P0', status: 'not_built' },
  { key: 'patient.profile', path: '/patient/profile', screen: 'Profile + ABHA link stub', role: 'CITIZEN', demoStep: null, priority: 'P0', status: 'not_built' },

  // ── Doctor ──────────────────────────────────────────────────────────────────
  { key: 'doctor.opd', path: '/doctor', screen: 'OPD queue', role: 'DOCTOR', demoStep: 8, priority: 'P0', status: 'not_built' },
  { key: 'doctor.consult', path: `/doctor/consult/${HERO.appointment.id}`, screen: 'Consultation + prescription', role: 'DOCTOR', demoStep: 9, priority: 'P0', status: 'not_built' },

  // ── Pharmacist ──────────────────────────────────────────────────────────────
  { key: 'pharmacist.inventory', path: '/pharmacist', screen: 'Inventory update', role: 'PHARMACIST', demoStep: 12, priority: 'P0', status: 'not_built' },

  // ── Admin ───────────────────────────────────────────────────────────────────
  { key: 'admin.analytics', path: '/admin', screen: 'Admin analytics (both tabs)', role: 'DISTRICT_ADMIN', demoStep: 14, priority: 'P0', status: 'not_built' },

  // ── Deferred (brief §5 "Deferred, and why") ─────────────────────────────────
  { key: 'patient.teleconsult', path: `/patient/teleconsult/${HERO.appointment.id}`, screen: 'Teleconsult waiting room', role: 'CITIZEN', demoStep: null, priority: 'deferred', status: 'not_built' },
  { key: 'doctor.teleconsult', path: `/doctor/teleconsult/${HERO.appointment.id}`, screen: 'Teleconsult call', role: 'DOCTOR', demoStep: null, priority: 'deferred', status: 'not_built' },
  { key: 'patient.diagnostics', path: '/patient/diagnostics', screen: 'Diagnostic order tracking', role: 'CITIZEN', demoStep: null, priority: 'deferred', status: 'not_built' },
  { key: 'patient.followUp', path: '/patient/follow-up', screen: 'Follow-up check-in', role: 'CITIZEN', demoStep: null, priority: 'deferred', status: 'not_built' },
  { key: 'doctor.referrals', path: '/doctor/referrals', screen: 'Referrals', role: 'DOCTOR', demoStep: null, priority: 'deferred', status: 'not_built' },
  { key: 'admin.audit', path: '/admin/audit', screen: 'Audit log', role: 'DISTRICT_ADMIN', demoStep: null, priority: 'deferred', status: 'not_built' },
  { key: 'admin.users', path: '/admin/users', screen: 'User management', role: 'DISTRICT_ADMIN', demoStep: null, priority: 'deferred', status: 'not_built' },
] as const;

export function route(key: string): RouteSpec {
  const found = ROUTES.find((r) => r.key === key);
  if (!found) throw new Error(`Unknown route key "${key}" — add it to e2e/routes.ts`);
  return found;
}

export function isBuilt(key: string): boolean {
  return route(key).status === 'built';
}
