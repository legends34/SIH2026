import type { en } from '../en/index';
type TriageShape = DeepStringify<typeof en.triage>;
type DeepStringify<T> = { [K in keyof T]: T[K] extends Record<string, unknown> ? DeepStringify<T[K]> : string };

// Marathi first-pass — SAFETY-CRITICAL, native review required before release
// Register: "तुम्ही" (recommended — respectful but not distant, suits rural Maharashtra)
export const triage: TriageShape = {
  intro: {
    title: 'तुम्हाला काय त्रास होतोय?',
    subtitle: 'तुमचे लक्षणे सांगा. आम्ही तुम्हाला योग्य उपचारापर्यंत पोहोचण्यास मदत करू.',
    voiceButton: 'लक्षणे बोलून सांगा',
    voiceListening: 'ऐकतोय… आत्ता बोला',
    voicePermissionDenied: 'मायक्रोफोनची परवानगी नाही. खाली टाइप करा.',
    typeInstead: 'टाइप करा',
    placeholder: 'तुम्हाला काय वाटतंय ते लिहा…',
    submit: 'लक्षणे तपासा',
  },
  understood: {
    label: 'आम्हाला समजले:',
    change: 'बदला',
    addMore: 'आणखी सांगा',
  },
  result: {
    urgencyLabel: 'काय करावे',
    whereToGo: 'कुठे जावे',
    callBack: 'लवकर या किंवा 108 वर कॉल करा जर:',
    disclaimer:
      'ही माहिती तुम्हाला योग्य उपचाराकडे पोहोचण्यास मदत करते. हे निदान नाही. डॉक्टर तुमची तपासणी करतील.', // REVIEW: "निदान" is medical; considered "हे आजार सांगत नाही" but "निदान नाही" is clearest for context
    lowConfidence:
      'आम्हाला नक्की सांगता येत नाही. {facility} मधील सामान्य डॉक्टर तुम्हाला अधिक चांगली मदत करू शकतात.',
  },
  urgency: {
    EMERGENCY: {
      headline: 'आत्ताच मदत घ्या.',
      timeframe: 'ताबडतोब जा — प्रत्येक मिनिट महत्त्वाचा आहे.',
      whereToGo: 'जवळच्या इमर्जन्सी वॉर्डमध्ये जा किंवा 108 वर कॉल करा.',
      warnSigns: 'परिस्थिती बिघडल्यास ताबडतोब जा किंवा 108 वर कॉल करा.',
    },
    URGENT: {
      headline: '2 तासांत डॉक्टरांना दाखवा.',
      timeframe: '2 तासांपेक्षा जास्त वाट पाहू नका.',
      whereToGo: 'आज OPD किंवा जवळच्या दवाखान्यात जा.',
      warnSigns: 'डॉक्टरांकडे पोहोचण्यापूर्वी जास्त त्रास झाल्यास 108 वर कॉल करा.',
    },
    SOON: {
      headline: 'आज डॉक्टरांना दाखवा.',
      timeframe: 'आजच जाण्याचा प्रयत्न करा.',
      whereToGo: 'जवळच्या सरकारी OPD किंवा दवाखान्यात जा.',
      warnSigns: 'जास्त त्रास झाल्यास इमर्जन्सीला जा किंवा 108 वर कॉल करा.',
    },
    ROUTINE: {
      headline: 'अपॉइंटमेंट बुक करा.',
      timeframe: 'पुढच्या काही दिवसांत जाऊ शकता.',
      whereToGo: 'जवळच्या OPD मध्ये वेळ बुक करा.',
      warnSigns: 'त्रास वाढल्यास लवकर डॉक्टरांना भेटा.',
    },
    SELF_CARE: {
      headline: 'घरी आराम करा.',
      timeframe: '1–2 दिवस काळजीपूर्वक पाहा.',
      whereToGo: 'आत्ता जाण्याची गरज नाही.',
      warnSigns: '2 दिवसांत बरे न वाटल्यास किंवा त्रास वाढल्यास डॉक्टरांना दाखवा.',
    },
  },
  symptoms: {
    chest_pain: 'छातीत दुखणे किंवा जड वाटणे',
    difficulty_breathing: 'श्वास घेण्यास त्रास',
    severe_headache: 'खूप तीव्र डोकेदुखी',
    high_fever: 'तीव्र ताप',
    vomiting: 'उलटी',
    diarrhea: 'जुलाब',
    abdominal_pain: 'पोटदुखी',
    dizziness: 'चक्कर येणे',
    weakness: 'अशक्तपणा किंवा थकवा',
    rash: 'अंगावर पुरळ',
    eye_pain: 'डोळ्यात दुखणे किंवा लाली',
    toothache: 'दातदुखी',
    back_pain: 'पाठदुखी',
    joint_pain: 'सांधेदुखी किंवा सूज',
    cough: 'खोकला',
    cold: 'सर्दी किंवा नाक गळणे',
    skin_wound: 'अंगावर जखम किंवा कट',
    pregnancy_concern: 'गरोदरपणात काळजी',
    child_not_eating: 'मूल जेवत नाही',
    child_fever: 'मुलाला ताप',
  },
  departments: {
    GENERAL: 'सामान्य डॉक्टर (जनरल मेडिसिन)',
    EMERGENCY: 'इमर्जन्सी (कॅज्युअल्टी)',
    PAEDIATRICS: 'लहान मुलांचे डॉक्टर (पिडियाट्रिक्स)',
    GYNAECOLOGY: 'महिला डॉक्टर (गायनेकोलॉजी)',
    CARDIOLOGY: 'हृदयरोग डॉक्टर (कार्डिओलॉजी)',
    ORTHOPAEDICS: 'हाड व सांधे डॉक्टर (ऑर्थोपेडिक्स)',
    ENT: 'कान, नाक व घसा डॉक्टर (ENT)',
    OPHTHALMOLOGY: 'डोळ्यांचे डॉक्टर (ऑफ्थाल्मोलॉजी)',
    DERMATOLOGY: 'त्वचारोग डॉक्टर (डर्मेटोलॉजी)',
    DENTAL: 'दातांचे डॉक्टर (डेंटल)',
    PSYCHIATRY: 'मन व मानसिक आरोग्य डॉक्टर (सायकियाट्री)',
    PHARMACY: 'फार्मसी (औषध काउंटर)',
  },
};
