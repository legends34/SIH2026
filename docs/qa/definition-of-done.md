# Definition of Done: screens

> Owner: Lane F · Source: `docs/DELEGATION_BRIEF.md` §6 rule 6, plus the checks below.
> A screen is **done** only when every box is ticked. "Works on my machine" isn't a box.

## Every screen

- [ ] **Happy path renders** with hero fixtures (`src/lib/mock-data/hero.ts`)
- [ ] **One failure path renders** (invalid input, conflict, not found)
- [ ] **Loading, empty and error states exist** and are reachable with `?state=loading|empty|error` (convention proposed to Lane A in `testid-requests.md` §2)
- [ ] **No console errors, no uncaught exceptions, no failed requests** (checked automatically by `e2e/smoke.spec.ts`)
- [ ] **No horizontal scroll at 375px** (automated check)
- [ ] **Works on a real phone at 375px**, not just a simulator (manual check, playbook F6)
- [ ] **Renders in en, hi and mr** with no missing keys and no English showing in hi/mr mode
- [ ] **`<html lang>` matches the selected locale** (automated check once the route is `built`)
- [ ] **Every string comes from `src/lib/content`**; nothing is hardcoded in JSX
- [ ] **Every tap target is at least 48 × 48 CSS px**
- [ ] **Icons always have a visible text label**
- [ ] **Keyboard focus is visible** on every interactive element
- [ ] **axe: zero critical violations** (automated); serious ones are logged and triaged
- [ ] **`data-testid` values from `testid-requests.md` are present** on the elements the demo path uses
- [ ] **Route status flipped to `built`** in `e2e/routes.ts` in the same PR

## Triage and emergency screens, additionally

- [ ] **No condition or disease names** anywhere in the result or overlay (automated check against `BANNED_TERMS`)
- [ ] **The disclaimer is visible** without scrolling on a 375px screen
- [ ] **The emergency overlay appears within 1 second** and nothing sits in front of it
- [ ] **The call-108 button is a real `tel:108` link**

## Complaint screens, additionally

- [ ] **Every AI-assisted field is editable** before submission

## Staff screens (doctor, pharmacist, admin), additionally

- [ ] **Usable at 1280px**, and the sidebar collapses to a drawer below `md`
- [ ] **No wide table breaks on a phone**; tables scroll inside their own container
