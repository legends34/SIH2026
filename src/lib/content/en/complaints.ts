export const complaints = {
  title: 'Feedback and complaints',
  form: {
    title: 'What happened?',
    typeLabel: 'Type',
    types: {
      delay: 'Long wait time',
      staff: 'Staff behaviour',
      facility: 'Cleanliness or facilities',
      medicine: 'Medicine not available',
      other: 'Other',
    },
    descriptionLabel: 'Tell us more',
    descriptionPlaceholder: 'Write what happened…',
    submit: 'Send feedback',
  },
  success: 'Thank you. We will look into this.',
  empty: 'No feedback submitted yet.',
} as const;
