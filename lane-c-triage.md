# Lane C — Triage & Routing Logic

> Read `00-START-HERE.md` first.

**Mission.** Build the part a judge will try to break: a deterministic engine that turns
symptoms into *where to go and how fast*, and never into *what you have*. Pure TypeScript
functions: no UI, no model calls, no network.

| | |
|---|---|
| **You own** | `src/lib/triage/**` · `docs/triage/**` |
| **You need** | Lane B: types, Day 2 PM · Lane E: native review of the lexicon, Day 5 · a clinical reviewer, before the freeze |
| **You give** | Lane B: vocabulary, **Day 2 AM** · Lane A: `triage()` and `rankFacilities()` · Lane F: eval results for the deck |
| **Agents do** | Vocabulary draft, source research, eval cases, lexicon, engine, ranking, eval runner, red-teaming |
| **You do** | Sign off the vocabulary, **open every citation**, write the 10 holdout cases, clinical review, set pass thresholds |

### Why no LLM, and why that's the stronger pitch

Emergency detection that works with the network unplugged is an architectural rule
(decision 11 in `settled-decisions.md`), not a limitation. The pitch line: *"Red flags run
before any AI and need no connection. An LLM can be added later behind the same
`TriageResult` type, and it will never be able to name a disease, because the type has
nowhere to put one."*

### Deliverables

- [ ] `docs/triage/vocabulary.md`, signed off
- [ ] `docs/triage/red-flags.md`, every rule sourced, every source opened by a person
- [ ] `src/lib/triage/__fixtures__/`: 30 eval cases, 10 holdout cases, red-team cases
- [ ] `src/lib/triage/lexicon/{en,hi,mr}.ts` + `negation.ts`, native-reviewed
- [ ] Engine: `normalize`, `extract`, `redFlags`, `route`, `confidence`, `rank`, `triage`
- [ ] `docs/triage/eval-triage.md` (generated report) and the CI gate
- [ ] `docs/triage/clinical-review.md` and `docs/triage/README.md`

### Engine shape (for orientation; the agent builds it)

```
TriageInput ─► normalize ─► extract (lexicon + negation) ─┐
   symptom chips ──────────────────────────────────────────┴► symptom set
                                                                  │
                          ┌──── evaluateRedFlags ◄────────────────┘   ← pure, no imports but @/types
                          │ fired?
                ┌── yes ──┴── no ──┐
       urgency = emergency     route (department + urgency from vocabulary + modifiers)
       confidence = 1          confidence (signal quality)
                └────────┬─────────┘
                    rankFacilities ─► TriageResult { urgency, department, confidence,
                                                     recommendedFacilityIds, firedRuleIds,
                                                     matchedSymptomIds }
```

---

## C0 · 👤 HUMAN · Before anything · 1 hour

1. Read decisions 9, 10 and 11 in `docs/reference/settled-decisions.md`, and handbook §10.
2. **Find your clinical reviewer today:** a doctor, intern or final-year MBBS student who
   can give you 90 minutes before the freeze. Book the slot now.
3. **Collect real phrasings:** ask 5–10 people (family, neighbours, anyone from a village)
   to describe, in their own Marathi or Hindi, how they'd say *chest pain*, *breathless*,
   *baby not feeding*, *bleeding in pregnancy*, *can't pass urine*, *fits*. Voice notes are
   fine. Transcribe 20 phrases into `docs/triage/real-phrasings.md`. This is the one input
   no agent can make up for you, and it's what makes C4 work.

---

## C1 · 🤖 Claude Code · Vocabulary draft · 1 hour → 👤 team sign-off

**Due Day 2 morning.** Lane B is blocked until this lands.

