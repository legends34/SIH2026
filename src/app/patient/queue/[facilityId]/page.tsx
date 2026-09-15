'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useAppState } from '@/lib/state/app-state';
import { HERO } from '@/lib/mock-data/hero';
import { StateHandler } from '@/components/ui/states';

export default function LiveQueuePage() {
  const params = useParams();
  const facilityId = params?.facilityId as string;
  const { t, facilities, nowServing } = useAppState();

  const facility = facilities.find((f) => f.id === facilityId) ?? facilities[0]!;
  const myToken = HERO.appointment.tokenNumber; // 19
  const tokensAhead = Math.max(0, myToken - nowServing);
  const etaMinutes = tokensAhead * 6; // 6 mins avg consultation time

  return (
    <StateHandler>
      <div className="queue-page" style={{ maxWidth: 640, margin: '0 auto' }}>
        <div className="page-header" style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--primary-700)', fontWeight: 700, textTransform: 'uppercase' }}>
            {facility.name}
          </span>
          <h1 className="page-title">
            {t('queue.title') || 'Live OPD Queue / लाइव कतार'}
          </h1>
          <p className="page-subtitle">
            Department: <strong>General OPD · Room No. 4</strong>
          </p>
        </div>

        {/* Live Queue Display Board */}
        <div className="card" style={{ padding: '2rem', textAlign: 'center', border: '2px solid var(--primary-600)', background: 'linear-gradient(to bottom, #ffffff, #f8fafc)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', alignItems: 'center' }}>
            {/* Now Serving */}
            <div style={{ padding: '1.25rem', background: 'var(--slate-100)', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-300)' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--slate-600)' }}>
                {t('queue.nowServing') || 'Now Serving / अभी चालू'}
              </span>
              <p
                className="token-huge"
                data-testid="queue-now-serving"
                style={{ color: 'var(--primary-800)', marginTop: '0.25rem' }}
              >
                {nowServing}
              </p>
              <span style={{ fontSize: '0.75rem', color: 'var(--emerald-800)', fontWeight: 600 }}>
                ● Consultation in progress
              </span>
            </div>

            {/* My Token */}
            <div style={{ padding: '1.25rem', background: 'var(--primary-50)', borderRadius: 'var(--radius-md)', border: '2px solid var(--primary-300)' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary-800)' }}>
                {t('queue.yourToken') || 'Your Token / आपका टोकन'}
              </span>
              <p
                className="token-huge"
                data-testid="queue-my-token"
                style={{ color: '#0d47a1', marginTop: '0.25rem' }}
              >
                {myToken}
              </p>
              <span style={{ fontSize: '0.75rem', color: 'var(--primary-800)', fontWeight: 600 }}>
                {tokensAhead === 0 ? '👉 Your Turn!' : `${tokensAhead} patients ahead`}
              </span>
            </div>
          </div>

          {/* Estimated Waiting Time */}
          <div
            className="queue-eta-box"
            data-testid="queue-eta"
            style={{
              marginTop: '1.5rem',
              padding: '1rem',
              borderRadius: 'var(--radius-sm)',
              background: tokensAhead <= 2 ? 'var(--amber-50)' : 'var(--emerald-50)',
              border: `1px solid ${tokensAhead <= 2 ? 'var(--amber-700)' : 'var(--emerald-600)'}`,
            }}
          >
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: tokensAhead <= 2 ? 'var(--amber-900)' : 'var(--emerald-800)' }}>
              ⏱️ {t('queue.etaLabel') || 'Estimated Wait Time / अनुमानित समय'}:
            </span>
            <p style={{ fontSize: '1.25rem', fontWeight: 800, color: tokensAhead <= 2 ? 'var(--amber-900)' : 'var(--emerald-800)', marginTop: '0.15rem' }}>
              {tokensAhead === 0 ? 'Please proceed into Doctor consultation room' : `Approximately ${etaMinutes} minutes (${tokensAhead} consultations remaining)`}
            </p>
          </div>

          <div style={{ marginTop: '1.5rem', textAlign: 'left', background: 'var(--slate-50)', padding: '1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: 'var(--slate-600)' }}>
            <p>💡 <strong>Real-time synchronization:</strong> When Dr. Rakesh Sharma calls the next patient from the OPD tab, this screen updates live in under 2 seconds without refreshing.</p>
          </div>
        </div>
      </div>
    </StateHandler>
  );
}
