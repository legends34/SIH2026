export const pharmacist = {
  title: 'Pharmacy',
  queue: {
    title: 'Pending prescriptions',
    empty: 'No pending prescriptions.',
  },
  dispense: {
    button: 'Mark as dispensed',
    confirm: 'Mark this prescription as dispensed?',
    success: 'Marked as dispensed.',
  },
  search: {
    label: 'Search prescriptions',
    placeholder: 'Patient name or token number',
  },
} as const;
