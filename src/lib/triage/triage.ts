import type {
  SymptomId,
  TriageContext,
  TriageInput,
  TriageResult,
} from './types';
import { extractSymptoms } from './extract';
import { evaluateRedFlags } from './redFlags';
import { routeNonEmergency } from './route';
import { calculateConfidence } from './confidence';
import { rankFacilities } from './rank';

/**
 * Strict allowlist of property keys permitted on a TriageResult object.
 * Guarantee that no diagnostic or unstructured text fields can ever be produced.
 */
export const ALLOWED_TRIAGE_RESULT_KEYS: readonly (keyof TriageResult)[] = [
  'urgency',
  'department',
  'confidence',
  'recommendedFacilityIds',
  'firedRuleIds',
  'matchedSymptomIds',
];

export function triage(input: TriageInput, ctx?: Partial<TriageContext>): TriageResult {
  // Step 1: Extract symptoms from free text
  const extracted = extractSymptoms(input.freeText ?? '', input.language);

  // Step 2: Combine with structured symptom chips, subtract negated symptoms
  const combinedSet = new Set<SymptomId>(input.symptomChips ?? []);
  for (const s of extracted.present) {
    combinedSet.add(s);
  }
  for (const s of extracted.negated) {
    combinedSet.delete(s);
  }

  const activeSymptoms = Array.from(combinedSet);

  // Step 3: Evaluate deterministic clinical red flags
  const firedRules = evaluateRedFlags(activeSymptoms, input.modifiers);

  let urgency: TriageResult['urgency'];
  let department: TriageResult['department'];
  let confidence: number;
  const firedRuleIds: string[] = firedRules.map((r) => r.id);

  if (firedRules.length > 0) {
    // Immediate emergency override
    urgency = 'emergency';
    department = firedRules[0]!.department;
    confidence = 1.0;
  } else {
    // Non-emergency routing and confidence estimation
    const route = routeNonEmergency(activeSymptoms, input.modifiers);
    urgency = route.urgency;
    department = route.department;

    confidence = calculateConfidence({
      isEmergency: false,
      symptomChipsCount: input.symptomChips?.length ?? 0,
      freeTextTokens: extracted.totalTokens,
      matchedPhrasesCount: extracted.matchedPhrases.length,
      matchedTokensCount: extracted.matchedPhrases.reduce(
        (acc, p) => acc + p.split(/\s+/).length,
        0
      ),
      matchedSymptoms: activeSymptoms,
    });
  }

  // Step 4: Facility ranking
  let recommendedFacilityIds: string[] = [];
  if (ctx && ctx.facilities && ctx.facilities.length > 0) {
    recommendedFacilityIds = rankFacilities({
      origin: input.origin,
      department,
      urgency,
      facilities: ctx.facilities,
      loadByFacility: ctx.loadByFacility ?? {},
      limit: 3,
    });
  }

  const result: TriageResult = {
    urgency,
    department,
    confidence,
    recommendedFacilityIds,
    firedRuleIds,
    matchedSymptomIds: activeSymptoms,
  };

  // Verify object shape at runtime against strict key allowlist
  const resultKeys = Object.keys(result);
  for (const k of resultKeys) {
    if (!ALLOWED_TRIAGE_RESULT_KEYS.includes(k as keyof TriageResult)) {
      throw new Error(`Forbidden key "${k}" detected on TriageResult!`);
    }
  }

  return result;
}
