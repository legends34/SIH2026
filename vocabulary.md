# Triage Vocabulary — v1 (draft, pending team sign-off)

> Decision document for humans. No code. Definitions marked **(proposed)** are judgment
> calls, not sourced facts — read those aloud at sign-off especially.

---

## 1. UrgencyBand

| Band | Operational definition | Facility tiers | Example presentations (symptom-level only) |
|---|---|---|---|
| `emergency` | Patient must reach care **immediately** — go now, don't wait for a slot. Source: WHO Emergency Triage Assessment and Treatment (ETAT) course defines this tier as immediate life-threatening signs requiring treatment before any other action. | CHC, SDH, DH (any facility that can stabilise) | Chest pain with sweating and arm numbness; sudden one-sided weakness; can't breathe / gasping; unconscious or fitting; heavy bleeding; severe burns |
| `urgent` | See a doctor **within 24 hours**. Not immediately life-threatening but risk of getting worse fast. **(proposed threshold — team should confirm 24h is right for this context)** | PHC and above | High fever with vomiting; deep cut needing stitches; persistent vomiting in a child; moderate breathing difficulty |
| `routine` | Book a normal OPD visit, no specific urgency. **(proposed)** | SC and above | Mild recurring headache; skin rash without fever; long-standing joint pain |
| `self-care` | No facility visit needed right now; home management + watch for red flags. **(proposed)** | — | Common cold symptoms alone, no other red flags; minor bruise |

---

## 2. DepartmentCode

| Code | Plain-language intent | Lowest tier offering it | Tier that stabilises & refers if unavailable |
|---|---|---|---|
| `EMERGENCY` | Life-threatening presentations, any cause | CHC | PHC (stabilise + refer) |
| `GEN_MED` | Adult general medicine — fevers, infections, chronic disease follow-up | SC/PHC | — |
| `PAEDS` | Children under 12, non-newborn | PHC | SC (stabilise + refer) |
| `NEONATAL` | Newborns under 2 months | CHC | PHC (stabilise + refer) |
| `OBGYN` | Pregnancy, postpartum, gynaecological | PHC | SC (stabilise + refer) |
| `SURGERY_GEN` | Trauma, wounds, abdominal pain needing surgical eval | CHC | PHC (stabilise + refer) |
| `ORTHO` | Fractures, sprains, joint injury | CHC | PHC (stabilise + refer) |
| `CARDIO` | Chest pain, cardiac symptoms — **(proposed: route to EMERGENCY first, CARDIO is the downstream department at DH-tier, not a first-contact routing target)** | DH | CHC (stabilise + refer up) |
| `NEURO` | Seizures, stroke signs, altered consciousness — same note as CARDIO: first contact is EMERGENCY | DH | CHC (stabilise + refer up) |
| `ENT` | Ear/nose/throat | PHC | SC (stabilise + refer) |
| `OPHTHALMOLOGY` | Eye complaints, including injury | CHC | PHC (stabilise + refer) |
| `DERMATOLOGY` | Skin conditions, non-emergency | PHC | — |
| `PSYCHIATRY` | Mental health, including suicidal ideation — **(proposed: suicidal intent routes to EMERGENCY per red-flag list, not directly here)** | SDH | PHC (stabilise + refer) |
| `TOXICOLOGY` | Poisoning, snakebite — **(proposed: also fires EMERGENCY red-flag; this is the downstream department)** | CHC | PHC (stabilise + refer) |

*Open question: does the team want `CARDIO`/`NEURO`/`TOXICOLOGY`/`PSYCHIATRY` as distinct
departments at all, given red flags always route to `EMERGENCY` first? Kept them for the
non-emergency, lower-urgency versions of the same symptoms (e.g. old scar from a healed
burn wound → not toxicology-emergency, just a dermatology follow-up).*

---

## 3. FacilityTier

