import { describe, it, expect } from 'vitest';
import { EN_LEXICON } from '../lexicon/en';
import { HI_LEXICON } from '../lexicon/hi';
import { MR_LEXICON } from '../lexicon/mr';
import { NEGATION_CUES, CLAUSE_BREAKS } from '../lexicon/negation';
import type { SymptomId } from '../types';

describe('Triage Lexicon Integrity', () => {
  const languages = [
    { code: 'en', lexicon: EN_LEXICON },
    { code: 'hi', lexicon: HI_LEXICON },
    { code: 'mr', lexicon: MR_LEXICON },
  ] as const;

  languages.forEach(({ code, lexicon }) => {
    describe(`Lexicon ${code}`, () => {
      it('has at least 4 phrases for every SymptomId', () => {
        const entries = Object.entries(lexicon) as [SymptomId, readonly string[]][];
        expect(entries.length).toBeGreaterThanOrEqual(60);

        for (const [symptomId, phrases] of entries) {
          expect(
            phrases.length,
            `Symptom ${symptomId} in ${code} must have at least 4 phrases (found ${phrases.length})`
          ).toBeGreaterThanOrEqual(4);
        }
      });

      it('has no colliding phrases mapping to two different SymptomIds', () => {
        const phraseToSymptoms = new Map<string, SymptomId[]>();

        for (const [symptomId, phrases] of Object.entries(lexicon) as [SymptomId, readonly string[]][]) {
          for (const phrase of phrases) {
            const normalized = phrase.toLowerCase().trim();
            const existing = phraseToSymptoms.get(normalized) ?? [];
            if (!existing.includes(symptomId)) {
              existing.push(symptomId);
            }
            phraseToSymptoms.set(normalized, existing);
          }
        }

        const collisions: Array<{ phrase: string; symptoms: SymptomId[] }> = [];
        for (const [phrase, symptoms] of phraseToSymptoms.entries()) {
          if (symptoms.length > 1) {
            collisions.push({ phrase, symptoms });
          }
        }

        expect(
          collisions,
          `Collisions found in ${code}: ${JSON.stringify(collisions)}`
        ).toEqual([]);
      });
    });
  });

  it('provides negation cues and clause breaks for all supported languages', () => {
    expect(NEGATION_CUES.en.length).toBeGreaterThan(0);
    expect(NEGATION_CUES.hi.length).toBeGreaterThan(0);
    expect(NEGATION_CUES.mr.length).toBeGreaterThan(0);

    expect(CLAUSE_BREAKS.en.length).toBeGreaterThan(0);
    expect(CLAUSE_BREAKS.hi.length).toBeGreaterThan(0);
    expect(CLAUSE_BREAKS.mr.length).toBeGreaterThan(0);
  });
});
