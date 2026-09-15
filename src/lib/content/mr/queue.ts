import type { en } from '../en/index';
type Shape = DeepStringify<typeof en.queue>;
type DeepStringify<T> = { [K in keyof T]: T[K] extends Record<string, unknown> ? DeepStringify<T[K]> : string };

export const queue: Shape = {
  title: 'माझा टोकन',
  tokenNumber: 'टोकन {number}',
  currentToken: 'आता नंबर आहे: {number}',
  estimatedWait: 'साधारण {minutes} मिनिटे प्रतीक्षा',
  yourTurn: 'तुमची वेळ आली आहे. कृपया {room} मध्ये जा.',
  missed: 'तुमचा टोकन पुढे गेला. पुन्हा रांगेत येण्यासाठी काउंटरवर विचारा.',
  done: 'तुमची भेट पूर्ण झाली.',
  cancel: {
    button: 'टोकन रद्द करा',
    confirm: 'तुमचा टोकन रद्द करून रांगेतून बाहेर पडायचे का?',
    success: 'टोकन रद्द झाला.',
  },
  empty: 'तुमच्याकडे कोणताही सक्रिय टोकन नाही.',
};