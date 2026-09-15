import type { EvalCase } from './eval-cases';

export const HOLDOUT_CASES: readonly EvalCase[] = [
  {
    id: 'HOLD_001',
    category: 'red_flag',
    input: {
      freeText: 'छातीत जड वाटतेय आणि डावा हात खूप दुखतोय',
      language: 'mr',
    },
    expected: {
      urgency: 'emergency',
      department: 'EMERGENCY',
      mustFireRuleIds: ['RF_002'],
    },
    rationale: 'Rural Marathi indirect cardiac ischemia triggering RF_002',
    needsNativeReview: true,
  },
  {
    id: 'HOLD_002',
    category: 'paediatric',
    input: {
      freeText: 'बाळ दूध पीत नाहीये आणि अगदी गळून पडलेय',
      language: 'mr',
      modifiers: { ageBand: 'neonate' },
    },
    expected: {
      urgency: 'emergency',
      department: 'EMERGENCY',
      mustFireRuleIds: ['RF_024'],
    },
    rationale: 'Neonate refusing feed with floppiness triggering RF_024',
    needsNativeReview: true,
  },
  {
    id: 'HOLD_003',
    category: 'obstetric',
    input: {
      freeText: 'गरोदरपणात रक्त जातंय खूप भीती वाटतेय',
      language: 'mr',
      modifiers: { pregnancyStatus: 'pregnant' },
    },
    expected: {
      urgency: 'emergency',
      department: 'EMERGENCY',
      mustFireRuleIds: ['RF_019'],
    },
    rationale: 'Antepartum vaginal bleeding in rural Marathi triggering RF_019',
    needsNativeReview: true,
  },
  {
    id: 'HOLD_004',
    category: 'red_flag',
    input: {
      freeText: 'साप चावला पायाला दोन दात उठलेत',
      language: 'mr',
    },
    expected: {
      urgency: 'emergency',
      department: 'EMERGENCY',
      mustFireRuleIds: ['RF_015'],
    },
    rationale: 'Snakebite with puncture marks triggering RF_015',
    needsNativeReview: true,
  },
  {
    id: 'HOLD_005',
    category: 'red_flag',
    input: {
      freeText: 'लघवी बंद झालीय सकाळपासून पोटात भयंकर कळ मारतेय',
      language: 'mr',
      modifiers: { duration: '1–24h' },
    },
    expected: {
      urgency: 'emergency',
      department: 'EMERGENCY',
      mustFireRuleIds: ['RF_013'],
    },
    rationale: 'Severe acute urinary retention with agonising pain',
    needsNativeReview: true,
  },
  {
    id: 'HOLD_006',
    category: 'obstetric',
    input: {
      freeText: 'अंगावरून पाणी सुटले अचानक दिवस भरलेत',
      language: 'mr',
      modifiers: { pregnancyStatus: 'pregnant' },
    },
    expected: {
      urgency: 'urgent',
      department: 'OBGYN',
    },
    rationale: 'Rupture of membranes near term routing to OBGYN',
    needsNativeReview: true,
  },
  {
    id: 'HOLD_007',
    category: 'negation',
    input: {
      freeText: 'दोन दिवसांपासून खोकला येतोय पण ताप नाही आणि दम लागत नाही',
      language: 'mr',
    },
    expected: {
      urgency: 'routine',
      department: 'GEN_MED',
      mustNotFireRuleIds: ['RF_005'],
    },
    rationale: 'Cough with negated fever and breathlessness in Marathi',
    needsNativeReview: true,
  },
  {
    id: 'HOLD_008',
    category: 'near_miss',
    input: {
      freeText: 'गाडीवरून पडलो गुडघ्याची वाटी दुखतेय चालता येत नाही',
      language: 'mr',
      symptomChips: ['joint_pain'],
    },
    expected: {
      urgency: 'urgent',
      department: 'ORTHO',
      mustNotFireRuleIds: ['RF_014'],
    },
    rationale: 'Isolated knee blunt trauma without polytrauma routing to Ortho',
    needsNativeReview: true,
  },
  {
    id: 'HOLD_009',
    category: 'paediatric',
    input: {
      freeText: 'मुलाच्या कानातून पू वाहतोय दोन दिवसांपासून',
      language: 'mr',
      modifiers: { ageBand: 'child' },
    },
    expected: {
      urgency: 'urgent',
      department: 'PAEDS',
    },
    rationale: 'Paediatric ear discharge routing to Paediatrics',
    needsNativeReview: true,
  },
  {
    id: 'HOLD_010',
    category: 'near_miss',
    input: {
      freeText: 'खूप दिवस झाले अंगावर खाजवणारे लाल पुरळ आहेत ताप नाही',
      language: 'mr',
      symptomChips: ['skin_rash'],
      modifiers: { duration: '>7d' },
    },
    expected: {
      urgency: 'routine',
      department: 'DERMATOLOGY',
    },
    rationale: 'Chronic pruritic rash without systemic signs routing to Dermatology',
    needsNativeReview: true,
  },
];
