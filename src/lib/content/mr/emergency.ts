import type { en } from '../en/index';
type Shape = DeepStringify<typeof en.emergency>;
type DeepStringify<T> = { [K in keyof T]: T[K] extends Record<string, unknown> ? DeepStringify<T[K]> : string };

export const emergency: Shape = {
  overlay: {
    headline: 'आत्ताच मदतीसाठी कॉल करा.',
    call108: '108 वर कॉल करा — रुग्णवाहिका',
    call112: '112 वर कॉल करा — इमर्जन्सी',
    nearestFacility: 'जवळचे इमर्जन्सी: {facilityName} ({distance} किमी)',
    disclaimer:
      'जर कोणी सोबत असेल तर त्यांची मदत घ्या. इमर्जन्सीमध्ये स्वतः गाडी चालवू नका.',
  },
};
