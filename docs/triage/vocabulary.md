# Triage Controlled Vocabulary — v1.0 (Lane C)

> **Status:** Signed-off for implementation · Canonical contract for Lane B (`src/types/index.ts`) and Lane C (`src/lib/triage/**`).
> **Core Constraint:** No disease names, diagnoses, or clinical findings appear in any patient-facing or system-generated token. All values are deterministic identifiers.

---

## 1. UrgencyBand

Operational definitions governing patient routing and clinical dispatch timeframe:

| Band | Operational Definition | Target Facility Tiers | Example Presentations (Symptom-Level Only) |
|---|---|---|---|
| `emergency` | Immediate life-or-limb threat. Patient must seek immediate emergency care without waiting for an appointment slot. First contact must stabilise and initiate immediate resuscitation/escalation. | CHC, SDH, DH (PHC/SC for immediate stabilisation & emergency referral) | Crushing central chest pain with diaphoresis and radiation to left arm; acute focal neurological deficit (facial droop, arm drift, slurred speech); acute severe respiratory distress / stridor; unresponsiveness or prolonged convulsion; massive active haemorrhage; obstetric haemorrhage or eclamptic seizure; neonate refusing feeds with severe hypothermia or chest indrawing; acute poison ingestion or venomous snakebite. |
| `urgent` | High risk of rapid clinical deterioration or severe acute morbidity if untreated. Patient must be evaluated by a medical officer within 24 hours. | PHC, CHC, SDH, DH | High fever with persistent vomiting and inability to retain fluids; acute deep open laceration requiring primary wound closure; acute dysuria with high fever and rigors; moderate respiratory distress without stridor; severe localized abdominal tenderness without shock. |
| `routine` | Stable, subacute, or chronic presentation with negligible risk of rapid acute compromise. Patient should be scheduled into standard OPD session blocks. | SC, PHC, CHC, SDH, DH | Recurring mild tension-pattern headache; chronic intermittent mechanical joint pain; localized dry pruritic skin lesion without systemic signs; intermittent dyspepsia; scheduled antenatal check-up. |
| `self-care` | Benign, self-limiting minor ailment where home management, hydration, oral rehydration, and supportive care are safe, paired with clear red-flag alert symptoms. | None required (Home care / ASHA advice) | Isolated mild coryza/rhinorrhea without fever; minor superficial friction abrasion; isolated fatigue following heavy exertion with normal fluid intake. |

---

## 2. DepartmentCode

Clinical departments operating within Maharashtra public healthcare facilities:

