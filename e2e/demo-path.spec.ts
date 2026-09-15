/**
 * e2e/demo-path.spec.ts — walks docs/demo-script.md step by step, asserting what the judge
 * should notice. This is the regression guard for the six minutes that matter most.
 *
 * Each step is independent (it navigates straight to its screen with hero fixtures), so one
 * broken step never hides the others. A step stays test.fixme until its route is 'built'
 * in e2e/routes.ts. Zero fixme is a freeze requirement (docs/qa/freeze-checklist.md).
 *
 * Selectors are data-testid values Lane F has requested in docs/qa/testid-requests.md.
 * Video is recorded for this spec only (playwright.config.ts).
 */
import { test, expect, type Page } from '@playwright/test';
import { BANNED_TERMS } from '@/lib/content/banned';
import type { Locale } from '@/lib/content/locales';
import { HERO } from '@/lib/mock-data/hero';
import { isBuilt, route } from './routes';
import { setLocale } from './support/locale';
import { signInAs } from './support/session';

/** The demo runs in the hero patient's own language (src/lib/mock-data/hero.ts). */
const DEMO_LOCALE = HERO.sunita.language as Locale;

async function openAs(page: Page, key: string, role: Parameters<typeof signInAs>[1], opts: { activePatientId?: string } = {}) {
  await setLocale(page, DEMO_LOCALE);
  await signInAs(page, role, opts);
  await page.goto(route(key).path);
}

/** The system must never name a condition on triage or emergency screens. */
async function expectNoDiagnosisLanguage(page: Page, testId: string) {
  const text = (await page.getByTestId(testId).innerText()).toLowerCase();
  const hits = [...BANNED_TERMS.en, ...BANNED_TERMS[DEMO_LOCALE]].filter((term) => text.includes(term.toLowerCase()));
  expect(hits, `banned diagnosis/reassurance terms on ${testId}`).toEqual([]);
}

