# Agent Playbook — Start Here

**Swasthya · SIH26133 prototype · Lanes B, C, D, E, F**

This folder breaks `DELEGATION_BRIEF.md` into step-by-step work for the five lanes that
aren't frontend. Agents do about 90% of it. Lane A (frontend) is left out on purpose for now.

| File | Who reads it |
|---|---|
| `00-START-HERE.md` | Everyone, first |
| `lane-b-data-contracts.md` | Lane B owner |
| `lane-c-triage.md` | Lane C owner |
| `lane-d-backend-contract.md` | Lane D owner |
| `lane-e-content-i18n.md` | Lane E owner |
| `lane-f-demo-qa.md` | Lane F owner |
| `templates/` | Whoever sets up the repo: `AGENTS.md`, `CLAUDE.md`, `CODEOWNERS`, PR template |

Markers used in every lane file:

- **🤖 AGENT** — a step an agent does, with the prompt to paste
- **👤 HUMAN** — a step a person must do. An agent can't do these, or shouldn't be trusted to.

---

## 1. What your job turns into

When agents write 90% of the output, you aren't the writer any more. You do three things:

1. **Specify.** Decide exactly what gets built, down to file paths and what "done" means.
   A vague prompt gets work that looks right and is wrong.
2. **Decide.** Agents draft the options and people choose.
3. **Verify.** Agents get things wrong confidently, in ways you can predict. Your job is to catch it.

Agents fail on this project in three ways. Each playbook has a counter to each one:

| How agents fail | Where it will hurt | The counter built into every lane |
|---|---|---|
| **They make things up** | Medical citations, facility names, coordinates, Marathi wording | Every fact carries a source URL. A person opens the link, and a native speaker signs off on translations. |
| **They stray** | Editing files outside their lane, adding dependencies, "improving" types they don't own | The ownership map in `AGENTS.md`, CODEOWNERS, and a "you may edit only" line in every prompt |
| **They claim results** | "All tests pass" when the tests were never run | Checks you run yourself (`pnpm check`), and typed contracts that fail to compile when something is wrong |

**The habit that matters most: turn every rule into a test or a type.** "Never show a
disease name" written as a sentence is only a hope. Written as a Vitest scan over every
locale file, it's a guarantee no agent can talk its way around.

---

## 2. Which agent does which job

| Kind of job | Use | Why |
|---|---|---|
| Designing a contract, safety-critical logic, anything where the reasoning matters more than the typing | **Claude Code**, in plan mode first | Good at reasoning across many files and following long lists of constraints. Plan mode lets you fix the approach before any code is written. |
| Well-defined, independent chunks you can run 3–5 at a time | **Codex cloud tasks** | Each task runs in its own sandbox and comes back as a PR, so you get real parallel work without juggling worktrees. |
| Small local edits and second-opinion reviews | **Codex CLI** | Fast. Running `/review` against `develop` is a good independent check on another agent's diff. |
| Anything that needs a browser: web research, clicking through the UI, screenshots | **Antigravity** | Its browser agent can open sources and drive the app, then hands back screenshots and recordings as evidence. |
| Reviewing an agent's work | **A different agent from the one that wrote it** | A model reviewing its own work has the same blind spots it had while writing. |

Rule of thumb: **Claude Code designs, Codex runs things in parallel, Antigravity uses the browser.**

These tools change quickly, so a menu name here may not match your version. The workflow still holds.

---

## 3. Day-0 setup (once, about 1 hour, whoever owns the repo)

### 0.1 · 👤 HUMAN · Create the repo

Run these by hand. It's faster than writing a prompt for them.

```bash
corepack enable
pnpm create vite@latest swasthya --template react-ts
```

```bash
cd swasthya && pnpm install && git init -b main && git add -A && git commit -m "chore: scaffold vite react-ts" && git switch -c develop
```

Create the GitHub repo, then push both `main` and `develop`.

### 0.2 · 👤 HUMAN · Put the source documents in the repo

Agents can only follow documents they can read.

