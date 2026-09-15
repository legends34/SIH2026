/**
 * Collects everything the Definition of Done says must not happen on a page load:
 * console errors, uncaught exceptions, and failed network requests.
 */
import type { Page } from '@playwright/test';

/** Known, harmless noise. Every entry needs a reason. Keep this list short. */
const IGNORED: ReadonlyArray<{ pattern: RegExp; reason: string }> = [
  { pattern: /favicon\.ico/, reason: 'Browsers probe for a favicon on every route; not an app error.' },
];

export interface PageProblems {
  consoleErrors: string[];
  pageErrors: string[];
  failedRequests: string[];
}

export function collectProblems(page: Page): PageProblems {
  const problems: PageProblems = { consoleErrors: [], pageErrors: [], failedRequests: [] };
  const ignored = (text: string) => IGNORED.some(({ pattern }) => pattern.test(text));

  page.on('console', (msg) => {
    if (msg.type() === 'error' && !ignored(msg.text())) problems.consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => {
    if (!ignored(err.message)) problems.pageErrors.push(err.message);
  });
  page.on('requestfailed', (req) => {
    const line = `${req.method()} ${req.url()} — ${req.failure()?.errorText ?? 'failed'}`;
    if (!ignored(line)) problems.failedRequests.push(line);
  });
  page.on('response', (res) => {
    const line = `${res.status()} ${res.url()}`;
    if (res.status() >= 400 && !ignored(line)) problems.failedRequests.push(line);
  });

  return problems;
}
