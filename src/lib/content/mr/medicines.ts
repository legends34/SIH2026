import type { en } from '../en/index';
type Shape = DeepStringify<typeof en.medicines>;
type DeepStringify<T> = { [K in keyof T]: T[K] extends Record<string, unknown> ? DeepStringify<T[K]> : string };

export const medicines: Shape = {
  title: 'औषधे',
  search: {
    label: 'औषधे शोधा',
    placeholder: 'औषधाचे नाव टाका',
    noResults: 'औषध सापडले नाही.',
  },
  dosage: 'प्रमाण',
  frequency: 'कधी घ्यायचे',
  duration: 'किती दिवस',
  instructions: 'सूचना',
  refill: {
    button: 'पुन्हा औषध मागवा',
    success: 'विनंती पाठवली. {pharmacy} मधून घ्या.',
    error: 'विनंती पाठवता आली नाही. पुन्हा प्रयत्न करा.',
  },
  empty: 'कोणतेही औषध दिलेले नाही.',
};