# Deck outline: 12 slides

> Owner: Lane F · v0 · 2026-09-15 · A person builds the actual slides (Google Slides / Canva).
> **Honesty rule:** every claim is tagged **[BUILT]** (runs today), **[DESIGNED]** (fully
> specified, not running), or **[ROADMAP]** (planned). Never present [DESIGNED] as [BUILT].
> ⚠️ = verify before this goes on a slide (see `docs/qa/cross-lane-issues.md`).

---

### Slide 1: Title

**Title:** *Swasthya: the right care, the first time, for rural patients*
- Team name · SIH26133 · Govt. of Maharashtra
- **Visual:** a single photo-style illustration of a rural PHC queue
- **Speaker notes:** Say only the problem-statement number and team name. The story starts on slide 2.
- **Proof:** —

### Slide 2: A day's wage lost, and nothing to show for it

- Sunita travels to the wrong facility, waits hours, finds the medicine out of stock, and has nowhere to complain
- **Four gaps: routing · waiting · stock · accountability**
- **Visual:** four icons on a single journey line, each with a red break
- **Speaker notes:** Tell Sunita's day in three sentences, then name the four gaps. No statistics unless they're cited.
- **Proof:** `docs/reference/handbook.md` §1.1 (framing). Any numbers added here need a public source URL in these notes.
- ⚠️ Cross-lane issue #1: the fixtures are Gurugram, the problem statement is Maharashtra. Match the story's place to whichever the team decides.

### Slide 3: Live demo

- **Visual:** a full-bleed "LIVE DEMO" slide, then switch to the laptop
- **Speaker notes:** Follow `docs/demo-script.md` exactly, 5:10 plus slack.
- **Proof:** `docs/demo-script.md`, `e2e/demo-path.spec.ts`
- Tag: **[BUILT]** only for steps whose route is `built` in `e2e/routes.ts` on the day. *Today: none are.*

### Slide 4: Routing: it tells you where to go, never what you have

- Deterministic red-flag rules run **before any AI** and need no internet **[BUILT]** ⚠️
- The triage output has **no field that can hold a disease name** **[BUILT]**
- Evaluated on 46 cases, including 10 holdout and 6 red-team cases: 100% emergency recall **[BUILT]** ⚠️
- **Visual:** the pipeline diagram (symptoms → red flags → route → rank), with the emergency branch in red
- **Speaker notes:** (≤60 words) "Emergency safety never depends on a model being right or online. The result type has nowhere to put a diagnosis, so the app structurally can't give one. We tested it on cases it never saw during development, and on a round of cases designed to break it."
- **Proof:** `src/lib/triage/redFlags.ts`, `src/lib/triage/types.ts`, `docs/triage/eval-triage.md` (`Lane_c`)
- ⚠️ Cross-lane issue #3: re-run `pnpm eval:triage` yourself before quoting 100%. **Don't mention the clinical review** until a real reviewer is confirmed.

### Slide 5: Waiting: a token before you leave home

- Capacity-based OPD sessions, with walk-ins and bookings on **one** token sequence **[DESIGNED]**; mock data follows it **[BUILT]**
- Live "now serving / your token / ETA" **[BUILT once steps 07–08 are built]**
- **Visual:** the patient queue screen next to the doctor's "Call next" button
- **Speaker notes:** "A rural PHC runs on walk-ins, so timed slots are fiction. We use session blocks with one visible queue."
- **Proof:** `docs/api/proposal-slot-semantics.md` §3–4, `docs/decisions.md` Decision 2

### Slide 6: Stock: check before you travel

- Availability shown as a band (available / low / out), never raw counts **[BUILT in mock data]**
- Stock changes are a ledger of entries, never an overwrite **[DESIGNED]**
- **Visual:** medicine search: out at the PHC, available at the CHC
- **Speaker notes:** "Citizens see bands, not numbers. Stock is a ledger, so two pharmacists updating at once can't corrupt it."
- **Proof:** `src/lib/mock-data/inventory.ts`, `docs/api/concurrency.md` §4

### Slide 7: Accountability: complaints you can track like a parcel

