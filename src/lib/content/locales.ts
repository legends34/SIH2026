// ─── Locale definitions ─────────────────────────────────────────────────────

export const LOCALES = ['en', 'hi', 'mr'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'hi'; // Hindi is default demo language for Delhi/NCR demo


/** BCP-47 tags for <html lang="..."> */
export const HTML_LANG: Record<Locale, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  mr: 'mr-IN',
};

/** Native names displayed in the language picker */
export const LOCALE_NATIVE_NAME: Record<Locale, string> = {
  en: 'English',
  hi: 'हिन्दी',
  mr: 'मराठी',
};
