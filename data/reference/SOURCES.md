# Reference Data Sources & Verification Status

> Owner: Lane B (Data Contracts & Mock Data)
> Scope: 6 NCR Districts (Gurugram, Faridabad, Ghaziabad, Gautam Buddha Nagar, Meerut, Sonipat)

## 1. Health Facilities (23 Facilities)

| District | Verified Count | Unverified Count | Source |
|---|---|---|---|
| Gurugram | 4 | 2 | Haryana Health Department / NHM Haryana Directory |
| Faridabad | 2 | 1 | NHM Haryana Facility Registry |
| Ghaziabad | 2 | 2 | UP Health & Family Welfare / CGHS |
| Gautam Buddha Nagar | 2 | 1 | UP Health Portal / District Administration |
| Meerut | 2 | 2 | UP Health Portal |
| Sonipat | 1 | 2 | Haryana Health Portal |

*Note on Unverified Facilities:* Facility coordinates and PIN codes for unverified PHCs and Sub-Centres are approximated from district taluka centroids and will be confirmed against official HFR (Health Facility Registry) in Lane D.

## 2. Essential Medicines (80 Medicines)

- Source: National List of Essential Medicines of India (NLEM 2022), Ministry of Health and Family Welfare (MoHFW), Government of India.
- Tier Level: Primary (P), Secondary (S), Tertiary (T).
- Hero fixture: Metformin 500mg Tablet (ID: `med_0042`).

## 3. Demographics & Patient Distributions

- Names and age distributions modeled after Census 2011 & NFHS-5 district-level data for NCR.
- Immunization schedule modeled after India's Universal Immunization Programme (UIP).
- Privacy protection: Aadhaar numbers strictly masked (maximum `aadhaarLast4` only). Regex `/\b\d{4}\s?\d{4}\s?\d{4}\b/` verified 0 matches across the entire codebase.

## 4. Hero Demo Path Fixtures

- Sunita Sharma (34, Gurugram, Hindi) — Account Holder (`pat_0001`, `usr_0001`)
- Ramesh Sharma (61, HTN + DM) — Dependent (`pat_0002`)
- Aarav Sharma (6, Paediatric) — Dependent (`pat_0003`)
- Hero Slot: Morning OPD 09:00–13:00 at Wazirabad PHC (`fac_0005`, `slot_000001`)
- Hero Appointment: Token 19, now serving 14, general_opd (`appt_000001`)
- Hero Medicine: Metformin 500mg (`med_0042`), OUT at Wazirabad PHC, IN at Farrukhnagar CHC (`fac_0004`, 11 km)
- Hero Complaint: `cmp_0001`, status: `in_review`, category: `medicine_unavailable`, SLA due tomorrow
