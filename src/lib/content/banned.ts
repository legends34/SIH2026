import type { Locale } from './locales';

export const ALLOWED_CLINICAL_NAMESPACES = ['records'];

export const BANNED_TERMS: Record<Locale, string[]> = {
  en: [
    'you have',
    'diagnosis',
    'disease',
    'condition',
    'you are suffering',
    'nothing serious',
    "don't worry",
    'all clear',
    "it's just",
  ],
  hi: ['निदान', 'रोग', 'कोई बात नहीं', 'काळजी करू नका'],
  mr: ['निदान', 'रोग', 'काळजी करू नका', 'काहीच नाही', 'सामान्य आहे'],
};

export const EXEMPTIONS: Array<{ key: string; term: string; reason: string }> = [
  { key: 'triage.result.disclaimer', term: 'diagnosis', reason: 'Explicitly stating it is NOT a diagnosis' },
  { key: 'triage.result.disclaimer', term: 'निदान', reason: 'Explicitly stating it is NOT a diagnosis (Marathi)' },
  { key: 'triage.departments.DERMATOLOGY', term: 'रोग', reason: 'Part of the valid department name त्वचारोग' },
  { key: 'common.empty.noData', term: 'काहीच नाही', reason: 'Literal translation for empty state, not false reassurance' },
  { key: 'states.empty', term: 'काहीच नाही', reason: 'Literal translation for empty state, not false reassurance' }
];
