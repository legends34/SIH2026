# Swasthya — Prototype Delegation Brief

**SIH26133 · Govt. of Maharashtra · Internal round**

One person builds the React prototype. This is what the other five do — so that the
frontend owner writes components and routes, and nothing else.

| | |
|---|---|
| **Deliverable** | UI-only web app (single responsive codebase, all four roles) |
| **Stack** | React 18 · Vite · TypeScript · React Router v6 · Tailwind v4 · lucide-react · Recharts |
| **Team** | 6 lanes, one owner each |
| **Backend** | Not in this build |
| **Languages** | English · Hindi · Marathi |

> Supersedes the Python/FastAPI/Kafka handoff plan **for this phase**. That plan's
> safety decisions survive as constraints inside the UI (no-diagnosis triage type,
> human-review preview step, consent-scoped record screens).

---

## 1. The shape of the problem

A UI-only prototype is a single-owner codebase. Six people cannot edit `src/features/`
at once without spending the week resolving merge conflicts instead of building screens.
So the other five lanes do not work *inside* the frontend — they work *around* it, and
each one removes a category of decision or production from the frontend owner's plate.

The screen list is roughly forty screens across four roles. One person can carry that
only if they never have to invent a data shape, write a line of copy, decide what a
triage result should say, or test their own work. Those four things are lanes B, E, C
and F. That is the whole design of this brief.

**The rule that makes it work:** every lane ships typed artifacts into files the frontend
owner imports and never edits. If a lane's output is a conversation rather than a file,
that lane is not really parallel.

---

## 2. The contract gate — Days 1–2

Nothing parallel starts until these four things are merged. Until then the whole team
works on the gate; after it, the six lanes genuinely do not block each other.

- [ ] `src/types/index.ts` — the data contracts
- [ ] Design tokens as Tailwind v4 `@theme` (CSS-based, not a JS config)
- [ ] `components/ui` primitives — Button, Card, Badge, Input, Textarea
- [ ] Route tree skeleton — every path under `/auth/*`, `/patient/*`, `/doctor/*`,
      `/pharmacist/*`, `/admin/*` exists and renders a placeholder

The route skeleton costs two hours and means no lane is ever blocked on
"where does this live".

```
              ┌─────────────────────────────────────────────┐
              │  GATE — merge before anyone branches        │
              │  types · tokens · ui primitives · routes    │
              └──────────────────────┬──────────────────────┘
                                     │
   ┌──────────┬──────────┬───────────┼───────────┬──────────┬──────────┐
   │    A     │    B     │     C     │     D     │    E     │    F     │
   │ Frontend │  Types & │  Triage   │  Backend  │ Content  │  Demo &  │
   │          │mock data │  logic    │ contract  │  & i18n  │    QA    │
   │ consumes │    → A   │    → A    │   post-   │    → A   │ audits A │
   │  B·C·E   │          │           │ prototype │          │          │
   └──────────┴──────────┴───────────┴───────────┴──────────┴──────────┘
```

---

## 3. The six lanes

### Lane A — Frontend implementation

**Needs:** the strongest React/TypeScript person on the team. This is the only lane that
cannot be covered by someone learning on the job.

**Builds**
- Every screen, in the order Auth → Patient → Doctor → Pharmacist → Admin.
- Both layout shells: `PatientShell` (bottom tab bar, mobile-first) and `SidebarShell`
  (desktop-first, collapsing to an off-canvas drawer below `md:`).
- The `components/ui` primitives — Button, Card, Badge, Input, Textarea — hand-rolled
  against the tokens.
- Loading, empty and error states as designed visuals, even though nothing triggers them.
- Named handler stubs for every action, each carrying its `// TODO(backend)` endpoint name.

**Explicitly does not**
- Define types, author mock data, write user-facing copy, or decide triage behaviour.
- Hardcode a data shape inside JSX. Everything arrives as props, typed against Lane B.

**Owns:** `src/app/**` · `src/features/**` · `src/components/**`

---

### Lane B — Data contracts & mock data

**Needs:** solid TypeScript, patience for detail. Does not need React. The
highest-leverage lane in the project.

**Builds**
- Every type in `src/types/index.ts` — `User`, `Role`, `TriageResult`, `Facility`,
  `Appointment`, `QueueState`, `Medicine`, `RecordEntry`, `Complaint`, `OpdPatient`,
  `InventoryItem`, `DispenseRequest`, `AuditLogEntry`, `TeleconsultSession`,
  `DiagnosticOrder`, `FollowUp`.
- Mock data that looks like a real district, not like test fixtures: ~30 government
  facilities across Beed, Nandurbar, Gadchiroli, Palghar, Osmanabad and Washim, at real
  tiers (SC / PHC / CHC / SDH / DH) with plausible coordinates and tier-appropriate bed
  counts.
- Medicines drawn from the NHM Essential Drug List — real generic names, not "Medicine A".
- Volume: ~40 appointments spread across every `AppointmentStatus`, a records timeline
  with consultations, prescriptions, lab reports and vaccinations, ~12 complaints
  distributed across the status machine, and audit log rows.
