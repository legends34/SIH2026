#!/usr/bin/env tsx
// pnpm content:report — prints per-locale/namespace stats

import { en } from './en/index';
import { hi } from './hi/index';
import { mr } from './mr/index';
import { NAMESPACES } from './namespaces';

type NestedObj = Record<string, unknown>;

function flattenValues(obj: NestedObj, prefix = ''): Array<{ key: string; value: string }> {
  return Object.entries(obj).flatMap(([k, v]) => {
    const full = prefix ? `${prefix}.${k}` : k;
    return typeof v === 'object' && v !== null
      ? flattenValues(v as NestedObj, full)
      : [{ key: full, value: String(v) }];
  });
}

const locales = [
  { label: 'en', data: en },
  { label: 'hi', data: hi },
  { label: 'mr', data: mr },
] as const;

console.log('\n📋  content:report\n');
console.log(
  'Locale  Namespace        Keys   ⟦TODO⟧  REVIEW',
);
console.log('─'.repeat(60));

let totalTodo = 0;
let totalReview = 0;

for (const { label, data } of locales) {
  for (const ns of NAMESPACES) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nsData = (data as any)[ns];
    if (!nsData) {
      console.log(`${label.padEnd(7)} ${ns.padEnd(16)} (missing)`);
      continue;
    }
    const entries = flattenValues(nsData as NestedObj);
    const todoCount = entries.filter(e => e.value.includes('⟦TODO⟧')).length;
    const reviewCount = entries.filter(e => e.value.includes('// REVIEW')).length;
    totalTodo += todoCount;
    totalReview += reviewCount;

    const todoStr = todoCount > 0 ? String(todoCount).padStart(6) : '     -';
    const reviewStr = reviewCount > 0 ? String(reviewCount).padStart(6) : '     -';
    console.log(
      `${label.padEnd(7)} ${ns.padEnd(16)} ${String(entries.length).padStart(4)}   ${todoStr}  ${reviewStr}`,
    );
  }
}

console.log('─'.repeat(60));
console.log(`\nTotal ⟦TODO⟧: ${totalTodo}   Total // REVIEW: ${totalReview}`);
if (totalTodo === 0 && totalReview === 0) {
  console.log('\n✅  Ready for release check.\n');
} else {
  console.log('\n⚠️  Resolve all ⟦TODO⟧ and // REVIEW before freeze.\n');
}
