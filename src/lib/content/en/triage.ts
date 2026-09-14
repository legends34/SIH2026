// SAFETY-CRITICAL: every string here must be reviewed by a human before release.
// No condition names, no diagnoses. Guidance only.

export const triage = {
  intro: {
    title: 'What are you feeling?',
    subtitle: 'Tell us your symptoms. We will help you find the right care.',
    voiceButton: 'Speak your symptoms',
    voiceListening: 'Listening… speak now',
    voicePermissionDenied: 'Microphone not allowed. Please type your symptoms below.',
    typeInstead: 'Type instead',
    placeholder: 'Describe what you are feeling…',
    submit: 'Check symptoms',
  },
  understood: {
    // "We understood" line — shows matched symptoms back to user
    label: 'We understood:',
    change: 'Change',
    addMore: 'Add more',
  },
  result: {
    urgencyLabel: 'What to do',
    whereToGo: 'Where to go',
    callBack: 'Come sooner or call 108 if:',
    disclaimer:
      'This guidance helps you reach the right care. It is not a diagnosis. A doctor will examine you.',
    lowConfidence:
      'We are not sure. A general doctor at {facility} can help you better.',
  },
  urgency: {
    EMERGENCY: {
      headline: 'Get help right now.',
      timeframe: 'Go immediately — every minute counts.',
      whereToGo: 'Go to the nearest emergency ward or call 108.',
      warnSigns: 'Go sooner or call 108 if the situation gets worse.',
    },
    URGENT: {
      headline: 'See a doctor within 2 hours.',
      timeframe: 'Do not wait more than 2 hours.',
      whereToGo: 'Go to OPD or an urgent-care clinic today.',
      warnSigns: 'Call 108 if you feel much worse before you reach the doctor.',
    },
    SOON: {
      headline: 'See a doctor today.',
      timeframe: 'Try to go before the end of the day.',
      whereToGo: 'Visit your nearest government OPD or clinic.',
      warnSigns: 'If you feel much worse, go to emergency or call 108.',
    },
    ROUTINE: {
      headline: 'Book an appointment.',
      timeframe: 'In the next few days is fine.',
      whereToGo: 'Book a slot at your nearest OPD.',
      warnSigns: 'If symptoms get worse, see a doctor sooner.',
    },
    SELF_CARE: {
      headline: 'Rest and take care at home.',
      timeframe: 'Watch carefully for 1–2 days.',
      whereToGo: 'No visit needed right now.',
      warnSigns: 'See a doctor if you do not feel better in 2 days or feel worse.',
    },
  },
  symptoms: {
    chest_pain: 'Chest pain or tightness',
    difficulty_breathing: 'Trouble breathing',
    severe_headache: 'Very bad headache',
    high_fever: 'High fever',
    vomiting: 'Vomiting',
    diarrhea: 'Loose motions',
    abdominal_pain: 'Stomach pain',
    dizziness: 'Dizziness or feeling faint',
    weakness: 'Weakness or tiredness',
    rash: 'Skin rash',
    eye_pain: 'Eye pain or redness',
    toothache: 'Toothache',
    back_pain: 'Back pain',
    joint_pain: 'Joint pain or swelling',
    cough: 'Cough',
    cold: 'Cold or runny nose',
    skin_wound: 'Wound or cut on skin',
    pregnancy_concern: 'Concern during pregnancy',
    child_not_eating: 'Child not eating',
    child_fever: 'Child has fever',
  },
  departments: {
    GENERAL: 'General doctor (General Medicine)',
    EMERGENCY: 'Emergency (Casualty)',
    PAEDIATRICS: "Children's doctor (Paediatrics)",
    GYNAECOLOGY: "Women's doctor (Gynaecology)",
    CARDIOLOGY: 'Heart doctor (Cardiology)',
    ORTHOPAEDICS: 'Bone and joint doctor (Orthopaedics)',
    ENT: 'Ear, nose and throat doctor (ENT)',
    OPHTHALMOLOGY: 'Eye doctor (Ophthalmology)',
    DERMATOLOGY: 'Skin doctor (Dermatology)',
    DENTAL: 'Teeth doctor (Dental)',
    PSYCHIATRY: 'Mind and mental health doctor (Psychiatry)',
    PHARMACY: 'Pharmacy (Medicine counter)',
  },
} as const;
