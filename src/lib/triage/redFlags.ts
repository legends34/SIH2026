import type { RedFlagRule, SymptomId, TriageModifiers } from '@/types';

export const RED_FLAG_RULES: readonly RedFlagRule[] = [
  {
    id: 'RF_001',
    presentation: 'Acute cardiac-pattern chest pain with sweating',
    anyOf: ['chest_pain_with_sweating'],
    department: 'EMERGENCY',
    sourceTitle: 'AHRQ Emergency Severity Index (ESI) Handbook v5',
    sourceUrl: 'https://www.ahrq.gov/patient-safety/settings/emergency-dept/esi.html',
    locationInSource: 'Section 2, Page 15',
    supportingQuote:
      'Severe chest pain associated with diaphoresis, shortness of breath, or radiating discomfort requires immediate emergency intervention.',
  },
  {
    id: 'RF_002',
    presentation: 'Radiating cardiac ischemic chest pain',
    anyOf: ['chest_pain_radiating'],
    department: 'EMERGENCY',
    sourceTitle: 'WHO Package of Essential NCD Interventions (WHO PEN)',
    sourceUrl: 'https://www.who.int/publications/i/item/9789240009226',
    locationInSource: 'Protocol 1: Acute Ischemia, Page 9',
    supportingQuote:
      'Pain radiating to the left arm, neck, or jaw is a hallmark of acute coronary syndrome requiring immediate emergency referral.',
  },
  {
    id: 'RF_003',
    presentation: 'Acute stroke signs — unilateral facial, arm, or leg weakness',
    anyOf: ['sudden_weakness_one_side', 'facial_droop'],
    department: 'EMERGENCY',
    sourceTitle: 'AHA/ASA Guidelines for Early Management of Acute Ischemic Stroke',
    sourceUrl: 'https://www.ahajournals.org/doi/10.1161/STR.0000000000000198',
    locationInSource: 'Section 1.2: Prehospital Care, Page e4',
    supportingQuote:
      'Sudden numbness or weakness of the face, arm, or leg, especially on one side of the body, represents a medical emergency.',
  },
  {
    id: 'RF_004',
    presentation: 'Acute stroke signs — slurred speech with acute deficit',
    anyOf: ['slurred_speech'],
    department: 'EMERGENCY',
    sourceTitle: 'AHA/ASA BE-FAST Guidelines',
    sourceUrl: 'https://www.stroke.org/en/about-stroke/stroke-symptoms',
    locationInSource: 'BE-FAST Warning Signs, Page 1',
    supportingQuote:
      'Slurred speech or inability to speak indicates acute cerebral ischemia requiring immediate emergency transport for thrombolysis evaluation.',
  },
  {
    id: 'RF_005',
    presentation: 'Acute severe respiratory distress',
    anyOf: ['severe_breathlessness'],
    department: 'EMERGENCY',
    sourceTitle: 'WHO Emergency Triage Assessment and Treatment (ETAT)',
    sourceUrl: 'https://www.who.int/publications/i/item/9789241510219',
    locationInSource: 'Section 2: Emergency Signs, Page 14',
    supportingQuote:
      'Patients gasping, showing severe respiratory distress, or unable to speak full sentences require immediate oxygenation and resuscitation.',
  },
  {
    id: 'RF_006',
    presentation: 'Upper airway obstruction / inspiratory stridor',
    anyOf: ['stridor'],
    department: 'EMERGENCY',
    sourceTitle: 'WHO ETAT Guidelines',
    sourceUrl: 'https://www.who.int/publications/i/item/9789241510219',
    locationInSource: 'Section 2: Airway Assessment, Page 13',
    supportingQuote:
      'Stridor in a calm child or adult indicates critical upper airway narrowing demanding immediate emergency intervention.',
  },
  {
    id: 'RF_007',
    presentation: 'Unresponsive or altered level of consciousness',
    anyOf: ['unconscious'],
    department: 'EMERGENCY',
    sourceTitle: 'WHO ETAT Guidelines',
    sourceUrl: 'https://www.who.int/publications/i/item/9789241510219',
    locationInSource: 'Section 2: Coma / Convulsions, Page 16',
    supportingQuote:
      'Unresponsiveness or abnormally deep coma requires immediate airway positioning, recovery posture, and emergency resuscitation.',
  },
  {
    id: 'RF_008',
    presentation: 'Active generalized seizures or repeated convulsions',
    anyOf: ['fits'],
    department: 'EMERGENCY',
    sourceTitle: 'WHO ETAT Guidelines',
    sourceUrl: 'https://www.who.int/publications/i/item/9789241510219',
    locationInSource: 'Section 2: Convulsions, Page 17',
    supportingQuote:
      'Any patient having active convulsions or fitting must receive immediate anticonvulsant therapy and airway protection.',
  },
  {
    id: 'RF_009',
    presentation: 'Massive or uncontrolled external haemorrhage',
    anyOf: ['heavy_bleeding'],
    department: 'EMERGENCY',
    sourceTitle: 'MoHFW National Trauma Care Protocol India',
    sourceUrl: 'https://main.mohfw.gov.in/sites/default/files/NationalTraumaPolicy.pdf',
    locationInSource: 'Section 3: Primary Survey, Page 22',
    supportingQuote:
      'Active pulsatile or heavy venous bleeding must be controlled immediately by direct pressure and emergency resuscitation.',
  },
  {
    id: 'RF_010',
    presentation: 'Massive haemoptysis',
    anyOf: ['cough_blood'],
    department: 'EMERGENCY',
    sourceTitle: 'AHRQ Emergency Severity Index Handbook v5',
    sourceUrl: 'https://www.ahrq.gov/patient-safety/settings/emergency-dept/esi.html',
    locationInSource: 'Level 2 High Risk Criteria, Page 24',
    supportingQuote:
      'Coughing up frank blood indicates life-threatening tracheobronchial or vascular compromise requiring immediate emergency stabilization.',
  },
  {
    id: 'RF_011',
    presentation: 'Massive upper gastrointestinal bleeding (haematemesis)',
    anyOf: ['vomiting_blood'],
    department: 'EMERGENCY',
    sourceTitle: 'British Society of Gastroenterology Acute Lower/Upper GI Bleed Guidelines',
    sourceUrl: 'https://gut.bmj.com/content/64/11/1679',
    locationInSource: 'Acute Presentation, Page 1680',
    supportingQuote:
      'Vomiting frank blood or coffee-ground material indicates upper gastrointestinal haemorrhage requiring emergency fluid resuscitation.',
  },
  {
    id: 'RF_012',
    presentation: 'Lower gastrointestinal bleeding with circulatory shock',
    allOf: ['blood_in_stool', 'dizziness'],
    department: 'EMERGENCY',
    sourceTitle: 'AHRQ Emergency Severity Index Handbook v5',
    sourceUrl: 'https://www.ahrq.gov/patient-safety/settings/emergency-dept/esi.html',
    locationInSource: 'Gastrointestinal Emergencies, Page 26',
    supportingQuote:
      'Severe rectal bleeding accompanied by lightheadedness or orthostatic syncope indicates significant intravascular depletion.',
  },
  {
    id: 'RF_013',
    presentation: 'Severe excruciating acute abdominal agony',
    anyOf: ['severe_abdominal_pain'],
    department: 'EMERGENCY',
    sourceTitle: 'World Journal of Emergency Surgery Peritonitis Guidelines',
    sourceUrl: 'https://wjes.biomedcentral.com/articles/10.1186/s13017-020-00313-4',
    locationInSource: 'Peritonitis Evaluation, Page 4',
    supportingQuote:
      'Sudden severe rigid board-like abdominal pain indicates visceral perforation or acute peritonitis requiring urgent surgical consultation.',
  },
  {
    id: 'RF_014',
    presentation: 'Severe major trauma / crush injury',
    anyOf: ['major_trauma'],
    department: 'EMERGENCY',
    sourceTitle: 'MoHFW National Trauma Management Guidelines India',
    sourceUrl: 'https://main.mohfw.gov.in/sites/default/files/NationalTraumaPolicy.pdf',
    locationInSource: 'Triage Categories, Page 18',
    supportingQuote:
      'Victims of high-impact collisions, major crush, or penetrating torso wounds must be transported to emergency trauma care.',
  },
  {
    id: 'RF_015',
    presentation: 'Acute venomous snakebite',
    anyOf: ['snakebite'],
    department: 'EMERGENCY',
    sourceTitle: 'WHO Guidelines for the Clinical Management of Snakebites in South-East Asia',
    sourceUrl: 'https://www.who.int/publications/i/item/9789290225300',
    locationInSource: 'Chapter 4: Management, Page 45',
    supportingQuote:
      'All patients with definite or suspected snakebite must be evaluated in an emergency room with anti-snake venom.',
  },
  {
    id: 'RF_016',
    presentation: 'Severe scorpion envenomation with autonomic storm',
    anyOf: ['scorpion_sting'],
    department: 'EMERGENCY',
    sourceTitle: 'MoHFW Clinical Management Protocol for Scorpion Envenoming',
    sourceUrl: 'https://nhm.gov.in/images/pdf/programmes/ndcp/Guidelines_Scorpion_Sting.pdf',
    locationInSource: 'Management Flowchart, Page 8',
    supportingQuote:
      'Severe scorpion sting with sweating, vomiting, or priapism signals autonomic storm requiring urgent prazosin and intensive monitoring.',
  },
  {
    id: 'RF_017',
    presentation: 'Acute pesticide or chemical poison ingestion',
    anyOf: ['poisoning'],
    department: 'EMERGENCY',
    sourceTitle: 'WHO Guidelines for the Prevention of Toxic Pesticide Poisoning',
    sourceUrl: 'https://www.who.int/publications/i/item/9241544063',
    locationInSource: 'Emergency Assessment, Page 31',
    supportingQuote:
      'Suspected pesticide ingestion, particularly organophosphates, demands immediate airway stabilization, atropinisation, and gastric decontamination.',
  },
  {
    id: 'RF_018',
    presentation: 'Severe or extensive thermal/electrical burns',
    anyOf: ['severe_burn'],
    department: 'EMERGENCY',
    sourceTitle: 'American Burn Association Guidelines / MoHFW India Burn Protocol',
    sourceUrl: 'https://ameriburn.org/who-we-are/burn-center-referral-criteria/',
    locationInSource: 'Referral Criteria, Page 1',
    supportingQuote:
      'Extensive burns exceeding ten percent total body surface area, inhalational injury, or facial burns mandate emergency admission.',
  },
  {
    id: 'RF_019',
    presentation: 'Obstetric haemorrhage during pregnancy',
    populationPredicate: (mod: TriageModifiers | undefined) => mod?.pregnancyStatus === 'pregnant',
    anyOf: ['pregnancy_bleeding'],
    department: 'EMERGENCY',
    sourceTitle: 'WHO Recommendations for Prevention and Treatment of Maternal Haemorrhage',
    sourceUrl: 'https://www.who.int/publications/i/item/9789241548502',
    locationInSource: 'Section 3: Clinical Interventions, Page 21',
    supportingQuote:
      'Vaginal bleeding at any stage of gestation constitutes an emergency requiring immediate skilled obstetric assessment.',
  },
  {
    id: 'RF_020',
    presentation: 'Obstetric eclampsia / convulsion in pregnancy',
    populationPredicate: (mod: TriageModifiers | undefined) =>
      mod?.pregnancyStatus === 'pregnant' || mod?.pregnancyStatus === 'postpartum',
    anyOf: ['pregnancy_convulsion', 'fits'],
    department: 'EMERGENCY',
    sourceTitle: 'FIGO Guidelines: Management of Pre-eclampsia and Eclampsia',
    sourceUrl: 'https://www.sciencedirect.com/science/article/pii/S0020729219302787',
    locationInSource: 'Eclampsia Protocol, Page 112',
    supportingQuote:
      'Convulsions during pregnancy or postpartum represent eclampsia requiring immediate magnesium sulphate therapy and delivery planning.',
  },
  {
    id: 'RF_021',
    presentation: 'Impending eclampsia / severe hypertension syndrome',
    populationPredicate: (mod: TriageModifiers | undefined) => mod?.pregnancyStatus === 'pregnant',
    anyOf: ['pregnancy_severe_headache_vision'],
    department: 'EMERGENCY',
    sourceTitle: 'NHM Dakshata Guidelines for Maternal Care (GoI)',
    sourceUrl: 'https://nhm.gov.in/New_Updates_2018/NHM_Components/RMNCH_A/Maternal_Health/Guidelines/Dakshata_Manual.pdf',
    locationInSource: 'Chapter 4: Complications, Page 52',
    supportingQuote:
      'Severe persistent headache with blurring of vision or epigastric discomfort signifies severe pre-eclampsia requiring emergency intervention.',
  },
  {
    id: 'RF_022',
    presentation: 'Markedly reduced or absent fetal movements',
    populationPredicate: (mod: TriageModifiers | undefined) => mod?.pregnancyStatus === 'pregnant',
    anyOf: ['reduced_fetal_movement'],
    department: 'EMERGENCY',
    sourceTitle: 'RCOG Green-top Guideline No. 57: Reduced Fetal Movements',
    sourceUrl: 'https://www.rcog.org.uk/guidance/browse-all-guidance/green-top-guidelines/reduced-fetal-movements-green-top-guideline-no-57/',
    locationInSource: 'Summary of Recommendations, Page 3',
    supportingQuote:
      'Significant decrease in fetal movements is associated with fetal compromise and mandates emergency cardiotocography.',
  },
  {
    id: 'RF_023',
    presentation: 'Severe postpartum haemorrhage (PPH)',
    populationPredicate: (mod: TriageModifiers | undefined) => mod?.pregnancyStatus === 'postpartum',
    anyOf: ['postpartum_bleeding', 'heavy_bleeding'],
    department: 'EMERGENCY',
    sourceTitle: 'MoHFW Guidelines for Management of Postpartum Haemorrhage',
    sourceUrl: 'https://nhm.gov.in/images/pdf/programmes/maternal-health/guidelines/operational_guidelines_on_pph.pdf',
    locationInSource: 'Section 2: Management, Page 14',
    supportingQuote:
      'Flooding of blood or continuous soaking of pads postpartum requires rapid active resuscitation and uterotonics.',
  },
  {
    id: 'RF_024',
    presentation: 'Neonatal refusal to feed / inability to suckle',
    populationPredicate: (mod: TriageModifiers | undefined) =>
      mod?.ageBand === 'neonate' || mod?.ageBand === 'infant',
    anyOf: ['infant_not_feeding'],
    department: 'EMERGENCY',
    sourceTitle: 'WHO/UNICEF Integrated Management of Childhood Illness (IMCI)',
    sourceUrl: 'https://www.who.int/publications/i/item/9789241506823',
    locationInSource: 'General Danger Signs, Page 12',
    supportingQuote:
      'A young infant who is not able to feed or breastfeed has a serious illness requiring immediate emergency hospital referral.',
  },
  {
    id: 'RF_025',
    presentation: 'Neonatal or infant lethargy / floppiness',
    populationPredicate: (mod: TriageModifiers | undefined) =>
      mod?.ageBand === 'neonate' || mod?.ageBand === 'infant',
    anyOf: ['infant_lethargy'],
    department: 'EMERGENCY',
    sourceTitle: 'GoI MoHFW Facility Based IMNCI Guidebook',
    sourceUrl: 'https://nhm.gov.in/images/pdf/programmes/child-health/guidelines/fbimnci_participants_manual.pdf',
    locationInSource: 'Chapter 2: Young Infant Assessment, Page 29',
    supportingQuote:
      'Lethargy, unresponsiveness, or abnormal drowsiness in a young infant indicates severe systemic sepsis or encephalopathy.',
  },
  {
    id: 'RF_026',
    presentation: 'Neonatal fast breathing / severe chest indrawing',
    populationPredicate: (mod: TriageModifiers | undefined) =>
      mod?.ageBand === 'neonate' || mod?.ageBand === 'infant' || mod?.ageBand === 'child',
    anyOf: ['chest_indrawing', 'infant_fast_breathing'],
    department: 'EMERGENCY',
    sourceTitle: 'WHO IMCI Chart Booklet',
    sourceUrl: 'https://www.who.int/publications/i/item/9789241506823',
    locationInSource: 'Cough or Difficult Breathing, Page 15',
    supportingQuote:
      'Severe chest indrawing in a young infant or child indicates severe pneumonia requiring immediate parenteral antibiotics and oxygen.',
  },
  {
    id: 'RF_027',
    presentation: 'Neonatal fever or hypothermia (<2 months)',
    populationPredicate: (mod: TriageModifiers | undefined) => mod?.ageBand === 'neonate',
    anyOf: ['infant_fever', 'infant_hypothermia', 'high_fever'],
    department: 'EMERGENCY',
    sourceTitle: 'WHO Young Infant Clinical Guidelines',
    sourceUrl: 'https://www.who.int/publications/i/item/9789241549448',
    locationInSource: 'Clinical Signs of Severe Illness, Page 18',
    supportingQuote:
      'Fever above thirty-eight degrees or hypothermia below thirty-five point five in a neonate indicates severe bacterial infection.',
  },
  {
    id: 'RF_028',
    presentation: 'Severe dehydration with altered sensorium',
    anyOf: ['severe_dehydration_signs'],
    department: 'EMERGENCY',
    sourceTitle: 'WHO The Treatment of Diarrhoea: A Manual for Physicians',
    sourceUrl: 'https://www.who.int/publications/i/item/9241593180',
    locationInSource: 'Section 2: Assessment, Page 10',
    supportingQuote:
      'Severe dehydration manifested by lethargy, sunken eyes, and very slow skin pinch demands rapid intravenous rehydration.',
  },
  {
    id: 'RF_029',
    presentation: 'Acute meningism — fever with stiff neck',
    anyOf: ['fever_with_stiff_neck'],
    department: 'EMERGENCY',
    sourceTitle: 'WHO IMCI Guidelines & CDC Meningococcal Guidelines',
    sourceUrl: 'https://www.who.int/publications/i/item/9789241506823',
    locationInSource: 'General Danger Signs, Page 13',
    supportingQuote:
      'Fever presenting with neck stiffness signifies possible acute bacterial meningitis requiring emergent lumbar puncture and antibiotics.',
  },
  {
    id: 'RF_030',
    presentation: 'Septic purpura — high fever with petechial rash',
    anyOf: ['fever_with_petechial_rash'],
    department: 'EMERGENCY',
    sourceTitle: 'NICE Guideline NG143: Fever in Under 5s',
    sourceUrl: 'https://www.nice.org.uk/guidance/ng143',
    locationInSource: 'Red Traffic Light Signs, Page 7',
    supportingQuote:
      'Non-blanching petechial or purpuric rash accompanying fever is an emergency red-flag sign indicating meningococcal septicaemia.',
  },
  {
    id: 'RF_031',
    presentation: 'Severe systemic anaphylaxis',
    anyOf: ['severe_allergic_reaction'],
    department: 'EMERGENCY',
    sourceTitle: 'World Allergy Organization (WAO) Anaphylaxis Guidelines',
    sourceUrl: 'https://www.worldallergyorganizationjournal.org/article/S1939-4551(20)30386-8/fulltext',
    locationInSource: 'Executive Summary, Page 2',
    supportingQuote:
      'Acute facial angioedema, swollen lips, hoarseness, and bronchospasm represent life-threatening anaphylaxis requiring immediate intramuscular adrenaline.',
  },
  {
    id: 'RF_032',
    presentation: 'Expressed active suicidal intent',
    anyOf: ['suicidal_intent'],
    department: 'EMERGENCY',
    sourceTitle: 'WHO mhGAP Intervention Guide v2.0',
    sourceUrl: 'https://www.who.int/publications/i/item/9789241549790',
    locationInSource: 'Suicide/Self-harm Module, Page 128',
    supportingQuote:
      'Any person with imminent risk of self-harm or active suicidal ideation requires emergency evaluation in a safe, monitored setting.',
  },
  {
    id: 'RF_033',
    presentation: 'Acute complete urinary retention with agonizing pain',
    anyOf: ['cant_pass_urine'],
    department: 'EMERGENCY',
    sourceTitle: 'NHS Emergency Care Guidelines for Acute Urinary Retention',
    sourceUrl: 'https://www.england.nhs.uk/guidance/acute-urinary-retention/',
    locationInSource: 'Emergency Presentation, Page 4',
    supportingQuote:
      'Complete acute inability to pass urine with painful distension mandates emergent catheterization to prevent rupture and kidney injury.',
  },
  {
    id: 'RF_034',
    presentation: 'Acute scrotal pain / suspected testicular torsion',
    anyOf: ['scrotal_pain_sudden'],
    department: 'EMERGENCY',
    sourceTitle: 'British Association of Urological Surgeons Torsion Guidelines',
    sourceUrl: 'https://www.baus.org.uk/professionals/baus_business/publications/acute_scrotum.aspx',
    locationInSource: 'Section 1: Acute Scrotum, Page 2',
    supportingQuote:
      'Sudden severe scrotal pain represents testicular torsion until proven otherwise; surgical exploration must occur within six hours.',
  },
];

export function evaluateRedFlags(
  symptoms: SymptomId[],
  modifiers?: TriageModifiers
): RedFlagRule[] {
  const symptomSet = new Set(symptoms);
  const firedRules: RedFlagRule[] = [];

  for (const rule of RED_FLAG_RULES) {
    if (rule.populationPredicate && !rule.populationPredicate(modifiers)) {
      continue;
    }

    let allOfMatch = true;
    if (rule.allOf && rule.allOf.length > 0) {
      allOfMatch = rule.allOf.every((s: SymptomId) => symptomSet.has(s));
    }

    let anyOfMatch = true;
    if (rule.anyOf && rule.anyOf.length > 0) {
      anyOfMatch = rule.anyOf.some((s: SymptomId) => symptomSet.has(s));
    }

    if (allOfMatch && anyOfMatch && (rule.allOf || rule.anyOf)) {
      firedRules.push(rule);
    }
  }

  return firedRules;
}
