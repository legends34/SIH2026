import type {
  DepartmentCode,
  SymptomId,
  TriageModifiers,
  UrgencyBand,
} from './types';

export const DEFAULT_DEPARTMENT_BY_SYMPTOM: Record<SymptomId, DepartmentCode> = {
  // Cardiovascular & Thoracic
  chest_pain: 'CARDIO',
  chest_pain_radiating: 'EMERGENCY',
  chest_pain_with_sweating: 'EMERGENCY',
  palpitations: 'CARDIO',
  swelling_both_legs: 'GEN_MED',

  // Respiratory
  breathless: 'GEN_MED',
  severe_breathlessness: 'EMERGENCY',
  stridor: 'EMERGENCY',
  cough: 'GEN_MED',
  cough_blood: 'EMERGENCY',
  wheezing: 'GEN_MED',

  // Neurological & Mental State
  sudden_weakness_one_side: 'EMERGENCY',
  slurred_speech: 'EMERGENCY',
  facial_droop: 'EMERGENCY',
  severe_headache: 'NEURO',
  fits: 'EMERGENCY',
  unconscious: 'EMERGENCY',
  confusion: 'EMERGENCY',
  dizziness: 'GEN_MED',
  fainting: 'GEN_MED',
  suicidal_intent: 'EMERGENCY',

  // Trauma, Envenomation & Haemorrhage
  heavy_bleeding: 'EMERGENCY',
  wound_deep: 'SURGERY_GEN',
  burn: 'SURGERY_GEN',
  severe_burn: 'EMERGENCY',
  fracture_suspected: 'ORTHO',
  major_trauma: 'EMERGENCY',
  snakebite: 'EMERGENCY',
  scorpion_sting: 'EMERGENCY',
  poisoning: 'EMERGENCY',

  // Gastrointestinal & Abdominal
  abdominal_pain: 'GEN_MED',
  severe_abdominal_pain: 'EMERGENCY',
  vomiting: 'GEN_MED',
  vomiting_blood: 'EMERGENCY',
  diarrhoea: 'GEN_MED',
  blood_in_stool: 'EMERGENCY',
  severe_dehydration_signs: 'EMERGENCY',
  heartburn: 'GEN_MED',
  constipation: 'GEN_MED',

  // Genitourinary
  cant_pass_urine: 'EMERGENCY',
  pain_urination: 'GEN_MED',
  blood_in_urine: 'GEN_MED',
  scrotal_pain_sudden: 'EMERGENCY',

  // Obstetric & Gynaecological
  pregnancy_bleeding: 'EMERGENCY',
  pregnancy_convulsion: 'EMERGENCY',
  pregnancy_severe_headache_vision: 'EMERGENCY',
  reduced_fetal_movement: 'EMERGENCY',
  rupture_of_membranes: 'OBGYN',
  labour_pain: 'OBGYN',
  postpartum_bleeding: 'EMERGENCY',
  foul_vaginal_discharge: 'OBGYN',

  // Paediatric & Neonatal Danger Signs
  infant_not_feeding: 'EMERGENCY',
  infant_lethargy: 'EMERGENCY',
  infant_fast_breathing: 'EMERGENCY',
  chest_indrawing: 'EMERGENCY',
  infant_fever: 'EMERGENCY',
  infant_hypothermia: 'EMERGENCY',
  child_fever: 'PAEDS',
  child_ear_pain: 'PAEDS',

  // Systemic, Cutaneous & Sensory
  high_fever: 'GEN_MED',
  fever_with_stiff_neck: 'EMERGENCY',
  fever_with_petechial_rash: 'EMERGENCY',
  severe_allergic_reaction: 'EMERGENCY',
  body_ache: 'GEN_MED',
  weakness_fatigue: 'GEN_MED',
  skin_rash: 'DERMATOLOGY',
  joint_pain: 'ORTHO',
  eye_injury: 'EMERGENCY',
  eye_redness_pain: 'OPHTHALMOLOGY',
  ear_discharge: 'ENT',
  sore_throat: 'ENT',
};

/**
 * Priority hierarchy for clinical tie-breaks among non-emergency departments.
 * Specialized / vulnerable populations precede general adult medicine.
 */
const DEPARTMENT_PRIORITY_ORDER: DepartmentCode[] = [
  'OBGYN',
  'NEONATAL',
  'PAEDS',
  'SURGERY_GEN',
  'ORTHO',
  'OPHTHALMOLOGY',
  'ENT',
  'DERMATOLOGY',
  'CARDIO',
  'NEURO',
  'PSYCHIATRY',
  'TOXICOLOGY',
  'GEN_MED',
  'EMERGENCY',
];

