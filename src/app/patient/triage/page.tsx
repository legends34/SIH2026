'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppState } from '@/lib/state/app-state';
import { triage } from '@/lib/triage';
import type { SymptomId, SupportedLanguage } from '@/types';
import { StateHandler } from '@/components/ui/states';

// Curated list of common & emergency symptom chips for triage selection
const SYMPTOM_OPTIONS: Array<{ id: SymptomId; label: string; icon: string }> = [
  { id: 'cough', label: 'Cough / खांसी', icon: '🗣️' },
  { id: 'sore_throat', label: 'Sore Throat / गले में खराश', icon: '🧣' },
  { id: 'body_ache', label: 'Body Ache / बदन दर्द', icon: '🩹' },
  { id: 'high_fever', label: 'High Fever / तेज बुखार', icon: '🌡️' },
  { id: 'breathless', label: 'Difficulty Breathing / सांस लेने में तकलीफ', icon: '🫁' },
  { id: 'chest_pain', label: 'Chest Pain / सीने में दर्द', icon: '💔' },
  { id: 'chest_pain_radiating', label: 'Chest Pain Spreading to Arm / सीने का दर्द हाथ में फैलना', icon: '⚡' },
  { id: 'chest_pain_with_sweating', label: 'Chest Pain with Cold Sweat / पसीने के साथ सीने में दर्द', icon: '💧' },
  { id: 'severe_headache', label: 'Severe Headache / तेज सिरदर्द', icon: '🤕' },
  { id: 'vomiting', label: 'Vomiting / उल्टी', icon: '🤢' },
  { id: 'diarrhoea', label: 'Diarrhoea / दस्त', icon: '🚽' },
  { id: 'abdominal_pain', label: 'Stomach Pain / पेट दर्द', icon: '😣' },
  { id: 'skin_rash', label: 'Skin Rash / त्वचा पर चकत्ते', icon: '🧴' },
  { id: 'eye_redness_pain', label: 'Eye Pain or Redness / आंख में दर्द', icon: '👁️' },
  { id: 'ear_discharge', label: 'Ear Pain / Discharge / कान की समस्या', icon: '👂' },
  { id: 'fracture_suspected', label: 'Limb Injury / Fracture / हाथ-पैर में चोट', icon: '🦵' },
  { id: 'burn', label: 'Burn / जलन', icon: '🔥' },
];

export default function TriagePage() {
  const router = useRouter();
  const { t, locale, facilities, activePatient } = useAppState();
  const [selectedSymptoms, setSelectedSymptoms] = useState<SymptomId[]>([]);
  const [freeText, setFreeText] = useState('');
  const [isListening, setIsListening] = useState(false);

  const toggleSymptom = (id: SymptomId) => {
    setSelectedSymptoms((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleVoiceSimulate = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setFreeText('मुझे दो दिन से खांसी और गले में खराश है');
      if (!selectedSymptoms.includes('cough')) setSelectedSymptoms((prev) => [...prev, 'cough']);
      if (!selectedSymptoms.includes('sore_throat')) setSelectedSymptoms((prev) => [...prev, 'sore_throat']);
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Map active patient age into ageBand
    const ageMonths = Math.floor((Date.now() - new Date(activePatient.dob).getTime()) / (30.4375 * 24 * 3600 * 1000));
    let ageBand: 'neonate' | 'infant' | 'child' | 'adult' | 'elderly' = 'adult';
    if (ageMonths <= 1) ageBand = 'neonate';
    else if (ageMonths <= 12) ageBand = 'infant';
    else if (ageMonths <= 144) ageBand = 'child';
    else if (ageMonths >= 720) ageBand = 'elderly';

    // Run deterministic Lane C Triage Engine
    const result = triage(
      {
        symptomChips: selectedSymptoms,
        freeText: freeText.trim() || undefined,
        language: locale as SupportedLanguage,
        modifiers: {
          ageBand,
          sex: activePatient.sex === 'F' ? 'female' : activePatient.sex === 'M' ? 'male' : 'other',
        },
        origin: { latitude: 28.4595, longitude: 77.0266 }, // Gurugram origin
      },
      {
        facilities: facilities as any,
      }
    );

    // Persist result in session storage for the result screen
    try {
      sessionStorage.setItem('demo.triage_result', JSON.stringify({
        ...result,
        patientName: activePatient.name,
        patientId: activePatient.id,
        selectedSymptoms,
      }));
    } catch {
      // Ignore
    }

    router.push('/patient/triage/result');
  };

  return (
    <StateHandler>
      <div className="triage-page" style={{ maxWidth: 800, margin: '0 auto' }}>
        <div className="page-header">
          <span style={{ fontSize: '0.85rem', color: 'var(--primary-700)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {t('triage.intro.title') || 'Smart Clinical Routing'}
          </span>
          <h1 className="page-title">
            {t('triage.intro.title') || 'What are you feeling?'}
          </h1>
          <p className="page-subtitle">
            {t('triage.intro.subtitle') || 'Select symptoms or describe in your language. We will guide you to the right government health facility.'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Free Text / Voice Input */}
          <div className="card">
            <div className="form-group">
              <label htmlFor="triage-text" className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{t('triage.intro.placeholder') || 'Describe what you are feeling…'}</span>
                <button
                  type="button"
                  onClick={handleVoiceSimulate}
                  className="btn btn-secondary"
                  style={{ minHeight: 36, padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}
                >
                  {isListening ? '🎙️ ' + (t('triage.intro.voiceListening') || 'Listening…') : '🎤 ' + (t('triage.intro.voiceButton') || 'Speak Symptoms')}
                </button>
              </label>

              <textarea
                id="triage-text"
                className="form-textarea"
                rows={3}
                value={freeText}
                onChange={(e) => setFreeText(e.target.value)}
                placeholder="उदा. मुझे सीने में दर्द है और सांस लेने में तकलीफ हो रही है / E.g. I have cough, fever and sore throat..."
              />
            </div>

            {/* Quick Symptom Chips */}
            <div>
              <span className="form-label" style={{ marginBottom: '0.5rem' }}>
                {t('triage.understood.label') || 'Select Symptoms / लक्षण चुनें:'}
              </span>

              <div className="symptom-chips-grid">
                {SYMPTOM_OPTIONS.map((sym) => {
                  const isSelected = selectedSymptoms.includes(sym.id);
                  return (
                    <button
                      key={sym.id}
                      type="button"
                      data-testid={`symptom-chip-${sym.id}`}
                      className={`symptom-chip ${isSelected ? 'selected' : ''}`}
                      onClick={() => toggleSymptom(sym.id)}
                    >
                      <span style={{ marginRight: '0.4rem' }}>{sym.icon}</span>
                      <span>{sym.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            data-testid="triage-submit"
            style={{ fontSize: '1.1rem', padding: '1rem' }}
          >
            {t('triage.intro.submit') || 'Check Symptoms & Find Care / जांचें और सुविधा खोजें'} ➔
          </button>
        </form>
      </div>
    </StateHandler>
  );
}
