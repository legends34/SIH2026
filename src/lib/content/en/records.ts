export const records = {
  title: 'My health records',
  visit: {
    title: 'Visit on {date}',
    facility: 'Facility',
    doctor: 'Doctor',
    notes: 'Notes',
    prescriptions: 'Prescriptions',
    reports: 'Reports',
  },
  empty: 'No health records yet.',
  download: 'Download records',
  share: {
    button: 'Share with doctor',
    success: 'Records shared.',
    error: 'Could not share. Try again.',
  },
  consent: {
    title: 'Allow the doctor to see your records?',
    allow: 'Allow',
    deny: 'Deny',
    note: 'You can remove access at any time from your profile.',
  },
} as const;
