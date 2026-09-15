import type { en } from '../en/index';
type Shape = DeepStringify<typeof en.auth>;
type DeepStringify<T> = { [K in keyof T]: T[K] extends Record<string, unknown> ? DeepStringify<T[K]> : string };

export const auth: Shape = {
  login: {
    title: 'लॉग इन करा',
    phoneLabel: 'मोबाइल नंबर',
    phonePlaceholder: 'तुमचा 10 अंकी नंबर टाका',
    sendOtp: 'OTP पाठवा',
    otpSent: '{phone} वर OTP पाठवला.',
    otpLabel: 'OTP टाका',
    otpHelp: 'आम्ही पाठवलेला 6 अंकी कोड टाका.',
    verifyOtp: 'तपासा',
    resendOtp: 'पुन्हा पाठवा',
    resendIn: '{seconds} सेकंदांत पुन्हा पाठवा',
    error: {
      invalidPhone: 'योग्य 10 अंकी नंबर टाका.',
      invalidOtp: 'कोड जुळला नाही. पुन्हा प्रयत्न करा.',
      tooManyAttempts: 'खूप वेळा चुकला. 10 मिनिटांनी पुन्हा प्रयत्न करा.',
    },
  },
  register: {
    title: 'अकाउंट तयार करा',
    nameLabel: 'पूर्ण नाव',
    namePlaceholder: 'आधारकार्डावरील नाव',
    ageLabel: 'वय',
    genderLabel: 'लिंग',
    genderOptions: {
      male: 'पुरुष',
      female: 'स्त्री',
      other: 'इतर',
    },
    submit: 'अकाउंट तयार करा',
  },
};
