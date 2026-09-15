# Copy Rules — Beed Health App

> Every string in this app follows these rules. This doc goes into every agent prompt. Edit it hard; every word here shapes the output.

---

## 1. Who We Write For

- **Primary reader:** A patient or family member in rural Beed district, Maharashtra.
- **Literacy level:** Aim for a **Class 5 reader** in their native language.
- **Device context:** Shared mobile phone, small screen, often low light, often noisy environment.
- **Read aloud:** Text is frequently read aloud by one family member to another. Write for the ear, not the eye.
- **Personas (from handbook §1.2):**
  - Shantabai, 58, farmer, speaks Marathi, limited literacy — she needs the simplest possible language.
  - Raju, 32, daily-wage worker, uses Hindi — direct and practical.
  - Priya, 24, ANM nurse — uses the app efficiently; appreciates clear labels.

---

## 2. Voice and Tone

- **Sentences:** ≤ 15 words. One idea per sentence.
- **Person:** Second person ("you", "तुम्ही", "आप"). Never third person for the user.
- **Voice:** Active, not passive. "Tap Confirm" not "Confirmation should be tapped."
- **Buttons:** Always start with a **verb** in the imperative. "Book appointment", "Send OTP", "Try again".
- **Warmth without softening:** Be kind, not vague. Never write reassurance that reduces urgency.

---

## 3. Register

| Language | Register | Reasoning |
|---|---|---|
| Marathi | **तुम्ही** | Respectful but not distant. Used by healthcare workers in Beed. Natural for both young and old. |
| Hindi | **आप** | Standard respectful Hindi. Avoids both formal "भवान" and casual "तुम". |
| English | **You** | Neutral, consistent with Indian govt health apps. |

> **(proposed)** Use "आपण" only for formal institutional text (e.g., consent notices). Everywhere else, "तुम्ही."

---

## 4. Words People Actually Use

Keep the loanwords that rural users already say. **Do not Sanskritise.**

| English | Hindi | Marathi | Note |
|---|---|---|---|
| Doctor | डॉक्टर | डॉक्टर | Use this; not "चिकित्सक" |
| Token | टोकन | टोकन | Use this; not "पर्ची" |
| OPD | OPD | OPD | Keep as abbreviation; it's known |
| Report | रिपोर्ट | रिपोर्ट | Use this; not "प्रतिवेदन" |
| Appointment | अपॉइंटमेंट | अपॉइंटमेंट | Use this; not "नियुक्ति" |
| Ambulance | एम्बुलेंस | रुग्णवाहिका | Both are known; mr: use "रुग्णवाहिका" for formality |
| Emergency | इमरजेंसी | इमर्जन्सी | Keep; it's understood |
| Hospital | अस्पताल / हॉस्पिटल | हॉस्पिटल / दवाखाना | "दवाखाना" for smaller clinics |
| Medicine | दवाई | औषध | Marathi uses "औषध" naturally |
| Pharmacy | फ़ार्मेसी | फार्मसी | Keep; also "औषध काउंटर" |
| Mobile number | मोबाइल नंबर | मोबाइल नंबर | Not "दूरध्वनी क्रमांक" |
| Password / OTP | OTP | OTP | Keep as-is |
| Fever | बुखार | ताप | Natural words |
| Pain | दर्द | दुखणे | Natural words |
| Loose motions | दस्त | जुलाब | Both common |
| Vomiting | उल्टी | उलटी | Natural; not "वमन" |
| Rash | दाने | पुरळ | Natural words |
| Dizziness | चक्कर | चक्कर | Same in both |
| Weakness | कमज़ोरी | अशक्तपणा | Natural words |
| Cough | खाँसी | खोकला | Natural words |
| Cold | सर्दी | सर्दी / नाक गळणे | "नाक गळणे" is more Beed-natural |
| Pregnancy | गर्भावस्था | गरोदरपण | Use "गरोदर" not "गर्भवती" in mr |
| Child | बच्चा | मूल / लेकरू | "लेकरू" is Beed-natural for infant |
| General doctor | सामान्य डॉक्टर | सामान्य डॉक्टर | |
| Paediatrics | बच्चों के डॉक्टर | लहान मुलांचे डॉक्टर | Add formal name after in brackets |
| Gynaecology | महिला डॉक्टर | महिला डॉक्टर | |
| Cardiology | दिल के डॉक्टर | हृदयरोग डॉक्टर | |
| Orthopaedics | हड्डी और जोड़ों के डॉक्टर | हाड व सांधे डॉक्टर | |
| ENT | कान, नाक और गले के डॉक्टर | कान, नाक व घसा डॉक्टर | |
| Ophthalmology | आँखों के डॉक्टर | डोळ्यांचे डॉक्टर | |
| Dermatology | त्वचा के डॉक्टर | त्वचारोग डॉक्टर | |
| Dental | दाँतों के डॉक्टर | दातांचे डॉक्टर | |
| Psychiatry | मन और मानसिक स्वास्थ्य डॉक्टर | मन व मानसिक आरोग्य डॉक्टर | |
| Booking | बुकिंग | बुकिंग | |
| Slot | स्लॉट | वेळ / स्लॉट | "वेळ" preferred in mr |
| Queue / waiting | कतार / इंतज़ार | रांग | Natural word |
| Records | रिकॉर्ड | नोंदी | "नोंदी" is natural Marathi |
| Consent | सहमति | परवानगी | "परवानगी" more natural in mr |
| Loading | लोड हो रहा है | लोड होतंय | Conversational |
| Cancel | रद्द करें | रद्द करा | |
| Confirm | पक्का करें | निश्चित करा | |
| Save | सेव करें | जतन करा | |

