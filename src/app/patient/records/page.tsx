'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppState } from '@/lib/state/app-state';
import { getPatientRecords } from '@/lib/mock-data/records';
import { HERO } from '@/lib/mock-data/hero';
import { StateHandler } from '@/components/ui/states';

export default function MedicalRecordsTimelinePage() {
  const { t, activePatient, householdPatients, setActivePatientId, facilities } = useAppState();
  const [filterType, setFilterType] = useState<string>('all');

  const patientRecords = getPatientRecords(activePatient.id);

  const filteredRecords = patientRecords.filter((r) => {
    if (filterType === 'all') return true;
    return r.type === filterType;
  });

  return (
    <StateHandler emptyTitle="No Medical Records" emptyMessage="No consultation or lab records found for this patient yet.">
      <div className="records-page" style={{ maxWidth: 840, margin: '0 auto' }}>
        <div className="page-header">
          <h1 className="page-title">
            {t('records.title') || 'Patient Health Timeline / स्वास्थ्य रिकॉर्ड'}
          </h1>
          <p className="page-subtitle">
            Permanent digital health history across all government visits
          </p>
        </div>

        {/* Patient Switcher */}
        <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)', textTransform: 'uppercase', fontWeight: 700 }}>
              Viewing Medical Timeline For:
            </span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)' }}>
              {activePatient.name}
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {householdPatients.map((p) => (
              <button
                key={p.id}
                type="button"
                data-testid="patient-switcher-option"
                onClick={() => setActivePatientId(p.id)}
                className={`btn ${activePatient.id === p.id ? 'btn-primary' : 'btn-secondary'}`}
                style={{ minHeight: 38, padding: '0.35rem 0.8rem', fontSize: '0.85rem' }}
              >
                {p.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {['all', 'consultation', 'prescription', 'lab_report', 'vaccination'].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilterType(f)}
              className={`btn ${filterType === f ? 'btn-primary' : 'btn-secondary'}`}
              style={{ minHeight: 36, padding: '0.3rem 0.8rem', fontSize: '0.8rem', borderRadius: 'var(--radius-full)' }}
            >
              {f === 'all' ? 'All Records' : f === 'consultation' ? '🩺 Consultations' : f === 'prescription' ? '💊 Prescriptions' : f === 'lab_report' ? '🔬 Lab Reports' : '💉 Vaccinations'}
            </button>
          ))}
        </div>

        {/* Timeline Entries */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredRecords.map((rec) => {
            const fac = facilities.find((f) => f.id === rec.facilityId);
            const dateStr = new Date(rec.recordedAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });

            return (
              <div
                key={rec.id}
                className="card"
                data-testid="record-entry"
                style={{ borderLeft: `5px solid ${rec.type === 'consultation' ? 'var(--primary-700)' : rec.type === 'prescription' ? '#d81b60' : rec.type === 'lab_report' ? 'var(--emerald-600)' : '#8e24aa'}` }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontSize: '1.4rem' }}>
                      {rec.type === 'consultation' ? '🩺' : rec.type === 'prescription' ? '💊' : rec.type === 'lab_report' ? '🔬' : '💉'}
                    </span>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                        {rec.type === 'consultation' ? 'Doctor Consultation' : rec.type === 'prescription' ? 'Medicine Prescription' : rec.type === 'lab_report' ? 'Diagnostic Lab Report' : 'Immunization Record'}
                      </h3>
                      <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                        {dateStr} · {fac?.name || 'Primary Health Centre'}
                      </span>
                    </div>
                  </div>

                  <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.5rem', background: 'var(--slate-100)', borderRadius: 'var(--radius-sm)', textTransform: 'uppercase' }}>
                    {rec.type === 'consultation' ? 'Consultation' : rec.type === 'prescription' ? 'Prescription' : rec.type === 'lab_report' ? 'Lab Report' : 'Vaccination'}
                  </span>
                </div>

                {/* Consultation Details */}
                {rec.type === 'consultation' && 'chiefComplaint' in rec.data && (
                  <div style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--slate-800)' }}>
                    <p><strong>Chief Complaint:</strong> {rec.data.chiefComplaint}</p>
                    {rec.data.clinicalNotes && <p style={{ marginTop: '0.25rem', color: 'var(--slate-600)' }}><em>Notes: {rec.data.clinicalNotes}</em></p>}
                    {rec.data.vitals && (
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--slate-600)', flexWrap: 'wrap' }}>
                        {rec.data.vitals.bpSystolic && <span>BP: <strong>{rec.data.vitals.bpSystolic}/{rec.data.vitals.bpDiastolic} mmHg</strong></span>}
                        {rec.data.vitals.pulsePerMin && <span>Pulse: <strong>{rec.data.vitals.pulsePerMin} bpm</strong></span>}
                        {rec.data.vitals.weightKg && <span>Weight: <strong>{rec.data.vitals.weightKg} kg</strong></span>}
                      </div>
                    )}
                  </div>
                )}

                {/* Prescription Details (including Metformin for Ramesh) */}
                {rec.type === 'prescription' && 'medicines' in rec.data && (
                  <div style={{ marginTop: '0.75rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      {rec.data.medicines.map((m, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0.4rem 0.6rem',
                            background: 'var(--slate-50)',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.85rem',
                          }}
                        >
                          <div>
                            <strong style={{ color: 'var(--slate-900)' }}>
                              {m.medicineId === HERO.medicine.id ? 'Metformin 500 mg Tablet' : m.medicineId === 'med_0008' ? 'Amlodipine 5 mg Tablet' : m.medicineId === 'med_0013' ? 'Atorvastatin 10 mg Tablet' : 'Paracetamol 500 mg'}
                            </strong>
                            <span style={{ color: 'var(--slate-600)', marginLeft: '0.5rem' }}>({m.dosage}, {m.frequency})</span>
                          </div>

                          <Link
                            href={`/patient/medicines?search=${m.medicineId === HERO.medicine.id ? 'Metformin' : 'Paracetamol'}`}
                            className="btn btn-secondary"
                            style={{ minHeight: 32, padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}
                          >
                            Check Stock ➔
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Lab Report Details */}
                {rec.type === 'lab_report' && 'testName' in rec.data && (
                  <div style={{ marginTop: '0.75rem', fontSize: '0.85rem' }}>
                    <strong>{rec.data.testName}</strong>
                    <div style={{ marginTop: '0.35rem' }}>
                      {rec.data.results.map((r, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '1rem', color: 'var(--slate-700)' }}>
                          <span>{r.parameter}: <strong>{r.value} {r.unit}</strong></span>
                          <span style={{ color: 'var(--slate-500)' }}>(Ref: {r.referenceRange})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </StateHandler>
  );
}
