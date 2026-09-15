import type { en } from '../en/index';
type Shape = DeepStringify<typeof en.patientHome>;
type DeepStringify<T> = { [K in keyof T]: T[K] extends Record<string, unknown> ? DeepStringify<T[K]> : string };

export const patientHome: Shape = {
  title: 'मुख्य पान',
  householdAccount: 'सामायिक कौटुंबिक खाते',
  todayAppointment: 'आजची अपॉइंटमेंट',
  viewReceipt: 'टोकन पावती पाहा',
  services: 'आरोग्य सेवा',
  greeting: 'नमस्कार, {name}।',
  greetingGeneric: 'नमस्कार।',
  checkSymptoms: 'लक्षणे तपासा',
  findFacility: 'हॉस्पिटल किंवा दवाखाना शोधा',
  myBookings: 'माझ्या अपॉइंटमेंट',
  myQueue: 'माझा टोकन',
  records: 'माझ्या आरोग्य नोंदी',
  quickLinks: {
    title: 'लवकर करा',
    emergency: 'इमर्जन्सी — 108 वर कॉल करा',
  },
  notifications: {
    title: 'सूचना',
    empty: 'कोणतीही नवीन सूचना नाही।',
  },
};
