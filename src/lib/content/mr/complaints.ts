import type { en } from '../en/index';
type Shape = DeepStringify<typeof en.complaints>;
type DeepStringify<T> = { [K in keyof T]: T[K] extends Record<string, unknown> ? DeepStringify<T[K]> : string };

export const complaints: Shape = {
  title: 'अभिप्राय आणि तक्रारी',
  form: {
    title: 'काय झाले?',
    typeLabel: 'प्रकार',
    types: {
      delay: 'जास्त वेळ वाट पाहावी लागली',
      staff: 'कर्मचाऱ्यांचे वागणे',
      facility: 'स्वच्छता किंवा सुविधा',
      medicine: 'औषध उपलब्ध नाही',
      other: 'इतर',
    },
    descriptionLabel: 'आम्हाला अधिक सांगा',
    descriptionPlaceholder: 'काय झाले ते लिहा…',
    submit: 'अभिप्राय पाठवा',
  },
  success: 'धन्यवाद. आम्ही याची दखल घेऊ.',
  empty: 'अद्याप कोणताही अभिप्राय दिला नाही.',
};