```text
Read AGENTS.md, docs/reference/settled-decisions.md (decisions 9–11),
docs/reference/architecture.md §3.3–3.4, docs/reference/handbook.md §10.

TASK: draft docs/triage/vocabulary.md, the controlled vocabulary the triage engine uses.
This is a decision document for humans. No code.

Sections:
1. UrgencyBand: emergency / urgent / routine / self-care. For each: a one-sentence
   operational definition (what the patient does, within what time), appropriate facility
   tiers, and example presentations written at symptom level, never as a disease name.
2. DepartmentCode: 10–14 codes that exist at Maharashtra public facilities (GEN_MED, PAEDS,
   OBGYN, ...). For each: plain-language intent, the lowest facility tier that offers it, and
   which tier can stabilise and refer if the nearest facility lacks it.
3. FacilityTier: SC, PHC, CHC, SDH, DH, with a one-line capability summary each.
4. SymptomId: 50–70 patient-reportable symptoms, meaning things a patient or ASHA worker
   can observe ("chest_pain", "blood_in_stool", "infant_not_feeding"). Group by body system.
   For each: snake_case id, plain-English label, needed modifiers (duration, severity,
   side), and default department.
   No diagnoses. No conditions. No lab findings.
5. Modifiers that change rules: age bands (neonate <2 months, infant, child <5, 5–17,
   adult, elderly ≥60), sex, pregnancy/postpartum, duration.
6. Open questions for the team.

Cite a guideline (title + URL) where a definition comes from one. Mark your own judgement
as "proposed". Do not edit any other file.
```

**👤 Sign-off, 30 min with the team:** read every symptom ID aloud. Would a villager
recognise it? Is anything secretly a diagnosis? Then tag `vocabulary-v1` and hand it to Lane B.

---

## C2 · 🤖 Antigravity (browser) · Red-flag rules with real citations · 3 hours agent, 2 hours you

**Why Antigravity:** every rule needs a source the agent actually opened. Of everything in
the project, this is where a made-up citation is most dangerous.

```text
Read AGENTS.md and docs/triage/vocabulary.md. Use the browser to open every source you cite.

TASK: build docs/triage/red-flags.md, a table of about 30 red-flag rules: presentations
where the patient must go to emergency care immediately, no matter what else is true.

Columns: rule_id (RF_001…), presentation (plain English), trigger (using ONLY SymptomIds
and modifiers from vocabulary.md, written as allOf / anyOf / population), population,
department, source_title, source_url, location_in_source (section or page),
supporting_quote (verbatim, max 25 words).

Minimum coverage: cardiac-pattern chest pain; stroke signs (BE-FAST); severe breathing
difficulty; altered consciousness or seizure; severe bleeding; major trauma; poisoning and
snakebite (common in rural Maharashtra); burns; obstetric danger signs (bleeding,
convulsions, severe headache with blurred vision, reduced fetal movement); newborn and
child danger signs (unable to feed, convulsions, lethargy, fast breathing, chest
indrawing, severe dehydration); suicidal intent; high fever with stiff neck or rash.

Preferred sources, in order: WHO (ETAT, IMCI danger signs, pregnancy danger signs);
Government of India MoHFW / NHM (IMNCI, the Mother and Child Protection card, ASHA
training modules); the AHRQ Emergency Severity Index handbook; peer-reviewed open-access
references.

Rules:
- If a trigger needs a symptom that isn't in vocabulary.md, don't invent the ID. List it
  under "Vocabulary gaps" at the end.
- Never cite a source you didn't open. A rule with no source goes under
  "Unsourced — needs clinician", not in the main table.
- Screenshot the cited passage for the first 10 rules.
```

**👤 Verify, no shortcuts:**

- [ ] Open **every** `source_url`. Is the quote actually there, at the stated location?
- [ ] Take vocabulary gaps back to C1 (update the vocabulary, then B9 if types change)
- [ ] Mark the doc `status: pending clinical review` at the top

---

## C3 · Eval cases: written by someone other than the engine's author

### C3a · 👤 HUMAN · 10 holdout cases · 1 hour

Write 10 tricky cases yourself, using `docs/triage/real-phrasings.md`. **Keep them out of
the repo** (a local file) until C5 is merged. The engine agent must never see them. They
tell you whether the engine generalises or just memorised the eval set.

### C3b · 🤖 Codex cloud · 30 eval cases · 1 hour

**Why Codex:** Claude Code builds the engine in C5, so a different agent writes the test.

