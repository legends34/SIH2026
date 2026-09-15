# e2e: Lane F's Playwright suites

| Suite | What it guards |
|---|---|
| `smoke.spec.ts` | Every route in `routes.ts` × mobile (375px) and desktop (1280px) × en/hi/mr: loads with no errors, no horizontal overflow, zero critical axe violations; screenshots attached. Built routes also check `<html lang>`. |
| `demo-path.spec.ts` | The 14 demo steps from `docs/demo-script.md`, asserting what the judge should see. It records video. |

Routes marked `not_built` in `routes.ts` report as **fixme** rather than failing, so the suite
is green from Day 2 and tightens automatically as Lane A flips routes to `built`.

## Setup (once, after the project scaffold is merged into `develop`)

This branch only adds Lane F files. When it merges, add these to `package.json`
(Lane F is allowed to change scripts and these two devDependencies only):

```json
{
  "scripts": {
    "e2e": "playwright test",
    "e2e:report": "playwright show-report"
  },
  "devDependencies": {
    "@playwright/test": "^1.63.0",
    "@axe-core/playwright": "^4"
  }
}
```

Add these lines to `.gitignore`:

```
/test-results/
/playwright-report/
/blob-report/
/playwright/.cache/
```

Then install:

```bash
pnpm install && pnpm exec playwright install chromium
```

## Run

```bash
pnpm e2e
```

```bash
pnpm e2e:report
```

Run one route or step:

```bash
pnpm exec playwright test -g "step 08"
```

The config builds the app with `next build` and serves it with `next start` on port 4173,
so tests see the production build the jury will see.

## When Lane A finishes a screen

1. Add the `data-testid` values listed in `docs/qa/testid-requests.md`.
2. Flip the route's `status` to `built` in `e2e/routes.ts` **in the same PR**.
3. `pnpm e2e`: its smoke test and demo step now run for real.

## Verified

2026-09-15, against `feat/b-data-contracts-new` (Next.js 16.3.5), Playwright 1.63.0, Chromium:

- `tsc` on `e2e/**` + `playwright.config.ts`: 0 errors
- 188 tests discovered; **6 passed** (root route × 2 viewports × 3 locales), 182 fixme (screens not built)
- Negative check: marking `/doctor` as built makes its smoke test **fail** with `HTTP status for /doctor … Received: 404`
