'use client';

import React from 'react';
import Link from 'next/link';
import { useAppState } from '@/lib/state/app-state';
import { HERO } from '@/lib/mock-data/hero';
import { StateHandler } from '@/components/ui/states';

export default function DoctorOpdQueuePage() {
  const { t, nowServing, callNextToken } = useAppState();

  const handleCallNext = () => {
    callNextToken();
  };

  const queueList = [
    { token: nowServing, name: nowServing === 19 ? 'Sunita Sharma (pat_0001)' : `Patient ${nowServing}`, status: 'In Consultation', dept: 'General OPD', priority: 'Routine' },
    { token: nowServing + 1, name: nowServing + 1 === 19 ? 'Sunita Sharma (pat_0001)' : `Patient ${nowServing + 1}`, status: 'Waiting', dept: 'General OPD', priority: 'Routine' },
    { token: nowServing + 2, name: `Patient ${nowServing + 2}`, status: 'Waiting', dept: 'General OPD', priority: 'Urgent' },
    { token: nowServing + 3, name: `Patient ${nowServing + 3}`, status: 'Waiting', dept: 'General OPD', priority: 'Routine' },
  ];

  return (
    <StateHandler>
      <div className="doctor-opd-page" style={{ maxWidth: 900, margin: '0 auto' }}>
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--primary-700)', fontWeight: 700, textTransform: 'uppercase' }}>
              Primary Health Centre, Wazirabad · Room 4
            </span>
            <h1 className="page-title">
              {t('doctor.title') || 'Doctor OPD Queue & Consultation'}
            </h1>
            <p className="page-subtitle">
              Medical Officer: <strong>Dr. Rakesh Sharma (MD)</strong>
            </p>
          </div>

          {/* Call Next Patient Button */}
          <button
            type="button"
            className="btn btn-success"
            data-testid="opd-call-next"
            onClick={handleCallNext}
            style={{ fontSize: '1.1rem', padding: '0.85rem 1.5rem', boxShadow: 'var(--shadow-md)' }}
          >
            📢 Call Next Patient (Token {nowServing + 1}) ➔
          </button>
        </div>

        {/* Current Active Patient Box */}
        <div className="card" style={{ background: 'linear-gradient(to right, #e8f5e9, #f1f8e9)', borderLeft: '6px solid var(--emerald-600)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--emerald-800)', textTransform: 'uppercase' }}>
                CURRENTLY SERVING IN ROOM
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginTop: '0.2rem' }}>
                <span className="token-huge" style={{ color: 'var(--emerald-800)', fontSize: '2.5rem' }}>
                  Token {nowServing}
                </span>
                <strong style={{ fontSize: '1.2rem', color: 'var(--slate-900)' }}>
                  {nowServing === 19 ? 'Sunita Sharma (34y, F)' : `Patient Token #${nowServing}`}
                </strong>
              </div>
            </div>

            <Link
              href={`/doctor/consult/${HERO.appointment.id}`}
              className="btn btn-primary"
              style={{ padding: '0.75rem 1.25rem' }}
            >
              🩺 Start / Open Consultation ➔
            </Link>
          </div>
        </div>

        {/* Live OPD Queue Table */}
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--slate-900)' }}>
            Upcoming Queue / प्रतीक्षारत कतार
          </h3>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--slate-100)', color: 'var(--slate-700)', borderBottom: '2px solid var(--slate-200)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Token</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Patient Name</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Department</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {queueList.map((row) => (
                  <tr key={row.token} style={{ borderBottom: '1px solid var(--slate-200)', background: row.token === nowServing ? 'var(--emerald-50)' : 'transparent' }}>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <strong style={{ fontSize: '1.1rem', color: 'var(--primary-800)' }}>{row.token}</strong>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>
                      {row.name}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--slate-600)' }}>
                      {row.dept}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.6rem',
                          borderRadius: 'var(--radius-sm)',
                          background: row.token === nowServing ? 'var(--emerald-100)' : 'var(--slate-200)',
                          color: row.token === nowServing ? 'var(--emerald-900)' : 'var(--slate-700)',
                        }}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <Link
                        href={`/doctor/consult/${HERO.appointment.id}`}
                        className="btn btn-secondary"
                        style={{ minHeight: 32, padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}
                      >
                        Examine ➔
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </StateHandler>
  );
}
