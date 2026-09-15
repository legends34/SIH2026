import type { en } from '../en/index';
type Shape = DeepStringify<typeof en.queue>;
type DeepStringify<T> = { [K in keyof T]: T[K] extends Record<string, unknown> ? DeepStringify<T[K]> : string };

export const queue: Shape = {
  title: 'मेरा टोकन',
  nowServing: 'वर्तमान टोकन',
  yourToken: 'आपका टोकन',
  etaLabel: 'अनुमानित प्रतीक्षा समय',
  liveTracking: 'लाइव कतार स्थिति',
  tokenNumber: 'टोकन {number}',
  currentToken: 'अभी जा रहे हैं: {number}',
  estimatedWait: 'लगभग {minutes} मिनट इंतज़ार',
  yourTurn: 'आपकी बारी है। कृपया {room} में जाएँ।',
  missed: 'आपका टोकन छूट गया। फिर से जुड़ने के लिए डेस्क पर पूछें।',
  done: 'आपकी विज़िट हो गई।',
  cancel: {
    button: 'टोकन रद्द करें',
    confirm: 'अपना टोकन रद्द करें और कतार से हटें?',
    success: 'टोकन रद्द हो गया।',
  },
  empty: 'आपके पास अभी कोई टोकन नहीं है।',
};