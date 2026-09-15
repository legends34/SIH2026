/**
 * Pure text normalisation pipeline for triage free-text input.
 * Preserves clause-break delimiters required for accurate negation scoping.
 */

export function normalizeText(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }

  // 1. Unicode canonical composition
  let normalized = text.normalize('NFC');

  // 2. Lowercase Latin characters
  normalized = normalized.toLowerCase();

  // 3. Normalise safe Devanagari variants (e.g. Nukta characters to base where appropriate)
  // \u093C is Devanagari Sign Nukta
  normalized = normalized.replace(/[\u093C]/g, '');

  // 4. Preserve clause delimiters (.,;:!? and Devanagari Danda \u0964 \u0965),
  // but replace other non-word/non-alphanumeric punctuation with spaces.
  // Allow Devanagari Unicode range \u0900-\u097F and Latin alphanumeric \w
  normalized = normalized.replace(/[^\w\s.,;:!?\u0900-\u097F\u0964\u0965]/g, ' ');

  // 5. Normalise danda and double danda to periods for uniform clause boundary handling
  normalized = normalized.replace(/[\u0964\u0965]/g, ' . ');

  // 6. Ensure clause break punctuation has spaces around it for token splitting
  normalized = normalized.replace(/([.,;:!?])/g, ' $1 ');

  // 7. Collapse whitespace and trim
  normalized = normalized.replace(/\s+/g, ' ').trim();

  return normalized;
}
