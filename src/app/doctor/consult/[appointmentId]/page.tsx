'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAppState } from '@/lib/state/app-state';
import { HERO } from '@/lib/mock-data/hero';
import { medicines } from '@/lib/mock-data/inventory';
import { StockIndicator } from '@/components/ui/badge';
import type { HealthRecord, Medicine } from '@/types';
import { StateHandler } from '@/components/ui/states';

export default function DoctorConsultationPage() {
  const params = useParams();
  const appointmentId = params?.appointmentId as string;
  const { t, stockItems, addRecord } = useAppState();

  const [bp, setBp] = useState('118/76');
  const [pulse, setPulse] = useState('78');
  const [weight, setWeight] = useState('58');
  const [temp, setTemp] = useState('37.2');
  const [chiefComplaint, setChiefComplaint] = useState('Acute cough and sore throat for 3 days');
  const [clinicalNotes, setClinicalNotes] = useState('Pharyngeal erythema present. Lungs clear to auscultation.');

  const [medQuery, setMedQuery] = useState('');
  const [prescribedMeds, setPrescribedMeds] = useState<Array<{ med: Medicine; dosage: string; frequency: string; duration: number }>>([
    {
      med: medicines.find((m) => m.id === 'med_0001') || medicines[0]!, // Paracetamol
      dosage: '1 tablet (500mg)',
      frequency: 'Thrice daily after meals',
      duration: 5,
    },
  ]);

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Search medicines
  const searchResults = medQuery.trim()
    ? medicines.filter(
        (m) =>
          m.genericName.toLowerCase().includes(medQuery.toLowerCase()) ||
          m.therapeuticCategory.toLowerCase().includes(medQuery.toLowerCase())
      )
    : [];

  const handleAddMedicine = (med: Medicine) => {
    if (!prescribedMeds.some((p) => p.med.id === med.id)) {
      setPrescribedMeds((prev) => [
        ...prev,
        { med, dosage: '1 tablet', frequency: 'Twice daily', duration: 5 },
      ]);
    }
    setMedQuery('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const [sys, dia] = bp.split('/').map((s) => Number(s.trim()));

    const record: HealthRecord = {
      id: `rec_${Date.now()}` as any,
      patientId: HERO.sunita.patientId,
      facilityId: HERO.phcId,
      authorUserId: HERO.doctor.userId,
      appointmentId: appointmentId as any,
      type: 'consultation',
      recordedAt: new Date().toISOString(),
      data: {
        chiefComplaint,
        clinicalNotes,
        vitals: {
          bpSystolic: sys || 118,
          bpDiastolic: dia || 76,
          pulsePerMin: Number(pulse) || 78,
          weightKg: Number(weight) || 58,
          tempCelsius: Number(temp) || 37.2,
        },
      },
    };

    addRecord(record);
    setSavedSuccess(true);
  };

  return (
    <StateHandler>
      <div className="consultation-page" style={{ maxWidth: 840, margin: '0 auto' }}>
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <Link href="/doctor" style={{ fontSize: '0.85rem', color: 'var(--primary-700)', fontWeight: 600 }}>
              ← {t('common.actions.back') || 'Back to OPD Queue'}
            </Link>
            <h1 className="page-title" style={{ marginTop: '0.25rem' }}>
              Patient Consultation & E-Prescription
            </h1>
            <p className="page-subtitle">
              Patient: <strong>Sunita Sharma (34y, F)</strong> · Token #19 · General OPD
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div
            className="card"
            data-testid="consult-saved"
            style={{ background: 'var(--emerald-50)', border: '2px solid var(--emerald-600)', padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
          >
            <span style={{ fontSize: '1.8rem' }}>✅</span>
            <div>
              <strong style={{ fontSize: '1.1rem', color: 'var(--emerald-900)' }}>
                Consultation & Prescription Saved Successfully!
              </strong>
              <p style={{ fontSize: '0.85rem', color: 'var(--emerald-800)' }}>
                Digital health record synced and available on the patient's mobile portal.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSave}>
          {/* 1. Clinical Examination & Vitals */}
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--slate-900)' }}>
              1. Clinical Vitals & Notes / नैदानिक नोट्स
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
              <div className="form-group">
                <label htmlFor="bp-input" className="form-label">Blood Pressure (mmHg)</label>
                <input
                  id="bp-input"
                  type="text"
                  className="form-input"
                  data-testid="consult-vitals-bp"
                  value={bp}
                  onChange={(e) => setBp(e.target.value)}
                  placeholder="120/80"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="pulse-input" className="form-label">Pulse (bpm)</label>
                <input
                  id="pulse-input"
                  type="number"
                  className="form-input"
                  value={pulse}
                  onChange={(e) => setPulse(e.target.value)}
                  placeholder="72"
                />
              </div>

              <div className="form-group">
                <label htmlFor="temp-input" className="form-label">Temp (°C)</label>
                <input
                  id="temp-input"
                  type="number"
                  step="0.1"
                  className="form-input"
                  value={temp}
                  onChange={(e) => setTemp(e.target.value)}
                  placeholder="37.0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="weight-input" className="form-label">Weight (kg)</label>
                <input
                  id="weight-input"
                  type="number"
                  className="form-input"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="60"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="complaint-input" className="form-label">Chief Complaint</label>
              <input
                id="complaint-input"
                type="text"
                className="form-input"
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="notes-input" className="form-label">Doctor's Clinical Notes</label>
              <textarea
                id="notes-input"
                className="form-textarea"
                rows={2}
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
              />
            </div>
          </div>

          {/* 2. Medicine Search & Live Stock Prescription */}
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--slate-900)' }}>
              2. Prescription with Live Stock Indicator / दवा पर्ची
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginBottom: '1rem' }}>
              💡 Live stock status at this PHC is verified before writing the prescription to prevent stockouts.
            </p>

            <div className="form-group">
              <label htmlFor="med-search" className="form-label">Search Drug to Prescribe</label>
              <input
                id="med-search"
                type="text"
                className="form-input"
                data-testid="rx-medicine-search"
                value={medQuery}
                onChange={(e) => setMedQuery(e.target.value)}
                placeholder="Type Paracetamol, Amoxicillin, Cetirizine, Metformin…"
              />

              {/* Medicine suggestions dropdown */}
              {searchResults.length > 0 && (
                <div style={{ marginTop: '0.35rem', background: 'var(--white)', border: '1px solid var(--slate-300)', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-md)', maxHeight: 200, overflowY: 'auto' }}>
                  {searchResults.map((m) => {
                    const st = stockItems.find((s) => s.facilityId === HERO.phcId && s.medicineId === m.id)?.status || 'available';
                    return (
                      <button
                        key={m.id}
                        type="button"
                        data-testid={`rx-medicine-option-${m.id}`}
                        onClick={() => handleAddMedicine(m)}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          width: '100%',
                          padding: '0.6rem 1rem',
                          textAlign: 'left',
                          background: 'none',
                          border: 'none',
                          borderBottom: '1px solid var(--slate-100)',
                          cursor: 'pointer',
                        }}
                      >
                        <div>
                          <strong>{m.genericName} {m.strength}</strong> ({m.dosageForm})
                        </div>
                        <StockIndicator status={st} />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Prescribed Medicines List */}
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {prescribedMeds.map((item, idx) => {
                const stock = stockItems.find((s) => s.facilityId === HERO.phcId && s.medicineId === item.med.id);
                const status = stock?.status || 'available';

                return (
                  <div
                    key={item.med.id || idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.75rem 1rem',
                      background: 'var(--slate-50)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--slate-200)',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: '1rem', color: 'var(--slate-900)' }}>
                        {item.med.genericName} {item.med.strength}
                      </strong>
                      <span style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginLeft: '0.5rem' }}>
                        ({item.dosage} · {item.frequency} · {item.duration} days)
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <StockIndicator status={status} medicineId={item.med.id} />
                      <button
                        type="button"
                        onClick={() => setPrescribedMeds((prev) => prev.filter((p) => p.med.id !== item.med.id))}
                        style={{ background: 'none', border: 'none', color: 'var(--crimson-600)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700 }}
                      >
                        ✕ Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            data-testid="consult-save"
            style={{ fontSize: '1.1rem', padding: '1rem' }}
          >
            💾 Save Consultation & Issue Prescription ➔
          </button>
        </form>
      </div>
    </StateHandler>
  );
}
