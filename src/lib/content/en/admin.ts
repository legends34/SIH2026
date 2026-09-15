export const admin = {
  title: 'Admin panel',
  dashboard: {
    title: 'Dashboard',
    totalPatients: 'Patients today',
    waitTime: 'Avg wait time',
    openTokens: 'Open tokens',
  },
  users: {
    title: 'Users',
    add: 'Add user',
    role: 'Role',
    roles: {
      patient: 'Patient',
      doctor: 'Doctor',
      pharmacist: 'Pharmacist',
      admin: 'Admin',
    },
  },
  error: {
    unauthorized: 'You do not have permission to do this.',
  },
} as const;
