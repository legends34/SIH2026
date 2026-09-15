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
      <div className="queue-page" style={{ maxWidth: 680, margin: '0 auto' }}>
        <div className="page-header" style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--teal-600)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {facility.name}
          </span>
          <h1 className="page-title" style={{ fontSize: '1.75rem', marginTop: '0.25rem' }}>
            {t('queue.title') || 'Live OPD Queue / लाइव कतार'}
          </h1>
          <p className="page-subtitle">
            Department: <strong>General OPD · Room No. 4</strong>
          </p>
        </div>

        {/* Live Queue Display Board */}
        <div className="card" style={{ padding: '2rem', textAlign: 'center', border: '2px solid var(--primary-900)', background: 'var(--bg-surface)', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem', alignItems: 'center' }}>
            {/* Now Serving */}
            <div style={{ padding: '1.25rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.03em' }}>
                {t('queue.nowServing') || 'Now Serving / अभी चालू'}
              </span>
              <p
                className="token-huge"
                data-testid="queue-now-serving"
                style={{ color: 'var(--primary-900)', marginTop: '0.25rem' }}
              >
                {nowServing}
              </p>
              <span style={{ fontSize: '0.76rem', color: 'var(--emerald-800)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--emerald-600)' }}></span>
                In Consultation
              </span>
            </div>

            {/* My Token */}
            <div style={{ padding: '1.25rem', background: 'var(--primary-50)', borderRadius: 'var(--radius-md)', border: '2px solid var(--primary-600)' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--primary-900)', letterSpacing: '0.03em' }}>
                {t('queue.yourToken') || 'Your Token / आपका टोकन'}
              </span>
              <p
                className="token-huge"
                data-testid="queue-my-token"
                style={{ color: 'var(--primary-900)', marginTop: '0.25rem' }}
              >
                {myToken}
              </p>
              <span style={{ fontSize: '0.76rem', color: 'var(--primary-800)', fontWeight: 700 }}>
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
              padding: '1.1rem 1.25rem',
              borderRadius: 'var(--radius-sm)',
              background: tokensAhead <= 2 ? 'var(--amber-50)' : 'var(--teal-50)',
              border: `1.5px solid ${tokensAhead <= 2 ? 'var(--amber-600)' : 'var(--teal-600)'}`,
            }}
          >
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: tokensAhead <= 2 ? 'var(--amber-900)' : 'var(--teal-800)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              ⏱️ {t('queue.etaLabel') || 'Estimated Wait Time / अनुमानित समय'}:
            </span>
            <p style={{ fontSize: '1.25rem', fontWeight: 900, color: tokensAhead <= 2 ? 'var(--amber-900)' : 'var(--teal-800)', marginTop: '0.2rem' }}>
              {tokensAhead === 0 ? 'Please proceed into Doctor consultation room' : `Approximately ${etaMinutes} minutes (${tokensAhead} consultations remaining)`}
            </p>
          </div>

          <div style={{ marginTop: '1.5rem', textAlign: 'left', background: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}>
            <p>💡 <strong>Real-time synchronization:</strong> When Dr. Rakesh Sharma calls the next patient from the OPD desk, this display updates live in under 2 seconds without refreshing.</p>
          </div>
        </div>
      </div>
    </StateHandler>
  );
}
