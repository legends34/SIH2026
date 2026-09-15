import { describe, it, expect } from 'vitest';
import { en } from '../en/index';
import { hi } from '../hi/index';
import { mr } from '../mr/index';
import { LOCALES, NAMESPACES } from '../index';

// ─── Helpers ─────────────────────────────────────────────────────────────────

type NestedObj = Record<string, unknown>;

function flattenKeys(obj: NestedObj, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([k, v]) => {
    const full = prefix ? `${prefix}.${k}` : k;
    return typeof v === 'object' && v !== null
      ? flattenKeys(v as NestedObj, full)
      : [full];
  });
}

function flattenValues(obj: NestedObj, prefix = ''): Array<{ key: string; value: string }> {
  return Object.entries(obj).flatMap(([k, v]) => {
    const full = prefix ? `${prefix}.${k}` : k;
    return typeof v === 'object' && v !== null
      ? flattenValues(v as NestedObj, full)
      : [{ key: full, value: String(v) }];
  });
}

function extractPlaceholders(str: string): string[] {
  return [...str.matchAll(/\{(\w+)\}/g)].map(m => m[1] ?? '');
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('Locale catalogue: key parity', () => {
  const enKeys = flattenKeys(en as unknown as NestedObj).sort();

  it('hi has every key that en has', () => {
    const hiKeys = flattenKeys(hi as unknown as NestedObj).sort();
    expect(hiKeys).toEqual(enKeys);
  });

  it('mr has every key that en has', () => {
    const mrKeys = flattenKeys(mr as unknown as NestedObj).sort();
    expect(mrKeys).toEqual(enKeys);
  });
});

describe('Locale catalogue: placeholder parity', () => {
  const enEntries = flattenValues(en as unknown as NestedObj);

  for (const locale of ['hi', 'mr'] as const) {
    const localeData = locale === 'hi' ? hi : mr;

    it(`${locale}: every {placeholder} from en appears in translation`, () => {
      const localeEntries = flattenValues(localeData as unknown as NestedObj);
      const localeMap = new Map(localeEntries.map(e => [e.key, e.value]));
      const mismatches: string[] = [];

      for (const { key, value } of enEntries) {
        const enVars = extractPlaceholders(value);
        if (enVars.length === 0) continue;
        const localeVal = localeMap.get(key) ?? '';
        const localeVars = extractPlaceholders(localeVal);
        const missing = enVars.filter(v => !localeVars.includes(v));
        const extra = localeVars.filter(v => !enVars.includes(v));
        if (missing.length || extra.length) {
          mismatches.push(`${key}: en=[${enVars}] ${locale}=[${localeVars}]`);
        }
      }
      expect(mismatches, mismatches.join('\n')).toHaveLength(0);
    });
  }
});

describe('Locale catalogue: no empty strings', () => {
  for (const [localeLabel, data] of [['en', en], ['hi', hi], ['mr', mr]] as const) {
    it(`${localeLabel}: no empty string values`, () => {
      const empties = flattenValues(data as unknown as NestedObj)
        .filter(e => e.value.trim() === '')
        .map(e => e.key);
      expect(empties, `Empty values: ${empties.join(', ')}`).toHaveLength(0);
    });
  }
});

describe('t() function: fallback to en', () => {
  it('returns en value for a missing runtime key in hi', async () => {
    const { t } = await import('../index');
    // A key that is ⟦TODO⟧ in hi should still return something (en fallback)
    const result = t('hi', 'common.appName');
    expect(result).toBeTruthy();
    expect(result).not.toBe('common.appName'); // didn't return the key itself
  });

  it('returns the key itself when key does not exist at all', async () => {
    const { t } = await import('../index');
    expect(t('en', 'nonexistent.deeply.nested.key')).toBe('nonexistent.deeply.nested.key');
  });
});

describe('LOCALES and NAMESPACES completeness', () => {
  it('LOCALES has en, hi, mr', () => {
    expect(LOCALES).toContain('en');
    expect(LOCALES).toContain('hi');
    expect(LOCALES).toContain('mr');
  });

  it('NAMESPACES covers all expected namespaces', () => {
    const expected = ['common','auth','patientHome','triage','emergency',
      'facilities','booking','queue','doctor','records','medicines',
      'pharmacist','complaints','profile','admin','states'];
    for (const ns of expected) {
      expect(NAMESPACES).toContain(ns);
    }
  });
});