```bash
mkdir -p docs/reference && cp ~/Documents/sih-healthcare/DELEGATION_BRIEF.md docs/ && cp ~/Documents/sih-healthcare/healthcare-platform-architecture.md docs/reference/architecture.md && cp ~/Documents/sih-healthcare/CLAUDE_CODE_HANDOFF_PROMPT.md docs/reference/settled-decisions.md && cp ~/Downloads/sih-arogyasetu-handbook.md docs/reference/handbook.md && cp -R ~/Documents/sih-healthcare/playbooks docs/playbooks
```

Also create an empty `docs/decisions.md`. The Day-1 meeting (§7) fills it in.

### 0.3 · 👤 HUMAN · Add the agent instruction files

Copy these from `templates/` to the repo root:

- `templates/AGENTS.md` → `AGENTS.md`. Codex and Antigravity read it, and it's the single source of rules.
- `templates/CLAUDE.md` → `CLAUDE.md`. It imports `AGENTS.md`, so Claude Code follows the same rules.
- `templates/CODEOWNERS` → `.github/CODEOWNERS`. Replace the `@handles` with real GitHub usernames.
- `templates/pull_request_template.md` → `.github/pull_request_template.md`

Commit to `develop`.

### 0.4 · 🤖 AGENT · Claude Code · Tooling every lane depends on

Run `claude` in the repo root and paste:

```text
Read AGENTS.md first. This is a fresh Vite + React + TypeScript repo.

TASK: set up the tooling every lane depends on. No UI work, no feature code.

1. TypeScript: "strict": true and "noUncheckedIndexedAccess": true in the app tsconfig.
   Path alias "@/*" -> "src/*" in both tsconfig and vite.config.ts.
2. Add Vitest (node environment) and tsx as devDependencies. package.json scripts:
   "typecheck" (tsc against the template's tsconfig layout, no emit),
   "test": "vitest run", "lint": "eslint .",
   "check": runs typecheck, lint and test in sequence and fails on the first failure.
3. Create these directories, each with a one-line README.md naming the owning lane
   (take it from the ownership map in AGENTS.md):
   src/types, src/lib/mock-data, src/lib/triage, src/lib/content, data/reference,
   docs/api, docs/triage, docs/content, docs/qa, docs/deck, e2e.
4. src/types/index.ts containing only: export {};
5. One trivial passing test at src/lib/__tests__/sanity.test.ts to prove the pipeline.
6. .nvmrc with the major version from `node -v`.
7. .github/workflows/ci.yml: on pull_request to develop and main, install with
   pnpm install --frozen-lockfile, then pnpm check. Use pnpm/action-setup and
   actions/setup-node reading .nvmrc.

Add no dependencies other than vitest and tsx.
DONE WHEN: pnpm check passes locally. Paste the real output.
REPORT: files changed, commands run with output, anything you were unsure about.
```

**👤 Verify:** run `pnpm check` yourself, then open a throwaway PR and confirm CI goes green.

### 0.5 · 👤 HUMAN · GitHub settings

- Protect `main` and `develop`: require a PR, 1 approval, **review from Code Owners**, and passing CI.
- Invite all six members.

### 0.6 · 👤 HUMAN · Connect the agents

| Agent | Setup |
|---|---|
| **Claude Code** | Run `claude` in the repo root. `CLAUDE.md` loads automatically. Shift+Tab cycles into plan mode. |
| **Codex cloud** | In Codex, connect GitHub and pick the repo. Create an environment with setup script `corepack enable && pnpm install --frozen-lockfile`. Once Lane F adds Playwright, append `&& pnpm exec playwright install --with-deps chromium`. Always start tasks from `develop`. |
| **Codex CLI** | Run `codex` in the repo root. It reads `AGENTS.md`. |
| **Antigravity** | Open the repo folder as the workspace. Add a workspace rule: *"Before any task, read AGENTS.md at the repo root and follow it exactly."* Use its planning mode for anything bigger than one file, and read the plan before letting it run. Allow the browser extension when asked. |

This build needs **no API keys**: no LLM calls, no backend, no paid services. So there are no
secrets to leak. Keep it that way.

### 0.7 · 👤 HUMAN · Day-1 decision meeting

45 minutes, everyone present. Work through §7 and write the answers into `docs/decisions.md`.

---

## 4. The loop for every task, in every lane

