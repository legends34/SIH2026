# Judge Q&A bank

> Owner: Lane F · v0 · 2026-09-15 · Answers are based **only** on docs in this repo.
> Where the docs don't answer a question, the entry says **GAP**. The team must write that answer; nobody improvises it on stage.
> Tags: **[BUILT]** runs today · **[DESIGNED]** fully specified · **[ROADMAP]** planned.
> "Answers" = the lane whose owner takes the question.
> At dry runs, drill 10 random questions on each person.

---

## A doctor on the jury

**1. What if the AI gets triage wrong?** · [BUILT] ⚠️ · Answers: C
Emergency detection isn't AI. It's a fixed set of red-flag rules that run first, on the phone, with no internet. The result can only say how urgent and which department; it has no field for a diagnosis. Anything below emergency still sends the patient to a doctor. We never tell anyone they're fine.
*Backed by:* `src/lib/triage/redFlags.ts`, `docs/triage/README.md` · ⚠️ Confirm eval numbers before quoting them (cross-lane #3).

**2. Who validated your red-flag rules?** · **GAP** · Answers: C
*Backed by:* `docs/triage/clinical-review.md`, **pending verification** (cross-lane #3). If no real clinician reviewed them, the honest answer is: "They're sourced from WHO and MoHFW guidance, and clinical validation is our next step."

**3. Does it ever name a disease?** · [BUILT] · Answers: C / E
No. The triage result type has nowhere to put one, and a test scans every string in all three languages for diagnosis words and false reassurance. Doctor-written records can contain clinical terms, as any real record does.
*Backed by:* `src/lib/content/banned.ts`, `src/lib/content/__tests__/guards.test.ts`, `e2e/demo-path.spec.ts` steps 03–04

**4. How does it handle a pregnant woman or a child?** · [BUILT] · Answers: C
Age band and pregnancy are inputs. Obstetric and newborn danger signs have their own red-flag rules, and the eval set includes paediatric and obstetric cases.
*Backed by:* `docs/triage/red-flags.md`, `docs/triage/eval-triage.md` §3

**5. What if the patient says "no fever"?** · [BUILT] · Answers: C
Negation is handled in English, Hindi and Marathi, so "no fever" never counts as fever. It's tested explicitly.
*Backed by:* `src/lib/triage/lexicon/negation.ts`, eval category `negation`

**6. Can a doctor see any patient's records?** · [DESIGNED] · Answers: D
No. A doctor reads a record only with an active appointment or the patient's consent, and every read is logged. For an unconscious patient there's a break-glass override: it needs a written reason, is time-limited, is logged at high severity, and notifies the facility admin.
*Backed by:* `docs/api/security.md` §1–2

**7. Is this a replacement for eSanjeevani?** · **GAP** · Answers: Project lead
No doc compares Swasthya with eSanjeevani. The team needs an agreed one-line positioning.

---

## A government health officer

**8. Is using Aadhaar legal here?** · [DESIGNED] · Answers: D
We never store an Aadhaar number. Real Aadhaar verification needs a UIDAI licence, so we built the integration point and use a mock gateway. Where linkage exists, we keep only a keyed hash and the last four digits.
*Backed by:* `docs/api/security.md` §4, `docs/api/schema.sql` (`aadhaar_links`)

**9. Does it work with ABHA / ABDM?** · [DESIGNED] · Answers: D
ABHA linkage sits behind a single adapter, currently a mock gateway. Record exchange is designed around FHIR R4, the ABDM standard.
*Backed by:* `docs/reference/architecture.md` §4.4, `docs/reference/settled-decisions.md` (locked decisions)

**10. Is it DPDP Act compliant?** · [DESIGNED] · Answers: D
It's designed around the Act: purpose-limited collection, recorded consent, minimisation (no raw Aadhaar, no raw stock counts shown to citizens), and events that carry IDs rather than personal data. We call it designed-for-compliance; there has been no legal audit.
*Backed by:* `docs/api/security.md` §5

**11. Who actually updates the stock?** · [BUILT in mock data] / [DESIGNED] · Answers: B / A
The facility pharmacist, in a screen built to take under 30 seconds. Each update is a ledger entry, so the history is kept and concurrent updates can't corrupt the count.
*Backed by:* `docs/api/concurrency.md` §4, demo step 12

**12. What happens if the pharmacist doesn't update it?** · **GAP** · Answers: B
The UI shows "updated X hours ago", but no doc defines what happens when stock data goes stale (a warning, hiding it, escalation). Decide on a policy.

**13. How are complaints routed, and what if nobody acts?** · [DESIGNED] · Answers: D
Routing is a fixed rule by category and severity, not a model. Each complaint gets an owner and an SLA, and a breach escalates it.
*Backed by:* `docs/api/endpoints.md` §10, `docs/reference/architecture.md` §3.5

**14. What does this cost the state?** · **GAP** · Answers: Project lead
No doc estimates hosting, rollout or training costs.

**15. How would ASHA workers use this?** · **GAP** · Answers: Project lead / E
The handbook names ASHA workers as assisted-access operators, but no screen or flow for them is designed or built.
*Backed by:* `docs/reference/handbook.md` §1.2 (mention only)

**16. What about people without a smartphone?** · **GAP** · Answers: Project lead
The architecture shows IVR/SMS as a client, and ASHA-assisted access is mentioned, but neither is specified.

**17. Which districts did you model, and why?** · [BUILT] ⚠️ · Answers: B
*Backed by:* `docs/decisions.md` Decision 3. ⚠️ Today these are NCR districts in Haryana and UP, which a Maharashtra jury will ask about (cross-lane #1). Resolve before the round.

**18. How is this different from the HMIS the state already has?** · **GAP** · Answers: Project lead

---

## A software engineer

**19. What happens when two people book the last slot?** · [DESIGNED] · Answers: D
The booking locks the slot row (`SELECT … FOR UPDATE`) inside a transaction. Exactly one succeeds; the other gets a clear "slot full" conflict.
*Backed by:* `docs/api/concurrency.md` §2

**20. How do you stop duplicate or skipped token numbers?** · [DESIGNED] · Answers: D
A single atomic upsert on a per-facility, per-department, per-day counter. There's no read-then-increment, so no gaps or duplicates.
*Backed by:* `docs/api/concurrency.md` §3, `docs/api/schema.sql` (`token_counters`)

**21. Can stock go negative?** · [DESIGNED] · Answers: D
No. The item row is locked before a dispense is written, and each ledger entry carries a unique idempotency key, so a retried request can't count twice.
*Backed by:* `docs/api/concurrency.md` §4

**22. Can you prove the booking race is handled?** · [DESIGNED] ⚠️ · Answers: D
*Backed by:* `docs/api/proofs/booking-race.sh`. ⚠️ Only say yes if it has been run and the output recorded. It's also missing from GitHub (cross-lane #11).

**23. How can an audit log be immutable in a normal database?** · [DESIGNED] · Answers: D
Three layers: each row stores the previous row's hash (a hash chain), a database trigger rejects UPDATE and DELETE, and the app's database role has no update rights on that table. A verification function checks the chain.
*Backed by:* `docs/api/security.md` §3

**24. How does the doctor's "call next" reach the patient instantly?** · [BUILT in prototype] / [DESIGNED] · Answers: A / D
In the prototype, tabs sync with the browser's BroadcastChannel. In production, a WebSocket push is sent inside the same transaction and never waits on Kafka; Kafka gets the event separately for analytics.
*Backed by:* `docs/api/events.md` §4, `docs/qa/testid-requests.md` §2.4

**25. Why Kafka? Isn't that overkill?** · [DESIGNED] · Answers: D
Analytics needs a durable, replayable event log, so a new dashboard metric can be backfilled from history. Every event has an ID, and the analytics tables deduplicate on it, so replays don't double-count.
*Backed by:* `docs/api/events.md` §5, `docs/reference/architecture.md` §4.2

**26. What if an event is lost between the database and Kafka?** · [DESIGNED] · Answers: D
The transactional outbox: the event is written in the same transaction as the data, and a relay publishes it afterwards.
*Backed by:* `docs/reference/settled-decisions.md` (decision 18), `docs/api/events.md` §2

**27. Why not just use ChatGPT for triage?** · [BUILT] · Answers: C
Because emergency safety can't depend on a model being available, correct or online. Rules run first and always. A model could be added later behind the same result type, and even then it couldn't name a disease.
*Backed by:* `docs/triage/README.md`, `docs/reference/settled-decisions.md` (decisions 9–11)

**28. Does it work without internet?** · [BUILT] ⚠️ · Answers: F
The prototype has no backend and no API keys, and it runs offline from a local build. ⚠️ The current layout loads its font from Google Fonts, which breaks offline. That must be fixed and the offline drill passed before this is claimed (cross-lane #12, `freeze-checklist.md`).

**29. How did you test it?** · [BUILT] · Answers: F
Unit tests on mock-data integrity and content guards, a triage eval gate test, and Playwright tests covering every route on phone and desktop in all three languages, including accessibility checks, plus a step-by-step demo-path test. (CI isn't set up on `develop` yet, so don't say "in CI" until it is.)
*Backed by:* `e2e/README.md`, `docs/triage/eval-triage.md`

**30. Is the data real?** · [BUILT] ⚠️ · Answers: B
Facility names and districts come from public government sources where they could be verified. Unverified facilities get generic names. People are fictional; no real Aadhaar or phone numbers are used.
*Backed by:* `data/reference/SOURCES.md` · ⚠️ Confirm which facilities are `verified=true` before saying "real".

**31. How does it scale to all of Maharashtra?** · [DESIGNED] · Answers: D
The NLP and teleconsultation services scale independently of the core, and analytics run on a separate warehouse so dashboards never slow down bookings.
*Backed by:* `docs/reference/architecture.md` §0–1

**32. How long until production?** · **GAP** · Answers: Project lead

---

## A product or impact judge

**33. Who is the user, really?** · [BUILT] · Answers: Project lead
A rural patient on a shared family phone, with a PHC doctor, a pharmacist and a district health officer behind them. One account manages a whole household.
*Backed by:* `docs/decisions.md` Decision 1, `docs/reference/handbook.md` §1.2

**34. Which of the four gaps matters most?** · **GAP** · Answers: Project lead
Pick one and be ready to defend it with a source.

**35. How would you measure success in a pilot?** · **GAP** · Answers: Project lead
Suggested draft to agree on: wrong-facility visits, OPD wait time, medicine stock-out complaints, and complaint SLA compliance.

**36. Why would a busy PHC doctor use this?** · **GAP** · Answers: A / Project lead

**37. What languages does it support?** · [BUILT] ⚠️ · Answers: E
English, Hindi and Marathi. Every string is translated, and a missing translation fails the build.
*Backed by:* `src/lib/content/` · ⚠️ Confirm native-speaker review is done before claiming quality (playbook E7).

**38. What about low-literacy users?** · [DESIGNED] · Answers: E
Big tap targets, icons always with labels, symptom chips instead of typing, and voice input as an affordance. Accessibility is audited per locale.
*Backed by:* `docs/copy-rules.md`, `docs/qa/definition-of-done.md`

**39. What did you deliberately not build?** · [ROADMAP] · Answers: Project lead
Real Aadhaar eKYC (licence-gated), payments (public care is free at the point of care), a native app (a PWA covers it), and diagnosis (a safety choice).
*Backed by:* `docs/reference/handbook.md` §0.3, `docs/DELEGATION_BRIEF.md` §5

**40. What's the one thing you'd build next?** · **GAP** · Answers: Project lead
