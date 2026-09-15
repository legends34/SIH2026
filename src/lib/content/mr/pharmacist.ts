import type { en } from '../en/index';
type Shape = DeepStringify<typeof en.pharmacist>;
type DeepStringify<T> = { [K in keyof T]: T[K] extends Record<string, unknown> ? DeepStringify<T[K]> : string };

export const pharmacist: Shape = {
  title: 'फार्मसी',
  queue: {
    title: 'बाकी चिठ्ठ्या',
    empty: 'कोणतीही चिठ्ठी बाकी नाही.',
  },
  dispense: {
    button: 'औषध दिले',
    confirm: 'या चिठ्ठीचे औषध दिले का?',
    success: 'औषध दिले म्हणून नोंदवले.',
  },
  search: {
    label: 'चिठ्ठी शोधा',
    placeholder: 'रुग्णाचे नाव किंवा टोकन नंबर',
  },
};