| Tier | Capability summary |
|---|---|
| `SC` (Sub-Centre) | First contact, ANM/ASHA-staffed. Basic first aid, ANC checkups, referral point. |
| `PHC` (Primary Health Centre) | Doctor-staffed OPD, basic labs, normal deliveries, limited inpatient beds. |
| `CHC` (Community Health Centre) | Specialist OPDs (surgery, OBGYN, paeds), emergency stabilisation, blood storage unit (some). |
| `SDH` (Sub-District Hospital) | Broader specialist coverage, more inpatient capacity, minor surgery. |
| `DH` (District Hospital) | Full specialist range, ICU-level care, major surgery, blood bank. |

*Source: general structure per India's public health facility tiering under NHM — team
should confirm against Maharashtra-specific facility data once Lane B's mock facilities
are drafted, since actual capability varies by district.*

---

## 4. SymptomId

Grouped by body system. `snake_case`, plain-English label, modifiers needed, default department.
**This is a partial draft (~45 of the target 50–70) — flagging for team expansion, not final.**

### Cardiac / chest
| id | label | modifiers | default dept |
|---|---|---|---|
| `chest_pain` | Chest pain | duration, side, radiating(bool) | CARDIO |
| `chest_pain_with_sweating` | Chest pain with sweating | — | EMERGENCY (red flag) |
| `palpitations` | Racing or irregular heartbeat | duration | CARDIO |

### Respiratory
| id | label | modifiers | default dept |
|---|---|---|---|
| `breathless` | Difficulty breathing | severity, duration | GEN_MED |
| `cough` | Cough | duration, blood(bool) | GEN_MED |
| `cough_blood` | Coughing blood | — | EMERGENCY (red flag) |
| `wheezing` | Wheezing / whistling breath | — | GEN_MED |

### Neuro
| id | label | modifiers | default dept |
|---|---|---|---|
| `sudden_weakness_one_side` | Sudden weakness on one side of body | — | EMERGENCY (red flag: stroke/BE-FAST) |
| `slurred_speech` | Sudden slurred speech | — | EMERGENCY (red flag) |
| `severe_headache` | Severe or worst-ever headache | duration | NEURO |
| `fits` | Seizure / convulsion | duration, first_time(bool) | EMERGENCY (red flag) |
| `unconscious` | Loss of consciousness | duration | EMERGENCY (red flag) |
| `confusion` | Sudden confusion / altered mental state | — | EMERGENCY (red flag) |

### Bleeding / trauma
| id | label | modifiers | default dept |
|---|---|---|---|
| `heavy_bleeding` | Heavy or uncontrolled bleeding | site | EMERGENCY (red flag) |
| `wound_deep` | Deep cut or wound | site | SURGERY_GEN |
| `burn` | Burn injury | severity(%), site | SURGERY_GEN |
| `fracture_suspected` | Suspected broken bone | site | ORTHO |
| `major_trauma` | Major accident / fall / crush injury | — | EMERGENCY (red flag) |
| `snakebite` | Snake bite | time_since_bite | EMERGENCY (red flag) |
| `poisoning` | Suspected poisoning / ingestion | substance(if known) | EMERGENCY (red flag) |

### Abdominal / GI
| id | label | modifiers | default dept |
|---|---|---|---|
| `abdominal_pain` | Stomach / abdominal pain | duration, severity, side | GEN_MED |
| `vomiting` | Vomiting | duration, blood(bool) | GEN_MED |
| `vomiting_blood` | Vomiting blood | — | EMERGENCY (red flag) |
| `diarrhoea` | Loose motions | duration, blood(bool) | GEN_MED |
| `blood_in_stool` | Blood in stool | — | EMERGENCY (red flag, if severe) |
| `severe_dehydration_signs` | Sunken eyes, very little urine, extreme thirst/lethargy | age_band | EMERGENCY (red flag) |

### Urinary
| id | label | modifiers | default dept |
|---|---|---|---|
| `cant_pass_urine` | Unable to pass urine | duration | EMERGENCY (red flag if >12–24h **(proposed threshold)**) |
| `pain_urination` | Pain while urinating | duration | GEN_MED |
| `blood_in_urine` | Blood in urine | — | GEN_MED (urgent) |