---

## 5. Safety Language ⚠️

### 5a. Fixed Urgency Band Wording

These strings are **non-negotiable**. No agent or translator may soften them.

| Band | English | Hindi | Marathi |
|---|---|---|---|
| EMERGENCY | Get help right now. | अभी मदद लें। | आत्ताच मदत घ्या। |
| URGENT | See a doctor within 2 hours. | 2 घंटे के अंदर डॉक्टर को दिखाएँ। | 2 तासांत डॉक्टरांना दाखवा। |
| SOON | See a doctor today. | आज डॉक्टर को दिखाएँ। | आज डॉक्टरांना दाखवा। |
| ROUTINE | Book an appointment. | अपॉइंटमेंट लें। | अपॉइंटमेंट बुक करा। |
| SELF_CARE | Rest and take care at home. | घर पर आराम करें। | घरी आराम करा। |

### 5b. Emergency Overlay

```
EN: Call for help right now.
    [Call 108 — Ambulance]   [Call 112 — Emergency]
    Nearest emergency: {facilityName} ({distance} km)
    If someone is with you, ask them to help. Do not drive yourself in an emergency.

HI: अभी मदद के लिए कॉल करें।
    [108 पर कॉल करें — एम्बुलेंस]   [112 पर कॉल करें — इमरजेंसी]
    नज़दीकी इमरजेंसी: {facilityName} ({distance} किमी)
    अगर कोई साथ है, तो उनसे मदद लें। इमरजेंसी में खुद गाड़ी न चलाएँ।

MR: आत्ताच मदतीसाठी कॉल करा।
    [108 वर कॉल करा — रुग्णवाहिका]   [112 वर कॉल करा — इमर्जन्सी]
    जवळचे इमर्जन्सी: {facilityName} ({distance} किमी)
    जर कोणी सोबत असेल तर त्यांची मदत घ्या। इमर्जन्सीमध्ये स्वतः गाडी चालवू नका।
```

### 5c. Triage Disclaimer

```
EN: This guidance helps you reach the right care. It is not a diagnosis. A doctor will examine you.
HI: यह जानकारी आपको सही इलाज तक पहुँचने में मदद करती है। यह जाँच नहीं है। डॉक्टर आपकी जाँच करेंगे।
MR: ही माहिती तुम्हाला योग्य उपचाराकडे पोहोचण्यास मदत करते। हे निदान नाही। डॉक्टर तुमची तपासणी करतील।
```

### 5d. Banned Terms

The following **must never appear** in any system-generated string (outside `records` namespace, which is doctor-authored):

**English banned:** "you have", "diagnosis", "disease", "condition", "you are suffering", "nothing serious", "don't worry", "all clear", "it's just"

**Hindi banned:** "निदान" (diagnosis), "रोग" (disease as label), "कोई बात नहीं", "काळजी करू नका" (in hi context), any condition name (e.g., "typhoid", "malaria", "diabetes" etc.)

**Marathi banned:** "निदान", "रोग", "काळजी करू नका", "काहीच नाही", "सामान्य आहे" (as reassurance), any condition name

> **Rule:** The app guides. The doctor diagnoses.

---

## 6. Numbers, Dates and Times

| Element | English | Hindi | Marathi |
|---|---|---|---|
| Date format | 14 Sept | 14 सितंबर | 14 सप्टेंबर |
| Time | 12-hour with AM/PM | सुबह / दोपहर / शाम / रात + time | सकाळी / दुपारी / संध्याकाळी / रात्री + time |
| Digits | Western (1, 2, 3) | Western (1, 2, 3) | Western (1, 2, 3) — not Devanagari numerals |
| Distance | 3.5 km | 3.5 किमी | 3.5 किमी |
| Wait time | About 20 minutes | लगभग 20 मिनट | साधारण 20 मिनिटे |

---

## 7. Errors and Empty States

**Formula:** What happened → what to do next. Never blame. Never show error codes.

| ❌ Bad | ✅ Good |
|---|---|
| "Error 504: Gateway timeout" | "Could not load. Try again." |
| "You entered wrong data" | "That didn't work. Check your number and try again." |
| "Server error" | "Something went wrong. Try again in a moment." |
| "No records found" | "No health records yet." |

---

## 8. Icons

Every icon-only control **must** have:
- A visible text label (preferred), OR
- An `aria-label` in the current locale, AND
- A tooltip on hover/focus

No icon ships without a text string in the content layer.

---

## 9. Button and Label Length Guard

- Target: ≤ **1.3×** the English string length for Hindi/Marathi button labels.
- If unavoidable, add `// LONG: <shorter alternative>` comment in the locale file.
- More than 10 overlong labels in a locale = Lane A must review for overflow.

---

## 10. The Grandparent Test

Before any safety string is finalised, read it aloud to someone over 60 with limited literacy and ask: *"What would you do next?"* If the answer isn't the intended action, rewrite it.
