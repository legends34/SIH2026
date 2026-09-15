import type { en } from '../en/index';
type Shape = DeepStringify<typeof en.records>;
type DeepStringify<T> = { [K in keyof T]: T[K] extends Record<string, unknown> ? DeepStringify<T[K]> : string };

export const records: Shape = {
  title: 'माझ्या आरोग्य नोंदी',
  visit: {
    title: '{date} ची भेट',
    facility: 'सुविधा',
    doctor: 'डॉक्टर',
    notes: 'नोंदी',
    prescriptions: 'औषधांची चिठ्ठी',
    reports: 'रिपोर्ट',
  },
  empty: 'अजून कोणत्याही आरोग्य नोंदी नाहीत.',
  download: 'नोंदी डाउनलोड करा',
  share: {
    button: 'डॉक्टरांसोबत शेअर करा',
    success: 'नोंदी शेअर केल्या.',
    error: 'शेअर करता आले नाही. पुन्हा प्रयत्न करा.',
  },
  consent: {
    title: 'डॉक्टरांना तुमच्या नोंदी पाहण्याची परवानगी द्यायची का?',
    allow: 'हो, परवानगी द्या',
    deny: 'नाही',
    note: 'तुम्ही तुमच्या प्रोफाइलमधून कधीही परवानगी काढू शकता.',
  },
};