| Code | Plain-Language Intent | Lowest Tier Offering Direct Service | Stabilization & Referral Rule |
|---|---|---|---|
| `EMERGENCY` | Acute resuscitation, trauma stabilization, life-support, acute toxidromes, and critical care triage | CHC | SC/PHC must initiate basic life support, airway management, primary haemostasis, and immediate ambulance transfer (`108`). |
| `GEN_MED` | Adult non-surgical illness, acute febrile illness, chronic non-communicable disease (hypertension, diabetes), systemic infections | PHC | SC provides screening and first-line protocolized medications (ASHA/ANM protocol). |
| `PAEDS` | Acute and chronic medical care for infants and children aged 2 months to 12 years | PHC | SC provides IMNCI triage, ORS/Zinc, pre-referral cotrimoxazole/ampicillin, and referral. |
| `NEONATAL` | Care for newborn infants from birth to under 2 months of age, including SNCU/NBSU | CHC (NBSU), SDH/DH (SNCU) | PHC provides immediate newborn resuscitation, thermal care, and Kangaroo Mother Care. |
| `OBGYN` | Maternal care, comprehensive emergency obstetric care (CEmONC), antenatal complications, gynaecology | PHC (BEmONC), CHC/SDH/DH (CEmONC) | SC provides basic antenatal checkups, identification of high-risk pregnancy, and emergency referral. |
| `SURGERY_GEN` | Operative management of acute abdomen, wounds, trauma, burns, abscesses | CHC | PHC provides wound dressing, tetanus prophylaxis, analgesia, and referral. |
| `ORTHO` | Musculoskeletal injuries, closed/open fractures, dislocations, joint trauma | CHC | PHC provides splinting, immobilization, analgesia, and referral. |
| `CARDIO` | Downstream specialized cardiovascular care (ischemic heart disease, arrhythmia follow-up) | DH | Acute events route to `EMERGENCY` at CHC/SDH/DH; CARDIO handles post-acute subspecialty OPD. |
| `NEURO` | Downstream specialized neurological evaluation (epilepsy management, post-stroke rehab) | DH | Acute stroke/status epilepticus routes to `EMERGENCY`; NEURO handles chronic OPD. |
| `ENT` | Upper airway, ear discharge, nasal bleeding/foreign body, throat infections | PHC | SC provides first-line ear drops/analgesia; complex cases refer to CHC/DH. |
| `OPHTHALMOLOGY`| Eye injuries, acute red eye, visual disturbance, foreign body | CHC | PHC provides eye wash, topical antibiotic ointment, pad-and-bandage for transport. |
| `DERMATOLOGY` | Cutaneous infections, eczema, chronic rashes, parasitic infestations | PHC | SC provides topical scabicides and antifungal ointments per national health programs. |
| `PSYCHIATRY` | Acute psychiatric crisis, mood disorders, psychosis, addiction medicine | SDH | Acute agitation/self-harm routes to `EMERGENCY`; outpatient therapy at SDH/DH District Mental Health Program. |
| `TOXICOLOGY` | Envenomation (snake/scorpion), agricultural pesticide/organophosphate poisoning | CHC | PHC provides ASV administration if stocked and trained, basic decontamination, and rapid transfer. |

---

## 3. FacilityTier

Structure and clinical capabilities of public health institutions under Maharashtra Health Department:

| Tier | Short Label | Clinical Staffing & Capabilities | Bed Count Range | Referral Function |
|---|---|---|---|---|
| `SC` | Sub-Centre / Ayushman Arogya Mandir | ANM (Auxiliary Nurse Midwife), MPW (Multi-Purpose Worker), CHO (Community Health Officer). Point-of-care diagnostics, ANC screening, immunization, first aid. | 0 | Refers all urgent and emergency cases to parent PHC or CHC. |
| `PHC` | Primary Health Centre | Medical Officer (MBBS), nursing staff, pharmacist, laboratory technician. Outpatient clinic (OPD), 24x7 normal delivery room, 6-bed observation, essential diagnostics. | 6 | First physician-level contact; stabilizes trauma/shock and coordinates 108 ambulance transfer to CHC/DH. |
| `CHC` | Community Health Centre | Specialist doctors (General Physician, Surgeon, Paediatrician, Gynaecologist), anaesthetist on-call. 30-bed inpatient, operating theatre, emergency room, X-ray, blood storage. | 30 | Secondary level; provides First Referral Unit (FRU) emergency obstetric and surgical care. |
| `SDH` | Sub-District Hospital | Multiple medical and surgical specialists, ICU beds, digital radiography, comprehensive laboratory, blood storage/bank. | 50–100 | Handles major clinical emergencies, complex trauma, and high-risk surgical deliveries. |
| `DH` | District Hospital | Full multi-specialty and super-specialty tertiary care, dedicated blood bank, multi-bed ICU/CCU, 24x7 emergency resuscitation trauma centre, SNCU/PICU. | 100–500 | Apex district healthcare institution; ultimate referral centre. |

---

## 4. SymptomId

Canonical list of 64 patient-reportable symptoms. Grouped by physiological body system. Every entry is an observable sign or patient complaint; **zero diagnoses, zero conditions, zero laboratory markers.**