### Obstetric / gynae
| id | label | modifiers | default dept |
|---|---|---|---|
| `pregnancy_bleeding` | Bleeding during pregnancy | trimester | EMERGENCY (red flag) |
| `pregnancy_convulsion` | Convulsions during pregnancy/postpartum | — | EMERGENCY (red flag) |
| `pregnancy_severe_headache_vision` | Severe headache with blurred vision during pregnancy | — | EMERGENCY (red flag — pre-eclampsia pattern) |
| `reduced_fetal_movement` | Baby moving less than usual | trimester | EMERGENCY (red flag) |
| `labour_pain` | Labour pains / contractions | frequency | OBGYN |
| `postpartum_bleeding` | Heavy bleeding after delivery | time_since_delivery | EMERGENCY (red flag) |

### Newborn / child
| id | label | modifiers | default dept |
|---|---|---|---|
| `infant_not_feeding` | Baby not feeding / refusing to feed | age_band(neonate) | EMERGENCY (red flag) |
| `infant_lethargy` | Baby unusually inactive / hard to wake | age_band(neonate) | EMERGENCY (red flag) |
| `infant_fast_breathing` | Baby breathing very fast | age_band | EMERGENCY (red flag) |
| `chest_indrawing` | Chest pulls in when child breathes | age_band(child) | EMERGENCY (red flag) |
| `infant_fever` | Fever in a baby under 2 months | age_band(neonate) | EMERGENCY (red flag — any fever this young) |
| `child_fever` | Fever in an older child | age_band | GEN_MED / PAEDS |

### General / systemic
| id | label | modifiers | default dept |
|---|---|---|---|
| `high_fever` | High fever | duration, temp(if known) | GEN_MED |
| `fever_with_stiff_neck` | Fever with stiff neck or rash | — | EMERGENCY (red flag) |
| `body_ache` | General body ache | duration | GEN_MED |
| `weakness_fatigue` | General weakness / tiredness | duration | GEN_MED |
| `dizziness` | Dizziness / fainting feeling | — | GEN_MED |
| `skin_rash` | Skin rash | duration, spreading(bool) | DERMATOLOGY |
| `joint_pain` | Joint pain | duration, side | ORTHO (routine) |
| `suicidal_intent` | Expressing wish to harm self / end life | — | EMERGENCY (red flag) |
| `eye_injury` | Eye injury or sudden vision loss | — | OPHTHALMOLOGY (urgent/emergency) |

---

## 5. Modifiers

| Modifier | Values |
|---|---|
| Age band | `neonate` (<2 months), `infant` (2mo–1yr), `child` (<5), `child_5_17`, `adult`, `elderly` (≥60) |
| Sex | `male`, `female`, `other` |
| Pregnancy status | `pregnant`, `postpartum` (≤42 days), `not_applicable` |
| Duration | free text or banded: `<1h`, `1–24h`, `1–7d`, `>7d` **(proposed banding — team should confirm granularity needed)** |

---

## 6. Open questions for the team

1. Should `CARDIO`, `NEURO`, `TOXICOLOGY`, `PSYCHIATRY` exist as departments at all, given every acute version of these routes straight to `EMERGENCY`? (See note under §2.)
2. Duration banding — is `<1h / 1–24h / 1–7d / >7d` fine-grained enough, or does the engine need exact durations for any rule?
3. The `cant_pass_urine` emergency threshold (proposed >12–24h) needs a real source or a clinician's call — I couldn't verify a clean citation for this exact cutoff.
4. Facility tier capability summary (§3) is generic NHM structure, not Maharashtra-verified — cross-check once Lane B's mock facility data exists.
5. Symptom list is ~45, not the full 50–70 — likely gaps: dental, mental health beyond suicidal ideation, allergic reaction, specific paediatric conditions (malnutrition signs). Flag anything real-phrasings.md surfaces that doesn't map to an existing ID.

---

*No diagnoses, no conditions, no lab findings anywhere in this file — every entry is a
patient-reportable symptom or an operational band, as required.*
