import type { en } from '../en/index';
type Shape = DeepStringify<typeof en.states>;
type DeepStringify<T> = { [K in keyof T]: T[K] extends Record<string, unknown> ? DeepStringify<T[K]> : string };

export const states: Shape = {
  loading: 'लोड होतंय, थोडे थांबा…',
  empty: 'इथे अजून काहीच नाही.',
  error: 'लोड झाले नाही. {action}',
  retry: 'पुन्हा प्रयत्न करा',
  offline: 'तुम्ही ऑफलाइन आहात. काही सुविधा काम करणार नाहीत.',
  success: 'झाले.',
};
