# Lane C Triage Engine — Frontend Integration Guide (Lane A)

> **For:** Lane A Frontend Developers  
> **Package:** `@/lib/triage`  
> **Status:** Production-Ready · Pure TypeScript · Zero Network Calls · Zero Disease Names  

---

## 1. What to Import

All required functions and types can be imported directly from `@/lib/triage`:

```typescript
import {
  triage,
  rankFacilities,
  type TriageInput,
  type TriageResult,
  type Facility,
  type FacilityLoadMap,
  type SymptomId,
  type UrgencyBand,
  type DepartmentCode,
} from '@/lib/triage';
```

---

## 2. Function Signatures & Data Contracts

### 2.1 `triage(input: TriageInput, ctx?: TriageContext): TriageResult`

The primary orchestrator. Synchronous, executes in < 1 ms.

```typescript
export interface TriageInput {
  freeText?: string;                  // Patient's typed or spoken text (English, Hindi, Marathi)
  language?: 'en' | 'hi' | 'mr';      // Hint for phrase extraction (defaults to multilingual)
  symptomChips?: SymptomId[];        // Tapped UI chips from symptom selector
  modifiers?: {
    ageBand?: 'neonate' | 'infant' | 'child' | 'child_5_17' | 'adult' | 'elderly';
    sex?: 'male' | 'female' | 'other';
    pregnancyStatus?: 'pregnant' | 'postpartum' | 'not_applicable';
    duration?: '<1h' | '1–24h' | '1–7d' | '>7d';
  };
  origin?: {
    latitude: number;
    longitude: number;
  };
}

export interface TriageResult {
  readonly urgency: 'emergency' | 'urgent' | 'routine' | 'self-care';
  readonly department: DepartmentCode;
  readonly confidence: number;                    // 0.10 to 1.00 signal quality
  readonly recommendedFacilityIds: string[];       // Top ranked facility IDs
  readonly firedRuleIds: string[];                // IDs of any triggered red-flag rules (e.g. 'RF_001')
  readonly matchedSymptomIds: SymptomId[];        // Recognized symptoms (for playback to user)
}
```

---

## 3. Complete Data Flow Example

How to wire user interactions into `triage()` and consume the structured result:

```typescript
// 1. Gather patient context and mock facility data
import { mockFacilities, mockFacilityLoads } from '@/lib/mock-data/facilities';
import { triage, type TriageInput, type TriageResult } from '@/lib/triage';
import { t } from '@/lib/content'; // Lane E translation helper

function handleTriageSubmit(userInput: {
  text: string;
  selectedChips: string[];
  ageYears: number;
  isPregnant: boolean;
  userCoords?: { lat: number; lng: number };
}): void {
  // Convert UI state to typed TriageInput
  const triageInput: TriageInput = {
    freeText: userInput.text,
    symptomChips: userInput.selectedChips as any,
    modifiers: {
      ageBand: userInput.ageYears < 0.16 ? 'neonate' : userInput.ageYears < 5 ? 'child' : 'adult',
      pregnancyStatus: userInput.isPregnant ? 'pregnant' : 'not_applicable',
      duration: '1–24h',
    },
    origin: userInput.userCoords
      ? { latitude: userInput.userCoords.lat, longitude: userInput.userCoords.lng }
      : undefined,
  };

  // Execute triage synchronously
  const result: TriageResult = triage(triageInput, {
    facilities: mockFacilities,
    loadByFacility: mockFacilityLoads,
  });

  // Check for immediate emergency
  if (result.urgency === 'emergency') {
    // CRITICAL: Immediately display full-screen emergency modal / overlay
    // Do NOT navigate to standard booking or show queue slots.
    displayEmergencyOverlay({
      firedRules: result.firedRuleIds,
      recommendedFacilityId: result.recommendedFacilityIds[0],
      emergencyHelpline: '108',
    });
    return;
  }

  // Non-emergency routing: display results card
  displayRoutingResultCard({
    urgencyLabel: t(`urgency.${result.urgency}`),
    departmentLabel: t(`department.${result.department}`),
    confidencePercentage: Math.round(result.confidence * 100),
    // Reflect back what the system understood using Lane E content keys
    understoodSymptoms: result.matchedSymptomIds.map((id) => t(`symptoms.${id}`)),
    facilityIds: result.recommendedFacilityIds,
  });
}
```

---

## 4. Understanding `matchedSymptomIds`

The `matchedSymptomIds` field returns an array of recognized `SymptomId` enums (e.g. `['chest_pain', 'cough']`).
- **UX Intent:** Display these back to the patient as read-only confirmation chips ("We understood: Chest pain, Cold sweating").
- **Localization:** Look up human-readable labels via Lane E's content dictionary using `symptoms.${symptomId}`. Never display raw snake_case IDs.
- **Safety Boundary:** These are the patient's *own reported complaints* mirrored back for confirmation, **never** an inferred finding or clinical sign.

---

## 5. The Three Absolute UI Invariants

When implementing screens in Lane A (`src/features/patient/triage/*`), you **must strictly follow these three rules**:

1. **NEVER show a condition or disease name.**
   - The engine never produces them, and the UI must never infer or display them. No "Possible Heart Attack", no "Suspected Stroke", no "Typhoid".
   - The UI communicates **where to go and how fast** ("Go to Emergency immediately", "Visit Community Health Centre within 24 hours"), never what the patient has.
2. **NEVER hide or suppress the clinical disclaimer.**
   - Every triage result screen must prominently display the mandatory statutory disclaimer provided by Lane E:
     > *"This triage tool does not provide medical diagnoses. It offers routing guidance based on reported symptoms. If you feel your condition is life-threatening, seek emergency care or call 108 immediately."*
3. **NEVER delay the emergency overlay behind any other step.**
   - If `result.urgency === 'emergency'`, the app must **immediately** trigger the full-screen Emergency Overlay (Screen 04).
   - Do not ask for user feedback, do not offer optional survey questions, and do not show an appointment booking calendar. Direct the patient immediately to emergency facilities and the `108` ambulance dialer.
