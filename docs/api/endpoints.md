# REST & WebSocket Endpoint Inventory

**Document:** `docs/api/endpoints.md`  
**Author:** Lane D (Backend Contract & Architecture)  
**Status:** Canonical specification for future backend implementation & mock-data references  
**Base URL:** `/api/v1`  
**Target Specification:** OpenAPI 3.1 compatible

---

## Global Architectural Rules & Conventions

1. **URL Paths:** Strict kebab-case, plural nouns for collections (`/api/v1/patients`, `/api/v1/facilities`).
2. **State Transitions (Verbs):** Verbs are permitted only for explicit lifecycle transitions:
   - `POST /api/v1/queues/{facilityId}/{departmentCode}/call-next`
   - `POST /api/v1/queues/{facilityId}/{departmentCode}/skip`
   - `POST /api/v1/records/break-glass`
   - `POST /api/v1/appointments/{id}/cancel`
3. **Parameter Derivation (Anti-Spoofing):**
   - `facilityId` is derived from the authenticated staff user JWT (`sub.facilityId`) for staff operations, or the URL path for public/patient queries. Never accepted in request bodies.
   - `patientId` is derived from URL path (`/api/v1/patients/{patientId}/...`) and verified against the user's `patientIds` JWT claim (citizen role) or active consent/appointment (doctor role).
   - `actorUserId` is always extracted from JWT `sub` claim.
4. **Error Envelope:**
   All non-2xx responses conform strictly to:
   ```json
   {
     "error": {
       "code": "ERROR_CODE_STRING",
       "message": "Human-readable description in English",
       "details": {},
       "correlation_id": "req_c9a18f4b"
     }
   }
   ```
5. **Idempotency:** Mutating `POST` endpoints (bookings, stock adjustments, complaints) accept and require an `Idempotency-Key: <UUID>` HTTP header.

---

## 1. Authentication & Identity (`auth`)

| Method | Path | Roles Allowed | Facility-Scoped | Consent-Gated | Request Type | Response Type | Events Emitted | Screens That Call It |
|---|---|---|---|---|---|---|---|---|
| `POST` | `/auth/otp/request` | Public | No | No | `OtpRequestInput` [NEW] | `OtpRequestResponse` [NEW] | None (rate limited) | 01 (Language & Login) |
| `POST` | `/auth/otp/verify` | Public | No | No | `OtpVerifyInput` [NEW] | `AuthSessionResponse` [NEW] | `patient.onboarded` (if first login) | 01 (OTP screen) |
| `GET` | `/auth/me` | All Authenticated | No | No | None | `User` | None | 02, App Shell |
| `POST` | `/auth/abha/link` | `CITIZEN` | No | No | `AbhaLinkInput` [NEW] | `AbhaLinkResponse` [NEW] | `auth.aadhaar.linked` | 02 (Profile / ABHA link) |
| `POST` | `/auth/logout` | All Authenticated | No | No | None | `ApiResponse` [NEW] | None | Settings / Logout |

*Notes on derivation:*
- `OtpVerifyInput` returns JWT bearing `userId`, `role`, `patientIds` (if CITIZEN), `facilityId` (if staff).
- ABHA verification proxies to mock ABDM gateway. No raw Aadhaar number is ever stored.

---

## 2. Patients & Household Management (`patients`)

| Method | Path | Roles Allowed | Facility-Scoped | Consent-Gated | Request Type | Response Type | Events Emitted | Screens That Call It |
|---|---|---|---|---|---|---|---|---|
| `GET` | `/patients` | `CITIZEN` | No | No | None | `Patient[]` | None | 02 (Patient Home Switcher) |
| `POST` | `/patients` | `CITIZEN` | No | No | `CreatePatientInput` [NEW] | `Patient` | `patient.onboarded` | 02 (Add Family Member) |
| `GET` | `/patients/{id}` | `CITIZEN`, `DOCTOR` | No | Yes (for doctor) | None | `Patient` | None | 02, 06, 09, 10 |
| `PUT` | `/patients/{id}` | `CITIZEN` | No | No | `UpdatePatientInput` [NEW] | `Patient` | None | Profile / Settings |

