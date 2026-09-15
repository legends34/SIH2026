import type { en } from '../en/index';
type Shape = DeepStringify<typeof en.states>;
type DeepStringify<T> = { [K in keyof T]: T[K] extends Record<string, unknown> ? DeepStringify<T[K]> : string };

export const states: Shape = {
  loading: 'लोड होतंय, थोडे थांबा…',
  empty: 'इथे अजून काहीच नाही.',
  emptySubtitle: 'येथे दाखवण्यासाठी सध्या कोणतीही माहिती नाही.',
  error: 'लोड झाले नाही. {action}',
  errorSubtitle: 'एक त्रुटी आली. कृपया पृष्ठ रीफ्रेश करण्याचा प्रयत्न करा.',
  retry: 'पुन्हा प्रयत्न करा',
  offline: 'तुम्ही ऑफलाइन आहात. काही सुविधा काम करणार नाहीत.',
  success: 'झाले.',
};
