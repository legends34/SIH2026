export const medicines = {
  title: 'Medicines',
  search: {
    label: 'Search medicines',
    placeholder: 'Enter medicine name',
    noResults: 'Medicine not found.',
  },
  dosage: 'Dosage',
  frequency: 'When to take',
  duration: 'For how many days',
  instructions: 'Instructions',
  refill: {
    button: 'Request refill',
    success: 'Refill requested. Collect from {pharmacy}.',
    error: 'Could not request refill. Try again.',
  },
  empty: 'No medicines prescribed.',
} as const;
