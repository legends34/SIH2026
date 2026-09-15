import type { en } from '../en/index';
type Shape = DeepStringify<typeof en.booking>;
type DeepStringify<T> = { [K in keyof T]: T[K] extends Record<string, unknown> ? DeepStringify<T[K]> : string };

export const booking: Shape = {
  title: 'अपॉइंटमेंट बुक करा',
  selectDepartment: 'विभाग निवडा',
  selectDoctor: 'डॉक्टर निवडा',
  selectDate: 'तारीख निवडा',
  selectSlot: 'वेळ निवडा',
  noSlots: 'या तारखेला कोणतीही वेळ उपलब्ध नाही. दुसऱ्या दिवशी प्रयत्न करा.',
  confirm: {
    title: 'अपॉइंटमेंट निश्चित करा',
    facility: 'हॉस्पिटल / दवाखाना',
    doctor: 'डॉक्टर',
    date: 'तारीख',
    time: 'वेळ',
    department: 'विभाग',
    button: 'बुकिंग निश्चित करा',
  },
  success: {
    title: 'अपॉइंटमेंट बुक झाली!',
    message: 'तुमची अपॉइंटमेंट {date} रोजी {time} वाजता {doctor} यांच्यासोबत आहे.',
    addToCalendar: 'कॅलेंडरमध्ये जोडा',
    viewToken: 'माझा टोकन पाहा',
  },
  error: {
    slotTaken: 'ती वेळ नुकतीच घेतली गेली. दुसरी वेळ निवडा.',
    failed: 'बुकिंग अयशस्वी. पुन्हा प्रयत्न करा.',
  },
  cancel: {
    button: 'अपॉइंटमेंट रद्द करा',
    confirm: 'तुम्हाला ही अपॉइंटमेंट नक्की रद्द करायची आहे का?',
    success: 'अपॉइंटमेंट रद्द झाली.',
  },
};