'use client';

import React from 'react';
import Link from 'next/link';
import { useAppState } from '@/lib/state/app-state';
import { HERO } from '@/lib/mock-data/hero';
import { StateHandler } from '@/components/ui/states';

export default function PatientHomePage() {
  const { t, activePatient, householdPatients, setActivePatientId, appointments, nowServing } = useAppState();

  const heroAppt = appointments.find((a) => a.id === HERO.appointment.id) ?? appointments[0];

  return (
    <StateHandler>
      <div className="patient-home">
        {/* Active Patient Switcher Card */}
        <div className="card" style={{ background: 'linear-gradient(to right, #f8fafc, #edf2f7)', borderLeft: '4px solid var(--primary-700)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--slate-500)', fontWeight: 700 }}>
                {t('patientHome.householdAccount') || 'Shared Household Account'}
              </span>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                {activePatient.name}
              </h2>
              <span style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>
                {activePatient.id === HERO.sunita.patientId ? 'Account Holder (Sunita, 34y)' : activePatient.id === HERO.ramesh.patientId ? 'Father-in-law (Ramesh, 61y)' : 'Son (Aarav, 6y)'}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {householdPatients.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  data-testid="patient-switcher-option"
                  onClick={() => setActivePatientId(p.id)}
                  className={`btn ${activePatient.id === p.id ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ minHeight: 40, padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}
                >
                  {p.id === activePatient.id ? '✓ ' : ''}{p.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Hero Next-Appointment Card with Token 19 */}
        {heroAppt && (
          <div className="next-appt-card" data-testid="home-next-appointment">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <span className="token-tag">
                  {t('patientHome.todayAppointment') || "Today's Appointment · आज का टोकन"}
                </span>
                <div className="appt-token-banner">
                  <span className="token-huge">{heroAppt.tokenNumber || HERO.appointment.tokenNumber}</span>
                  <span style={{ fontSize: '1.2rem', opacity: 0.9 }}>
                    / {t('queue.nowServing') || 'Now Serving'}: <strong>{nowServing}</strong>
                  </span>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span className="urgency-badge badge-routine" style={{ background: 'rgba(255,255,255,0.2)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.4)' }}>
                  General OPD
                </span>
                <p style={{ marginTop: '0.5rem', fontSize: '0.95rem' }}>
                  Primary Health Centre, Wazirabad
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <Link
                href={`/patient/queue/${HERO.phcId}`}
                className="btn btn-success"
                style={{ flex: 1, minWidth: 160 }}
              >
                ⏱️ {t('queue.liveTracking') || 'Live Queue Status'} ➔
              </Link>
              <Link
                href={`/patient/appointments/${heroAppt.id}`}
                className="btn"
                style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', flex: 1, minWidth: 160 }}
              >
                📄 {t('patientHome.viewReceipt') || 'Token Receipt'}
              </Link>
            </div>
          </div>
        )}

        {/* Quick Action Grid */}
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '1.5rem 0 1rem', color: 'var(--slate-900)' }}>
          {t('patientHome.services') || 'Healthcare Services / स्वास्थ्य सेवाएं'}
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <Link href="/patient/triage" className="card card-clickable" style={{ borderTop: '4px solid var(--primary-600)' }}>
            <span style={{ fontSize: '2rem' }}>🩺</span>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0.5rem 0 0.25rem' }}>
              {t('triage.intro.title') || 'Smart Symptom Triage'}
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>
              Check symptoms and find the right government clinic or specialist.
            </p>
          </Link>

          <Link href="/patient/facilities" className="card card-clickable" style={{ borderTop: '4px solid var(--emerald-600)' }}>
            <span style={{ fontSize: '2rem' }}>🏥</span>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0.5rem 0 0.25rem' }}>
              {t('facilities.title') || 'Government Facilities'}
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>
              Browse nearby PHCs, CHCs, and District Hospitals in Gurugram & NCR.
            </p>
          </Link>

          <Link href="/patient/records" className="card card-clickable" style={{ borderTop: '4px solid #8e24aa)' }}>
            <span style={{ fontSize: '2rem' }}>📋</span>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0.5rem 0 0.25rem' }}>
              {t('records.title') || 'Medical Records'}
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>
              Access timeline of past consultations, prescriptions, and lab tests.
            </p>
          </Link>

          <Link href="/patient/medicines" className="card card-clickable" style={{ borderTop: '4px solid #d81b60)' }}>
            <span style={{ fontSize: '2rem' }}>💊</span>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0.5rem 0 0.25rem' }}>
              {t('medicines.title') || 'Medicine Availability'}
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>
              Search essential medicine stock across government dispensaries.
            </p>
          </Link>

          <Link href="/patient/complaints/new" className="card card-clickable" style={{ borderTop: '4px solid var(--amber-700)' }}>
            <span style={{ fontSize: '2rem' }}>📢</span>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0.5rem 0 0.25rem' }}>
              {t('complaints.title') || 'File Grievance / Complaint'}
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>
              Report stockouts, wait times, or service issues with SLA tracking.
            </p>
          </Link>

          <Link href="/patient/profile" className="card card-clickable" style={{ borderTop: '4px solid var(--slate-700)' }}>
            <span style={{ fontSize: '2rem' }}>👤</span>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0.5rem 0 0.25rem' }}>
              {t('profile.title') || 'ABHA & Profile'}
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>
              Link Ayushman Bharat Health Account (ABHA) and manage family members.
            </p>
          </Link>
        </div>
      </div>
    </StateHandler>
  );
}
