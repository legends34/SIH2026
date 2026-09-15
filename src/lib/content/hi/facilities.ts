import type { en } from '../en/index';
type Shape = DeepStringify<typeof en.facilities>;
type DeepStringify<T> = { [K in keyof T]: T[K] extends Record<string, unknown> ? DeepStringify<T[K]> : string };

export const facilities: Shape = {
  title: 'अस्पताल और क्लिनिक',
  search: {
    placeholder: 'नाम या जगह से खोजें',
    label: 'सुविधाएँ खोजें',
    noResults: 'आपके आस-पास कोई सुविधा नहीं मिली। बड़े क्षेत्र में खोजें।',
    loading: 'आपके आस-पास सुविधाएँ खोज रहे हैं…',
  },
  filter: {
    label: 'फ़िल्टर',
    open24h: '24 घंटे खुला',
    hasEmergency: 'इमरजेंसी वार्ड है',
    hasBed: 'बेड उपलब्ध हैं',
  },
  card: {
    distanceAway: '{distance} किमी दूर',
    open: 'अभी खुला है',
    closed: 'बंद है',
    emergency24h: 'इमरजेंसी: 24 घंटे',
    getDirections: 'रास्ता देखें',
    viewDetails: 'पूरी जानकारी देखें',
  },
  detail: {
    departments: 'विभाग',
    timings: 'समय',
    phone: 'फ़ोन',
    address: 'पता',
  },
  empty: 'आस-पास कोई अस्पताल या क्लिनिक नहीं मिला।',
};