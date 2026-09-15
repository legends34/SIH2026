import { describe, it, expect } from 'vitest';
import { en } from '../en/index';
import { hi } from '../hi/index';
import { mr } from '../mr/index';
import { BANNED_TERMS, ALLOWED_CLINICAL_NAMESPACES, EXEMPTIONS } from '../banned';

// Derive keys from base English content dictionary to test multi-locale parity
const SYMPTOM_IDS = Object.keys(en.triage.symptoms);
const DEPARTMENT_CODES = Object.keys(en.triage.departments);



type NestedObj = Record<string, unknown>;

function flattenValues(obj: NestedObj, prefix = ''): Array<{ key: string; value: string }> {
  return Object.entries(obj).flatMap(([k, v]) => {
    const full = prefix ? `${prefix}.${k}` : k;
    return typeof v === 'object' && v !== null
      ? flattenValues(v as NestedObj, full)
      : [{ key: full, value: String(v) }];
  });
}

const localesData = { en, hi, mr } as const;
const localesList = ['en', 'hi', 'mr'] as const;

describe('Guard tests: Banned Terms', () => {
  for (const locale of localesList) {
    it(`checks ${locale} for banned diagnosis/reassurance terms`, () => {
      const data = localesData[locale];
      const banned = BANNED_TERMS[locale];
      const violations: string[] = [];

      for (const [ns, nsData] of Object.entries(data)) {
        if (ALLOWED_CLINICAL_NAMESPACES.includes(ns)) continue;
        
        const entries = flattenValues(nsData as NestedObj, ns);
        
        for (const { key, value } of entries) {
          const lowerValue = value.toLowerCase();
          for (const term of banned) {
            const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            // Checking for boundaries, works better for scripts
            const regex = new RegExp(`(^|[^\\p{L}\\p{N}])${escapedTerm}([^\\p{L}\\p{N}]|$)`, 'iu');
            
            if (regex.test(lowerValue)) {
              const isExempt = EXEMPTIONS.some(e => e.key === key && e.term === term);
              if (!isExempt) {
                violations.push(`[${key}] contains banned term "${term}"`);
              }
            }
          }
        }
      }
      
      expect(violations, violations.join('\n')).toHaveLength(0);
    });
  }
});

describe('Guard tests: Coverage', () => {
  for (const locale of localesList) {
    it(`${locale}: covers all SYMPTOM_IDS`, () => {
      const symptoms = localesData[locale].triage.symptoms;
      for (const sym of SYMPTOM_IDS) {
        expect(symptoms).toHaveProperty(sym);
      }
    });

    it(`${locale}: covers all DEPARTMENT_CODES`, () => {
      const depts = localesData[locale].triage.departments;
      for (const dept of DEPARTMENT_CODES) {
        expect(depts).toHaveProperty(dept);
      }
    });
  }
});

describe('Guard tests: Button/Label Length', () => {
  it('checks hi and mr button/label lengths against en', () => {
    const enEntries = flattenValues(en as NestedObj);
    const hiEntries = new Map(flattenValues(hi as NestedObj).map(e => [e.key, e.value]));
    const mrEntries = new Map(flattenValues(mr as NestedObj).map(e => [e.key, e.value]));
    
    const overlong: string[] = [];

    for (const { key, value: enValue } of enEntries) {
      const parts = key.toLowerCase().split('.');
      const lastPart = parts[parts.length - 1];
      if (lastPart?.includes('button') || lastPart?.includes('label')) {
        const enLen = enValue.length;
        // Avoid dividing by 0 for empty strings, give small baseline
        const maxLen = Math.max(enLen * 1.6, 10);
        
        const hiVal = hiEntries.get(key);
        if (hiVal && hiVal.length > maxLen) {
          overlong.push(`[hi] ${key}: ${hiVal.length} chars (en: ${enLen})`);
        }
        
        const mrVal = mrEntries.get(key);
        if (mrVal && mrVal.length > maxLen) {
          overlong.push(`[mr] ${key}: ${mrVal.length} chars (en: ${enLen})`);
        }
      }
    }
    
    if (overlong.length > 0) {
      console.warn('⚠️ Overlong buttons/labels:\n' + overlong.join('\n'));
    }
    expect(overlong.length).toBeLessThanOrEqual(10);
  });
});

describe('Guard tests: TODOs', () => {
  it('counts or fails on ⟦TODO⟧ based on RELEASE env', () => {
    let todoCount = 0;
    
    for (const locale of localesList) {
      const entries = flattenValues(localesData[locale] as NestedObj);
      for (const { value } of entries) {
        if (value.includes('⟦TODO⟧')) {
          todoCount++;
        }
      }
    }
    
    if (process.env.RELEASE === '1') {
      expect(todoCount, `Found ${todoCount} ⟦TODO⟧ items during RELEASE build`).toBe(0);
    } else {
      expect(true).toBe(true);
    }
  });
});
