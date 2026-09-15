import type { en } from '../en/index';
type Shape = DeepStringify<typeof en.pharmacist>;
type DeepStringify<T> = { [K in keyof T]: T[K] extends Record<string, unknown> ? DeepStringify<T[K]> : string };

export const pharmacist: Shape = {
  title: 'फ़ार्मेसी',
  queue: {
    title: 'बाकी पर्चियाँ',
    empty: 'कोई पर्ची बाकी नहीं।',
  },
  dispense: {
    button: 'दवाई दे दी गई',
    confirm: 'क्या दवाई दे दी गई है?',
    success: 'दवाई दे दी गई।',
  },
  search: {
    label: 'पर्ची खोजें',
    placeholder: 'मरीज़ का नाम या टोकन नंबर',
  },
};