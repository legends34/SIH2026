export const common = {
  appName: 'Aarogya Setu Health',
  tagline: 'Your health, your care, nearby.',
  loading: 'Loading…',
  error: {
    generic: 'Something went wrong. Please try again.',
    noInternet: 'No internet connection. Check your signal and try again.',
    sessionExpired: 'Your session ended. Please log in again.',
  },
  button: {
    retry: 'Try again',
    goHome: 'Go to home',
    cancel: 'Cancel',
    confirm: 'Confirm',
    next: 'Next',
    back: 'Back',
    save: 'Save',
    close: 'Close',
  },
  empty: {
    noData: 'Nothing here yet.',
    noResults: 'No results found. Try a different search.',
  },
  language: {
    selectLabel: 'Choose language',
    changed: 'Language changed to {name}.',
  },
  actions: {
    back: 'Back',
    close: 'Close',
  },
  roles: {
    citizen: 'Citizen',
    doctor: 'Doctor',
    pharmacist: 'Pharmacist',
    admin: 'District Admin',
  },
} as const;
