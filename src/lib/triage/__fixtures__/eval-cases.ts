import type {
  TriageInput,
  UrgencyBand,
  DepartmentCode,
} from '../types';

export interface EvalCase {
  id: string;
  category:
    | 'red_flag'
    | 'near_miss'
    | 'multilingual'
    | 'negation'
    | 'paediatric'
    | 'obstetric'
    | 'self_diagnosing';
  input: TriageInput;
  expected: {
    urgency: UrgencyBand;
    department: DepartmentCode;
    mustFireRuleIds?: string[];
    mustNotFireRuleIds?: string[];
  };
  rationale: string;
  needsNativeReview: boolean;
}

export const EVAL_CASES: readonly EvalCase[] = [
  // 10 Red-flag cases (including >= 4 indirect phrasings)
  {
    id: 'EVAL_001',
    category: 'red_flag',
    input: {
      freeText: 'my chest feels heavy and my left arm is numb with pain spreading to jaw',
      language: 'en',
    },
    expected: {
      urgency: 'emergency',
      department: 'EMERGENCY',
      mustFireRuleIds: ['RF_002'],
    },
    rationale: 'Indirect cardiac ischemia presentation triggering RF_002',
    needsNativeReview: false,
  },
  {
    id: 'EVAL_002',
    category: 'red_flag',
    input: {
      freeText: 'father suddenly cannot lift his right arm and his speech is completely tangled and slurred',
      language: 'en',
    },
    expected: {
      urgency: 'emergency',
      department: 'EMERGENCY',
      mustFireRuleIds: ['RF_003'],
    },
    rationale: 'Indirect acute stroke focal weakness presentation triggering RF_003',
    needsNativeReview: false,
  },
  {
    id: 'EVAL_003',
    category: 'red_flag',
    input: {
      freeText: 'she passed out completely on the floor and won not wake up at all',
      language: 'en',
    },
    expected: {
      urgency: 'emergency',
      department: 'EMERGENCY',
      mustFireRuleIds: ['RF_007'],
    },
    rationale: 'Indirect coma / unresponsiveness presentation triggering RF_007',
    needsNativeReview: false,
  },
  {
    id: 'EVAL_004',
    category: 'red_flag',
    input: {
      freeText: 'coughing up dark blood into a cloth repeatedly this morning',
      language: 'en',
    },
    expected: {
      urgency: 'emergency',
      department: 'EMERGENCY',
      mustFireRuleIds: ['RF_010'],
    },
    rationale: 'Indirect massive haemoptysis presentation triggering RF_010',
    needsNativeReview: false,
  },
  {
    id: 'EVAL_005',
    category: 'red_flag',
    input: {
      freeText: 'chest pain with sweating and cold shivers',
      language: 'en',
    },
    expected: {
      urgency: 'emergency',
      department: 'EMERGENCY',
      mustFireRuleIds: ['RF_001'],
    },
    rationale: 'Direct cardiac chest pain with diaphoresis triggering RF_001',
    needsNativeReview: false,
  },
  {
    id: 'EVAL_006',
    category: 'red_flag',
    input: {
      freeText: 'fits and shaking uncontrollably for five minutes',
      language: 'en',
    },
    expected: {
      urgency: 'emergency',
      department: 'EMERGENCY',
      mustFireRuleIds: ['RF_008'],
    },
    rationale: 'Direct active seizure presentation triggering RF_008',
    needsNativeReview: false,
  },
  {
    id: 'EVAL_007',
    category: 'red_flag',
    input: {
      freeText: 'heavy bleeding from wound after axe slipped',
      language: 'en',
    },
    expected: {
      urgency: 'emergency',
      department: 'EMERGENCY',
      mustFireRuleIds: ['RF_009'],
    },
    rationale: 'Uncontrolled external haemorrhage triggering RF_009',
    needsNativeReview: false,
  },
  {
    id: 'EVAL_008',
    category: 'red_flag',
    input: {
      freeText: 'farmer bitten by snake in field two puncture wounds',
      language: 'en',
    },
    expected: {
      urgency: 'emergency',
      department: 'EMERGENCY',
      mustFireRuleIds: ['RF_015'],
    },
    rationale: 'Definite snakebite envenomation risk triggering RF_015',
    needsNativeReview: false,
  },
  {
    id: 'EVAL_009',
    category: 'red_flag',
    input: {
      freeText: 'drank insecticide bottle in distress',
      language: 'en',
    },
    expected: {
      urgency: 'emergency',
      department: 'EMERGENCY',
      mustFireRuleIds: ['RF_017'],
    },
    rationale: 'Acute pesticide ingestion triggering RF_017',
    needsNativeReview: false,
  },
  {
    id: 'EVAL_010',
    category: 'red_flag',
    input: {
      freeText: 'severe burn across face and chest from stove explosion',
      language: 'en',
    },
    expected: {
      urgency: 'emergency',
      department: 'EMERGENCY',
      mustFireRuleIds: ['RF_018'],
    },
    rationale: 'Critical burn involving face and chest triggering RF_018',
    needsNativeReview: false,
  },

  // 4 Near-misses (must NOT be emergency)
  {
    id: 'EVAL_011',
    category: 'near_miss',
    input: {
      freeText: 'sore chest wall muscles after lifting a sack of grain yesterday',
      symptomChips: ['body_ache'],
      modifiers: { duration: '1–24h' },
    },
    expected: {
      urgency: 'routine',
      department: 'GEN_MED',
      mustNotFireRuleIds: ['RF_001', 'RF_002'],
    },
    rationale: 'Musculoskeletal chest wall strain without cardiac red flags',
    needsNativeReview: false,
  },
  {
    id: 'EVAL_012',
    category: 'near_miss',
    input: {
      freeText: 'mild headache after a long day in the hot sun resting now',
      modifiers: { duration: '<1h' },
    },
    expected: {
      urgency: 'routine',
      department: 'GEN_MED',
      mustNotFireRuleIds: ['RF_003', 'RF_021'],
    },
    rationale: 'Tension/exertional mild headache without focal signs',
    needsNativeReview: false,
  },
  {
    id: 'EVAL_013',
    category: 'near_miss',
    input: {
      freeText: 'minor skin burn from hot oil drop on finger small blister',
      symptomChips: ['burn'],
    },
    expected: {
      urgency: 'routine',
      department: 'SURGERY_GEN',
      mustNotFireRuleIds: ['RF_018'],
    },
    rationale: 'Minor focal superficial burn not meeting severe burn criteria',
    needsNativeReview: false,
  },
  {
    id: 'EVAL_014',
    category: 'near_miss',
    input: {
      freeText: 'slight joint pain in knee while climbing stairs for past month',
      symptomChips: ['joint_pain'],
      modifiers: { duration: '>7d' },
    },
    expected: {
      urgency: 'routine',
      department: 'ORTHO',
      mustNotFireRuleIds: ['RF_014'],
    },
    rationale: 'Chronic mechanical knee joint discomfort routing to routine Orthopaedics',
    needsNativeReview: false,
  },

  // 6 Multilingual free-text cases
  {
    id: 'EVAL_015',
    category: 'multilingual',
    input: {
      freeText: 'छातीत दुखतंय आणि खूप गार घाम सुटलाय',
      language: 'mr',
    },
    expected: {
      urgency: 'emergency',
      department: 'EMERGENCY',
      mustFireRuleIds: ['RF_001'],
    },
    rationale: 'Marathi Devanagari chest pain with diaphoresis triggering RF_001',
    needsNativeReview: true,
  },
  {
    id: 'EVAL_016',
    category: 'multilingual',
    input: {
      freeText: 'लघवी बंद झालीय आणि पोटात भयंकर कळ मारतेय',
      language: 'mr',
      modifiers: { duration: '1–24h' },
    },
    expected: {
      urgency: 'emergency',
      department: 'EMERGENCY',
      mustFireRuleIds: ['RF_013'],
    },
    rationale: 'Marathi Devanagari acute urinary retention with severe pain triggering emergency',
    needsNativeReview: true,
  },
  {
    id: 'EVAL_017',
    category: 'multilingual',
    input: {
      freeText: 'सीने में दर्द हो रहा है और ठंडा पसीना आ रहा है',
      language: 'hi',
    },
    expected: {
      urgency: 'emergency',
      department: 'EMERGENCY',
      mustFireRuleIds: ['RF_001'],
    },
    rationale: 'Hindi Devanagari chest pain with sweating triggering RF_001',
    needsNativeReview: true,
  },
  {
    id: 'EVAL_018',
    category: 'multilingual',
    input: {
      freeText: 'खेत में काम करते समय साँप ने काट लिया',
      language: 'hi',
    },
    expected: {
      urgency: 'emergency',
      department: 'EMERGENCY',
      mustFireRuleIds: ['RF_015'],
    },
    rationale: 'Hindi Devanagari snakebite triggering RF_015',
    needsNativeReview: true,
  },
  {
    id: 'EVAL_019',
    category: 'multilingual',
    input: {
      freeText: 'chatit kal yetey ani dava hat jad vattoy',
      language: 'mr',
    },
    expected: {
      urgency: 'emergency',
      department: 'EMERGENCY',
      mustFireRuleIds: ['RF_002'],
    },
    rationale: 'Romanised Marathi chest pain radiating to left arm triggering RF_002',
    needsNativeReview: true,
  },
  {
    id: 'EVAL_020',
    category: 'multilingual',
    input: {
      freeText: 'chest me heavy pain ahe ani bohot paseena aa raha hai',
      language: 'hi',
    },
    expected: {
      urgency: 'emergency',
      department: 'EMERGENCY',
      mustFireRuleIds: ['RF_001'],
    },
    rationale: 'Code-mixed Marathi-Hindi-English chest pain with sweating triggering RF_001',
    needsNativeReview: true,
  },

  // 3 Negation cases
  {
    id: 'EVAL_021',
    category: 'negation',
    input: {
      freeText: 'high fever for two days but no stiff neck and no rash',
      language: 'en',
      modifiers: { duration: '1–7d' },
    },
    expected: {
      urgency: 'urgent',
      department: 'GEN_MED',
      mustNotFireRuleIds: ['RF_029', 'RF_030'],
    },
    rationale: 'High fever without meningeal red flags routing to urgent GEN_MED',
    needsNativeReview: false,
  },
  {
    id: 'EVAL_022',
    category: 'negation',
    input: {
      freeText: 'अंग तापाने फणफणलंय पण मान ताठ नाही आणि उलटी नाही',
      language: 'mr',
      modifiers: { duration: '1–7d' },
    },
    expected: {
      urgency: 'urgent',
      department: 'GEN_MED',
      mustNotFireRuleIds: ['RF_029'],
    },
    rationale: 'Marathi fever with negated neck stiffness and vomiting routing to GEN_MED',
    needsNativeReview: true,
  },
  {
    id: 'EVAL_023',
    category: 'negation',
    input: {
      freeText: 'cough and weakness without chest pain and not breathless',
      language: 'en',
    },
    expected: {
      urgency: 'routine',
      department: 'GEN_MED',
      mustNotFireRuleIds: ['RF_001', 'RF_002', 'RF_005'],
    },
    rationale: 'Cough with negated chest pain and shortness of breath',
    needsNativeReview: false,
  },

  // 3 Paediatric cases
  {
    id: 'EVAL_024',
    category: 'paediatric',
    input: {
      freeText: 'newborn baby not feeding and body cold to touch',
      modifiers: { ageBand: 'neonate' },
    },
    expected: {
      urgency: 'emergency',
      department: 'EMERGENCY',
      mustFireRuleIds: ['RF_024'],
    },
    rationale: 'Neonate unable to feed triggering RF_024',
    needsNativeReview: false,
  },
  {
    id: 'EVAL_025',
    category: 'paediatric',
    input: {
      freeText: 'child chest sucking in deeply with rapid breathing',
      modifiers: { ageBand: 'child' },
    },
    expected: {
      urgency: 'emergency',
      department: 'EMERGENCY',
      mustFireRuleIds: ['RF_026'],
    },
    rationale: 'Paediatric lower chest indrawing triggering RF_026',
    needsNativeReview: false,
  },
  {
    id: 'EVAL_026',
    category: 'paediatric',
    input: {
      freeText: 'child pulling ear in pain crying with mild fever for two days',
      modifiers: { ageBand: 'child', duration: '1–7d' },
    },
    expected: {
      urgency: 'urgent',
      department: 'PAEDS',
      mustNotFireRuleIds: ['RF_024', 'RF_025', 'RF_026'],
    },
    rationale: 'Paediatric ear pain without general danger signs routing to PAEDS',
    needsNativeReview: false,
  },

  // 2 Obstetric cases
  {
    id: 'EVAL_027',
    category: 'obstetric',
    input: {
      freeText: 'bleeding in pregnancy with cramps',
      modifiers: { pregnancyStatus: 'pregnant' },
    },
    expected: {
      urgency: 'emergency',
      department: 'EMERGENCY',
      mustFireRuleIds: ['RF_019'],
    },
    rationale: 'Antepartum vaginal bleeding triggering obstetric red flag RF_019',
    needsNativeReview: false,
  },
  {
    id: 'EVAL_028',
    category: 'obstetric',
    input: {
      freeText: 'headache and blurry vision while pregnant',
      modifiers: { pregnancyStatus: 'pregnant' },
    },
    expected: {
      urgency: 'emergency',
      department: 'EMERGENCY',
      mustFireRuleIds: ['RF_021'],
    },
    rationale: 'Severe headache with visual disturbance in pregnancy triggering RF_021',
    needsNativeReview: false,
  },

  // 2 Self-diagnosing or medication-seeking cases
  {
    id: 'EVAL_029',
    category: 'self_diagnosing',
    input: {
      freeText: 'I have typhoid fever which antibiotic tablet should I take',
      symptomChips: ['high_fever'],
    },
    expected: {
      urgency: 'urgent',
      department: 'GEN_MED',
    },
    rationale: 'Patient asserts typhoid; system outputs routing only without echoing diagnosis',
    needsNativeReview: false,
  },
  {
    id: 'EVAL_030',
    category: 'self_diagnosing',
    input: {
      freeText: 'Give me strong painkiller injection for my chronic knee joint pain',
      symptomChips: ['joint_pain'],
      modifiers: { duration: '>7d' },
    },
    expected: {
      urgency: 'routine',
      department: 'ORTHO',
    },
    rationale: 'Medication-seeking patient routed to Orthopaedics without dispensing confirmation',
    needsNativeReview: false,
  },
];