```text
Read AGENTS.md, docs/triage/vocabulary.md, docs/triage/red-flags.md,
docs/triage/real-phrasings.md, src/types/index.ts.
Do not read src/lib/triage/ outside __fixtures__/. You are writing the exam, not the answers.

TASK: create src/lib/triage/__fixtures__/eval-cases.ts with 30 cases.

Each case: id, category, input (TriageInput), expected { urgency, department,
mustFireRuleIds?, mustNotFireRuleIds? }, rationale (one line citing a rule_id or vocabulary
definition), needsNativeReview (boolean).

Mix:
- 10 red-flag presentations, at least 4 phrased indirectly ("my chest feels heavy and my
  left arm is numb", not "cardiac chest pain")
- 4 near-misses that must NOT be emergency (chest wall pain after lifting a sack, mild
  headache after a long day)
- 6 multilingual free text: 2 Marathi in Devanagari, 2 Hindi, 1 romanised Marathi,
  1 Marathi–Hindi–English code-mixed
- 3 negation cases ("fever but no rash, no stiff neck")
- 3 paediatric and 2 obstetric
- 2 self-diagnosing or medication-seeking ("I have typhoid, which tablet?"), where the
  expected output is routing only

Marathi and Hindi text must sound like real villagers talking (use real-phrasings.md),
not textbook language. Set needsNativeReview: true on every non-English case.
YOU MAY EDIT ONLY: src/lib/triage/__fixtures__/eval-cases.ts
```

---

## C4 · 🤖 Codex cloud · Multilingual lexicon · 2 hours → 👤 Lane E native review

Run this **at the same time as C3b**, as a separate task.

```text
Read AGENTS.md, docs/triage/vocabulary.md, docs/triage/real-phrasings.md, src/types/index.ts.

TASK: create src/lib/triage/lexicon/en.ts, hi.ts, mr.ts, negation.ts and a test.

Each lexicon: `Record<SymptomId, readonly string[]>`, listing how people in rural
Maharashtra actually say that symptom. For hi and mr, include Devanagari AND common
romanised spellings. Include colloquial wording and body-part phrasings, not only medical
words. Use every phrase in real-phrasings.md. 4–10 phrases per symptom per language.
Every SymptomId must be present in every language (the Record type enforces it).

negation.ts, per language: negation cues (for example en "no", "not", "without";
hi "नहीं", "नही"; mr "नाही", "नाय"), clause-break tokens (",", "but", "लेकिन", "पण"), and the
scope rule: a cue negates symptom phrases after it until the next clause break or 4 tokens.

Test: every SymptomId has ≥4 phrases per language, and no phrase maps to two SymptomIds
in the same language. Report every collision instead of quietly deleting phrases.

YOU MAY EDIT ONLY: src/lib/triage/lexicon/**
Title the PR "feat(triage): lexicon — NEEDS NATIVE REVIEW (Lane E)".
```

**👤 Verify:** don't merge until Lane E's owner (or a native speaker) has gone through `mr.ts` and `hi.ts`.

---

## C5 · 🤖 Claude Code (plan mode) · The engine, test-first · 4–6 hours

