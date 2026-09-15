import type { en } from '../en/index';
type CommonShape = DeepStringify<typeof en.common>;
type DeepStringify<T> = { [K in keyof T]: T[K] extends Record<string, unknown> ? DeepStringify<T[K]> : string };

export const common: CommonShape = {
  appName: 'आरोग्य सेतु हेल्थ',
  tagline: 'आपकी सेहत, आपकी देखभाल, पास में।',
  loading: 'लोड हो रहा है…',
  error: {
    generic: 'कुछ गड़बड़ हो गई। फिर से कोशिश करें।',
    noInternet: 'इंटरनेट नहीं है। सिग्नल देखें और फिर कोशिश करें।',
    sessionExpired: 'आपका सेशन खत्म हो गया। फिर से लॉग इन करें।',
  },
  button: {
    retry: 'फिर कोशिश करें',
    goHome: 'होम पर जाएँ',
    cancel: 'रद्द करें',
    confirm: 'पक्का करें',
    next: 'आगे',
    back: 'पीछे',
    save: 'सेव करें',
    close: 'बंद करें',
  },
  empty: {
    noData: 'अभी कुछ नहीं है।',
    noResults: 'कोई नतीजा नहीं। दूसरी खोज करें।',
  },
  language: {
    selectLabel: 'भाषा चुनें',
    changed: 'भाषा {name} में बदल गई।',
  },
  actions: {
    back: 'वापस जाएं',
    close: 'बंद करें',
  },
  roles: {
    citizen: 'नागरिक',
    doctor: 'चिकित्सक',
    pharmacist: 'फार्मासिस्ट',
    admin: 'जिला प्रशासक',
  },
};
