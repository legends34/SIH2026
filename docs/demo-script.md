# Demo script: 6 minutes

> Owner: Lane F · Version 0 · 2026-09-15 · Revise at every checkpoint.
> Fixtures: `src/lib/mock-data/hero.ts` on `feat/b-data-contracts-new`.
> Regression guard: `e2e/demo-path.spec.ts` (one test per step below).

> ⚠️ **Resolve before rehearsing** (`docs/qa/cross-lane-issues.md`):
> **#1**: the fixtures are set in Gurugram (Haryana), but this is a Maharashtra problem statement.
> **#2**: the demo language is Hindi (hero) vs Marathi (Lane E default).
> **#13**: the CHC distance is 11 km in the story, 17 km by coordinates.
> This script follows the fixtures **as they are today**. Change the names and places here when the data changes.

**Status:** every step is **[NOT BUILT]**. No Lane A screens exist yet. This script is the target.

---

## Before you start

| | |
|---|---|
| **Runtime budget** | 5:20 of content + 0:40 slack = **6:00** |
| **Laptop, window 1 (1280px)** | Tab A: doctor OPD `/doctor` (Dr. Rakesh Sharma) · Tab B: pharmacist `/pharmacist` (Mehta) · Tab C: admin `/admin` (Priya Singh) |
| **Laptop, window 2 (375px, side by side)** | Tab D: patient `/patient/queue/fac_0005` (Sunita). **Same browser as window 1**: step 08 only syncs between tabs of one browser (no backend). |
| **Real phone** | Patient app at `/auth/language`, for steps 01–06 and 10–13, where mobile credibility matters |
| **Locale** | Patient: Hindi (hero language). Staff tabs: English. |
| **Reset before every run** | Close all tabs → clear site data (localStorage + sessionStorage) → reopen the tabs above. The hero state returns: token 19, now serving 14. |
| **Offline** | Run from `pnpm build && pnpm start` on the laptop. Wi-Fi off. |
| **Backup** | Recordings folder on the demo laptop's desktop, with clips named `step-NN.mp4` |

---

## 0:00 · Opening (20 s, no UI)

> "Sunita is 34. Last month she walked 20 km to a health centre with her father-in-law Ramesh.
> The doctor's OPD was full, and his diabetes medicine was out of stock. She lost a day's wage
> and came home with nothing. She had nowhere to complain.
> That's four gaps: **routing, waiting, stock, and accountability**. Here's what closes them."

---

## The walkthrough

