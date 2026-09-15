import type { en } from '../en/index';
type Shape = DeepStringify<typeof en.booking>;
type DeepStringify<T> = { [K in keyof T]: T[K] extends Record<string, unknown> ? DeepStringify<T[K]> : string };

export const booking: Shape = {
  title: 'अपॉइंटमेंट लें',
  selectDepartment: 'विभाग चुनें',
  selectDoctor: 'डॉक्टर चुनें',
  selectDate: 'तारीख चुनें',
  selectSlot: 'समय चुनें',
  noSlots: 'इस तारीख पर कोई स्लॉट नहीं है। दूसरे दिन की कोशिश करें।',
  confirm: {
    title: 'अपॉइंटमेंट पक्का करें',
    facility: 'अस्पताल / क्लिनिक',
    doctor: 'डॉक्टर',
    date: 'तारीख',
    time: 'समय',
    department: 'विभाग',
    button: 'बुकिंग पक्का करें',
  },
  success: {
    title: 'अपॉइंटमेंट हो गई!',
    message: 'आपका अपॉइंटमेंट {date} को {time} बजे {doctor} के साथ है।',
    addToCalendar: 'कैलेंडर में जोड़ें',
    viewToken: 'अपना टोकन देखें',
  },
  error: {
    slotTaken: 'वह स्लॉट अभी लिया गया। दूसरा समय चुनें।',
    failed: 'बुकिंग नहीं हो पाई। फिर कोशिश करें।',
  },
  cancel: {
    button: 'अपॉइंटमेंट रद्द करें',
    confirm: 'क्या आप सच में यह अपॉइंटमेंट रद्द करना चाहते हैं?',
    success: 'अपॉइंटमेंट रद्द हो गया।',
  },
};