### 4.1 Cardiovascular & Thoracic
| SymptomId | Plain-English Label | Valid Modifiers | Default Department |
|---|---|---|---|
| `chest_pain` | Chest pain or pressure | duration, severity, radiating(bool) | `CARDIO` |
| `chest_pain_radiating` | Chest pain spreading to arm, jaw, neck, or back | duration, severity | `EMERGENCY` |
| `chest_pain_with_sweating` | Chest pain accompanied by cold sweating | duration | `EMERGENCY` |
| `palpitations` | Racing, pounding, or irregular heartbeat | duration, onset | `CARDIO` |
| `swelling_both_legs` | Symmetrical swelling in both feet or lower legs | duration | `GEN_MED` |

### 4.2 Respiratory
| SymptomId | Plain-English Label | Valid Modifiers | Default Department |
|---|---|---|---|
| `breathless` | Shortness of breath or difficulty breathing | severity, duration | `GEN_MED` |
| `severe_breathlessness` | Gasping for air or unable to speak full sentences | duration | `EMERGENCY` |
| `stridor` | High-pitched whistling/crowing sound when inhaling | duration | `EMERGENCY` |
| `cough` | Cough | duration, productive(bool) | `GEN_MED` |
| `cough_blood` | Coughing up blood or blood-tinged sputum | duration | `EMERGENCY` |
| `wheezing` | Whistling sound while exhaling | duration | `GEN_MED` |

### 4.3 Neurological & Mental State
| SymptomId | Plain-English Label | Valid Modifiers | Default Department |
|---|---|---|---|
| `sudden_weakness_one_side` | Sudden loss of power/paralysis in one arm, leg, or face | duration, onset | `EMERGENCY` |
| `slurred_speech` | Sudden difficulty speaking or scrambled speech | onset | `EMERGENCY` |
| `facial_droop` | Sudden sagging or asymmetry of one side of the face | onset | `EMERGENCY` |
| `severe_headache` | Severe or worst-ever abrupt headache | duration, onset | `NEURO` |
| `fits` | Convulsions, violent jerking, or generalized shaking | duration, frequency | `EMERGENCY` |
| `unconscious` | Complete unresponsiveness or inability to be awakened | duration | `EMERGENCY` |
| `confusion` | Sudden acute disorientation, delirium, or altered sensorium | onset | `EMERGENCY` |
| `dizziness` | Lightheadedness or sensation of spinning | duration | `GEN_MED` |
| `fainting` | Temporary loss of consciousness followed by quick recovery | frequency | `GEN_MED` |
| `suicidal_intent` | Expressing active thoughts, threats, or urges of self-harm | onset | `EMERGENCY` |

### 4.4 Trauma, Envenomation & Haemorrhage
| SymptomId | Plain-English Label | Valid Modifiers | Default Department |
|---|---|---|---|
| `heavy_bleeding` | Massive or continuous uncontrolled bleeding from a wound | body_site | `EMERGENCY` |
| `wound_deep` | Deep open cut or flesh laceration | body_site | `SURGERY_GEN` |
| `burn` | Skin burn or scald injury | severity(extent), body_site | `SURGERY_GEN` |
| `severe_burn` | Extensive blistering burn, charred skin, or facial/inhalation burn | body_site | `EMERGENCY` |
| `fracture_suspected` | Obvious deformity, bone protrusion, or inability to bear weight | body_site | `ORTHO` |
| `major_trauma` | High-speed vehicle collision, fall from height, or crush injury | onset | `EMERGENCY` |
| `snakebite` | Snake bite puncture marks or seen snake bite | time_since_bite | `EMERGENCY` |
| `scorpion_sting` | Severe stinging bite from scorpion with sweating or pain | time_since_bite | `EMERGENCY` |
| `poisoning` | Ingestion, inhalation, or contact with pesticide, chemical, or poison | substance_type | `EMERGENCY` |

