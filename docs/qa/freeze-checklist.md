# Freeze checklist

> Owner: Lane F · Freeze = round date − 3 days (round date still to be set).
> After the freeze, only these may merge: bug fixes with an issue, seed-data realism,
> copy fixes, and test fixes. No features.

## Code and tests

- [ ] `pnpm check` green on `develop`
- [ ] `pnpm e2e` green on `develop`: every P0 route in `e2e/routes.ts` is `built`
- [ ] `e2e/demo-path.spec.ts` has **zero** `fixme`
- [ ] `RELEASE=1 pnpm test` passes (no `⟦TODO⟧` strings left in any locale)
- [ ] `develop` promoted to `main`

## QA

- [ ] `docs/qa/matrix.md`: every demo-path row ✅
- [ ] The latest exploratory run in `docs/qa/runs/` has no open blockers
- [ ] The latest accessibility audit (`docs/content/a11y-audit-*.md`) has no open blockers
- [ ] Real-device pass done on the cheapest Android phone in the team (F6)
- [ ] Every row in `docs/qa/cross-lane-issues.md` closed or accepted with a written reason

## Demo

- [ ] **Offline drill passed:** `pnpm build && pnpm start`, Wi-Fi off, full demo on the demo laptop
- [ ] No Google Fonts, CDN or map-tile dependency left (the offline drill proves it)
- [ ] Screen recording of every flow plus the 3-minute backup video, saved **on the demo laptop's disk**
- [ ] Every fallback in `docs/demo-script.md` names a real clip and timestamp
- [ ] 3 timed dry runs under 6:00, at least one in front of someone outside the team

## Deck

- [ ] Every claim in `docs/deck/outline.md` tagged [BUILT] / [DESIGNED] / [ROADMAP] and checked against the running app
- [ ] Every `GAP` in `docs/deck/qa-bank.md` resolved
- [ ] The clinical-review claim verified (cross-lane issue #3) or removed
