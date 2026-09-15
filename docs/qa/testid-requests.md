# Requests to Lane A: test IDs and conventions

> Owner: Lane F · Consumer: Lane A
> `e2e/demo-path.spec.ts` selects elements by these `data-testid` values. Nothing here is
> an edit to `src/`: these are requests. If you'd rather use a different name, change it
> here and in the spec in the same PR.

## 1. Test IDs by demo step

`{id}` means the entity's real ID, e.g. `facility-card-fac_0005`.
Attributes like `data-urgency` must hold the **enum value**, not translated text, so tests
work in every locale.

| Step | Route | Element | `data-testid` | Also needs |
|---|---|---|---|---|
| 01 | `/auth/language` | Each language card | `lang-option-{en\|hi\|mr}` | |
| 01 | `/auth/login` | Phone input | `auth-phone-input` | |
| 01 | `/auth/login` | Send OTP button | `auth-send-otp` | |
| 01 | `/auth/otp` | OTP input | `auth-otp-input` | Any 6 digits accepted in the demo build |
| 01 | `/auth/otp` | Verify button | `auth-verify` | Redirects to `/patient` |
| 02 | `/patient` | Next-appointment card | `home-next-appointment` | Contains the token number |
| 02 | `/patient` | Each option in the active-patient switcher | `patient-switcher-option` | One per patient on the account |
| 03 | `/patient/triage` | Each symptom chip | `symptom-chip-{SymptomId}` | IDs from Lane C's vocabulary |
| 03 | `/patient/triage` | Submit | `triage-submit` | |
| 03 | `/patient/triage/result` | Result card | `triage-result-card` | |
| 03 | `/patient/triage/result` | Urgency badge | `triage-urgency` | `data-urgency="{UrgencyBand}"` |
| 03 | `/patient/triage/result` | Disclaimer | `triage-disclaimer` | |
| 03 | `/patient/triage/result` | Each recommended facility | `triage-facility-card` | |
| 04 | overlay | Emergency overlay root | `emergency-overlay` | Must not render at all for non-emergency results |
| 04 | overlay | Call 108 | `emergency-call-108` | `href="tel:108"` |
| 05 | `/patient/facilities` | Each facility card | `facility-card-{FacilityId}` | |
| 05 | `/patient/facilities/{id}` | Facility name | `facility-name` | |
| 05 | `/patient/facilities/{id}` | Tier badge | `facility-tier` | |
| 06 | `/patient/book/{facilityId}` | Each department option | `department-option-{departmentCode}` | |
| 06 | `/patient/book/{facilityId}` | Each slot option | `slot-option` | |
| 06 | `/patient/book/{facilityId}` | Confirm | `booking-confirm` | |
| 06 | `/patient/appointments/{id}` | Token number | `token-number` | Text is just the number |
| 07 | `/patient/queue/{facilityId}` | Now serving | `queue-now-serving` | Text is just the number |
| 07 | `/patient/queue/{facilityId}` | Your token | `queue-my-token` | Text is just the number |
| 07 | `/patient/queue/{facilityId}` | ETA | `queue-eta` | |
| 08 | `/doctor` | Call next | `opd-call-next` | Must update other tabs via §2.4 |
| 09 | `/doctor/consult/{appointmentId}` | Blood pressure input | `consult-vitals-bp` | |
| 09 | `/doctor/consult/{appointmentId}` | Medicine search | `rx-medicine-search` | |
| 09 | `/doctor/consult/{appointmentId}` | Each medicine suggestion | `rx-medicine-option-{MedicineId}` | |
| 09 | `/doctor/consult/{appointmentId}` | Stock indicator per prescribed medicine | `rx-stock-indicator-{MedicineId}` | `data-stock-status="{available\|low\|out}"` |
| 09 | `/doctor/consult/{appointmentId}` | Save | `consult-save` | |
| 09 | `/doctor/consult/{appointmentId}` | Saved confirmation | `consult-saved` | |
| 10 | `/patient/records` | Each timeline entry | `record-entry` | |
| 11 | `/patient/medicines` | Search input | `medicine-search-input` | |
| 11 | `/patient/medicines` | Each facility result | `medicine-result-{FacilityId}` | `data-stock-status`; contains distance in km |
| 12 | `/pharmacist` | Each inventory row | `inventory-row-{MedicineId}` | `data-stock-status` |
| 12 | `/pharmacist` | Quantity input (inside row) | `inventory-quantity-input` | |
| 12 | `/pharmacist` | Save (inside row) | `inventory-save` | |
| 13 | `/patient/complaints/new` | Narrative textarea | `complaint-narrative` | |
| 13 | `/patient/complaints/new` | Generate button | `complaint-generate` | Navigates to preview |
| 13 | `/patient/complaints/new/preview` | Category field | `complaint-field-category` | Editable |
| 13 | `/patient/complaints/new/preview` | Severity field | `complaint-field-severity` | Editable |
| 13 | `/patient/complaints/{id}` | Status | `complaint-status` | `data-status="{ComplaintStatus}"` |
| 13 | `/patient/complaints/{id}` | SLA badge | `complaint-sla` | |
| 13 | `/patient/complaints/{id}` | Each timeline entry | `complaint-timeline-entry` | |
| 14 | `/admin` | KPI tiles | `kpi-footfall`, `kpi-avg-wait`, `kpi-no-show`, `kpi-stockouts`, `kpi-open-complaints` | |
| 14 | `/admin` | Tabs | `analytics-tab-operational`, `analytics-tab-clinical` | |
| 14 | `/admin` | Tab panels | `analytics-panel-operational`, `analytics-panel-clinical` | |
| — | `/patient/profile` | ABHA link stub | `abha-link-button` | P0, 20-minute stub |

## 2. Conventions proposed to Lane A

These make the prototype testable and the demo survivable. Once agreed, record them in `docs/decisions.md`.

1. **Routes live exactly at the paths in `e2e/routes.ts`.** When a screen is built, flip its
   `status` to `built` in the same PR.
2. **Demo session in `sessionStorage["demo.session"]`** as
   `{ userId, role, activePatientId? }`. It has to be *session* storage (per tab) so the doctor
   and the patient can be signed in in two tabs of the same browser.
3. **Forced states:** in non-production builds, `?state=loading|empty|error` forces that state.
4. **Cross-tab sync:** queue, stock and complaint changes are broadcast on a
   `BroadcastChannel("swasthya-demo")`, so demo step 08 updates the patient tab in under 2 s
   with no backend.
5. **Export the locale storage key** from `src/lib/content` (Lane E). `e2e/support/locale.ts`
   currently repeats the string `"locale"`.
6. **The root route `/` redirects to `/auth/language`.** Today it's the Create-Next-App default page.
7. **Wire `LocaleProvider` into `src/app/layout.tsx`.** Today the layout hardcodes `lang="en"`
   and loads the Geist font from Google (Lane E's typography spec calls for self-hosted IBM Plex).
