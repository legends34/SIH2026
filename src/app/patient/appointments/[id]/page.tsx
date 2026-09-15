'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAppState } from '@/lib/state/app-state';
import { HERO } from '@/lib/mock-data/hero';
import { StateHandler } from '@/components/ui/states';

export default function AppointmentReceiptPage() {
  const params = useParams();
  const apptId = params?.id as string;
  const { t, appointments, facilities, nowServing } = useAppState();

  const appointment = appointments.find((a) => a.id === apptId) ?? {
    id: HERO.appointment.id,
    tokenNumber: HERO.appointment.tokenNumber,
    facilityId: HERO.phcId,
    departmentCode: 'general_opd',
    status: 'booked',
    bookedAt: '2026-09-15T08:30:00+05:30',
  };

  const facility = facilities.find((f) => f.id === appointment.facilityId) ?? facilities[0]!;

  return (
    <StateHandler>
      <div className="receipt-page" style={{ maxWidth: 640, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '2.5rem' }}>🎟️</span>
          <h1 className="page-title" style={{ marginTop: '0.25rem' }}>
            {t('booking.receipt.title') || 'Official OPD Token Receipt'}
          </h1>
          <p className="page-subtitle">
            Government of Haryana / Delhi-NCR Health Mission
          </p>
        </div>

        <div className="card" style={{ border: '2px solid var(--primary-700)', padding: '2rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--slate-500)', fontWeight: 700 }}>
            {t('booking.receipt.tokenLabel') || 'Your OPD Token Number / आपका टोकन नंबर'}
          </span>

          <div style={{ margin: '1rem 0' }}>
            <span
              className="token-huge"
              data-testid="token-number"
              style={{ color: 'var(--primary-800)' }}
            >
              {appointment.tokenNumber || HERO.appointment.tokenNumber}
            </span>
          </div>

          <div style={{ padding: '0.75rem', background: 'var(--primary-50)', borderRadius: 'var(--radius-sm)', margin: '1rem 0' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--primary-900)' }}>
              Current Queue Status: <strong>Now Serving {nowServing}</strong>
            </span>
          </div>

          <div style={{ borderTop: '1px dashed var(--slate-300)', paddingTop: '1.25rem', marginTop: '1.25rem', textAlign: 'left' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', fontSize: '0.9rem' }}>
              <div>
                <span style={{ color: 'var(--slate-500)', display: 'block', fontSize: '0.75rem', fontWeight: 700 }}>FACILITY</span>
                <strong style={{ color: 'var(--slate-900)' }}>{facility.name}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--slate-500)', display: 'block', fontSize: '0.75rem', fontWeight: 700 }}>DEPARTMENT</span>
                <strong style={{ color: 'var(--slate-900)' }}>General OPD</strong>
              </div>
              <div>
                <span style={{ color: 'var(--slate-500)', display: 'block', fontSize: '0.75rem', fontWeight: 700 }}>DATE & SESSION</span>
                <strong style={{ color: 'var(--slate-900)' }}>Today · 09:00 AM – 01:00 PM</strong>
              </div>
              <div>
                <span style={{ color: 'var(--slate-500)', display: 'block', fontSize: '0.75rem', fontWeight: 700 }}>PATIENT</span>
                <strong style={{ color: 'var(--slate-900)' }}>Sunita Sharma</strong>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link
              href={`/patient/queue/${facility.id}`}
              className="btn btn-success"
              style={{ flex: 1, minWidth: 160 }}
            >
              ⏱️ {t('queue.liveTracking') || 'Live Queue Tracking'} ➔
            </Link>
            <Link
              href="/patient"
              className="btn btn-secondary"
              style={{ flex: 1, minWidth: 160 }}
            >
              🏠 {t('patientHome.title') || 'Back to Home'}
            </Link>
          </div>
        </div>
      </div>
    </StateHandler>
  );
}
