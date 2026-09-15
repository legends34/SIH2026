import type { en } from '../en/index';
type Shape = DeepStringify<typeof en.states>;
type DeepStringify<T> = { [K in keyof T]: T[K] extends Record<string, unknown> ? DeepStringify<T[K]> : string };

export const states: Shape = {
  loading: 'लोड हो रहा है, थोड़ा रुकें…',
  empty: 'यहाँ अभी कुछ नहीं है।',
  emptySubtitle: 'यहाँ प्रदर्शित करने के लिए अभी कोई जानकारी नहीं है।',
  error: 'लोड नहीं हुआ। {action}',
  errorSubtitle: 'एक त्रुटि हुई। कृपया पृष्ठ को रीफ़्रेश करने का प्रयास करें।',
  retry: 'फिर कोशिश करें',
  offline: 'आप ऑफलाइन हैं। कुछ सुविधाएँ काम नहीं करेंगी।',
  success: 'हो गया।',
};
