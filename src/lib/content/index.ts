// ─── Main i18n entry point ───────────────────────────────────────────────────
export { LOCALES, DEFAULT_LOCALE, HTML_LANG, LOCALE_NATIVE_NAME } from './locales';
export type { Locale } from './locales';
export { NAMESPACES } from './namespaces';
export type { Namespace } from './namespaces';
export type { MessageKey, Messages, ExtractVars } from './types';

import { en } from './en/index';
import { hi } from './hi/index';
import { mr } from './mr/index';
import type { Locale } from './locales';
import { DEFAULT_LOCALE, HTML_LANG } from './locales';

// The full message catalogue keyed by locale
const catalogue = { en, hi, mr } as const;

/**
 * t(locale, key, vars?)
 * Resolves a dotted message key for the given locale.
 * Falls back to `en` if the key is missing in the requested locale.
 */
export function t(
  locale: Locale,
  key: string,
  vars?: Record<string, string | number>,
): string {
  const parts = key.split('.');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let value: any = (catalogue as any)[locale];
  for (const part of parts) {
    if (value == null || typeof value !== 'object') { value = undefined; break; }
    value = value[part];
  }

  // Fallback to English
  if (typeof value !== 'string') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let fallback: any = catalogue.en;
    for (const part of parts) {
      if (fallback == null || typeof fallback !== 'object') { fallback = undefined; break; }
      fallback = fallback[part];
    }
    value = typeof fallback === 'string' ? fallback : key;
  }

  // Replace {placeholder} tokens
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      value = (value as string).replaceAll(`{${k}}`, String(v));
    }
  }

  return value as string;
}

// ─── LocaleProvider (browser-only, safe for SSR) ────────────────────────────
const STORAGE_KEY = 'locale';

function getStoredLocale(): Locale | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'hi' || stored === 'mr') return stored;
  } catch { /* SSR or private mode */ }
  return null;
}

function setStoredLocale(locale: Locale): void {
  try { localStorage.setItem(STORAGE_KEY, locale); } catch { /* SSR or private mode */ }
}

function applyLocale(locale: Locale): void {
  try {
    document.documentElement.lang = HTML_LANG[locale];
  } catch { /* SSR */ }
}

export function createLocaleProvider() {
  let _locale: Locale = getStoredLocale() ?? DEFAULT_LOCALE;
  applyLocale(_locale);

  const listeners = new Set<(l: Locale) => void>();

  return {
    get locale(): Locale { return _locale; },
    setLocale(locale: Locale) {
      _locale = locale;
      setStoredLocale(locale);
      applyLocale(locale);
      listeners.forEach(fn => fn(locale));
    },
    subscribe(fn: (l: Locale) => void) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    /** useT() — call inside a reactive context (React, Svelte, etc.) */
    useT() {
      return {
        locale: _locale,
        setLocale: this.setLocale.bind(this),
        t: (key: string, vars?: Record<string, string | number>) =>
          t(_locale, key, vars),
      };
    },
  };
}

/** Singleton provider — import this in your app root */
export const localeProvider = createLocaleProvider();

/** Convenience hook alias */
export const useT = () => localeProvider.useT();
