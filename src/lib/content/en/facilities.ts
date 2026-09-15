export const facilities = {
  title: 'Hospitals and clinics',
  search: {
    placeholder: 'Search by name or location',
    label: 'Search facilities',
    noResults: 'No facilities found near you. Try a wider area.',
    loading: 'Finding facilities near you…',
  },
  filter: {
    label: 'Filter',
    open24h: 'Open 24 hours',
    hasEmergency: 'Has emergency ward',
    hasBed: 'Beds available',
  },
  card: {
    distanceAway: '{distance} km away',
    open: 'Open now',
    closed: 'Closed',
    emergency24h: 'Emergency: 24h',
    getDirections: 'Get directions',
    viewDetails: 'View details',
  },
  detail: {
    departments: 'Departments',
    timings: 'Timings',
    phone: 'Phone',
    address: 'Address',
  },
  empty: 'No hospitals or clinics found nearby.',
} as const;