test.describe('Demo path', () => {
  test('step 01 · language select → login → OTP', async ({ page }) => {
    test.fixme(!isBuilt('auth.language') || !isBuilt('auth.login') || !isBuilt('auth.otp'), 'auth screens not built');
    await setLocale(page, 'en');
    await page.goto(route('auth.language').path);
    await page.getByTestId(`lang-option-${DEMO_LOCALE}`).click();
    await expect(page).toHaveURL(new RegExp(route('auth.login').path));
    await page.getByTestId('auth-phone-input').fill('+91 90000 00001');
    await page.getByTestId('auth-send-otp').click();
    await expect(page).toHaveURL(new RegExp(route('auth.otp').path));
    await page.getByTestId('auth-otp-input').fill('123456');
    await page.getByTestId('auth-verify').click();
    await expect(page).toHaveURL(new RegExp(`${route('patient.home').path}$`));
  });

  test('step 02 · patient home shows the shared-phone household and today\'s token', async ({ page }) => {
    test.fixme(!isBuilt('patient.home'), 'patient home not built');
    await openAs(page, 'patient.home', 'CITIZEN');
    await expect(page.getByTestId('home-next-appointment')).toContainText(String(HERO.appointment.tokenNumber));
    // 1:N accounts: Sunita manages herself, Ramesh and Aarav
    await expect(page.getByTestId('patient-switcher-option')).toHaveCount(3);
  });

  test('step 03 · triage routes a routine presentation, never names a condition', async ({ page }) => {
    test.fixme(!isBuilt('patient.triage') || !isBuilt('patient.triageResult'), 'triage screens not built');
    await openAs(page, 'patient.triage', 'CITIZEN');
    for (const symptom of ['cough', 'sore_throat', 'body_ache']) {
      await page.getByTestId(`symptom-chip-${symptom}`).click();
    }
    await page.getByTestId('triage-submit').click();
    await expect(page.getByTestId('triage-result-card')).toBeVisible();
    await expect(page.getByTestId('triage-urgency')).toHaveAttribute('data-urgency', /^(routine|self-care|urgent)$/);
    await expect(page.getByTestId('triage-disclaimer')).toBeVisible();
    await expect(page.getByTestId('emergency-overlay')).toHaveCount(0);
    expect(await page.getByTestId('triage-facility-card').count()).toBeGreaterThan(0);
    await expectNoDiagnosisLanguage(page, 'triage-result-card');
  });

  test('step 04 · red-flag input shows the emergency overlay immediately', async ({ page }) => {
    test.fixme(!isBuilt('patient.triage') || !isBuilt('patient.triageResult'), 'triage screens not built');
    // In the script, Sunita switches the active patient to Ramesh for this step.
    await openAs(page, 'patient.triage', 'CITIZEN', { activePatientId: HERO.ramesh.patientId });
    await page.getByTestId('symptom-chip-chest_pain_radiating').click();
    await page.getByTestId('symptom-chip-chest_pain_with_sweating').click();
    await page.getByTestId('triage-submit').click();
    // The overlay must not wait behind any other step (docs/triage/README.md).
    await expect(page.getByTestId('emergency-overlay')).toBeVisible({ timeout: 1_000 });
    await expect(page.getByTestId('emergency-call-108')).toHaveAttribute('href', 'tel:108');
    await expectNoDiagnosisLanguage(page, 'emergency-overlay');
  });

  test('step 05 · facility list → Sunita\'s PHC', async ({ page }) => {
    test.fixme(!isBuilt('patient.facilities') || !isBuilt('patient.facilityDetail'), 'facility screens not built');
    await openAs(page, 'patient.facilities', 'CITIZEN');
    await page.getByTestId(`facility-card-${HERO.phcId}`).click();
    await expect(page).toHaveURL(new RegExp(route('patient.facilityDetail').path));
    await expect(page.getByTestId('facility-name')).toBeVisible();
    await expect(page.getByTestId('facility-tier')).toBeVisible();
  });

  test('step 06 · booking wizard → token receipt', async ({ page }) => {
    test.fixme(!isBuilt('patient.book') || !isBuilt('patient.appointment'), 'booking screens not built');
    await openAs(page, 'patient.book', 'CITIZEN');
    await page.getByTestId(`department-option-${HERO.appointment.department}`).click();
    await page.getByTestId('slot-option').first().click();
    await page.getByTestId('booking-confirm').click();
    await expect(page.getByTestId('token-number')).toBeVisible();

    // The hero receipt the demo actually shows
    await page.goto(route('patient.appointment').path);
    await expect(page.getByTestId('token-number')).toHaveText(String(HERO.appointment.tokenNumber));
  });

  test('step 07 · live queue shows token, now serving and ETA', async ({ page }) => {
    test.fixme(!isBuilt('patient.queue'), 'live queue not built');
    await openAs(page, 'patient.queue', 'CITIZEN');
    await expect(page.getByTestId('queue-now-serving')).toHaveText(String(HERO.appointment.nowServing));
    await expect(page.getByTestId('queue-my-token')).toHaveText(String(HERO.appointment.tokenNumber));
    await expect(page.getByTestId('queue-eta')).toBeVisible();
  });

  test('step 08 · doctor "call next" updates the patient\'s queue in under 2 s', async ({ context }) => {
    test.fixme(!isBuilt('doctor.opd') || !isBuilt('patient.queue'), 'OPD queue or live queue not built');
    // Two tabs, same browser: the only setup where a UI-only prototype can sync (BroadcastChannel).
    const doctor = await context.newPage();
    const patient = await context.newPage();
    await openAs(patient, 'patient.queue', 'CITIZEN');
    await openAs(doctor, 'doctor.opd', 'DOCTOR');

    const before = HERO.appointment.nowServing;
    await expect(patient.getByTestId('queue-now-serving')).toHaveText(String(before));
    await doctor.getByTestId('opd-call-next').click();
    await expect(patient.getByTestId('queue-now-serving')).toHaveText(String(before + 1), { timeout: 2_000 });
  });

  test('step 09 · consultation with prescription and live stock indicator', async ({ page }) => {
    test.fixme(!isBuilt('doctor.consult'), 'consultation screen not built');
    // Sunita's consultation (hero appointment). Metformin belongs to Ramesh's story (steps 10–13),
    // so this step only proves the live stock indicator appears for whatever is prescribed.
    await openAs(page, 'doctor.consult', 'DOCTOR');
    await page.getByTestId('consult-vitals-bp').fill('118/76');
    await page.getByTestId('rx-medicine-search').fill('Paracetamol');
    await page.locator('[data-testid^="rx-medicine-option-"]').first().click();
    await expect(page.locator('[data-testid^="rx-stock-indicator-"]').first()).toHaveAttribute(
      'data-stock-status',
      /^(available|low|out)$/,
    );
    await page.getByTestId('consult-save').click();
    await expect(page.getByTestId('consult-saved')).toBeVisible();
  });

  test('step 10 · records timeline for Ramesh on the shared account', async ({ page }) => {
    test.fixme(!isBuilt('patient.records'), 'records timeline not built');
    await openAs(page, 'patient.records', 'CITIZEN', { activePatientId: HERO.ramesh.patientId });
    // Lane B: Ramesh has a timeline of 8+ entries
    expect(await page.getByTestId('record-entry').count()).toBeGreaterThanOrEqual(8);
  });

  test('step 11 · medicine search: out at the PHC, available at the CHC', async ({ page }) => {
    test.fixme(!isBuilt('patient.medicines'), 'medicine search not built');
    await openAs(page, 'patient.medicines', 'CITIZEN');
    await page.getByTestId('medicine-search-input').fill(HERO.medicine.name);
    await expect(page.getByTestId(`medicine-result-${HERO.phcId}`)).toHaveAttribute('data-stock-status', 'out');
    await expect(page.getByTestId(`medicine-result-${HERO.chcId}`)).toHaveAttribute('data-stock-status', 'available');
    await expect(page.getByTestId(`medicine-result-${HERO.chcId}`)).toContainText(String(HERO.medicine.distanceKm));
  });

  test('step 12 · pharmacist updates stock', async ({ page }) => {
    test.fixme(!isBuilt('pharmacist.inventory'), 'pharmacist inventory not built');
    await openAs(page, 'pharmacist.inventory', 'PHARMACIST');
    const row = page.getByTestId(`inventory-row-${HERO.medicine.id}`);
    await expect(row).toHaveAttribute('data-stock-status', 'out');
    await row.getByTestId('inventory-quantity-input').fill('200');
    await row.getByTestId('inventory-save').click();
    await expect(row).toHaveAttribute('data-stock-status', 'available');
  });

  test('step 13 · complaint: file → editable preview → track', async ({ page }) => {
    test.fixme(
      !isBuilt('patient.complaintNew') || !isBuilt('patient.complaintPreview') || !isBuilt('patient.complaintTrack'),
      'complaint screens not built',
    );
    await openAs(page, 'patient.complaintNew', 'CITIZEN');
    await page.getByTestId('complaint-narrative').fill('Metformin was not available at the PHC for two weeks.');
    await page.getByTestId('complaint-generate').click();
    await expect(page).toHaveURL(new RegExp(route('patient.complaintPreview').path));
    // Every AI-assisted field must be editable before submission
    await expect(page.getByTestId('complaint-field-category')).toBeEditable();
    await expect(page.getByTestId('complaint-field-severity')).toBeEditable();

    await page.goto(route('patient.complaintTrack').path);
    await expect(page.getByTestId('complaint-status')).toHaveAttribute('data-status', HERO.complaint.status);
    await expect(page.getByTestId('complaint-sla')).toBeVisible();
    await expect(page.getByTestId('complaint-timeline-entry').first()).toBeVisible();
  });

  test('step 14 · admin analytics, both tabs', async ({ page }) => {
    test.fixme(!isBuilt('admin.analytics'), 'admin analytics not built');
    await openAs(page, 'admin.analytics', 'DISTRICT_ADMIN');
    for (const kpi of ['kpi-footfall', 'kpi-avg-wait', 'kpi-no-show', 'kpi-stockouts', 'kpi-open-complaints']) {
      await expect(page.getByTestId(kpi)).toBeVisible();
    }
    await page.getByTestId('analytics-tab-clinical').click();
    await expect(page.getByTestId('analytics-panel-clinical')).toBeVisible();
    await page.getByTestId('analytics-tab-operational').click();
    await expect(page.getByTestId('analytics-panel-operational')).toBeVisible();
  });
});
