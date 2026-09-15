/**
 * Lane C — Triage & Routing Type Definitions
 * Canonical contract for the deterministic triage engine.
 * Handed off to Lane B for inclusion in `src/types/index.ts`.
 */

export type UrgencyBand = 'emergency' | 'urgent' | 'routine' | 'self-care';

export type DepartmentCode =
  | 'EMERGENCY'
  | 'GEN_MED'
  | 'PAEDS'
  | 'NEONATAL'
  | 'OBGYN'
  | 'SURGERY_GEN'
  | 'ORTHO'
  | 'CARDIO'
  | 'NEURO'
  | 'ENT'
  | 'OPHTHALMOLOGY'
  | 'DERMATOLOGY'
  | 'PSYCHIATRY'
  | 'TOXICOLOGY';

export type FacilityTier = 'SC' | 'PHC' | 'CHC' | 'SDH' | 'DH';

export type SymptomId =
  // Cardiovascular & Thoracic
  | 'chest_pain'
  | 'chest_pain_radiating'
  | 'chest_pain_with_sweating'
  | 'palpitations'
  | 'swelling_both_legs'
  // Respiratory
  | 'breathless'
  | 'severe_breathlessness'
  | 'stridor'
  | 'cough'
  | 'cough_blood'
  | 'wheezing'
  // Neurological & Mental State
  | 'sudden_weakness_one_side'
  | 'slurred_speech'
  | 'facial_droop'
  | 'severe_headache'
  | 'fits'
  | 'unconscious'
  | 'confusion'
  | 'dizziness'
  | 'fainting'
  | 'suicidal_intent'
  // Trauma, Envenomation & Haemorrhage
  | 'heavy_bleeding'
  | 'wound_deep'
  | 'burn'
  | 'severe_burn'
  | 'fracture_suspected'
  | 'major_trauma'
  | 'snakebite'
  | 'scorpion_sting'
  | 'poisoning'
  // Gastrointestinal & Abdominal
  | 'abdominal_pain'
  | 'severe_abdominal_pain'
  | 'vomiting'
  | 'vomiting_blood'
  | 'diarrhoea'
  | 'blood_in_stool'
  | 'severe_dehydration_signs'
  | 'heartburn'
  | 'constipation'
  // Genitourinary
  | 'cant_pass_urine'
  | 'pain_urination'
  | 'blood_in_urine'
  | 'scrotal_pain_sudden'
  // Obstetric & Gynaecological
  | 'pregnancy_bleeding'
  | 'pregnancy_convulsion'
  | 'pregnancy_severe_headache_vision'
  | 'reduced_fetal_movement'
  | 'rupture_of_membranes'
  | 'labour_pain'
  | 'postpartum_bleeding'
  | 'foul_vaginal_discharge'
  // Paediatric & Neonatal Danger Signs
  | 'infant_not_feeding'
  | 'infant_lethargy'
  | 'infant_fast_breathing'
  | 'chest_indrawing'
  | 'infant_fever'
  | 'infant_hypothermia'
  | 'child_fever'
  | 'child_ear_pain'
  // Systemic, Cutaneous & Sensory
  | 'high_fever'
  | 'fever_with_stiff_neck'
  | 'fever_with_petechial_rash'
  | 'severe_allergic_reaction'
  | 'body_ache'
  | 'weakness_fatigue'
  | 'skin_rash'
  | 'joint_pain'
  | 'eye_injury'
  | 'eye_redness_pain'
  | 'ear_discharge'
  | 'sore_throat';

export type AgeBand =
  | 'neonate'
  | 'infant'
  | 'child'
  | 'child_5_17'
  | 'adult'
  | 'elderly';

export type Sex = 'male' | 'female' | 'other';

export type PregnancyStatus = 'pregnant' | 'postpartum' | 'not_applicable';

export type DurationBand = '<1h' | '1–24h' | '1–7d' | '>7d';

export interface TriageModifiers {
  ageBand?: AgeBand;
  sex?: Sex;
  pregnancyStatus?: PregnancyStatus;
  duration?: DurationBand;
}

export type SupportedLanguage = 'en' | 'hi' | 'mr';

export interface GeoLocation {
  latitude: number;
  longitude: number;
}

export interface TriageInput {
  freeText?: string;
  language?: SupportedLanguage;
  symptomChips?: SymptomId[];
  modifiers?: TriageModifiers;
  origin?: GeoLocation;
}

export interface TriageResult {
  readonly urgency: UrgencyBand;
  readonly department: DepartmentCode;
  readonly confidence: number;
  readonly recommendedFacilityIds: string[];
  readonly firedRuleIds: string[];
  readonly matchedSymptomIds: SymptomId[];
}

export interface Facility {
  id: string;
  name: string;
  tier: FacilityTier;
  latitude: number;
  longitude: number;
  departments: DepartmentCode[];
  dailyCapacity: number;
}

export type FacilityLoadMap = Record<string, number>;

export interface TriageContext {
  facilities: Facility[];
  loadByFacility: FacilityLoadMap;
}

export interface RedFlagRule {
  id: string;
  presentation: string;
  populationPredicate?: (modifiers?: TriageModifiers) => boolean;
  allOf?: SymptomId[];
  anyOf?: SymptomId[];
  department: DepartmentCode;
  sourceTitle: string;
  sourceUrl: string;
  locationInSource: string;
  supportingQuote: string;
}