- A `// TODO(backend): GET /api/...` comment above every export, naming the real endpoint.

**Owns:** `src/types/index.ts` · `src/lib/mock-data/**`

---

### Lane C — Triage & routing logic

**Needs:** someone comfortable with plain functions and test cases. No UI, no API keys,
no model calls in this build.

**Builds**
- The red-flag rule table — around 30 deterministic rules, each with a source citation,
  as pure functions with no network dependency. Chest pain with radiation, stroke signs,
  obstetric bleeding, paediatric dehydration, and so on.
- The department enum and the symptom → department mapping.
- The urgency bands: `emergency` / `urgent` / `routine` / `self-care`, each with a
  definition written down, not implied.
- A facility ranking function scoring distance × capability × current load, so the
  prototype's recommendations are computed rather than hardcoded.
- A 40-case evaluation set with expected outputs — vague, multilingual, self-diagnosing,
  medication-seeking, paediatric and obstetric inputs.

**Hard constraints**
- `TriageResult` has no diagnosis or disease field, and no free-text field that could
  hold one. Output is urgency + department + confidence + facility IDs.
- Emergency detection must work with every model and network dependency removed. In this
  build there are none, which is the point — it is the architecture, not a limitation.

**Owns:** `src/lib/triage/**` · `docs/eval-triage.md`

---

### Lane D — Backend contract & schema

**Needs:** someone who thinks in data models. This lane produces documents, not running
code — nothing here is imported by the prototype.

**Builds**
- The relational schema and ERD covering identity, facilities, appointments, queue,
  records, prescriptions, inventory ledger, complaints, consent grants and audit log.
- An OpenAPI spec using the exact endpoint names already committed to in the UI's
  `TODO(backend)` comments, so wiring later is plumbing rather than renaming.
- The event catalogue — `patient.onboarded`, `triage.completed`, `appointment.booked`,
  `queue.updated`, `record.created`, `inventory.stock.updated`, `complaint.status_changed`
  and the rest.
- A written note on the three race-sensitive operations — slot booking, per-facility token
  allocation, and the stock ledger — and how each stays correct under concurrency. This is
  the question a technical judge asks.

**Scope boundary**
- No running server, no MSW, no fake API. The prototype stays UI-only, deliberately.
- This is also the first lane to be reassigned if the round is close — see §7.

**Owns:** `docs/api/**` · `docs/erd.md`

---

### Lane E — Content, i18n & accessibility

**Needs:** fluent Marathi and Hindi, and care with words. The least technical lane and one
of the two that decide whether the demo lands.

**Builds**
- Every user-facing string, keyed and typed, in `en` / `hi` / `mr`. No English string is
  ever written inline in a component.
- The safety-critical copy: triage result cards and the emergency overlay must read as
  routing guidance — "See a doctor within 24 hours", "Call emergency services now" — and
  never as a named condition. This lane owns that line and defends it.
- IBM Plex Sans Devanagari wired alongside IBM Plex Sans, so Hindi and Marathi render in
  the same type system rather than a fallback face.
- The low-literacy and elderly pass: tap target sizes, text scale, icon-plus-label rather
  than icon alone, and the voice-input affordance on triage and complaint filing.
- Copy for every loading, empty and error state — the states Lane A designs but cannot
  invent words for.

**Owns:** `src/lib/content/**` · `docs/copy-rules.md`

---

### Lane F — Demo, QA & deck

**Needs:** someone organised and willing to be the person who says a screen is not done.
For an internal round, this lane is worth as much as any build lane.

**Builds**
- The demo path written click by click, with a fallback at every step, and rehearsed
  against a stopwatch.
- The deck. Open on the four gaps — routing, waiting, stock, accountability — not on the
  tech stack.
- Responsive QA against the hard requirements: the sidebar collapsing to a drawer below
  `md:`, and no wide table rendering broken on a phone. Every screen checked at 375px on a
  real device, not in a simulator.
- A screen recording of each finished flow, as insurance against venue Wi-Fi.
- The definition-of-done checklist, run against every screen before it is called finished.

**Owns:** `docs/demo-script.md` · `docs/qa/**`

---

## 4. File ownership

This table is the actual mechanism that keeps six people out of each other's way. A lane
may read anything; it may write only its own paths. A change needed in someone else's path
is a request, not an edit.

| Path | Owner | Everyone else |
|---|---|---|
| `src/types/index.ts` | **B** | Read-only. Changes requested, never pushed. |
| `src/lib/mock-data/**` | **B** | Import only. |
| `src/lib/triage/**` | **C** | Call the exported functions. |
| `src/lib/content/**` | **E** | Reference keys. Never inline a string. |
| `src/components/ui/**` | **A** | Use the primitives; don't fork them. |
| `src/features/**`, `src/app/**` | **A** | Hands off. |
| `docs/api/**`, `docs/erd.md` | **D** | Reference for endpoint names. |
| `docs/demo-script.md`, `docs/qa/**` | **F** | Reference. |