- Complaint written in your own words → structured, **editable** official form **[DESIGNED → BUILT at step 13]**
- Status timeline plus an SLA due date, with escalation on breach **[BUILT in mock data]** / **[DESIGNED]** (escalation)
- **Visual:** the complaint tracker timeline
- **Speaker notes:** "Every AI-drafted field is editable before submission. Routing to an officer is a rule, not a model."
- **Proof:** `src/lib/mock-data/complaints.ts`, `docs/api/endpoints.md` §10

### Slide 8: Why it's real engineering

- Two people can't book the last seat: row locks plus an atomic token counter **[DESIGNED]**
- Audit log that can't be edited: hash-chained rows, a database trigger, and an app role without UPDATE **[DESIGNED]**
- Records opened only with consent or an active appointment; audited break-glass access for emergencies **[DESIGNED]**
- Aadhaar stored only as a keyed hash (HMAC-SHA256) plus the last 4 digits **[DESIGNED]**
- **Visual:** a two-column race-condition timeline (naive vs locked)
- **Speaker notes:** "These are specified down to SQL: 29 tables and 47 API operations. We can walk you through the booking race in 30 seconds."
- **Proof:** `docs/api/concurrency.md`, `docs/api/security.md` §2–4, `docs/api/schema.sql`, `docs/api/openapi.yaml`
- ⚠️ Say "we can show the proof" only after `docs/api/proofs/booking-race.sh` has actually been run and recorded (it's also missing on GitHub, cross-lane issue #11).

### Slide 9: Production architecture (designed, not yet built)

- A modular core, plus separate NLP/triage and teleconsultation services **[DESIGNED]**
- PostgreSQL + pgvector · Redis · Kafka with a transactional outbox · ClickHouse · MinIO · LiveKit (WebRTC) **[DESIGNED]**
- Events carry IDs, never personal data **[DESIGNED]**
- **Visual:** the architecture diagram, with a clear "DESIGNED — NOT YET BUILT" label
- **Speaker notes:** "The prototype proves the experience; this is how it scales to the whole state. It's fully specified, so the next phase is building to a spec, not guessing."
- **Proof:** `docs/reference/architecture.md`, `docs/reference/settled-decisions.md`, `docs/api/events.md`

### Slide 10: Fits the systems government already runs

- ABHA / ABDM identity behind a single adapter; a mock gateway until licensed **[DESIGNED]**
- FHIR R4 for any record exchange **[DESIGNED]**
- DPDP Act 2023: purpose limitation, consent records, minimisation **[DESIGNED]**
- **Visual:** logos row (ABDM, FHIR), if permitted, or plain text labels
- **Speaker notes:** "We didn't build real Aadhaar eKYC because it's licence-gated. We built the exact integration point, so switching it on is one adapter."
- **Proof:** `docs/api/security.md` §4–5, `docs/reference/architecture.md` §4.4

### Slide 11: Roadmap

- **Next 3 months [ROADMAP]:** build the production core to the spec; pilot at one block's PHCs; a real clinical review of the triage rules
- **Then [ROADMAP]:** multilingual voice input, teleconsultation, diagnostics tracking, follow-up reminders
- **Later [ROADMAP]:** state-wide analytics for district health officers
- **Visual:** three horizontal lanes
- **Speaker notes:** Keep it to 30 seconds. Name the pilot's success metric: time-to-right-facility, OPD wait, stock-out complaints.
- **Proof:** `docs/DELEGATION_BRIEF.md` §5 "Deferred, and why"

### Slide 12: Team

- Six people, six lanes: frontend · data contracts · triage · backend design · content & languages · demo & QA
- **Visual:** photos plus one line each on what they owned
- **Speaker notes:** Hand off to Q&A. Everyone knows which questions are theirs (`docs/deck/qa-bank.md`).
- **Proof:** `docs/DELEGATION_BRIEF.md` §3

---

## Before building the slides

- [ ] Cross-lane issues #1, #2 and #3 resolved. They change slides 2, 3 and 4.
- [ ] Every [BUILT] tag rechecked against the running app the day before the round
- [ ] Any statistic on slide 2 has a public source URL in the notes