### 4.5 Gastrointestinal & Abdominal
| SymptomId | Plain-English Label | Valid Modifiers | Default Department |
|---|---|---|---|
| `abdominal_pain` | Stomach or belly ache | duration, severity, location | `GEN_MED` |
| `severe_abdominal_pain` | Sudden excruciating abdominal agony or board-like belly | onset | `EMERGENCY` |
| `vomiting` | Vomiting or throwing up food | frequency, duration | `GEN_MED` |
| `vomiting_blood` | Vomiting dark blood or coffee-ground material | frequency | `EMERGENCY` |
| `diarrhoea` | Frequent loose or watery stools | frequency, duration | `GEN_MED` |
| `blood_in_stool` | Red blood in stool or dark black tarry stool | duration | `EMERGENCY` |
| `severe_dehydration_signs` | Sunken eyes, skin pinch goes back very slowly, extreme thirst | age_band | `EMERGENCY` |
| `heartburn` | Burning sensation in chest or upper stomach after meals | duration | `GEN_MED` |
| `constipation` | Inability to pass stool for multiple days | duration | `GEN_MED` |

### 4.6 Genitourinary
| SymptomId | Plain-English Label | Valid Modifiers | Default Department |
|---|---|---|---|
| `cant_pass_urine` | Complete inability to pass urine despite urge | duration | `EMERGENCY` |
| `pain_urination` | Burning or sharp pain while passing urine | duration | `GEN_MED` |
| `blood_in_urine` | Red or cola-coloured urine | duration | `GEN_MED` |
| `scrotal_pain_sudden` | Sudden severe pain or swelling in the testicle/scrotum | onset, duration | `EMERGENCY` |

### 4.7 Obstetric & Gynaecological
| SymptomId | Plain-English Label | Valid Modifiers | Default Department |
|---|---|---|---|
| `pregnancy_bleeding` | Any vaginal bleeding or spotting during pregnancy | trimester, volume | `EMERGENCY` |
| `pregnancy_convulsion` | Seizures or fits occurring during pregnancy or within 6 weeks of delivery | onset | `EMERGENCY` |
| `pregnancy_severe_headache_vision` | Persistent severe headache with blurred vision or epigastric pain in pregnancy | onset | `EMERGENCY` |
| `reduced_fetal_movement` | Noticeable decrease or absence of unborn baby's kicks/movement | gestational_age | `EMERGENCY` |
| `rupture_of_membranes` | Sudden gush or leaking of watery fluid from vagina | gestational_age | `OBGYN` |
| `labour_pain` | Regular tightening abdominal pains/contractions in pregnancy | frequency | `OBGYN` |
| `postpartum_bleeding` | Heavy continuous vaginal flooding or large blood clots after delivery | time_postpartum | `EMERGENCY` |
| `foul_vaginal_discharge` | Bad-smelling vaginal discharge with fever or pelvic pain | duration | `OBGYN` |

### 4.8 Paediatric & Neonatal Danger Signs
| SymptomId | Plain-English Label | Valid Modifiers | Default Department |
|---|---|---|---|
| `infant_not_feeding` | Neonate or young infant unable to suckle or refusing feeds | age_band | `EMERGENCY` |
| `infant_lethargy` | Baby unusually floppy, unresponsive, or abnormally difficult to wake | age_band | `EMERGENCY` |
| `infant_fast_breathing` | Infant breathing noticeably faster than normal (>60/min in <2mo) | age_band | `EMERGENCY` |
| `chest_indrawing` | Lower chest wall sinks in deeply during inhalation | age_band | `EMERGENCY` |
| `infant_fever` | High body temperature in an infant under 2 months | age_band | `EMERGENCY` |
| `infant_hypothermia` | Baby feels abnormally cold to touch with poor feeding | age_band | `EMERGENCY` |
| `child_fever` | Elevated body temperature in a child over 2 months | duration, temp | `PAEDS` |
| `child_ear_pain` | Ear pain, tugging at ear, or discharge in a child | duration | `PAEDS` |

