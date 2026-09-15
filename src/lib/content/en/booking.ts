export const booking = {
  title: 'Book appointment',
  selectDepartment: 'Choose department',
  selectDoctor: 'Choose doctor',
  selectDate: 'Choose date',
  selectSlot: 'Choose time',
  noSlots: 'No slots available on this date. Try another day.',
  confirm: {
    title: 'Confirm appointment',
    facility: 'Hospital / Clinic',
    doctor: 'Doctor',
    date: 'Date',
    time: 'Time',
    department: 'Department',
    button: 'Confirm booking',
  },
  success: {
    title: 'Appointment booked!',
    message: 'Your appointment is on {date} at {time} with {doctor}.',
    addToCalendar: 'Add to calendar',
    viewToken: 'View my token',
  },
  error: {
    slotTaken: 'That slot was just taken. Pick another time.',
    failed: 'Booking failed. Try again.',
  },
  cancel: {
    button: 'Cancel appointment',
    confirm: 'Are you sure you want to cancel this appointment?',
    success: 'Appointment cancelled.',
  },
} as const;
