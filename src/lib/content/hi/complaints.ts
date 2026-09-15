import type { en } from '../en/index';
type Shape = DeepStringify<typeof en.complaints>;
type DeepStringify<T> = { [K in keyof T]: T[K] extends Record<string, unknown> ? DeepStringify<T[K]> : string };

export const complaints: Shape = {
  title: 'फीडबैक और शिकायतें',
  generate: 'शिकायत पूर्वावलोकन बनाएं',
  submit: 'आधिकारिक शिकायत दर्ज करें',
  preview: {
    title: 'शिकायत विवरण की समीक्षा और संपादन',
  },
  form: {
    title: 'क्या हुआ?',
    typeLabel: 'प्रकार',
    types: {
      delay: 'लंबा इंतज़ार',
      staff: 'स्टाफ़ का व्यवहार',
      facility: 'साफ-सफाई या सुविधाएँ',
      medicine: 'दवाई उपलब्ध नहीं',
      other: 'अन्य',
    },
    descriptionLabel: 'हमें और बताएँ',
    descriptionPlaceholder: 'लिखें कि क्या हुआ…',
    submit: 'फीडबैक भेजें',
  },
  success: 'धन्यवाद। हम इसे देखेंगे।',
  empty: 'अभी कोई फीडबैक नहीं दिया गया।',
};