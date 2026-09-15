'use client';

import React from 'react';
import Link from 'next/link';
import { StateHandler } from '@/components/ui/states';

export default function DoctorReferralsPage() {
  return (
    <StateHandler>
      <div style={{ maxWidth: 840, margin: '0 auto' }}>
        <div className="page-header">
          <Link href="/doctor" style={{ fontSize: '0.85rem', color: 'var(--primary-700)', fontWeight: 600 }}>
            ← Back to Doctor OPD
          </Link>
          <h1 className="page-title" style={{ marginTop: '0.5rem' }}>
            Secondary & Tertiary Specialist Referrals
          </h1>
          <p className="page-subtitle">
            Transfer complex cardiac, surgical, and paediatric cases to CHC / District Hospitals
          </p>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ fontSize: '1.1rem', color: 'var(--slate-900)' }}>Cardiology Escalation · Ramesh Sharma</strong>
              <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>Referred to District Hospital Gurugram for Echocardiogram evaluation</p>
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, padding: '0.25rem 0.6rem', background: 'var(--emerald-50)', color: 'var(--emerald-800)', borderRadius: 'var(--radius-sm)' }}>
              Slot Booked
            </span>
          </div>
        </div>
      </div>
    </StateHandler>
  );
}
