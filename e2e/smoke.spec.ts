/**
 * e2e/smoke.spec.ts — every route × viewport × locale.
 *
 * Guards the Definition of Done (docs/qa/definition-of-done.md) from Day 2 onward:
 *   1. loads with an OK status, no console errors, no uncaught exceptions, no failed requests
 *   2. no horizontal overflow ("no wide table breaks on a phone")
 *   3. full-page screenshot attached to the report
 *   4. axe: fail on critical violations, annotate serious ones
 *   5. built screens only: <html lang> matches the chosen locale
 *
 * Routes marked not_built in e2e/routes.ts are reported as fixme, not failures.
 */
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { HTML_LANG, LOCALES } from '@/lib/content/locales';
import { ROUTES } from './routes';
import { collectProblems } from './support/errors';
import { setLocale } from './support/locale';
import { signInAs } from './support/session';

for (const spec of ROUTES) {
  for (const locale of LOCALES) {
    test.describe(`${spec.path} · ${locale}`, () => {
      test.fixme(spec.status === 'not_built', `"${spec.screen}" is not built yet (e2e/routes.ts)`);

      test(`smoke: ${spec.screen}`, async ({ page }, testInfo) => {
        const problems = collectProblems(page);
        await setLocale(page, locale);
        await signInAs(page, spec.role);

        const response = await page.goto(spec.path, { waitUntil: 'networkidle' });

        await test.step('loads without errors', async () => {
          expect(response, 'navigation returned no response').not.toBeNull();
          expect(response!.status(), `HTTP status for ${spec.path}`).toBeLessThan(400);
          expect(problems.pageErrors, 'uncaught exceptions').toEqual([]);
          expect(problems.consoleErrors, 'console errors').toEqual([]);
          expect(problems.failedRequests, 'failed requests').toEqual([]);
        });

        await test.step('no horizontal overflow', async () => {
          const overflow = await page.evaluate(() => ({
            scrollWidth: document.documentElement.scrollWidth,
            innerWidth: window.innerWidth,
          }));
          expect(
            overflow.scrollWidth,
            `page is ${overflow.scrollWidth}px wide in a ${overflow.innerWidth}px viewport`,
          ).toBeLessThanOrEqual(overflow.innerWidth);
        });

        await test.step('screenshot', async () => {
          await testInfo.attach(`${spec.key}-${locale}.png`, {
            body: await page.screenshot({ fullPage: true }),
            contentType: 'image/png',
          });
        });

        await test.step('accessibility (axe)', async () => {
          const { violations } = await new AxeBuilder({ page }).analyze();
          for (const v of violations.filter((x) => x.impact === 'serious')) {
            testInfo.annotations.push({ type: 'a11y-serious', description: `${v.id}: ${v.help} (${v.nodes.length} nodes)` });
          }
          const critical = violations.filter((x) => x.impact === 'critical');
          expect(
            critical.map((v) => `${v.id}: ${v.help} (${v.nodes.length} nodes)`),
            'critical accessibility violations',
          ).toEqual([]);
        });

        if (spec.status === 'built') {
          await test.step('<html lang> matches locale', async () => {
            await expect(page.locator('html')).toHaveAttribute('lang', HTML_LANG[locale]);
          });
        }
      });
    });
  }
}
