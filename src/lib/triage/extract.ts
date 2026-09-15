import type { SupportedLanguage, SymptomId } from './types';
import { normalizeText } from './normalize';
import { LEXICONS } from './lexicon';
import { NEGATION_CUES, CLAUSE_BREAKS, NEGATION_SCOPE_LIMIT } from './lexicon/negation';

export interface ExtractionResult {
  present: SymptomId[];
  negated: SymptomId[];
  matchedPhrases: string[];
  totalTokens: number;
}

interface PhraseEntry {
  phrase: string;
  phraseTokens: string[];
  symptomId: SymptomId;
  tokenCount: number;
}

export function extractSymptoms(
  freeText: string,
  language?: SupportedLanguage
): ExtractionResult {
  if (!freeText || freeText.trim() === '') {
    return { present: [], negated: [], matchedPhrases: [], totalTokens: 0 };
  }

  const normalized = normalizeText(freeText);
  const tokens = normalized.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) {
    return { present: [], negated: [], matchedPhrases: [], totalTokens: 0 };
  }

  // Compile active lexicons: primary language + fallbacks (to handle code-mixing)
  const langsToSearch: SupportedLanguage[] = language
    ? [language, ...(['en', 'hi', 'mr'] as SupportedLanguage[]).filter((l) => l !== language)]
    : ['en', 'hi', 'mr'];

  // Collect all phrases and sort by longest token count first
  const phraseEntries: PhraseEntry[] = [];
  const seenPhrases = new Set<string>();

  for (const lang of langsToSearch) {
    const lexicon = LEXICONS[lang];
    if (!lexicon) continue;

    for (const [symptomId, phrases] of Object.entries(lexicon) as [SymptomId, readonly string[]][]) {
      for (const rawPhrase of phrases) {
        const normPhrase = normalizeText(rawPhrase);
        if (!normPhrase || seenPhrases.has(`${normPhrase}:${symptomId}`)) continue;
        seenPhrases.add(`${normPhrase}:${symptomId}`);

        const pTokens = normPhrase.split(/\s+/).filter(Boolean);
        if (pTokens.length > 0) {
          phraseEntries.push({
            phrase: normPhrase,
            phraseTokens: pTokens,
            symptomId,
            tokenCount: pTokens.length,
          });
        }
      }
    }
  }

  // Sort longest first
  phraseEntries.sort((a, b) => b.tokenCount - a.tokenCount);

  // Identify clause breaks and negation cue positions in the token stream
  const allNegationCues = new Set<string>();
  const allClauseBreaks = new Set<string>();

  for (const lang of ['en', 'hi', 'mr'] as SupportedLanguage[]) {
    NEGATION_CUES[lang]?.forEach((c) => allNegationCues.add(normalizeText(c)));
    CLAUSE_BREAKS[lang]?.forEach((b) => allClauseBreaks.add(normalizeText(b)));
  }

  // Determine token-level negation status
  // A negation cue negates subsequent tokens up to NEGATION_SCOPE_LIMIT (4) tokens
  // or until a clause break token is encountered.
  const tokenIsNegated: boolean[] = new Array(tokens.length).fill(false);
  let negationRemaining = 0;

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i]!;

    if (allClauseBreaks.has(t)) {
      negationRemaining = 0;
      continue;
    }

    if (allNegationCues.has(t)) {
      negationRemaining = NEGATION_SCOPE_LIMIT + 1; // includes the cue itself + 4 tokens
      continue;
    }

    if (negationRemaining > 0) {
      tokenIsNegated[i] = true;
      negationRemaining--;
    }
  }

  // Longest-phrase matching against token stream
  const presentSet = new Set<SymptomId>();
  const negatedSet = new Set<SymptomId>();
  const matchedPhrases: string[] = [];
  const tokenMatched = new Array(tokens.length).fill(false);

  for (let i = 0; i < tokens.length; i++) {
    if (tokenMatched[i]) continue;

    for (const entry of phraseEntries) {
      const { phraseTokens, symptomId, phrase } = entry;
      const len = phraseTokens.length;

      if (i + len > tokens.length) continue;

      let match = true;
      for (let j = 0; j < len; j++) {
        if (tokenMatched[i + j] || tokens[i + j] !== phraseTokens[j]) {
          match = false;
          break;
        }
      }

      if (match) {
        // Mark tokens as matched to prevent double-matching
        for (let j = 0; j < len; j++) {
          tokenMatched[i + j] = true;
        }

        matchedPhrases.push(phrase);

        // Check if phrase started within an active negation scope
        if (tokenIsNegated[i]) {
          negatedSet.add(symptomId);
        } else {
          presentSet.add(symptomId);
        }
        break;
      }
    }
  }

  // Affirmative presence overrides negation if both occurred in different parts
  for (const s of presentSet) {
    negatedSet.delete(s);
  }

  return {
    present: Array.from(presentSet),
    negated: Array.from(negatedSet),
    matchedPhrases,
    totalTokens: tokens.length,
  };
}
