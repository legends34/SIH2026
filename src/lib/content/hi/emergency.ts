import type { en } from '../en/index';
type EmergencyShape = DeepStringify<typeof en.emergency>;
type DeepStringify<T> = { [K in keyof T]: T[K] extends Record<string, unknown> ? DeepStringify<T[K]> : string };

export const emergency: EmergencyShape = {
  overlay: {
    headline: 'अभी मदद के लिए कॉल करें।',
    call108: '108 पर कॉल करें — एम्बुलेंस',
    call112: '112 पर कॉल करें — इमरजेंसी',
    nearestFacility: 'नज़दीकी इमरजेंसी: {facilityName} ({distance} किमी)',
    disclaimer:
      'अगर कोई साथ है, तो उनसे मदद लें। इमरजेंसी में खुद गाड़ी न चलाएँ।',
  },
};
