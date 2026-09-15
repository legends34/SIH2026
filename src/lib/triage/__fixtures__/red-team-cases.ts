import type { EvalCase } from './eval-cases';

export interface RedTeamCase extends EvalCase {
  foundBy: 'red-team';
}

export const RED_TEAM_CASES: readonly RedTeamCase[] = [
  {
    id: 'RED_001',
    category: 'red_flag',
    foundBy: 'red-team',
    input: {
      freeText: '70 year old father no chest pain, but sweating heavily and very breathless while sitting',
      language: 'en',
      modifiers: { ageBand: 'elderly' },
    },
    expected: {
      urgency: 'emergency',
      department: 'EMERGENCY',
      mustFireRuleIds: ['RF_005'],
      mustNotFireRuleIds: ['RF_001'],
    },
    rationale: 'Atypical elderly coronary equivalent with dyspnoea and diaphoresis, chest pain negated',
    needsNativeReview: false,
  },
  {
    id: 'RED_002',
    category: 'red_flag',
    foundBy: 'red-team',
    input: {
      freeText: 'toddler high pitched whistling while inhaling and unable to drink water',
      language: 'en',
      modifiers: { ageBand: 'child' },
    },
    expected: {
      urgency: 'emergency',
      department: 'EMERGENCY',
      mustFireRuleIds: ['RF_006'],
    },
    rationale: 'Inspiratory stridor indicating impending upper airway obstruction',
    needsNativeReview: false,
  },
  {
    id: 'RED_003',
    category: 'red_flag',
    foundBy: 'red-team',
    input: {
      freeText: 'नवजात बाळ हाताला खूप थंड लागतंय आणि दूध पीत नाहीये',
      language: 'mr',
      modifiers: { ageBand: 'neonate' },
    },
    expected: {
      urgency: 'emergency',
      department: 'EMERGENCY',
      mustFireRuleIds: ['RF_024'],
    },
    rationale: 'Neonatal hypothermia with feeding refusal in Marathi',
    needsNativeReview: true,
  },
  {
    id: 'RED_004',
    category: 'red_flag',
    foundBy: 'red-team',
    input: {
      freeText: 'boy has sudden severe testicle pain started 1 hour ago rolling in agony',
      language: 'en',
      modifiers: { ageBand: 'child_5_17', duration: '<1h' },
    },
    expected: {
      urgency: 'emergency',
      department: 'EMERGENCY',
    },
    rationale: 'Acute scrotal pain indicating testicular torsion risk requiring emergency exploration',
    needsNativeReview: false,
  },
  {
    id: 'RED_005',
    category: 'negation',
    foundBy: 'red-team',
    input: {
      freeText: 'no vomiting, but patient passed out completely and unresponsive',
      language: 'en',
    },
    expected: {
      urgency: 'emergency',
      department: 'EMERGENCY',
      mustFireRuleIds: ['RF_007'],
      mustNotFireRuleIds: ['RF_011'],
    },
    rationale: 'Negation on vomiting must not leak across clause break into unresponsiveness',
    needsNativeReview: false,
  },
  {
    id: 'RED_006',
    category: 'red_flag',
    foundBy: 'red-team',
    input: {
      freeText: 'vipparit vichar yetayet jeev dyavasa wattoy kahi aasha urli nahi',
      language: 'mr',
    },
    expected: {
      urgency: 'emergency',
      department: 'EMERGENCY',
      mustFireRuleIds: ['RF_032'],
    },
    rationale: 'Expressed active suicidal ideation in romanised Marathi triggering RF_032',
    needsNativeReview: true,
  },
];
