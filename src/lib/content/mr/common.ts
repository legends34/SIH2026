import type { en } from '../en/index';
type Shape = DeepStringify<typeof en.common>;
type DeepStringify<T> = { [K in keyof T]: T[K] extends Record<string, unknown> ? DeepStringify<T[K]> : string };

export const common: Shape = {
  appName: 'आरोग्य सेतु हेल्थ',
  tagline: 'तुमचे आरोग्य, तुमची काळजी, जवळच.',
  loading: 'लोड होतंय…',
  error: {
    generic: 'काहीतरी चुकलं. पुन्हा प्रयत्न करा.',
    noInternet: 'इंटरनेट नाही. सिग्नल तपासा आणि पुन्हा प्रयत्न करा.',
    sessionExpired: 'तुमचे सेशन संपले. पुन्हा लॉग इन करा.',
  },
  button: {
    retry: 'पुन्हा प्रयत्न करा',
    goHome: 'मुख्य पानावर जा',
    cancel: 'रद्द करा',
    confirm: 'निश्चित करा',
    next: 'पुढे',
    back: 'मागे',
    save: 'जतन करा',
    close: 'बंद करा',
  },
  empty: {
    noData: 'इथे अजून काहीच नाही.',
    noResults: 'काहीच सापडले नाही. वेगळे शोधा.',
  },
  language: {
    selectLabel: 'भाषा निवडा',
    changed: 'भाषा {name} मध्ये बदलली.',
  },
};
