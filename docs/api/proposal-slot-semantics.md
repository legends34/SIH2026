# Proposal: OPD Slot Semantics & Token Queue Architecture

**Document:** `docs/api/proposal-slot-semantics.md`  
**Author:** Lane D (Backend Contract & Architecture)  
**Status:** Settled (Feeds `docs/decisions.md` Decision 2)  
**Target:** Ayushman Bharat Health & Wellness Centres (AB-HWC) / Primary Health Centres (PHCs) / Community Health Centres (CHCs)

---

## 1. Context: The Reality of a Rural PHC OPD

A rural Primary Health Centre (PHC) serves a catchment population of 20,000–30,000. Operational characteristics:
- **Staffing:** Typically **one single Medical Officer (MO)** on duty, assisted by a staff nurse and pharmacist.
- **Sessions:** Standard two-session split per Indian Public Health Standards (IPHS):
  - **Morning Session:** 09:00 – 13:00 (4 hours)
  - **Evening Session:** 16:00 – 18:00 (2 hours)
- **Patient Volume:** 80–180 patients per day; **70%–85% are walk-ins** from agrarian or unorganized labour backgrounds with shared or non-smartphone devices.
- **Service Time Variability:** Consultations range from 90 seconds (routine refill/mild viral) to 18 minutes (antenatal examination, geriatric co-morbidity, acute respiratory distress, emergency stabilization).
- **Physical Dynamics:** Power cuts, manual paper registries, and sporadic doctor calls for emergencies/deliveries are common.

---

## 2. Evaluation of Three Slot Models

| Dimension | (A) Capacity-1 Timed Slots (e.g., 10:15–10:30) | (B) Capacity-N Session Blocks (Recommended) | (C) Pure Token Queue (No Pre-booking) |
|---|---|---|---|
| **Concept** | Strict discrete 10–15 min appointments per patient. | Broad arrival blocks (e.g., 09:00–11:00, 11:00–13:00) with capacity $N$. | Pure FIFO queue on physical arrival; zero advance scheduling. |
| **Walk-in Handling** | Walk-ins squeeze into "emergency buffer" or wait until all booked slots no-show. | Walk-ins and bookings share the same session capacity and unified daily sequence. | 100% first-come, first-served at the registration desk. |
| **What Patient Sees** | "Your appointment is 10:15 AM." Arrives at 10:10, waits until 12:45 due to emergency delays. Patient feels misled. | "Session: Morning Block 1 (09:00–11:00). Your Token: #24. Current: #11. Est. wait: 35–50 min." | "Take a slip at the counter. Token #48." No advance visibility before physical arrival. |
| **ETA Accuracy** | **Fictional.** $15\text{ min} \times \text{variance}$ compounds error exponentially across 40 patients. | **Moderate & Realistic.** Rolling average: $\text{ETA} = (\text{Token} - \text{NowServing}) \times \text{AvgMinutes}_{\text{last 1hr}}$. | **High after arrival, zero prior.** Patient only learns wait time once standing inside the clinic. |
| **Concurrency Control** | Row lock on individual slot row: `SELECT id FROM slots WHERE id = :id AND booked_patient_id IS NULL FOR UPDATE;` | Pessimistic lock on session block: `SELECT id, booked_count, capacity FROM slots WHERE id = :id FOR UPDATE;` then check `booked_count < capacity`. | Single atomic counter per facility/dept/day: `UPDATE token_counters SET last_token = last_token + 1 RETURNING last_token;` |
| **Schema Sketch** | `slots(id, start_time, end_time, patient_id NULL)` | `slots(id, date, session_name, start_time, end_time, capacity, booked_count)` | `token_counters(facility_id, dept_code, date, last_token, now_serving)` |
| **Failure Modes** | Cascading delays; 80% walk-in surge destroys calendar; booked no-shows waste slots while walk-ins wait outside in heat. | If doctor is called to emergency delivery, entire block shifts, but queue order remains intact and fair. | Severe early morning crowd crush at 08:30 AM at PHC gate; zero demand smoothing or capacity planning. |

---

## 3. Core Architectural Decision: Unified Token Sequence

### Question
**Should walk-ins and booked patients share one token sequence per facility/department/day?**

### Decision
**YES.** One single, monotonically increasing, gapless token sequence per `(facility_id, department_code, service_date)`. Each token is tagged with `source: 'booked' | 'walk_in'`.

### Why:
1. **Single Physical Display Board:** A PHC has a single OPD waiting hall. Having "Appointment Queue A" and "Walk-in Queue W" creates confusion, disputes, and accusations of queue-jumping. One number on the wall display (`Now Serving: 18`) is universally understood.
2. **Deterministic Interleaving:** When a booked patient checks in on-site, their pre-assigned token number holds their position. If they arrive late past their block, the system marks them `late_arrival` and moves them behind the current batch (+3 tokens) without losing auditability.
3. **Emergency Triage Priority:** Red-flag / emergency cases (from Triage Lane C) bypass the standard sequence via an explicit triage priority flag (`priority: 'EMERGENCY'`) which alerts the doctor console immediately.

---

## 4. Recommendation & What We Give Up

### Recommendation: Option B — Capacity-N Session Blocks with Shared Daily Token Counters
1. **Sessions:** 
   - Block 1 (Morning Early): 09:00 – 11:00 (Capacity: 30)
   - Block 2 (Morning Late): 11:00 – 13:00 (Capacity: 30)
   - Block 3 (Evening): 16:00 – 18:00 (Capacity: 25)
2. **Pre-booking Quota:** 50% reserved for advance app booking, 50% dynamically allocated to on-site walk-ins. Unused advance booking quota converts automatically to walk-ins at session start.
3. **Queue Progression:** Doctors press **"Call Next"** on their console; the counter advances `now_serving`, triggers a WebSocket broadcast to the waiting room TV and patient phones, and emits `queue.updated` to the analytics bus.

### What We Give Up:
- **Exact Minute-Level Guarantees:** We cannot tell a patient "you will see the doctor at 10:14 AM". In an Indian rural public health setting, that guarantee is a falsehood.
- **Arbitrary Rescheduling:** Patients cannot swap individual 10-minute micro-slots; they must reschedule to an alternate session block.
