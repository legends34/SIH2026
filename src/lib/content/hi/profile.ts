import type { en } from '../en/index';
type Shape = DeepStringify<typeof en.profile>;
type DeepStringify<T> = { [K in keyof T]: T[K] extends Record<string, unknown> ? DeepStringify<T[K]> : string };

export const profile: Shape = {
  title: 'मेरी प्रोफ़ाइल',
  edit: 'प्रोफ़ाइल बदलें',
  name: 'नाम',
  age: 'उम्र',
  gender: 'लिंग',
  phone: 'मोबाइल नंबर',
  saved: 'प्रोफ़ाइल सेव हो गई।',
  error: {
    saveFailed: 'सेव नहीं हुआ। फिर कोशिश करें।',
  },
};
