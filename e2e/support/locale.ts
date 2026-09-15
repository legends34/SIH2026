/**
 * Set the UI locale before the page loads.
 *
 * Lane E's src/lib/content/index.ts persists the choice under localStorage["locale"],
 * but does not export that key. Requested in docs/qa/testid-requests.md §2 — once exported,
 * import it here instead of repeating the string.
 */
import type { Page } from '@playwright/test';
import type { Locale } from '@/lib/content/locales';

export const LOCALE_STORAGE_KEY = 'locale';

/** Must be called before page.goto(). */
export async function setLocale(page: Page, locale: Locale): Promise<void> {
  await page.addInitScript(
    ([key, value]) => {
      try { window.localStorage.setItem(key, value); } catch { /* storage blocked */ }
    },
    [LOCALE_STORAGE_KEY, locale] as const,
  );
}
