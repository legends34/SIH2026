import type { en } from '../en/index';
type Shape = DeepStringify<typeof en.patientHome>;
type DeepStringify<T> = { [K in keyof T]: T[K] extends Record<string, unknown> ? DeepStringify<T[K]> : string };

export const patientHome: Shape = {
  title: 'मुख्य पृष्ठ',
  householdAccount: 'साझा पारिवारिक खाता',
  todayAppointment: 'आज का अपॉइंटमेंट',
  viewReceipt: 'टोकन रसीद देखें',
  services: 'स्वास्थ्य सेवाएं',
  greeting: 'नमस्ते, {name}।',
  greetingGeneric: 'नमस्ते।',
  checkSymptoms: 'लक्षण जाँचें',
  findFacility: 'अस्पताल या क्लिनिक खोजें',
  myBookings: 'मेरे अपॉइंटमेंट',
  myQueue: 'मेरा टोकन',
  records: 'मेरे स्वास्थ्य रिकॉर्ड',
  quickLinks: {
    title: 'जल्दी करें',
    emergency: 'इमरजेंसी — 108 पर कॉल करें',
  },
  notifications: {
    title: 'सूचनाएँ',
    empty: 'कोई नई सूचना नहीं।',
  },
};
