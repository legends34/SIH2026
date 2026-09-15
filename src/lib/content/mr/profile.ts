import type { en } from '../en/index';
type Shape = DeepStringify<typeof en.profile>;
type DeepStringify<T> = { [K in keyof T]: T[K] extends Record<string, unknown> ? DeepStringify<T[K]> : string };

export const profile: Shape = {
  title: 'माझी प्रोफाइल',
  edit: 'प्रोफाइल बदला',
  name: 'नाव',
  age: 'वय',
  gender: 'लिंग',
  phone: 'मोबाइल नंबर',
  saved: 'प्रोफाइल जतन केली.',
  error: {
    saveFailed: 'जतन झाले नाही. पुन्हा प्रयत्न करा.',
  },
};