### One schema decision to make before Lane B writes a line

The brief puts `abhaId` on `User`, which quietly makes one account equal one patient.
Rural households share a phone — Ramesh in the persona list uses his son's phone. Model
`Patient` as its own entity with `User.patients: Patient[]` and an active-patient
switcher, **even in a UI-only build**. It costs an hour now; retrofitting it later means
redesigning Booking, Profile and Records together.

---

## 5. The demo path

For an internal round that arrives sooner than a full build window, this is the cut.
Everything on this path is P0; everything else waits. Lane F owns the sequence, Lane A
builds it in this order.

| # | Screen | Surface |
|---|---|---|
| 01 | Language select → login → OTP | Auth |
| 02 | Patient home, bottom tab shell | Patient |
| 03 | Triage input → result card | Patient · Lane C logic |
| 04 | Emergency overlay, full-screen | The moment that lands |
| 05 | Facility list → detail | Patient |
| 06 | Booking wizard → token receipt | Patient |
| 07 | Live queue: token, now-serving, ETA | Patient |
| 08 | Doctor OPD queue → call next | Doctor |
| 09 | Consultation form + prescription | Doctor |
| 10 | Records timeline, back on patient side | Patient |
| 11 | Medicine search by facility | Patient |
| 12 | Pharmacist inventory update | Pharmacist |
| 13 | Complaint: file → preview → track | Patient |
| 14 | Admin analytics, both tabs | Admin · build last |

### Deferred, and why

| Screen group | Status | Reasoning |
|---|---|---|
| Teleconsultation (waiting room, call UI) | After P0 | Visually impressive and cheap without real WebRTC — but not on the shortest convincing path. |
| Diagnostic order tracking | After P0 | Four-state tracker. Add once the records timeline exists to hang it off. |
| Follow-up check-in | After P0 | Closes the loop nicely in the narrative; nothing depends on it. |
| Referrals, audit log, user management | After P0 | Admin depth. Worth having, never demoed under time pressure. |
| ABHA linkage entry point | **P0 · 20 min** | A stubbed button in Profile. Trivial, and it answers the interoperability question before it is asked. |
| Real Aadhaar / consent flow | **Not built** | Licence-gated. Say so out loud — scoping discipline scores points. |

---

## 6. Working rules

1. **Nobody works on `main`.** Branch as `feat/<lane>-<desc>`, merge to `develop`,
   promote to `main` at checkpoints only.
2. **No branch lives more than two days.** A five-day branch in the last week is a
   guaranteed conflict festival, and it always lands on Lane A.
3. **One merge window a day**, at a fixed time, everyone present. Lane A merges last, so
   they rebase onto settled contracts rather than the reverse.
4. **Anything an LLM wrote is not done.** It is done when a second person has run it and
   read it. This matters most for Lane C's rules and Lane E's medical copy — the two
   places where a plausible-looking wrong answer is a safety problem, not a bug.
5. **Two items in progress per person, maximum.** Blocked means take a review, not a
   third item.
6. **A screen is done** when the happy path and one failure path both render, loading and
   empty states exist, it works at 375px on a real phone, and every string came from Lane E.

---

## 7. If you fall behind

Make these calls at the halfway checkpoint, not in the last two days. Each is a deliberate
trade, in the order you should spend them.

| Trigger | Move |
|---|---|
| Lane A is behind at the halfway point | Lane D pauses and pairs into the frontend on a hard file split — one owns `features/patient/**`, the other owns `features/{doctor,pharmacist,admin}/**`. Two shells, two directories, no shared files beyond `components/ui`. |
| Lane C is behind | Ship the red-flag table and the department mapping; drop the ranking function to a distance sort and the eval set to ten cases. The red-flag path is the part that matters. |
| Still behind | Cut Admin analytics to a single Operational tab. It is last in the build order precisely because it is the cheapest thing to lose. |
| Under a week out | Feature freeze. Everyone moves to seed-data realism, empty states, the deck and dry runs. A team that freezes demos; a team that does not shows a white screen. |

---

## 8. Open items

- [ ] **Names against lanes.** The lanes are written by capability because the skill split
      is not yet known. Lane A needs the strongest React person; lanes B and C need
      TypeScript but no React; Lane E needs fluent Marathi more than it needs code.
- [ ] **The internal round date.** It sets where the P0 cut falls and when the freeze
      happens. Everything in §7 keys off it.
- [ ] **Is the demo given in Marathi?** If yes, Marathi is a P0 deliverable and Lane E
      moves to the front of the queue. If the demo is in English with a language toggle
      shown once, Marathi can trail.
- [ ] **The patient-per-account decision.** 1:1 or 1:N, per §4. Lane B cannot start until
      this is settled, and it is the one answer that is expensive to change later.

---

*Swasthya · prototype delegation brief · UI-only React build*
