import type { en } from '../en/index';
type Shape = DeepStringify<typeof en.auth>;
type DeepStringify<T> = { [K in keyof T]: T[K] extends Record<string, unknown> ? DeepStringify<T[K]> : string };

export const auth: Shape = {
  language: {
    title: 'तुमची भाषा निवडा',
    subtitle: 'शासकीय आरोग्य सेवांसाठी तुमची पसंतीची भाषा निवडा',
  },
  login: {
    title: 'लॉग इन करा',
    subtitle: 'कुटुंबाच्या आरोग्य सेवांसाठी तुमचा मोबाईल नंबर प्रविष्ट करा',
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
  otp: {
    title: 'ओटीपी पडताळणी करा',
    subtitle: 'तुमच्या मोबाईलवर पाठवलेला ६ अंकी कोड प्रविष्ट करा',
    otpLabel: '६ अंकी ओटीपी',
    verify: 'पडताळणी करा आणि पुढे जा',
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