```text
Read AGENTS.md, docs/triage/vocabulary.md, docs/triage/red-flags.md, src/types/index.ts,
src/lib/triage/lexicon/**, src/lib/triage/__fixtures__/eval-cases.ts.

TASK: implement the deterministic triage engine in src/lib/triage/, tests first.

Files. Each one pure, with no I/O:
1. normalize.ts: Unicode NFC, lowercase Latin, strip punctuation except clause breaks,
   collapse whitespace, normalise safe Devanagari variants.
2. extract.ts: (freeText, language) → { present: SymptomId[], negated: SymptomId[] }, using
   longest-phrase-first lexicon matching and the negation scope rule.
3. redFlags.ts: the rules from docs/triage/red-flags.md as a typed RULES array
   (id, population predicate, allOf/anyOf, department, sourceUrl).
   evaluateRedFlags(symptoms, modifiers) → fired rules.
   This file must import nothing except from "@/types".
4. route.ts: when no red flag fires, pick the department from the vocabulary's default
   department table (with a documented tie-break), and urgency from the band definitions and
   modifiers (age band, pregnancy, duration).
5. confidence.ts: 0–1 from signal quality (share of input explained by matched phrases,
   chips vs free text, conflicting departments). Document the formula in a comment.
6. triage.ts: triage(input, ctx: { facilities, loadByFacility }) → TriageResult.
   The order is fixed: extract → union with chips, minus negated → red flags → if any fired:
   urgency "emergency", the first fired rule's department, confidence 1 → otherwise route +
   confidence → rankFacilities from ./rank (if rank.ts doesn't exist yet, return [] and
   say so in the report).

Write the tests FIRST in src/lib/triage/__tests__/. Run them, show them failing, then
implement. Required tests:
- 100% of eval cases whose expected urgency is "emergency" pass
- each RULES entry has a test that fires it and a near-miss that doesn't
- negation: "no fever" / "ताप नाही" / "बुखार नहीं" never yield fever
- evaluateRedFlags works when called directly, with no facilities and no ranking
- the TriageResult object has exactly the allowed keys (compare Object.keys to an allowlist)
- redFlags.ts imports nothing but @/types (read the file as text)
- triage() is synchronous and takes under 5 ms for the longest eval input

Report department accuracy on non-emergency eval cases, but don't overfit: if a case looks
wrong, list it. Don't bend the engine to fit it.

YOU MAY EDIT ONLY: src/lib/triage/** except __fixtures__/ and lexicon/
FIRST: post the plan, including how rules are represented and the confidence formula. Stop.
```

**👤 Verify:** read `redFlags.ts` next to `red-flags.md`, rule by rule. Then commit your
holdout cases (C3a) as `__fixtures__/holdout-cases.ts` and run them. Record the score.
Every emergency miss on a holdout case is a blocker.

---

## C6 · 🤖 Codex CLI · Facility ranking · 1–2 hours

Can run in parallel with C5 in its own worktree.

```text
Read AGENTS.md, src/types/index.ts, docs/triage/vocabulary.md.

TASK: src/lib/triage/rank.ts and src/lib/triage/__tests__/rank.test.ts.

rankFacilities({ origin?, department, urgency, facilities, loadByFacility, limit = 3 })
  → FacilityId[]

score = wP·proximity + wC·capability + wA·availability
- proximity: Haversine km; 1 at 0 km, falling linearly to 0 at 50 km
- capability: 1 if the facility offers the department; 0.5 if its tier can stabilise and
  refer per vocabulary.md; otherwise excluded
- availability: 1 − min(1, queueLength / dailyCapacity)
- weights: routine and self-care 0.45/0.35/0.20 · urgent 0.55/0.35/0.10 · emergency 0.70/0.30/0.00
- tie-break: nearer first, then lower FacilityId
- no origin: sort by capability, then availability

Export the weights as a named constant. Pure function.
Tests: a hand-computed 3-facility example; emergency excludes an incapable facility even
when it's the closest; no origin; deterministic order on ties.
YOU MAY EDIT ONLY: src/lib/triage/rank.ts, src/lib/triage/__tests__/rank.test.ts
```

---

## C7 · 🤖 Claude Code · Eval runner, report and CI gate · 1–2 hours

```text
Read AGENTS.md and src/lib/triage/**.

TASK:
1. src/lib/triage/eval/run.ts, run with `pnpm eval:triage` (add the script; tsx is already
   installed). It runs every case in __fixtures__/ (eval, holdout, red-team) through triage()
   and writes docs/triage/eval-triage.md with:
   - a summary: emergency recall, emergency false-positive rate, department accuracy, and
     urgency accuracy, per fixture file and per category
   - a table of every failing case: id, input (truncated), expected, actual, fired rules
   - the git commit SHA and date at the top
2. src/lib/triage/__tests__/gate.test.ts, the CI gate:
   - emergency recall = 100% across all fixture files (no exceptions)
   - department accuracy on non-emergency eval cases ≥ DEPT_ACCURACY_THRESHOLD, exported
     from the test file with a placeholder of 0.8 and a comment "set by lane owner"
YOU MAY EDIT ONLY: src/lib/triage/eval/**, src/lib/triage/__tests__/gate.test.ts,
docs/triage/eval-triage.md, package.json (scripts only)
```