| # | Budget | Screen / route | Presenter says (≤2 sentences) | Exact clicks / taps | What the judge should notice | If it breaks |
|---|---|---|---|---|---|---|
| **01** [NOT BUILT] | 10 s | Language → login → OTP · `/auth/language` | "She picks her language and signs in with her phone number. No app store, no password." | Phone: tap **हिन्दी** → type `+91 90000 00001` → **Send OTP** → any 6 digits → **Verify** | Three big language cards; OTP login; lands on home in Hindi | Skip to 02 (already signed in on Tab D) |
| **02** [NOT BUILT] | 10 s | Patient home · `/patient` | "One phone, one account, the whole household: Sunita, Ramesh and Aarav." | Point at the patient switcher, then the next-appointment card | **1:N household switcher** (3 people); today's token **19** on the home card | Screenshot slide 02 |
| **03** [NOT BUILT] | 25 s | Triage · `/patient/triage` → result | "She has a cough, a sore throat and body ache. The app tells her *where* to go and *how soon*. It never tells her what she has." | Tap chips **cough**, **sore throat**, **body ache** → **Submit** | Urgency badge, department, facility cards, **disclaimer visible**, **no disease name anywhere** | Clip `step-03.mp4` |
| **04** [NOT BUILT] | 30 s | Emergency overlay | "Now her father-in-law: chest pain spreading to his arm, cold sweat. That rule runs before any AI, and it needs no internet." | Back → switch patient to **Ramesh** → chips **chest pain radiating** + **chest pain with sweating** → **Submit** | **Full-screen red overlay instantly**, a working **Call 108** button, nearest emergency facility. *Pause here for 3 seconds.* | Clip `step-04.mp4`. **Don't skip this step.** |
| **05** [NOT BUILT] | 15 s | Facility list → detail · `/patient/facilities` | "Back to Sunita's cough: these are government facilities that can treat it, ranked by distance, capability and how busy they are." | Close overlay → switch back to **Sunita** → **Facilities** → tap **Primary Health Centre, Wazirabad** | Tier badges, departments, timings; ranking isn't distance alone | Skip to 06 |
| **06** [NOT BUILT] | 20 s | Booking → token receipt · `/patient/book/fac_0005` | "She books a morning OPD session and gets a token before leaving home." | **General OPD** → today's morning session → **Confirm** → open the receipt | **Token 19**, huge; the facility; directions | Show `/patient/appointments/appt_000001` directly |
| **07** [NOT BUILT] | 10 s | Live queue · `/patient/queue/fac_0005` | "She can see exactly where the queue is, so she leaves home at the right time." | Switch to laptop window 2 (Tab D) | **Now serving 14 · your token 19 · ETA** | Screenshot slide 07 |
| **08** [NOT BUILT] | 30 s | Doctor OPD · `/doctor` ↔ patient queue | "At the PHC, Dr. Sharma calls the next patient. Watch Sunita's screen." | Tab A: click **Call next**. Keep both windows visible. | **Patient screen changes 14 → 15 within 2 s** without a reload. *Peak moment: say nothing for 2 seconds.* | Clip `step-08.mp4` |
| **09** [NOT BUILT] | 25 s | Consultation · `/doctor/consult/appt_000001` | "When Sunita's turn comes, the doctor records vitals and prescribes. Stock is shown live, before the prescription is written." | Tab A: open Sunita → BP `118/76` → search **Paracetamol** → add → **Save** | **Stock indicator next to each drug**; saved record | Skip to 10 |
| **10** [NOT BUILT] | 15 s | Records timeline · `/patient/records` | "Every visit stays with the family, including Ramesh's two years of diabetes and blood-pressure care." | Phone: **Records** → switch to **Ramesh** | A timeline of **8+ entries**; the Metformin prescription is visible | Screenshot slide 10 |
| **11** [NOT BUILT] | 20 s | Medicine search · `/patient/medicines` | "Before travelling, she checks whether Ramesh's Metformin is in stock." | Tap **Check stock** on the Metformin prescription (or search `Metformin`) | **Out** at her PHC · **Available** at the CHC nearby · "updated X hours ago" · no raw counts | Clip `step-11.mp4` |
| **12** [NOT BUILT] | 15 s | Pharmacist inventory · `/pharmacist` | "The pharmacist logs a delivery in seconds. It's a ledger entry, never an overwrite." | Tab B: row **Metformin 500 mg** → quantity `200` → **Save** | Status flips **out → available** | Skip to 13 |
| **13** [NOT BUILT] | 30 s | Complaint · `/patient/complaints/new` → preview → tracker | "She complains in her own words. The app turns it into an official complaint she can edit, then she tracks it like a parcel." | Phone: **Complaints → New** → type/speak the narrative → **Generate** → show editable fields → open **cmp_0001** | **Every generated field is editable**; status **In review**; **SLA due tomorrow**; timeline | Screenshot slides 13a/13b |
| **14** [NOT BUILT] | 20 s | Admin analytics · `/admin` | "And the district officer finally sees the whole picture: footfall, waiting times, stock-outs, complaints against their SLAs." | Tab C: KPI row → **Operational** tab → **Clinical** tab | KPIs + charts that **match the lists** seen earlier | Screenshot slide 14 |

---

## 5:40 · Close (15 s)

> "Everything you saw runs offline on this laptop today: [BUILT]. The production design, with
> real booking concurrency, an immutable audit log, consent and ABHA, is fully specified:
> [DESIGNED]. Next is a pilot with one block health office: [ROADMAP]. Thank you."

---

## Time budget check

| Segment | Seconds |
|---|---|
| Opening | 20 |
| Steps 01–14 | 10 + 10 + 25 + 30 + 15 + 20 + 10 + 30 + 25 + 15 + 20 + 15 + 30 + 20 = **275** |
| Close | 15 |
| **Total** | **310 s = 5:10**, which leaves **50 s slack** for one stumble or one judge interruption |

## If you lose time: cut in this order

1. Step 12 (say "the pharmacist restocks" over step 11's screen)
2. Step 05 (go straight from triage to booking)
3. Step 09 (mention the live stock indicator during step 08)

**Never cut 04 or 08.** They're the two moments judges remember.

## If a judge interrupts

Answer in one sentence, say "let me show you", and resume at the **next peak** (04 or 08), not where you stopped.

---

## Changelog

| Date | Change | Why |
|---|---|---|
| 2026-09-15 | v0 created from brief §5 + `hero.ts` | Initial script |
| 2026-09-15 | Metformin moved from Sunita's consult (09) to Ramesh's refill (10–13) | The hero appointment is Sunita's cough consult; Metformin is Ramesh's long-term medicine. The old order had the doctor prescribing diabetes medicine for a cough. |