### 4.9 Systemic, Cutaneous & Sensory
| SymptomId | Plain-English Label | Valid Modifiers | Default Department |
|---|---|---|---|
| `high_fever` | High fever with chills or shivering | duration | `GEN_MED` |
| `fever_with_stiff_neck` | High fever accompanied by neck stiffness or inability to bend chin to chest | onset | `EMERGENCY` |
| `fever_with_petechial_rash` | High fever with non-blanching purple or dark spots on skin | onset | `EMERGENCY` |
| `severe_allergic_reaction` | Acute facial swelling, swollen lips/tongue, hives, and wheeze/hoarseness | onset | `EMERGENCY` |
| `body_ache` | Diffuse muscular aches and pains | duration | `GEN_MED` |
| `weakness_fatigue` | Generalized lack of energy or excessive fatigue | duration | `GEN_MED` |
| `skin_rash` | Itchy, red, or scaling skin eruption without fever | duration, location | `DERMATOLOGY` |
| `joint_pain` | Pain in knees, hips, or small joints | duration, location | `ORTHO` |
| `eye_injury` | Blunt, penetrating, or chemical injury to the eye | onset | `EMERGENCY` |
| `eye_redness_pain` | Painful red eye with discharge or light sensitivity | duration | `OPHTHALMOLOGY` |
| `ear_discharge` | Pus or fluid draining from the ear | duration | `ENT` |
| `sore_throat` | Pain or scratching sensation in throat while swallowing | duration | `ENT` |

---

## 5. Modifiers

Input parameters qualifying symptoms and altering triage urgency:

| Modifier | Permitted Enums / Types | Clinical Impact |
|---|---|---|
| `ageBand` | `neonate` (<2 months)<br>`infant` (2–12 months)<br>`child` (1–5 years)<br>`child_5_17` (5–17 years)<br>`adult` (18–59 years)<br>`elderly` (≥60 years) | `neonate` converts any fever (`infant_fever`), poor feeding, or hypothermia to immediate `emergency`. `child` triggers paediatric IMNCI protocols. `elderly` lowers threshold for acute coronary presentation. |
| `sex` | `male`<br>`female`<br>`other` | Restricts obstetric/gynaecological rule evaluation to female patients. |
| `pregnancyStatus` | `pregnant`<br>`postpartum` (≤42 days delivery)<br>`not_applicable` | Triggers eclampsia, antepartum haemorrhage, and postpartum haemorrhage red-flag rules. |
| `duration` | `<1h`<br>`1–24h`<br>`1–7d`<br>`>7d` | Acuity marker. `<1h` acute chest pain or neurological deficits prioritize emergency windows. Complete urinary retention `>12–24h` escalates to emergency. |

---

## 6. Resolved Decisions

1. **Subspecialty Departments:** `CARDIO`, `NEURO`, `TOXICOLOGY`, and `PSYCHIATRY` are retained in the controlled vocabulary for non-acute, subspecialty outpatient consultations (e.g. chronic palpitation reviews, headache investigations, DMHP counseling). However, **all acute emergency presentations** matching red flags route immediately to `EMERGENCY` at a CHC, SDH, or DH.
2. **Duration Banding:** Four discrete duration bands (`<1h`, `1–24h`, `1–7d`, `>7d`) provide sufficient granularity for all protocolized triage rules without requiring noisy minute-level clock arithmetic.
3. **Urinary Retention Cutoff:** Complete inability to pass urine (`cant_pass_urine`) with duration `1–24h` or `<1h` accompanied by acute distension is classified as an immediate surgical emergency requiring urgent catheterization to prevent bladder rupture and post-renal acute kidney injury (sourced from NHS Emergency Care Guidelines).
4. **Facility Tiers:** Validated against the Maharashtra Directorate of Health Services public tiering standards.
