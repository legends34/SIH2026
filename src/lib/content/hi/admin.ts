import type { en } from '../en/index';
type Shape = DeepStringify<typeof en.admin>;
type DeepStringify<T> = { [K in keyof T]: T[K] extends Record<string, unknown> ? DeepStringify<T[K]> : string };

export const admin: Shape = {
  title: 'एडमिन पैनल',
  dashboard: {
    title: 'डैशबोर्ड',
    totalPatients: 'आज के मरीज़',
    waitTime: 'औसत इंतज़ार',
    openTokens: 'खुले टोकन',
  },
  users: {
    title: 'यूज़र',
    add: 'यूज़र जोड़ें',
    role: 'भूमिका',
    roles: {
      patient: 'मरीज़',
      doctor: 'डॉक्टर',
      pharmacist: 'फ़ार्मासिस्ट',
      admin: 'एडमिन',
    },
  },
  error: {
    unauthorized: 'आपको यह करने की अनुमति नहीं है।',
  },
};