*Notes on derivation:*
- `CITIZEN` can only access `Patient` IDs contained in their JWT `patientIds` array.
- `DOCTOR` can access `Patient` details only with active appointment or valid consent grant.

---

## 3. Facilities Directory (`facilities`)

| Method | Path | Roles Allowed | Facility-Scoped | Consent-Gated | Request Type | Response Type | Events Emitted | Screens That Call It |
|---|---|---|---|---|---|---|---|---|
| `GET` | `/facilities` | Public / All | No | No | Query: `district`, `tier`, `lat`, `lon`, `radiusKm` | `Facility[]` | None | 05 (Facility List) |
| `GET` | `/facilities/{id}` | Public / All | No | No | None | `FacilityDetailResponse` [NEW] | None | 05 (Facility Detail) |
| `GET` | `/facilities/{id}/departments` | Public / All | No | No | None | `FacilityDepartment[]` [NEW] | None | 05, 06 (Booking Wizard) |
| `GET` | `/facilities/{id}/beds` | All Authenticated | Yes (`id` matches) | No | None | `BedSummaryResponse` [NEW] | None | Admin Dashboard, Bed Management |
| `PUT` | `/facilities/{id}/beds/{bedId}` | `FACILITY_ADMIN`, `DOCTOR` | Yes | No | `UpdateBedStatusInput` [NEW] | `Bed` [NEW] | `bed.status_changed` | Inpatient / Bed Manager |

*Notes on derivation:*
- Facility coordinate distance is calculated via PostGIS/spherical distance formula on Postgres.

---

## 4. Slots & Appointments (`slots` & `appointments`)

| Method | Path | Roles Allowed | Facility-Scoped | Consent-Gated | Request Type | Response Type | Events Emitted | Screens That Call It |
|---|---|---|---|---|---|---|---|---|
| `GET` | `/facilities/{facilityId}/slots` | All Authenticated | No | No | Query: `departmentCode`, `date` | `Slot[]` | None | 06 (Booking Wizard) |
| `POST` | `/appointments` | `CITIZEN`, `FACILITY_ADMIN` | No | No | `BookAppointmentInput` [NEW] | `Appointment` | `appointment.booked`, `queue.token.issued` | 06 (Booking Confirmation) |
| `GET` | `/appointments/{id}` | `CITIZEN`, `DOCTOR`, `FACILITY_ADMIN` | Yes (for staff) | No | None | `Appointment` | None | 06, 07, 08 |
| `POST` | `/appointments/{id}/check-in` | `CITIZEN`, `FACILITY_ADMIN` | Yes | No | None | `Appointment` | `queue.updated` | 07 (Check-in at clinic gate) |
| `POST` | `/appointments/{id}/cancel` | `CITIZEN`, `FACILITY_ADMIN` | No | No | `CancelAppointmentInput` [NEW] | `Appointment` | `appointment.cancelled` [NEW] | 07, Patient Home |

*Notes on derivation & idempotency:*
- `BookAppointmentInput` requires `slotId`, `patientId`, and header `Idempotency-Key`.
- Atomically decrements slot availability and allocates sequential `tokenNumber`.

---

## 5. OPD Live Queue (`queues`)

