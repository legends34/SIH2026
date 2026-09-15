'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAppState } from '@/lib/state/app-state';
import { FacilityTierBadge } from '@/components/ui/badge';
import { StateHandler } from '@/components/ui/states';

export default function FacilityDetailPage() {
  const params = useParams();
  const facilityId = params?.id as string;
  const { t, facilities } = useAppState();

  const facility = facilities.find((f) => f.id === facilityId) ?? facilities[0]!;

  return (
    <StateHandler>
      <div className="facility-detail-page" style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ marginBottom: '1rem' }}>
          <Link href="/patient/facilities" style={{ fontSize: '0.85rem', color: 'var(--primary-700)', fontWeight: 600 }}>
            ← {t('common.actions.back') || 'Back to Facility List'}
          </Link>
        </div>

        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h1 className="page-title" data-testid="facility-name" style={{ fontSize: '1.6rem' }}>
                {facility.name}
              </h1>
              <p style={{ fontSize: '0.95rem', color: 'var(--slate-600)', marginTop: '0.25rem' }}>
                📍 {facility.taluka}, {facility.district} · Pincode {facility.pincode}
              </p>
            </div>

            <FacilityTierBadge tier={facility.tier} />
          </div>

          <div style={{ marginTop: '1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', background: 'var(--slate-50)', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 700 }}>OPD TIMINGS</span>
              <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--slate-900)' }}>08:00 AM – 02:00 PM</p>
            </div>
            <div style={{ padding: '0.75rem', background: 'var(--slate-50)', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 700 }}>EMERGENCY CASUALTY</span>
              <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--slate-900)' }}>24 × 7 Available</p>
            </div>
            <div style={{ padding: '0.75rem', background: 'var(--slate-50)', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 700 }}>VERIFICATION STATUS</span>
              <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--emerald-800)' }}>✓ Verified Gov Facility</p>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--slate-900)' }}>
              Active Departments / सक्रिय विभाग
            </h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {facility.departments.map((d) => (
                <span
                  key={d}
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--primary-50)',
                    color: 'var(--primary-800)',
                    border: '1px solid var(--primary-200)',
                  }}
                >
                  {d.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              href={`/patient/book/${facility.id}`}
              className="btn btn-primary"
              style={{ flex: 1, minWidth: 200, fontSize: '1.05rem' }}
            >
              📅 {t('booking.bookSlot') || 'Book OPD Appointment'} ➔
            </Link>
            <Link
              href={`/patient/queue/${facility.id}`}
              className="btn btn-secondary"
              style={{ flex: 1, minWidth: 200 }}
            >
              ⏱️ {t('queue.liveTracking') || 'Check Live Queue'}
            </Link>
          </div>
        </div>
      </div>
    </StateHandler>
  );
}
