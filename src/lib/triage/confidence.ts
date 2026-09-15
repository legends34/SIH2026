import type { DepartmentCode, SymptomId } from './types';
import { DEFAULT_DEPARTMENT_BY_SYMPTOM } from './route';

export interface ConfidenceInput {
  isEmergency: boolean;
  symptomChipsCount: number;
  freeTextTokens: number;
  matchedPhrasesCount: number;
  matchedTokensCount: number;
  matchedSymptoms: SymptomId[];
}

/**
 * Signal quality calculation for triage confidence.
 *
 * Formula:
 * - If red flag fired: Confidence = 1.00 (deterministic emergency override).
 * - Otherwise:
 *     Confidence = w_clarity * inputClarity + w_modality * modalityReliability + w_concordance * departmentConcordance
 *   Where:
 *     w_clarity = 0.40 (ratio of input explained by recognized clinical terms)
 *     w_modality = 0.30 (structured chips provide higher certainty than unconstrained free text)
 *     w_concordance = 0.30 (agreement across symptoms on a single destination department)
 *
 * Range: Strictly bounded [0.10, 1.00], rounded to two decimal places.
 */
export function calculateConfidence(input: ConfidenceInput): number {
  if (input.isEmergency) {
    return 1.0;
  }

  if (input.matchedSymptoms.length === 0) {
    return 0.1;
  }

  // 1. Input clarity: share of input tokens accounted for by matched phrases
  let inputClarity = 1.0;
  if (input.freeTextTokens > 0) {
    inputClarity = Math.min(1.0, Math.max(0.2, input.matchedTokensCount / input.freeTextTokens));
  }

  // 2. Modality reliability: structured chip inputs carry higher reliability than raw speech/text
  let modalityReliability = 0.85;
  if (input.symptomChipsCount > 0 && input.freeTextTokens === 0) {
    modalityReliability = 1.0; // Pure structured input
  } else if (input.symptomChipsCount > 0 && input.freeTextTokens > 0) {
    modalityReliability = 0.95; // Multimodal confirmation
  } else {
    modalityReliability = 0.85; // Free text only
  }

  // 3. Department concordance: penalize diffuse, multi-system symptom sets
  const departments = new Set<DepartmentCode>();
  for (const s of input.matchedSymptoms) {
    departments.add(DEFAULT_DEPARTMENT_BY_SYMPTOM[s] ?? 'GEN_MED');
  }

  let departmentConcordance = 1.0;
  if (departments.size === 1) {
    departmentConcordance = 1.0;
  } else if (departments.size === 2) {
    departmentConcordance = 0.75;
  } else {
    departmentConcordance = 0.5;
  }

  const composite =
    0.4 * inputClarity +
    0.3 * modalityReliability +
    0.3 * departmentConcordance;

  return Math.min(1.0, Math.max(0.1, Math.round(composite * 100) / 100));
}
