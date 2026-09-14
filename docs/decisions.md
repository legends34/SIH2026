# docs/decisions.md — Lane B Settled Decisions

> Last updated: 2026-09-15  
> Owner: Lane B (Data Contracts & Mock Data)  
> Status: **LOCKED for B1 onwards**

---

## Decision 1 · Patient:Account Relationship

**Decision:** 1:N — One citizen account manages multiple family members (patients).

- A `CITIZEN` user has a `patientIds: PatientId[]` array (minimum 1).
- Each `Patient` record stores its own demographics (name, dob, sex, etc.).
- Staff users (doctors, pharmacists, admins) do NOT have `patientIds`.

**Example:** Sunita's account manages herself (Sunita, 34), her father-in-law (Ramesh, 61), and her son (Aarav, 6).

---

## Decision 2 · Slot Semantics

**Decision:** Capacity-N session blocks with shared token sequence.

- A `Slot` represents a session block (e.g., Morning OPD 09:00–13:00) with a `capacity: number`.
- Tokens are issued in one gapless sequence per facility/department/day.
- Walk-in patients get the next token in the same sequence as booked appointments.
- A slot is "full" when `bookedCount >= capacity`. New bookings are rejected at that point.
- Queue order is by token number, not by appointment time.

---

## Decision 3 · Target Districts (Near Delhi, NCR Region)

Six districts selected for good data availability from NHM and government sources:

| # | District | State |
|---|----------|-------|
| 1 | Gurugram | Haryana |
| 2 | Faridabad | Haryana |
| 3 | Ghaziabad | Uttar Pradesh |
| 4 | Gautam Buddha Nagar (Noida) | Uttar Pradesh |
| 5 | Meerut | Uttar Pradesh |
| 6 | Sonipat | Haryana |

---

## Decision 4 · ID Conventions

Template literal IDs prevent passing wrong ID types at compile time:

```ts
export type FacilityId    = `fac_${string}`;
export type PatientId     = `pat_${string}`;
export type UserId        = `usr_${string}`;
export type DoctorId      = `doc_${string}`;
export type AppointmentId = `appt_${string}`;
export type SlotId        = `slot_${string}`;
export type MedicineId    = `med_${string}`;
export type ComplaintId   = `cmp_${string}`;
export type RecordId      = `rec_${string}`;
export type AuditId       = `aud_${string}`;
```

---

## Decision 5 · Date & Time Conventions

- All dates are plain strings: `IsoDate = string` → "2026-09-15"
- All datetimes are strings with IST offset: `IsoDateTime = string` → "2026-09-15T09:30:00+05:30"
- No Date objects. No UTC-only strings.
- OPD hours: Morning 09:00–13:00, Evening 16:00–18:00.

---

## Decision 6 · Aadhaar Privacy

- Only `aadhaarLast4?: string` on Patient. Never the full 12-digit number.
- Regex /\b\d{4}\s?\d{4}\s?\d{4}\b/ must NOT match any string in mock data (enforced by test).

---

## Decision 7 · Status Enums (all from as const arrays)

```ts
export const APPOINTMENT_STATUSES = ['booked','checked_in','in_consultation','completed','cancelled','no_show'] as const;
export const STOCK_STATUSES       = ['available','low','out'] as const;
export const COMPLAINT_STATUSES   = ['open','in_review','escalated','resolved','closed'] as const;
export const USER_ROLES           = ['CITIZEN','DOCTOR','PHARMACIST','FACILITY_ADMIN','DISTRICT_ADMIN','STATE_ADMIN'] as const;
export const FACILITY_TIERS       = ['sub_centre','phc','chc','sdh','dh'] as const;
```

---

## Decision 8 · Randomness & Determinism

- All mock data uses mulberry32 seeded PRNG. Seed = filename string.
- Math.random() and Date.now() are banned from all mock data files (enforced by test).

---

## Decision 9 · TriageResult — No Free Text

TriageResult must not contain any free-text string fields. Only: urgency band, department code, confidence (0–1), and IDs.

---

## Hero Story (Fixed, Never Regenerated)

| Fixture | Detail |
|---------|--------|
| Sunita, 34 | Account holder, Gurugram district, preferred language Hindi |
| Ramesh, 61 | Dependent on Sunita's account; hypertension, rich record timeline |
| Aarav, 6 | Dependent on Sunita's account; paediatric triage |
| Dr. Sharma | Medical officer at Sunita's PHC (Gurugram) |
| Pharmacist Mehta | Same PHC |
| District Admin | Gurugram district admin |
| Today's appointment | Sunita, Token 19, now serving 14 |
| Hero medicine | Out of stock at her PHC, available at CHC 11 km away |
| Hero complaint | Medicine unavailable, status in_review, SLA due tomorrow |