| Method | Path | Roles Allowed | Facility-Scoped | Consent-Gated | Request Type | Response Type | Events Emitted | Screens That Call It |
|---|---|---|---|---|---|---|---|---|
| `GET` | `/queues/{facilityId}/{departmentCode}/state` | All Authenticated | No | No | Query: `date` (default today) | `QueueState` | None | 07 (Live Queue), 08 (Doctor OPD) |
| `GET` | `/queues/{facilityId}/{departmentCode}/entries` | `DOCTOR`, `FACILITY_ADMIN` | Yes | No | Query: `date` | `QueueEntry[]` | None | 08 (Doctor Queue List) |
| `POST` | `/queues/{facilityId}/{departmentCode}/call-next` | `DOCTOR` | Yes | No | None | `QueueCallNextResponse` [NEW] | `queue.updated` | 08 (Doctor 'Call Next' Button) |
| `POST` | `/queues/{facilityId}/{departmentCode}/skip` | `DOCTOR` | Yes | No | `QueueSkipInput` [NEW] | `QueueState` | `queue.updated` | 08 (Doctor 'Skip/Hold') |
| `POST` | `/queues/{facilityId}/{departmentCode}/walk-in` | `FACILITY_ADMIN`, `DOCTOR` | Yes | No | `RegisterWalkInInput` [NEW] | `QueueEntry` | `queue.token.issued`, `queue.updated` | Registration Desk OPD |

*Notes on derivation:*
- WebSocket notifications broadcast simultaneously with `queue.updated` for instant UI sync.

---

## 6. Deterministic Triage (`triage`)

| Method | Path | Roles Allowed | Facility-Scoped | Consent-Gated | Request Type | Response Type | Events Emitted | Screens That Call It |
|---|---|---|---|---|---|---|---|---|
| `POST` | `/triage/evaluate` | `CITIZEN`, `DOCTOR` | No | No | `TriageInput` | `TriageResult` | `symptoms.extracted`, `triage.completed` | 03 (Triage Wizard), 04 (Emergency Overlay) |
| `GET` | `/triage/symptoms` | Public / All | No | No | Query: `language`, `search` | `SymptomDirectoryResponse` [NEW] | None | 03 (Symptom Chips) |

*Notes:*
- Zero free-text diagnoses returned. Strictly deterministic red-flag rules (evaluated in Python) plus ontology finding codes.

---

## 7. Health Records, Consent & Break-Glass (`records` & `consent`)

| Method | Path | Roles Allowed | Facility-Scoped | Consent-Gated | Request Type | Response Type | Events Emitted | Screens That Call It |
|---|---|---|---|---|---|---|---|---|
| `GET` | `/patients/{patientId}/records` | `CITIZEN`, `DOCTOR` | No | Yes (for doctor) | Query: `type`, `cursor`, `limit` | `CursorPage<HealthRecord>` [NEW] | None (audited) | 10 (Records Timeline), 09 |
| `POST` | `/records` | `DOCTOR` | Yes | Yes (active appointment) | `CreateHealthRecordInput` [NEW] | `HealthRecord` | `record.created` | 09 (Consultation Form) |
| `GET` | `/records/{id}` | `CITIZEN`, `DOCTOR` | No | Yes | None | `HealthRecord` | None (audited) | 10 (Record Detail) |
| `POST` | `/consent/grants` | `CITIZEN` | No | No | `CreateConsentInput` [NEW] | `ConsentGrant` [NEW] | None | 10 (Consent Manager) |
| `POST` | `/consent/grants/{id}/revoke` | `CITIZEN` | No | No | None | `ApiResponse` [NEW] | None | 10 (Consent Manager) |
| `POST` | `/records/break-glass` | `DOCTOR` | Yes | No (Emergency override) | `BreakGlassInput` [NEW] | `BreakGlassSessionResponse` [NEW] | High-severity audit entry | Emergency stabilization |

*Notes on derivation:*
- `records` table is append-only with trigger-level lock.
- `BreakGlassInput` requires mandatory `patientId`, `facilityId`, and non-empty `reason` (minimum 20 characters). Notifies facility admin.

---

## 8. Prescriptions & Dispensing (`prescriptions`)

