import type { en } from '../en/index';
type Shape = DeepStringify<typeof en.doctor>;
type DeepStringify<T> = { [K in keyof T]: T[K] extends Record<string, unknown> ? DeepStringify<T[K]> : string };

export const doctor: Shape = {
  title: 'डॉक्टर',
  profile: {
    qualification: 'योग्यता',
    experience: '{years} साल का अनुभव',
    languages: 'भाषाएँ',
    availableToday: 'आज उपलब्ध',
    notAvailable: 'आज उपलब्ध नहीं',
  },
  consultNote: {
    title: 'डॉक्टर का नोट',
    empty: 'इस विज़िट के लिए कोई नोट नहीं।',
  },
};