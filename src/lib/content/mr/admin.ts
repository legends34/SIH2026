import type { en } from '../en/index';
type Shape = DeepStringify<typeof en.admin>;
type DeepStringify<T> = { [K in keyof T]: T[K] extends Record<string, unknown> ? DeepStringify<T[K]> : string };

export const admin: Shape = {
  title: 'ॲडमिन पॅनेल',
  dashboard: {
    title: 'डॅशबोर्ड',
    totalPatients: 'आजचे रुग्ण',
    waitTime: 'प्रतीक्षेची सरासरी वेळ',
    openTokens: 'सक्रिय टोकन',
  },
  users: {
    title: 'वापरकर्ते',
    add: 'वापरकर्ता जोडा',
    role: 'भूमिका',
    roles: {
      patient: 'रुग्ण',
      doctor: 'डॉक्टर',
      pharmacist: 'फार्मासिस्ट',
      admin: 'ॲडमिन',
    },
  },
  error: {
    unauthorized: 'तुम्हाला हे करण्याची परवानगी नाही.',
  },
};