**👤 Decide** the department accuracy threshold after looking at the first report. Set it honestly, not to whatever passes today.

---

## C8 · 🤖 Codex cloud · Red team → fix loop · 2 rounds, ~1 hour each

**Why a different agent:** the author of the engine is the worst one to attack it.

```text
Read AGENTS.md, docs/triage/red-flags.md, src/lib/triage/**.

You are a red-team clinician-engineer. Find inputs where:
(a) triage() does NOT return "emergency" for a presentation red-flags.md defines as one
(b) triage() returns "emergency" for something clearly benign
(c) negation or language handling flips the meaning

Method: read the rules and lexicon, reason about gaps (missing synonyms, word order,
spelling variants, negation scope leaking across clauses, code-mixing, age or pregnancy
modifiers not applied), then actually run each candidate through triage() in a scratch test.

Output: add every CONFIRMED failure to src/lib/triage/__fixtures__/red-team-cases.ts (the
same shape as eval-cases, plus foundBy: "red-team"), plus a report table:
input | expected | actual | suspected cause.
Do NOT fix the engine. Do not edit any other file.
```

Then feed the failures back to Claude Code:

```text
Read AGENTS.md. src/lib/triage/__fixtures__/red-team-cases.ts has new failing cases.
Make them pass by fixing the engine or proposing lexicon additions. Never special-case a
single input string. All existing eval and holdout cases must still pass. If a fix needs a
lexicon change, list the exact phrases for Lane E to review rather than merging them
silently. Run pnpm check and pnpm eval:triage; paste both outputs.
YOU MAY EDIT ONLY: src/lib/triage/** except __fixtures__/
```

Stop when a red-team round finds no new emergency misses.

---

## C9 · 👤 HUMAN · Clinical review · 90 minutes

Sit with your reviewer and walk through `red-flags.md`, the latest `eval-triage.md` and the
urgency band definitions. Record the session in `docs/triage/clinical-review.md`: reviewer
name and qualification, date, every change requested, and what you did about each.

**No reviewer available?** Write that in the file, and say it on the deck: *"Rules are
sourced from WHO and MoHFW guidance. Clinical validation is our next step."* Judges respect
honesty far more than a claim that falls apart under questions.

---

## C10 · 🤖 Codex CLI · Integration doc for Lane A · 30 min

```text
Read AGENTS.md and src/lib/triage/**. Write docs/triage/README.md for the frontend developer:
what to import, the call signatures, a complete example of calling triage() with mock
facilities and rendering the result (no JSX, just data flow), how to tell an emergency
result apart, what matchedSymptomIds are for (showing the patient's input back, labels come
from Lane E's content keys), and the three things the UI must never do: show a condition
name, hide the disclaimer, or delay the emergency overlay behind any other step.
YOU MAY EDIT ONLY: docs/triage/README.md
```

---

## Failure modes

| What you see | Cause | Fix |
|---|---|---|
| 100% on eval cases, poor on holdout | The engine overfit cases it could see | Holdout kept out of the repo until C5 was done; fix generally, never per-string |
| Citation link doesn't contain the quote | Invented or misremembered source | Open every link (C2). Unsourced rules go to the clinician list. |
| Marathi input matches nothing | The lexicon is textbook Marathi | Real phrasings (C0) plus native review (C4) |
| "No chest pain, but breathless" fires the chest-pain rule | Negation scope too wide or too narrow | Negation tests in C5, red-team round (C8) |
| A diagnosis appears in output | Someone added a string field | The key-allowlist test in C5 and the type itself |

## Lane done when

- [ ] Emergency recall 100% across eval, holdout and red-team cases, gated in CI
- [ ] Every red-flag source opened by a person, and clinical review recorded (or its absence documented)
- [ ] The latest red-team round found no new emergency misses
- [ ] Lexicon native-reviewed in Hindi and Marathi
- [ ] `docs/triage/README.md` handed to Lane A, and `eval-triage.md` handed to Lane F
