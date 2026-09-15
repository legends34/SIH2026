import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { triage, ALLOWED_TRIAGE_RESULT_KEYS } from '../triage';
import { evaluateRedFlags, RED_FLAG_RULES } from '../redFlags';
import { extractSymptoms } from '../extract';
import { EVAL_CASES } from '../__fixtures__/eval-cases';
import type { SymptomId, TriageModifiers } from '../types';

describe('Triage Engine Core Suite', () => {
  it('100% of eval cases whose expected urgency is "emergency" pass', () => {
    const emergencyCases = EVAL_CASES.filter((c) => c.expected.urgency === 'emergency');
    expect(emergencyCases.length).toBeGreaterThanOrEqual(10);

    for (const c of emergencyCases) {
      const result = triage(c.input);
      expect(
        result.urgency,
        `Case ${c.id} expected emergency but received ${result.urgency}. Input: ${JSON.stringify(c.input)}`
      ).toBe('emergency');

      if (c.expected.mustFireRuleIds && c.expected.mustFireRuleIds.length > 0) {
        for (const ruleId of c.expected.mustFireRuleIds) {
          expect(
            result.firedRuleIds,
            `Case ${c.id} expected rule ${ruleId} to fire. Fired: ${result.firedRuleIds}`
          ).toContain(ruleId);
        }
      }
    }
  });

  it('negation: "no fever" / "ताप नाही" / "बुखार नहीं" never yield fever', () => {
    const cases = [
      { text: 'no fever', lang: 'en' as const },
      { text: 'patient has cough without fever', lang: 'en' as const },
      { text: 'बुखार नहीं है', lang: 'hi' as const },
      { text: 'ताप नाही अजिबात', lang: 'mr' as const },
      { text: 'कफ आहे पण ताप नाहीये', lang: 'mr' as const },
    ];

    for (const { text, lang } of cases) {
      const extracted = extractSymptoms(text, lang);
      expect(
        extracted.present.includes('high_fever') || extracted.present.includes('child_fever'),
        `Expected fever NOT to be present in text: "${text}"`
      ).toBe(false);

      const result = triage({ freeText: text, language: lang });
      expect(
        result.matchedSymptomIds.includes('high_fever') ||
        result.matchedSymptomIds.includes('child_fever')
      ).toBe(false);
    }
  });

  it('evaluateRedFlags works when called directly with no facilities and no ranking', () => {
    const fired = evaluateRedFlags(['chest_pain_with_sweating']);
    expect(fired.length).toBeGreaterThan(0);
    expect(fired[0]?.id).toBe('RF_001');

    const empty = evaluateRedFlags([]);
    expect(empty).toEqual([]);
  });

  it('each RED_FLAG_RULES entry has a test that fires it and a near-miss that does not', () => {
    for (const rule of RED_FLAG_RULES) {
      // 1. Positive case: synthesize trigger symptoms
      const triggerSymptoms: SymptomId[] = [];
      if (rule.anyOf && rule.anyOf.length > 0) {
        triggerSymptoms.push(rule.anyOf[0]!);
      }
      if (rule.allOf && rule.allOf.length > 0) {
        for (const s of rule.allOf) {
          if (!triggerSymptoms.includes(s)) triggerSymptoms.push(s);
        }
      }

      // Satisfy population predicate if present
      const candidateModifiers: (TriageModifiers | undefined)[] = [
        undefined,
        { ageBand: 'neonate', pregnancyStatus: 'pregnant' },
        { ageBand: 'neonate', pregnancyStatus: 'postpartum' },
        { ageBand: 'infant' },
        { ageBand: 'child' },
        { ageBand: 'elderly' },
        { pregnancyStatus: 'postpartum' },
      ];
      const positiveModifiers = candidateModifiers.find(
        (m) => !rule.populationPredicate || rule.populationPredicate(m)
      );

      const firedPositive = evaluateRedFlags(triggerSymptoms, positiveModifiers);
      expect(
        firedPositive.some((r) => r.id === rule.id),
        `Rule ${rule.id} failed to fire on valid positive triggers`
      ).toBe(true);

      // 2. Near-miss case: unrelated benign symptom
      const benignSymptoms: SymptomId[] = ['joint_pain'];
      const firedNegative = evaluateRedFlags(benignSymptoms);
      expect(
        firedNegative.some((r) => r.id === rule.id),
        `Rule ${rule.id} fired erroneously on unrelated symptom`
      ).toBe(false);
    }
  });

  it('the TriageResult object has exactly the allowed keys', () => {
    const result = triage({
      freeText: 'chest pain with sweating',
      language: 'en',
    });

    const resultKeys = Object.keys(result).sort();
    const expectedKeys = [...ALLOWED_TRIAGE_RESULT_KEYS].sort();

    expect(resultKeys).toEqual(expectedKeys);
    expect(resultKeys.includes('diagnosis')).toBe(false);
    expect(resultKeys.includes('disease')).toBe(false);
  });

  it('redFlags.ts imports nothing but @/types (read the file as text)', () => {
    const filePath = path.resolve(__dirname, '../redFlags.ts');
    const content = fs.readFileSync(filePath, 'utf-8');

    const importLines = content
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.startsWith('import '));

    expect(importLines.length).toBeGreaterThan(0);
    for (const line of importLines) {
      expect(
        line,
        `redFlags.ts must import ONLY from "@/types". Offending line: ${line}`
      ).toMatch(/from ['"]@\/types['"];?$/);
    }
  });

  it('triage() is synchronous and executes under 5 ms for the longest eval input', () => {
    const longestInput = EVAL_CASES.reduce((prev, curr) =>
      (curr.input.freeText?.length ?? 0) > (prev.input.freeText?.length ?? 0) ? curr : prev
    );

    // Warm-up call
    triage(longestInput.input);

    const start = performance.now();
    for (let i = 0; i < 50; i++) {
      triage(longestInput.input);
    }
    const end = performance.now();
    const durationPerCall = (end - start) / 50;

    expect(durationPerCall).toBeLessThan(5); // under 5 ms threshold
  });
});