```
 card ─► pick agent ─► branch/worktree ─► prompt (plan first) ─► approve plan
   ─► agent builds + runs checks ─► YOU run checks ─► other agent reviews
   ─► you read the diff ─► PR ─► code owner approves ─► merge at the daily window
```

**1. One card = one PR = one agent session.** If you can't describe the card in one sentence, split it.

**2. Isolate parallel local agents with worktrees.** Two agents working in the same checkout will overwrite each other's changes.

```bash
git switch develop && git pull && git worktree add ../swasthya-b-types -b feat/b-types-v1 develop
```

```bash
cd ../swasthya-b-types && pnpm install
```

Then start `claude` or `codex` there, or open that folder in Antigravity. After the PR merges:

```bash
git worktree remove ../swasthya-b-types
```

Codex cloud tasks are already isolated, so they don't need worktrees.

**3. Every prompt follows this shape.** The lane files are written this way. When you write your own, keep it:

```text
Read AGENTS.md, <the exact files this task needs>.

TASK: <one deliverable, with its file path>

<specifics: structure, rules, examples>

YOU MAY EDIT ONLY: <paths>
DONE WHEN: <commands that must pass>. Paste the real output.
REPORT: files changed, commands + output, decisions you made, open questions.
FIRST: post a plan and stop.   ← for anything that creates or changes a contract
```

**4. When the agent reports back, don't believe it. Check.** Run `pnpm check` yourself.

**5. Get a different agent to review, then read the diff yourself.** See §5.

**6. Merge only in the daily merge window.** Lane A merges last.

---

## 5. Review: who checks whom

| Written by | Reviewed by |
|---|---|
| Claude Code | Codex CLI: `/review` against `develop` |
| Codex (cloud or CLI) | Claude Code: paste the review prompt below |
| Antigravity | Claude Code or Codex, **plus** a person opening the cited sources |

**Review prompt (works in any agent):**

```text
Read AGENTS.md. Review the changes on this branch against develop (git diff develop...HEAD).
Do not edit any files.

Report blockers first:
1. Files changed outside the paths the PR description says it owns
2. Violations of any hard rule in AGENTS.md
3. Claims in the PR description not backed by the diff or by command output
4. Tests that assert nothing meaningful, or that were weakened to make them pass
5. Invented facts: citations, names, coordinates or codes that can't be verified
Then correctness problems, then nits.

Output a table: file:line | issue | severity (blocker/major/minor) | suggested fix.
```

**👤 Your 5-minute diff read. Never skip it:**

1. `git diff --stat develop...HEAD`: did it only touch the paths it was supposed to?
2. Run `pnpm check` yourself.
3. Read the **tests** before the code. Do they test the rule, or just repeat what the implementation does?
4. Open 3 cited sources at random.
5. Search the diff for the usual shortcuts:

```bash
git diff develop...HEAD | grep -nE 'Math\.random|Date\.now|fetch\(|: any\b|@ts-(ignore|expect-error)|\.skip\(|\.only\(|eslint-disable'
```

---

## 6. Timeline and handoffs

The round date isn't set yet. Days below count from repo setup. If the round is sooner,
squeeze the middle, but **the freeze stays 3 days before the round.**

| When | Lane B | Lane C | Lane D | Lane E | Lane F |
|---|---|---|---|---|---|
| **Day 1** | Decisions meeting · B1 data inventory | C1 vocabulary draft | D2 slot proposal (feeds the meeting) | E1 i18n module | Hero story with B · F2 DoD & QA matrix |
| **Day 2 · gate** | B2 types → B3 review → **freeze `contract-v1`** | Vocabulary signed off → to B · 👤 10 holdout cases · C2 red-flag research starts | D1 endpoint list v0 → published | E2 copy rules · 👤 register decision | F1 demo script v0 · F3 smoke tests |
| **Days 3–4** | B4 reference research · B5 foundation + hero | C3 eval cases · C4 lexicon (in parallel) | D3 schema + ERD | E3 English copy (parallel tasks) · E4 safety copy | Smoke tests in CI · F7 deck outline |
| **Days 5–6** | B6 domain data, wave 1 then wave 2 | C5 engine · C6 ranking | D4 OpenAPI · D6 events | E5 translations · E6 back-translation | F8 Q&A bank |
| **Days 7–8** | B7 integrity tests · B8 TODO sync | C7 eval report · C8 red-team loop · holdout score | D7 concurrency · D8 security · D5 drift check | E7 native review · E8 guard tests · E9 fonts | F4 demo-path e2e as screens land |
| **Halfway** | **Checkpoint:** F runs the full demo on whatever exists. Make the §7 cut calls from the brief. |||||
| **After** | Contract changes only (B9) | C9 👤 clinical review · C10 integration doc | Can be reassigned to Lane A | E10 accessibility audit | F5 exploratory · F6 device · F9–F11 |
| **Freeze** | Round minus 3 days. Only seed data, bug fixes, deck and rehearsals from here. |||||

