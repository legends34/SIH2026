export const auth = {
  language: {
    title: 'Choose Your Language',
    subtitle: 'Select your preferred language for government healthcare services',
  },
  login: {
    title: 'Log in',
    subtitle: 'Enter your mobile number to access family healthcare services',
    phoneLabel: 'Mobile number',
    phonePlaceholder: 'Enter your 10-digit number',
    sendOtp: 'Send OTP',
    otpSent: 'OTP sent to {phone}.',
    otpLabel: 'Enter OTP',
    otpHelp: 'Enter the 6-digit code we sent you.',
    verifyOtp: 'Verify',
    resendOtp: 'Send again',
    resendIn: 'Send again in {seconds}s',
    error: {
      invalidPhone: 'Enter a valid 10-digit number.',
      invalidOtp: 'That code did not match. Try again.',
      tooManyAttempts: 'Too many tries. Wait 10 minutes and try again.',
    },
  },
  otp: {
    title: 'Verify OTP',
    subtitle: 'Enter the 6-digit code sent to your mobile phone',
    otpLabel: 'Enter 6-Digit OTP',
    verify: 'Verify & Continue',
  },
  register: {
    title: 'Create account',
    nameLabel: 'Full name',
    namePlaceholder: 'Your name as on Aadhaar',
    ageLabel: 'Age',
    genderLabel: 'Gender',
    genderOptions: {
      male: 'Male',
      female: 'Female',
      other: 'Other',
    },
    submit: 'Create account',
  },
} as const;
