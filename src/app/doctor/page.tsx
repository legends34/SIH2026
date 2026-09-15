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
        <div className="card" style={{ background: 'var(--teal-50)', borderLeft: '6px solid var(--teal-600)', borderTop: '1px solid var(--teal-100)', borderRight: '1px solid var(--teal-100)', borderBottom: '1px solid var(--teal-100)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--teal-800)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                CURRENTLY SERVING IN ROOM
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginTop: '0.2rem' }}>
                <span className="token-huge" style={{ color: 'var(--teal-800)', fontSize: '2.5rem' }}>
                  Token {nowServing}
                </span>
                <strong style={{ fontSize: '1.25rem', color: 'var(--primary-900)' }}>
                  {nowServing === 19 ? 'Sunita Sharma (34y, F)' : `Patient Token #${nowServing}`}
                </strong>
              </div>
            </div>

            <Link
              href={`/doctor/consult/${HERO.appointment.id}`}
              className="btn btn-teal"
              style={{ padding: '0.75rem 1.35rem' }}
            >
              🩺 Start / Open Consultation ➔
            </Link>
          </div>
        </div>

        {/* Live OPD Queue Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.25rem 0.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-900)' }}>
              Upcoming Queue / प्रतीक्षारत कतार
            </h3>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--bg-subtle)', color: 'var(--text-secondary)', borderBottom: '2px solid var(--border-color)' }}>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Token</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Patient Name</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Department</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Status</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {queueList.map((row) => (
                  <tr key={row.token} style={{ borderBottom: '1px solid var(--border-color)', background: row.token === nowServing ? 'var(--teal-50)' : 'transparent' }}>
                    <td style={{ padding: '0.9rem 1.25rem' }}>
                      <strong style={{ fontSize: '1.15rem', color: 'var(--primary-900)' }}>{row.token}</strong>
                    </td>
                    <td style={{ padding: '0.9rem 1.25rem', fontWeight: 700, color: 'var(--primary-900)' }}>
                      {row.name}
                    </td>
                    <td style={{ padding: '0.9rem 1.25rem', color: 'var(--text-secondary)' }}>
                      {row.dept}
                    </td>
                    <td style={{ padding: '0.9rem 1.25rem' }}>
                      <span
                        style={{
                          fontSize: '0.76rem',
                          fontWeight: 800,
                          padding: '0.25rem 0.65rem',
                          borderRadius: 'var(--radius-xs)',
                          background: row.token === nowServing ? 'var(--emerald-50)' : 'var(--bg-subtle)',
                          color: row.token === nowServing ? 'var(--emerald-800)' : 'var(--text-secondary)',
                          border: `1px solid ${row.token === nowServing ? '#b7e6d0' : 'var(--border-color)'}`,
                          textTransform: 'uppercase',
                          letterSpacing: '0.03em',
                        }}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.9rem 1.25rem' }}>
                      <Link
                        href={`/doctor/consult/${HERO.appointment.id}`}
                        className="btn btn-secondary"
                        style={{ minHeight: 34, padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}
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
