# QA matrix

> Owner: Lane F · Update after every checkpoint, exploratory run (F5) and real-device pass (F6).
> Status: ✅ passes · ❌ fails (link the issue) · — not checked yet
> Route keys match `e2e/routes.ts`. Checks match `docs/qa/definition-of-done.md`.

**Legend for columns:** Happy = happy path · Fail = failure path · States = loading/empty/error · Console = no errors · 375 = no overflow at 375px · Phone = real device · i18n = en/hi/mr, no missing keys · Lang = `<html lang>` · Copy = strings from content · Tap = ≥48px targets · Focus = visible focus · axe = no critical · Test IDs = present

## Demo path (P0)

| Step | Route key | Path | Owner | Happy | Fail | States | Console | 375 | Phone | i18n | Lang | Copy | Tap | Focus | axe | Test IDs | Last checked |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 01 | auth.language | `/auth/language` | A | — | — | — | — | — | — | — | — | — | — | — | — | — | — |
| 01 | auth.login | `/auth/login` | A | — | — | — | — | — | — | — | — | — | — | — | — | — | — |
| 01 | auth.otp | `/auth/otp` | A | — | — | — | — | — | — | — | — | — | — | — | — | — | — |
| 02 | patient.home | `/patient` | A | — | — | — | — | — | — | — | — | — | — | — | — | — | — |
| 03 | patient.triage | `/patient/triage` | A + C | — | — | — | — | — | — | — | — | — | — | — | — | — | — |
| 04 | patient.triageResult | `/patient/triage/result` | A + C | — | — | — | — | — | — | — | — | — | — | — | — | — | — |
| 05 | patient.facilities | `/patient/facilities` | A | — | — | — | — | — | — | — | — | — | — | — | — | — | — |
| 05 | patient.facilityDetail | `/patient/facilities/fac_0005` | A | — | — | — | — | — | — | — | — | — | — | — | — | — | — |
| 06 | patient.book | `/patient/book/fac_0005` | A | — | — | — | — | — | — | — | — | — | — | — | — | — | — |
| 06 | patient.appointment | `/patient/appointments/appt_000001` | A | — | — | — | — | — | — | — | — | — | — | — | — | — | — |
| 07 | patient.queue | `/patient/queue/fac_0005` | A | — | — | — | — | — | — | — | — | — | — | — | — | — | — |
| 08 | doctor.opd | `/doctor` | A | — | — | — | — | — | — | — | — | — | — | — | — | — | — |
| 09 | doctor.consult | `/doctor/consult/appt_000001` | A | — | — | — | — | — | — | — | — | — | — | — | — | — | — |
| 10 | patient.records | `/patient/records` | A | — | — | — | — | — | — | — | — | — | — | — | — | — | — |
| 11 | patient.medicines | `/patient/medicines` | A | — | — | — | — | — | — | — | — | — | — | — | — | — | — |
| 12 | pharmacist.inventory | `/pharmacist` | A | — | — | — | — | — | — | — | — | — | — | — | — | — | — |
| 13 | patient.complaintNew | `/patient/complaints/new` | A | — | — | — | — | — | — | — | — | — | — | — | — | — | — |
| 13 | patient.complaintPreview | `/patient/complaints/new/preview` | A | — | — | — | — | — | — | — | — | — | — | — | — | — | — |
| 13 | patient.complaintTrack | `/patient/complaints/cmp_0001` | A | — | — | — | — | — | — | — | — | — | — | — | — | — | — |
| 14 | admin.analytics | `/admin` | A | — | — | — | — | — | — | — | — | — | — | — | — | — | — |
| — | patient.profile | `/patient/profile` (ABHA stub) | A | — | — | — | — | — | — | — | — | — | — | — | — | — | — |

## Scaffold

| Route key | Path | Status | Console | 375 | axe | Last checked | Note |
|---|---|---|---|---|---|---|---|
| root | `/` | placeholder | ✅ | ✅ | ✅ | 2026-09-15 | Create-Next-App default page. Automated smoke passed on mobile + desktop × en/hi/mr against `feat/b-data-contracts-new`. Not a real screen: must redirect to `/auth/language`. |

## Deferred (after P0)

| Route key | Path | Owner | Happy | Console | 375 | i18n | axe | Last checked |
|---|---|---|---|---|---|---|---|---|
| patient.teleconsult | `/patient/teleconsult/appt_000001` | A | — | — | — | — | — | — |
| doctor.teleconsult | `/doctor/teleconsult/appt_000001` | A | — | — | — | — | — | — |
| patient.diagnostics | `/patient/diagnostics` | A | — | — | — | — | — | — |
| patient.followUp | `/patient/follow-up` | A | — | — | — | — | — | — |
| doctor.referrals | `/doctor/referrals` | A | — | — | — | — | — | — |
| admin.audit | `/admin/audit` | A | — | — | — | — | — | — |
| admin.users | `/admin/users` | A | — | — | — | — | — | — |
