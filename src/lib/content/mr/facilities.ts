import type { en } from '../en/index';
type Shape = DeepStringify<typeof en.facilities>;
type DeepStringify<T> = { [K in keyof T]: T[K] extends Record<string, unknown> ? DeepStringify<T[K]> : string };

export const facilities: Shape = {
  title: 'हॉस्पिटल आणि दवाखाने',
  search: {
    placeholder: 'नाव किंवा ठिकाणावरून शोधा',
    label: 'सुविधा शोधा',
    noResults: 'तुमच्या जवळ कोणतीही सुविधा आढळली नाही. मोठ्या भागात शोधा.',
    loading: 'तुमच्या जवळ सुविधा शोधत आहे…',
  },
  filter: {
    label: 'फिल्टर',
    open24h: '24 तास उघडे',
    hasEmergency: 'इमर्जन्सी वॉर्ड आहे',
    hasBed: 'बेड उपलब्ध आहेत',
  },
  card: {
    distanceAway: '{distance} किमी दूर',
    open: 'आता उघडे आहे',
    closed: 'बंद आहे',
    emergency24h: 'इमर्जन्सी: 24 तास',
    getDirections: 'रस्ता पाहा',
    viewDetails: 'पूर्ण माहिती पाहा',
  },
  detail: {
    departments: 'विभाग',
    timings: 'वेळ',
    phone: 'फोन',
    address: 'पत्ता',
  },
  empty: 'जवळ कोणतेही हॉस्पिटल किंवा दवाखाने आढळले नाहीत.',
};