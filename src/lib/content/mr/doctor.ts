import type { en } from '../en/index';
type Shape = DeepStringify<typeof en.doctor>;
type DeepStringify<T> = { [K in keyof T]: T[K] extends Record<string, unknown> ? DeepStringify<T[K]> : string };

export const doctor: Shape = {
  title: 'डॉक्टर',
  profile: {
    qualification: 'शिक्षण',
    experience: '{years} वर्षांचा अनुभव',
    languages: 'भाषा',
    availableToday: 'आज उपलब्ध',
    notAvailable: 'आज उपलब्ध नाही',
  },
  consultNote: {
    title: 'डॉक्टरांची नोंद',
    empty: 'या भेटीसाठी कोणतीही नोंद नाही.',
  },
};