| Method | Path | Roles Allowed | Facility-Scoped | Consent-Gated | Request Type | Response Type | Events Emitted | Screens That Call It |
|---|---|---|---|---|---|---|---|---|
| `POST` | `/prescriptions` | `DOCTOR` | Yes | Yes | `CreatePrescriptionInput` [NEW] | `PrescriptionResponse` [NEW] | `record.created` | 09 (Doctor Rx submit) |
| `GET` | `/patients/{patientId}/prescriptions` | `CITIZEN`, `DOCTOR`, `PHARMACIST` | Yes (for pharmacist) | Yes | Query: `status` | `PrescriptionResponse[]` [NEW] | None | 10, 12 |
| `POST` | `/prescriptions/{id}/dispense` | `PHARMACIST` | Yes | No (presumed clinical flow) | `DispensePrescriptionInput` [NEW] | `DispenseResponse` [NEW] | `inventory.stock.updated` | 12 (Pharmacy counter) |

---

## 9. Medicine Inventory & Stock (`inventory`)

| Method | Path | Roles Allowed | Facility-Scoped | Consent-Gated | Request Type | Response Type | Events Emitted | Screens That Call It |
|---|---|---|---|---|---|---|---|---|
| `GET` | `/facilities/{facilityId}/stock` | All Authenticated | No | No | Query: `search`, `status`, `cursor` | `StockItem[]` | None | 11 (Medicine search), 12 (Pharmacist) |
| `GET` | `/medicines/search` | Public / All | No | No | Query: `q`, `district`, `radiusKm` | `MedicineAvailabilityResponse[]` [NEW] | None | 11 (Nearby stock finder) |
| `POST` | `/facilities/{facilityId}/stock/adjust` | `PHARMACIST`, `FACILITY_ADMIN` | Yes | No | `StockAdjustmentInput` [NEW] | `StockItem` | `inventory.stock.updated` | 12 (Stock update) |
| `GET` | `/facilities/{facilityId}/stock/ledger` | `PHARMACIST`, `FACILITY_ADMIN` | Yes | No | Query: `medicineId`, `from`, `to` | `LedgerEntry[]` | None | 12 (Audit ledger) |

*Notes on derivation & idempotency:*
- `StockAdjustmentInput` requires `Idempotency-Key` header and delta. Updates projection row under `FOR UPDATE` lock.

---

## 10. Citizen Complaints & Grievance Redressal (`complaints`)

| Method | Path | Roles Allowed | Facility-Scoped | Consent-Gated | Request Type | Response Type | Events Emitted | Screens That Call It |
|---|---|---|---|---|---|---|---|---|
| `POST` | `/complaints` | `CITIZEN` | No | No | `CreateComplaintInput` [NEW] | `Complaint` | `complaint.submitted` | 13 (Complaint wizard) |
| `GET` | `/complaints` | `CITIZEN`, `FACILITY_ADMIN`, `DISTRICT_ADMIN` | Yes (for admins) | No | Query: `status`, `category`, `facilityId` | `Complaint[]` | None | 13 (Track complaints), Admin |
| `GET` | `/complaints/{id}` | `CITIZEN`, Admins | Yes (for admins) | No | None | `Complaint` | None | 13 (Complaint detail) |
| `POST` | `/complaints/{id}/updates` | `FACILITY_ADMIN`, `DISTRICT_ADMIN` | Yes | No | `ComplaintUpdateInput` [NEW] | `Complaint` | `complaint.status_changed` | Grievance resolution screen |

*Notes on derivation:*
- Patient ID is automatically attached from citizen session. SLA deadline (`slaDueAt`) is auto-computed (72h for high severity, 7 days for medium).

---

## 11. Patient Referrals (`referrals`)

| Method | Path | Roles Allowed | Facility-Scoped | Consent-Gated | Request Type | Response Type | Events Emitted | Screens That Call It |
|---|---|---|---|---|---|---|---|---|
| `POST` | `/referrals` | `DOCTOR` | Yes | Yes | `CreateReferralInput` [NEW] | `ReferralResponse` [NEW] | None | Doctor Referral workflow |
| `GET` | `/facilities/{facilityId}/referrals/incoming` | `FACILITY_ADMIN`, `DOCTOR` | Yes | No | Query: `status`, `date` | `ReferralResponse[]` [NEW] | None | District Hospital triage |

