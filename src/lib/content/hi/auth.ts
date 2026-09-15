import type { en } from '../en/index';
type AuthShape = DeepStringify<typeof en.auth>;
type DeepStringify<T> = { [K in keyof T]: T[K] extends Record<string, unknown> ? DeepStringify<T[K]> : string };

export const auth: AuthShape = {
  language: {
    title: 'अपनी भाषा चुनें',
    subtitle: 'सरकारी स्वास्थ्य सेवाओं के लिए अपनी पसंदीदा भाषा चुनें',
  },
  login: {
    title: 'लॉग इन करें',
    subtitle: 'परिवार की स्वास्थ्य सेवाओं के लिए अपना मोबाइल नंबर डालें',
    phoneLabel: 'मोबाइल नंबर',
    phonePlaceholder: 'अपना 10 अंकों का नंबर डालें',
    sendOtp: 'OTP भेजें',
    otpSent: '{phone} पर OTP भेजा गया।',
    otpLabel: 'OTP डालें',
    otpHelp: '6 अंकों का कोड डालें जो हमने भेजा।',
    verifyOtp: 'जाँचें',
    resendOtp: 'फिर भेजें',
    resendIn: '{seconds} सेकंड में फिर भेजें',
    error: {
      invalidPhone: 'सही 10 अंकों का नंबर डालें।',
      invalidOtp: 'कोड सही नहीं था। फिर कोशिश करें।',
      tooManyAttempts: 'बहुत बार कोशिश हुई। 10 मिनट बाद फिर कोशिश करें।',
    },
  },
  otp: {
    title: 'ओटीपी सत्यापित करें',
    subtitle: 'अपने मोबाइल नंबर पर भेजा गया 6 अंकों का कोड दर्ज करें',
    otpLabel: '6 अंकों का ओटीपी',
    verify: 'सत्यापित करें और आगे बढ़ें',
  },
  register: {
    title: 'अकाउंट बनाएँ',
    nameLabel: 'पूरा नाम',
    namePlaceholder: 'आधार के अनुसार नाम',
    ageLabel: 'उम्र',
    genderLabel: 'लिंग',
    genderOptions: {
      male: 'पुरुष',
      female: 'महिला',
      other: 'अन्य',
    },
    submit: 'अकाउंट बनाएँ',
  },
};
