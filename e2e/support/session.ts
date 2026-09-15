/**
 * Demo sign-in for a UI-only prototype.
 *
 * PROPOSED CONVENTION for Lane A (see docs/qa/testid-requests.md §2):
 *   sessionStorage["demo.session"] = JSON.stringify({ userId, role, activePatientId? })
 *
 * sessionStorage (not localStorage) is deliberate: it is per-tab, so the doctor and the
 * patient can be signed in as different people in two tabs of the SAME browser — which is
 * the only way the "call next → queue updates" demo moment can work without a backend.
 */
import type { Page } from '@playwright/test';
import { HERO } from '@/lib/mock-data/hero';
import type { Role } from '../routes';

export const SESSION_STORAGE_KEY = 'demo.session';

const HERO_USER_BY_ROLE: Record<Exclude<Role, null>, { userId: string; activePatientId?: string }> = {
  CITIZEN: { userId: HERO.sunita.userId, activePatientId: HERO.sunita.patientId },
  DOCTOR: { userId: HERO.doctor.userId },
  PHARMACIST: { userId: HERO.pharmacist.userId },
  DISTRICT_ADMIN: { userId: HERO.districtAdmin.userId },
};

/** Must be called before page.goto(). */
export async function signInAs(page: Page, role: Role, overrides: { activePatientId?: string } = {}): Promise<void> {
  if (role === null) return;
  const session = { ...HERO_USER_BY_ROLE[role], ...overrides, role };
  await page.addInitScript(
    ([key, value]) => {
      try { window.sessionStorage.setItem(key, value); } catch { /* storage blocked */ }
    },
    [SESSION_STORAGE_KEY, JSON.stringify(session)] as const,
  );
}