### Handoffs: what each lane needs from the others, and by when

| Producer → consumer | Artifact | Needed by |
|---|---|---|
| C → B | `docs/triage/vocabulary.md` (department codes, urgency bands, symptom IDs) | Day 2 morning. **B2 can't finish without it.** |
| B → C, D, E, A | `src/types/index.ts` tagged `contract-v1` | Day 2 evening |
| D → B | `docs/api/endpoints.md` (endpoint names for `TODO(backend)` comments) | Day 3 |
| B → F | `src/lib/mock-data/hero.ts` (named demo fixtures) | Day 4 |
| C ↔ E | The lexicon needs native review; symptom labels need a key for every symptom | Day 5 |
| E → F | `src/lib/content/locales.ts` (for smoke tests that switch locale) | Day 2 |
| D → F | `docs/api/concurrency.md`, `docs/api/security.md` (for the deck and Q&A) | Day 8 |

---

## 7. Decisions for people to make on Day 1, before any agent runs

Agents may draft options for these. People decide, and the answers go in `docs/decisions.md`.

| # | Decision | Recommendation | Why it can't wait |
|---|---|---|---|
| 1 | **Patients per account:** 1:1 or 1:N | **1:N.** One `User` manages several `Patient`s, with an active-patient switcher. | Shared household phones. Lane B's types depend on it, and changing it later means redesigning Booking, Profile and Records. |
| 2 | **Slot semantics:** capacity-1 timed slots, capacity-N session blocks, or pure token queue? Do walk-ins share a token sequence with bookings? | **Capacity-N session blocks** (OPD hours in ~30-min blocks, each with a capacity). **One token sequence** per facility/department/day, each token tagged `booked` or `walk_in`. | A rural PHC OPD is mostly walk-ins, so timed capacity-1 slots are fiction there. One sequence means one visible queue. Lane D brings the one-page comparison (D2). |
| 3 | **Department codes and urgency band definitions** | Lane C drafts them in 1 hour (C1) and the team signs off | Every lane uses these words |
| 4 | **Triage input model** | **Symptom chips first, free text optional,** matched by a multilingual phrase lexicon. No LLM in this build. Voice is a UI affordance only. | Keeps the engine deterministic and testable, and keeps the demo working with no network |
| 5 | **Does `TriageResult` include `matchedSymptomIds`?** | **Yes,** as enum IDs only. It shows the patient's own input back ("we understood: chest pain, sweating"), not a finding. | A UX need that doesn't break the no-free-text rule |
| 6 | **Round date** and **demo language** | — | Sets the freeze date, and whether Marathi is P0 |
| 7 | **The two-window demo:** doctor clicks "call next" and the patient's queue updates | Lane A syncs tabs with `BroadcastChannel`, and the patient view runs as a 375px window **on the same laptop** | UI-only means no server, so a real phone and a laptop **can't** sync. Decide now rather than discovering it on stage. |
| 8 | **Clinical reviewer** for red flags and safety copy | A doctor, intern or final-year MBBS student you can get 90 minutes from | If you can't get one, the deck has to say so honestly |
| 9 | **Final approver** for `AGENTS.md`, `docs/decisions.md` and merges to `main` | Kanav | Someone has to own the rules |

---

## 8. Things agents never do alone, in any lane

- Merge anything, anywhere
- Make any decision in §7
- Get trusted on a citation, coordinate, facility name or translation nobody opened or read
- Write final medical wording that patients will see
- Change GitHub settings, add collaborators, or connect agents to accounts
- Write a claim in the deck that nobody checked against the build
- Present

Everything else is fair game for agents. That's the 90%.
