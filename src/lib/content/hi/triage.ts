import type { Messages } from '../types';
import type { en } from '../en/index';

// Hindi first-pass translation — triage (SAFETY-CRITICAL, human-reviewed required)
type TriageShape = DeepStringify<typeof en.triage>;
type DeepStringify<T> = { [K in keyof T]: T[K] extends Record<string, unknown> ? DeepStringify<T[K]> : string };

export const triage: TriageShape = {
  intro: {
    title: 'आप कैसा महसूस कर रहे हैं?',
    subtitle: 'अपने लक्षण बताइए। हम आपको सही इलाज तक पहुँचने में मदद करेंगे।',
    voiceButton: 'अपने लक्षण बोलें',
    voiceListening: 'सुन रहे हैं… अभी बोलें',
    voicePermissionDenied: 'माइक्रोफ़ोन की अनुमति नहीं मिली। नीचे टाइप करें।',
    typeInstead: 'टाइप करें',
    placeholder: 'आप क्या महसूस कर रहे हैं, लिखें…',
    submit: 'लक्षण जाँचें',
  },
  understood: {
    label: 'हमने समझा:',
    change: 'बदलें',
    addMore: 'और जोड़ें',
  },
  result: {
    urgencyLabel: 'क्या करें',
    whereToGo: 'कहाँ जाएँ',
    callBack: 'जल्दी आएँ या 108 पर कॉल करें अगर:',
    disclaimer:
      'यह जानकारी आपको सही इलाज तक पहुँचने में मदद करती है। यह जाँच नहीं है। डॉक्टर आपकी जाँच करेंगे।', // REVIEW: "जाँच" used for both check and diagnosis — consider "निदान नहीं है"? No — निदान is banned.
    lowConfidence:
      'हम पूरी तरह निश्चित नहीं हैं। {facility} के सामान्य डॉक्टर आपकी बेहतर मदद कर सकते हैं।',
  },
  urgency: {
    EMERGENCY: {
      headline: 'अभी मदद लें।',
      timeframe: 'तुरंत जाएँ — हर मिनट ज़रूरी है।',
      whereToGo: 'नजदीकी इमरजेंसी वार्ड में जाएँ या 108 पर कॉल करें।',
      warnSigns: 'अगर हालत बिगड़े तो तुरंत जाएँ या 108 पर कॉल करें।',
    },
    URGENT: {
      headline: '2 घंटे के अंदर डॉक्टर को दिखाएँ।',
      timeframe: '2 घंटे से ज़्यादा इंतजार न करें।',
      whereToGo: 'आज OPD या किसी क्लिनिक में जाएँ।',
      warnSigns: 'डॉक्टर के पास पहुँचने से पहले हालत बिगड़े तो 108 पर कॉल करें।',
    },
    SOON: {
      headline: 'आज डॉक्टर को दिखाएँ।',
      timeframe: 'आज के दिन जाने की कोशिश करें।',
      whereToGo: 'नज़दीकी सरकारी OPD या क्लिनिक जाएँ।',
      warnSigns: 'अगर ज़्यादा तकलीफ हो तो इमरजेंसी जाएँ या 108 पर कॉल करें।',
    },
    ROUTINE: {
      headline: 'अपॉइंटमेंट लें।',
      timeframe: 'अगले कुछ दिनों में जा सकते हैं।',
      whereToGo: 'नज़दीकी OPD में स्लॉट बुक करें।',
      warnSigns: 'अगर तकलीफ बढ़े तो जल्दी डॉक्टर से मिलें।',
    },
    SELF_CARE: {
      headline: 'घर पर आराम करें।',
      timeframe: '1–2 दिन ध्यान से देखें।',
      whereToGo: 'अभी जाने की ज़रूरत नहीं है।',
      warnSigns: '2 दिन में ठीक न हो या हालत बिगड़े तो डॉक्टर को दिखाएँ।',
    },
  },
  symptoms: {
    chest_pain: 'सीने में दर्द या जकड़न',
    difficulty_breathing: 'साँस लेने में तकलीफ',
    severe_headache: 'बहुत तेज़ सिरदर्द',
    high_fever: 'तेज़ बुखार',
    vomiting: 'उल्टी',
    diarrhea: 'दस्त',
    abdominal_pain: 'पेट दर्द',
    dizziness: 'चक्कर आना',
    weakness: 'कमज़ोरी या थकान',
    rash: 'त्वचा पर दाने',
    eye_pain: 'आँखों में दर्द या लाली',
    toothache: 'दाँत दर्द',
    back_pain: 'पीठ दर्द',
    joint_pain: 'जोड़ों में दर्द या सूजन',
    cough: 'खाँसी',
    cold: 'सर्दी या नाक बहना',
    skin_wound: 'त्वचा पर घाव या कट',
    pregnancy_concern: 'गर्भावस्था में चिंता',
    child_not_eating: 'बच्चे का खाना न खाना',
    child_fever: 'बच्चे को बुखार',
  },
  departments: {
    GENERAL: 'सामान्य डॉक्टर (जनरल मेडिसिन)',
    EMERGENCY: 'इमरजेंसी (कैज़ुअल्टी)',
    PAEDIATRICS: 'बच्चों के डॉक्टर (पीडियाट्रिक्स)',
    GYNAECOLOGY: 'महिला डॉक्टर (गायनेकोलॉजी)',
    CARDIOLOGY: 'दिल के डॉक्टर (कार्डियोलॉजी)',
    ORTHOPAEDICS: 'हड्डी और जोड़ों के डॉक्टर (ऑर्थोपेडिक्स)',
    ENT: 'कान, नाक और गले के डॉक्टर (ENT)',
    OPHTHALMOLOGY: 'आँखों के डॉक्टर (ऑप्थैल्मोलॉजी)',
    DERMATOLOGY: 'त्वचा के डॉक्टर (डर्मेटोलॉजी)',
    DENTAL: 'दाँतों के डॉक्टर (डेंटल)',
    PSYCHIATRY: 'मन और मानसिक स्वास्थ्य डॉक्टर (साइकियाट्री)',
    PHARMACY: 'फ़ार्मेसी (दवाई काउंटर)',
  },
};