---

## 12. Teleconsultation Sessions (`teleconsult`)

| Method | Path | Roles Allowed | Facility-Scoped | Consent-Gated | Request Type | Response Type | Events Emitted | Screens That Call It |
|---|---|---|---|---|---|---|---|---|
| `POST` | `/teleconsult/sessions` | `DOCTOR`, `FACILITY_ADMIN` | Yes | Yes | `CreateTeleconsultInput` [NEW] | `TeleconsultSession` | None | Teleconsultation setup |
| `POST` | `/teleconsult/sessions/{id}/token` | `CITIZEN`, `DOCTOR` | No | Yes | None | `LiveKitTokenResponse` [NEW] | `teleconsult.session.started` | Video consultation room |
| `POST` | `/teleconsult/sessions/{id}/end` | `DOCTOR` | No | No | None | `TeleconsultSession` | `teleconsult.session.ended` | Video consultation end |

---

## 13. Diagnostics & Lab Orders (`diagnostics`)

| Method | Path | Roles Allowed | Facility-Scoped | Consent-Gated | Request Type | Response Type | Events Emitted | Screens That Call It |
|---|---|---|---|---|---|---|---|---|
| `POST` | `/diagnostics/orders` | `DOCTOR` | Yes | Yes | `CreateDiagnosticOrderInput` [NEW] | `DiagnosticOrder` | `diagnostic.ordered` | 09 (Doctor ordering lab) |
| `GET` | `/patients/{patientId}/diagnostics` | `CITIZEN`, `DOCTOR` | No | Yes | Query: `status` | `DiagnosticOrder[]` | None | 10 (Records / Lab list) |
| `POST` | `/diagnostics/orders/{id}/results` | Lab Technician, `DOCTOR` | Yes | No | `SubmitDiagnosticResultInput` [NEW] | `DiagnosticOrder` | `diagnostic.result_ready`, `record.created` | Lab result entry |

---

## 14. Follow-up Care & Adherence (`follow-ups`)

| Method | Path | Roles Allowed | Facility-Scoped | Consent-Gated | Request Type | Response Type | Events Emitted | Screens That Call It |
|---|---|---|---|---|---|---|---|---|
| `POST` | `/follow-ups` | `DOCTOR` | Yes | Yes | `CreateFollowUpInput` [NEW] | `FollowUp` | None | 09 (Consultation follow-up) |
| `GET` | `/patients/{patientId}/follow-ups` | `CITIZEN`, `DOCTOR` | No | Yes | Query: `activeOnly` | `FollowUp[]` | None | 02 (Home alerts), 10 |
| `POST` | `/follow-ups/{id}/respond` | `CITIZEN` | No | No | `FollowUpResponseInput` [NEW] | `FollowUp` | `followup.response_received` | Patient SMS/App reply |

*Notes:*
- Background scheduler polls due table with `SELECT ... FOR UPDATE SKIP LOCKED` and emits `followup.due` & `followup.reminder_sent`.

---

## 15. Operational & Clinical Analytics (`analytics`)

| Method | Path | Roles Allowed | Facility-Scoped | Consent-Gated | Request Type | Response Type | Events Emitted | Screens That Call It |
|---|---|---|---|---|---|---|---|---|
| `GET` | `/analytics/facilities/{facilityId}/daily` | `FACILITY_ADMIN`, `DISTRICT_ADMIN`, `STATE_ADMIN` | Yes | No | Query: `from`, `to` | `DailyAnalytics[]` | None | 14 (Admin Analytics Tab 1) |
| `GET` | `/analytics/district/{district}/summary` | `DISTRICT_ADMIN`, `STATE_ADMIN` | No | No | Query: `date` | `DistrictAnalyticsSummary` [NEW] | None | 14 (Admin Analytics Tab 2) |
| `GET` | `/analytics/syndromic-surveillance` | `DISTRICT_ADMIN`, `STATE_ADMIN` | No | No | Query: `departmentCode`, `from`, `to` | `SurveillanceClusterResponse` [NEW] | None | Public Health Disease Surveillance |

