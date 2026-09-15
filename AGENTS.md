# AGENTS.md — Swasthya prototype

Instructions for every AI agent in this repo: Claude Code, Codex, Antigravity.
Read all of this before doing anything.

## What this is

A UI-only React prototype for Smart India Hackathon problem SIH26133 (Govt. of Maharashtra):
rural public healthcare access. The flow runs triage → facility → booking → live queue →
consultation → records → medicines → complaints → admin analytics.

**There is no backend in this build.** No network calls from `src/`. All data is typed,
deterministic mock data.

## Source documents, in order of precedence

When documents disagree, the one higher in this list wins:

1. `docs/DELEGATION_BRIEF.md`: scope, lanes, file ownership, demo path
2. `docs/decisions.md`: decisions the team made after the brief
3. `docs/reference/settled-decisions.md`: use its **"Settled decisions"** section (safety,
   privacy, data modelling) and its event list. **Its tech stack (Python, FastAPI, Kafka,
   ClickHouse, LiveKit) does NOT apply to this build.**
4. `docs/reference/architecture.md`: the future production architecture
5. `docs/reference/handbook.md`: personas, user stories, screen list, API naming ideas.
   **Its tech stack (Next.js, Express, Prisma, Groq) does NOT apply to this build.**

## Stack

React 18 · Vite · TypeScript (strict) · React Router v6 · Tailwind v4 · lucide-react · Recharts · Vitest · Playwright (e2e) · pnpm

## Commands

| Command | What it does |
|---|---|
| `pnpm dev` | Run the app |
| `pnpm check` | typecheck + lint + unit tests. **Must pass before you report done.** |
| `pnpm test` | Unit tests only |
| `pnpm e2e` | Playwright tests (once Lane F has added them) |

## Ownership: you may edit only the paths your task names

| Path | Lane |
|---|---|
| `src/app/**`, `src/features/**`, `src/components/**` | A: Frontend |
| `src/types/index.ts`, `src/lib/mock-data/**`, `data/reference/**`, `docs/data-inventory.md` | B: Data contracts |
| `src/lib/triage/**`, `docs/triage/**` | C: Triage logic |
| `docs/api/**`, `docs/erd.md` | D: Backend contract |
| `src/lib/content/**`, `docs/copy-rules.md`, `docs/content/**` | E: Content & i18n |
| `docs/demo-script.md`, `docs/qa/**`, `docs/deck/**`, `e2e/**`, `playwright.config.ts` | F: Demo & QA |
| `AGENTS.md`, `CLAUDE.md`, `docs/decisions.md`, `.github/**` | Project lead |

If your task needs a change outside your paths, **stop and say so.** Don't make the change.

## Hard rules

1. **Stay in scope.** Edit only the paths the task names. Don't refactor or "improve" anything else.
2. **No new dependencies** unless the task explicitly allows one by name.
3. **No network.** No `fetch`, no HTTP clients, no API keys, no CDN assets anywhere in `src/`.
4. **The system never diagnoses.** Triage output, triage and emergency copy, and all
   system-generated text contain **no disease or condition names**. `TriageResult` holds
   only: urgency band, department code, confidence, facility IDs, fired rule IDs and matched
   symptom IDs. All of these are enums or IDs; **none is a free-text field.**
   Doctor-authored clinical records in mock data may use clinical terms, as a real record would.
5. **No inline user-facing strings.** Every piece of copy comes from `src/lib/content`.
6. **Privacy.** Never produce anything that looks like a full Aadhaar number; only
   `aadhaarLast4` exists. Mock phone numbers use the pattern `+91 90000 0XXXX`. Mock
   people are fictional.
7. **Deterministic.** No `Math.random()` or `Date.now()` in mock data or triage. Use
   `src/lib/mock-data/_rng.ts` and `_clock.ts`.
8. **Endpoint comments.** Above every mock-data export, write
   `// TODO(backend): METHOD /api/v1/...`, taking the endpoint from `docs/api/endpoints.md`.
9. **Cite or leave it out.** Every medical claim, facility fact or dataset row carries a
   source URL you actually opened. If you can't find a source, say so. **Never invent a
   citation, name, coordinate or code.**
10. **Show your results.** Run `pnpm check` and paste the real output. If something failed,
    was skipped, or you weren't sure, say that plainly.
11. **Never weaken a test to make it pass.** Fix the code or data, or report the conflict.

## Done means

- `pnpm check` passes, with the output pasted
- `git diff --stat develop...HEAD` shows only owned paths
- Your report lists: files changed, commands and their output, decisions you made, open questions

## When unsure

Stop and ask. Don't build two alternatives. Don't guess at a decision `docs/decisions.md` doesn't cover.
