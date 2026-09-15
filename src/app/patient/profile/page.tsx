'use client';

import React, { useState } from 'react';
import { useAppState } from '@/lib/state/app-state';
import { HERO } from '@/lib/mock-data/hero';
import { StateHandler } from '@/components/ui/states';

export default function PatientProfilePage() {
  const { t, activePatient, householdPatients } = useAppState();
  const [abhaLinked, setAbhaLinked] = useState(false);
  const [abhaNumber, setAbhaNumber] = useState('');

  const handleLinkAbha = (e: React.FormEvent) => {
    e.preventDefault();
    setAbhaLinked(true);
  };

  return (
    <StateHandler>
      <div className="profile-page" style={{ maxWidth: 740, margin: '0 auto' }}>
        <div className="page-header">
          <h1 className="page-title">
            {t('profile.title') || 'Citizen Profile & ABHA Account'}
          </h1>
          <p className="page-subtitle">
            Manage your Ayushman Bharat Health Account and linked household dependents
          </p>
        </div>

        {/* ABHA Link Card */}
        <div className="card" style={{ background: 'linear-gradient(135deg, #1e3c72, #2a5298)', color: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.9 }}>
                Ayushman Bharat Digital Mission (ABDM)
              </span>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '0.2rem' }}>
                ABHA Health ID
              </h2>
              <p style={{ fontSize: '0.9rem', opacity: 0.9, marginTop: '0.25rem' }}>
                Link your 14-digit ABHA ID to automatically sync lab reports and OPD records across India.
              </p>
            </div>
            <span style={{ fontSize: '2.5rem' }}>🇮🇳</span>
          </div>

          {!abhaLinked ? (
            <form onSubmit={handleLinkAbha} style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <input
                type="text"
                className="form-input"
                value={abhaNumber}
                onChange={(e) => setAbhaNumber(e.target.value)}
                placeholder="Enter 14-digit ABHA (e.g. 91-1234-5678-9012)"
                style={{ flex: 1, minWidth: 240, background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}
              />
              <button
                type="submit"
                className="btn btn-success"
                data-testid="abha-link-button"
                style={{ minWidth: 140 }}
              >
                Link ABHA ➔
              </button>
            </form>
          ) : (
            <div style={{ marginTop: '1.25rem', padding: '0.75rem 1rem', background: 'rgba(46, 125, 50, 0.4)', borderRadius: 'var(--radius-sm)', border: '1px solid #81c784' }}>
              <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                ✓ ABHA ID Linked: <strong>91-8821-4439-0192</strong> (Sunita Sharma)
              </p>
            </div>
          )}
        </div>

        {/* Patient Details */}
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--slate-900)' }}>
            Primary Account Details
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.9rem' }}>
            <div>
              <span style={{ color: 'var(--slate-500)', fontSize: '0.8rem', fontWeight: 700 }}>FULL NAME</span>
              <p style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{activePatient.name}</p>
            </div>
            <div>
              <span style={{ color: 'var(--slate-500)', fontSize: '0.8rem', fontWeight: 700 }}>PHONE NUMBER</span>
              <p style={{ fontWeight: 700, color: 'var(--slate-900)' }}>+91 90000 00001</p>
            </div>
            <div>
              <span style={{ color: 'var(--slate-500)', fontSize: '0.8rem', fontWeight: 700 }}>AADHAAR (LAST 4)</span>
              <p style={{ fontWeight: 700, color: 'var(--slate-900)' }}>XXXX-XXXX-4819</p>
            </div>
            <div>
              <span style={{ color: 'var(--slate-500)', fontSize: '0.8rem', fontWeight: 700 }}>LOCATION</span>
              <p style={{ fontWeight: 700, color: 'var(--slate-900)' }}>Wazirabad, Gurugram, Delhi-NCR</p>
            </div>
          </div>
        </div>

        {/* Linked Household Members */}
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--slate-900)' }}>
            Linked Household Family Members (1:N Account)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {householdPatients.map((p) => (
              <div
                key={p.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem 1rem',
                  background: 'var(--slate-50)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--slate-200)',
                }}
              >
                <div>
                  <strong style={{ color: 'var(--slate-900)' }}>{p.name}</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--slate-600)', marginLeft: '0.5rem' }}>
                    ({p.id === HERO.sunita.patientId ? 'Self / Account Holder' : p.id === HERO.ramesh.patientId ? 'Father-in-law' : 'Child Dependent'})
                  </span>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--emerald-800)' }}>
                  ✓ Active
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </StateHandler>
  );
}
