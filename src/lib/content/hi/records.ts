import type { en } from '../en/index';
type Shape = DeepStringify<typeof en.records>;
type DeepStringify<T> = { [K in keyof T]: T[K] extends Record<string, unknown> ? DeepStringify<T[K]> : string };

export const records: Shape = {
  title: 'मेरे स्वास्थ्य रिकॉर्ड',
  visit: {
    title: '{date} की विज़िट',
    facility: 'सुविधा',
    doctor: 'डॉक्टर',
    notes: 'नोट्स',
    prescriptions: 'पर्ची',
    reports: 'रिपोर्ट',
  },
  empty: 'अभी कोई स्वास्थ्य रिकॉर्ड नहीं।',
  download: 'रिकॉर्ड डाउनलोड करें',
  share: {
    button: 'डॉक्टर के साथ शेयर करें',
    success: 'रिकॉर्ड शेयर किए गए।',
    error: 'शेयर नहीं हो पाया। फिर कोशिश करें।',
  },
  consent: {
    title: 'क्या डॉक्टर आपके रिकॉर्ड देख सकते हैं?',
    allow: 'हाँ, अनुमति दें',
    deny: 'नहीं',
    note: 'आप अपनी प्रोफ़ाइल से कभी भी अनुमति हटा सकते हैं।',
  },
};