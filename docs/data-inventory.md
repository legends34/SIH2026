# Data Inventory

> Lane B — Data Contracts & Mock Data
>
> This inventory records the data requirements visible from the current repository state.
> The project's `docs/DELEGATION_BRIEF.md` and `docs/reference/handbook.md` referenced
> by the Lane B playbook are not present in the current repository, so screens that
> are not implemented or documented in available repository artifacts are not invented here.

## Current Implemented Screen

### Home

- **Route:** `/`
- **Role:** Unspecified
- **Current implementation:** Next.js starter page

#### Displays

The current `/` screen does not consume any Swasthya domain entities.

It currently displays:

- Static Next.js starter content
- Next.js logo
- Links to Vercel templates/deployment
- Links to Next.js learning/documentation

#### Submits

No form or action payload.

#### Derived

No Swasthya-derived values.

---

## Planned / Domain Screens

The Lane B playbook requires the inventory to cover the project's demo path
and deferred screens, including their displayed entities, submitted payloads,
and derived values.

Those screens cannot be enumerated reliably from the current repository because
the referenced `docs/DELEGATION_BRIEF.md` and `docs/reference/handbook.md`
are unavailable.

The following domain entities are nevertheless represented by the Lane B
data contract and mock-data layer:

- User
- Patient
- Facility
- Slot
- Appointment
- Inventory / Stock
- Complaint
- QueueState
- Medical Record
- AuditLogEntry
- Analytics
- TeleconsultSession
- DiagnosticOrder
- FollowUp

No additional screen-to-field mapping is asserted until the authoritative
screen list is available.

---

## Data Minimisation

The frontend data contract follows the Lane B requirement that only the
minimum necessary personal data should be exposed.

In particular:

- Aadhaar is represented only by `aadhaarLast4`.
- Full Aadhaar numbers must not appear in frontend data.
- Patient data should only be supplied to screens that require it.
- Staff-facing data should not unnecessarily contain patient information.

---

## Map / LLM Differences

The Lane B playbook states that the handbook's screen list assumes a map
and an LLM. The current repository does not contain those implemented
screens, so no map or LLM data requirements are asserted here.

---

## Entity Summary

| Entity | Current screen usage | Notes |
|---|---|---|
| User | None | Contract/mock-data entity |
| Patient | None | Contract/mock-data entity |
| Facility | None | Contract/mock-data entity |
| Slot | None | Contract/mock-data entity |
| Appointment | None | Contract/mock-data entity |
| Inventory | None | Contract/mock-data entity |
| Complaint | None | Contract/mock-data entity |
| QueueState | None | Contract/mock-data entity |
| Medical Record | None | Contract/mock-data entity |
| AuditLogEntry | None | Contract/mock-data entity |
| Analytics | None | Contract/mock-data entity |
| TeleconsultSession | None | Deferred domain entity |
| DiagnosticOrder | None | Deferred domain entity |
| FollowUp | None | Deferred domain entity |

## Open Dependency

The authoritative screen inventory should be added once the missing project
brief/handbook becomes available. At that point this document should be
updated with, for every screen:

1. Route and role
2. Displayed `Entity.field` values
3. Submitted form/action payload
4. Derived values and their computation location
5. Personal-data justification