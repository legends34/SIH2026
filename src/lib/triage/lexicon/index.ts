export * from './en';
export * from './hi';
export * from './mr';
export * from './negation';

import { EN_LEXICON } from './en';
import { HI_LEXICON } from './hi';
import { MR_LEXICON } from './mr';
import type { SupportedLanguage, SymptomId } from '../types';

export const LEXICONS: Record<SupportedLanguage, Record<SymptomId, readonly string[]>> = {
  en: EN_LEXICON,
  hi: HI_LEXICON,
  mr: MR_LEXICON,
};