const URGENT_SYMPTOMS = new Set<SymptomId>([
  'high_fever',
  'wound_deep',
  'fracture_suspected',
  'blood_in_urine',
  'scrotal_pain_sudden',
  'rupture_of_membranes',
  'labour_pain',
  'foul_vaginal_discharge',
  'child_ear_pain',
  'eye_redness_pain',
  'severe_headache',
]);

const SELF_CARE_SYMPTOMS = new Set<SymptomId>([
  'body_ache',
  'weakness_fatigue',
  'heartburn',
  'sore_throat',
]);

export interface RoutingOutput {
  department: DepartmentCode;
  urgency: UrgencyBand;
}

export function routeNonEmergency(
  symptoms: SymptomId[],
  modifiers?: TriageModifiers
): RoutingOutput {
  if (symptoms.length === 0) {
    return { department: 'GEN_MED', urgency: 'routine' };
  }

  // 1. Age and pregnancy population overrides
  if (modifiers?.pregnancyStatus === 'pregnant' || modifiers?.pregnancyStatus === 'postpartum') {
    const hasObstetricComplaint = symptoms.some((s) => {
      const dept = DEFAULT_DEPARTMENT_BY_SYMPTOM[s];
      return dept === 'OBGYN' || s === 'abdominal_pain' || s === 'pain_urination';
    });
    if (hasObstetricComplaint) {
      return { department: 'OBGYN', urgency: 'urgent' };
    }
  }

  if (modifiers?.ageBand === 'neonate') {
    return { department: 'NEONATAL', urgency: 'urgent' };
  }

  if (modifiers?.ageBand === 'infant' || modifiers?.ageBand === 'child') {
    const hasPaeds = symptoms.some(
      (s) =>
        DEFAULT_DEPARTMENT_BY_SYMPTOM[s] === 'PAEDS' ||
        s === 'cough' ||
        s === 'vomiting' ||
        s === 'diarrhoea' ||
        s === 'ear_discharge' ||
        s === 'child_ear_pain'
    );
    if (hasPaeds) {
      return { department: 'PAEDS', urgency: 'urgent' };
    }
  }

  // 2. Department vote counting
  const departmentCounts = new Map<DepartmentCode, number>();
  for (const s of symptoms) {
    const dept = DEFAULT_DEPARTMENT_BY_SYMPTOM[s] ?? 'GEN_MED';
    departmentCounts.set(dept, (departmentCounts.get(dept) ?? 0) + 1);
  }

  let selectedDept: DepartmentCode = 'GEN_MED';
  let maxCount = 0;

  for (const [dept, count] of departmentCounts.entries()) {
    if (count > maxCount) {
      maxCount = count;
      selectedDept = dept;
    } else if (count === maxCount) {
      // Tie-break via documented priority order
      const currentRank = DEPARTMENT_PRIORITY_ORDER.indexOf(selectedDept);
      const challengerRank = DEPARTMENT_PRIORITY_ORDER.indexOf(dept);
      if (challengerRank !== -1 && (currentRank === -1 || challengerRank < currentRank)) {
        selectedDept = dept;
      }
    }
  }

  // 3. Urgency determination
  let urgency: UrgencyBand = 'routine';

  const hasUrgentSymptom = symptoms.some((s) => URGENT_SYMPTOMS.has(s));
  const isOnlySelfCare =
    symptoms.length === 1 && SELF_CARE_SYMPTOMS.has(symptoms[0]!);

  if (hasUrgentSymptom) {
    urgency = 'urgent';
  } else if (isOnlySelfCare && (!modifiers?.duration || modifiers.duration === '<1h')) {
    urgency = 'self-care';
  } else {
    urgency = 'routine';
  }

  // 4. Acuity modifier adjustments
  if (urgency === 'routine') {
    if (modifiers?.duration === '<1h' && symptoms.includes('abdominal_pain')) {
      urgency = 'urgent';
    }
    // Acute joint pain (not chronic >7d) represents potential fracture, dislocation, or acute haemarthrosis
    if (symptoms.includes('joint_pain') && modifiers?.duration !== '>7d' && (!modifiers?.duration || modifiers.duration === '1–24h' || modifiers.duration === '<1h')) {
      urgency = 'urgent';
    }
    if (modifiers?.ageBand === 'elderly' && (symptoms.includes('dizziness') || symptoms.includes('breathless'))) {
      urgency = 'urgent';
    }
    if (symptoms.length >= 3) {
      urgency = 'urgent';
    }
  }

  return { department: selectedDept, urgency };
}