---

## 16. Audit Log & DPDP Verification (`audit`)

| Method | Path | Roles Allowed | Facility-Scoped | Consent-Gated | Request Type | Response Type | Events Emitted | Screens That Call It |
|---|---|---|---|---|---|---|---|---|
| `GET` | `/audit/verify` | `STATE_ADMIN`, `FACILITY_ADMIN` | Yes | No | None | `AuditChainVerificationResponse` [NEW] | None | Technical Audit / Evaluation |
| `GET` | `/audit/entries` | `FACILITY_ADMIN`, `DISTRICT_ADMIN` | Yes | No | Query: `entityType`, `entityId`, `cursor` | `CursorPage<AuditLogEntry>` [NEW] | None | Security Dashboard |

---

## WebSocket Push Architecture

### 1. Channels

| Channel Path | Authentication | Intended Clients | Purpose |
|---|---|---|---|
| `/api/v1/ws/queues/{facilityId}/{departmentCode}` | Bearer Token in Query / Subprotocol | Waiting Room TV displays, Patient Mobile App, Doctor Web Console | Sub-second OPD queue progression (`nowServing`, `estimatedWaitMinutes`, `activeToken`). |
| `/api/v1/ws/facilities/{facilityId}/stock` | Staff Bearer Token | Pharmacy Station, Medical Store Console | Instant notification of zero-stock alerts and emergency inventory draws. |

### 2. Server-to-Client Messages

#### Message 1: `QUEUE_UPDATED`
```json
{
  "event": "QUEUE_UPDATED",
  "timestamp": "2026-09-15T10:14:32+05:30",
  "facilityId": "fac_gurugram_phc_01",
  "departmentCode": "GEN_MED",
  "payload": {
    "nowServing": 19,
    "lastToken": 42,
    "calledToken": 19,
    "avgServiceTimeMinutes": 4.5,
    "activePatientWaitEstMinutes": 0
  }
}
```

#### Message 2: `STOCK_DEPLETED`
```json
{
  "event": "STOCK_DEPLETED",
  "timestamp": "2026-09-15T10:14:35+05:30",
  "facilityId": "fac_gurugram_phc_01",
  "payload": {
    "medicineId": "med_amoxicillin_500",
    "remainingQuantity": 0,
    "status": "out",
    "nearestFacilityWithStock": {
      "facilityId": "fac_sohna_chc_01",
      "distanceKm": 11.2,
      "quantity": 450
    }
  }
}
```

### 3. Decoupling from Kafka: Why WebSocket Push Never Waits on Kafka

A common anti-pattern in distributed architectures is routing real-time UI updates through Kafka before pushing to the client (e.g., `Client -> API -> Kafka -> Consumer -> WebSocket Service -> Client`).

**In Swasthya, WebSocket push is directly broadcast from the local transaction commit:**
1. **Latency:** Local PostgreSQL transaction commit triggers Redis Pub/Sub directly ($< 3	ext{ms}$). Routing via Kafka introduces broker round-trips, consumer polling lags, and partition rebalance latency (	ext{ms} - 2500	ext{ms}$).
2. **Reliability:** If Kafka broker partitions are rebalancing or ingestion is backlogged, the doctor clicking **"Call Next"** would suffer frozen display boards.
3. **Architectural Separation:**
   - **Kafka** is the **durable, replayable, analytical outbox bus** for asynchronous consumers (ClickHouse, SMS notification service, follow-up jobs).
   - **WebSocket via Redis** is the **ephemeral, sub-second presentation broadcast channel**.
