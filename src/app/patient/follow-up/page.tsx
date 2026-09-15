'use client';

import React from 'react';
import Link from 'next/link';
import { StateHandler } from '@/components/ui/states';

export default function FollowUpPage() {
  return (
    <StateHandler>
      <div style={{ maxWidth: 740, margin: '0 auto' }}>
        <div className="page-header">
          <Link href="/patient" style={{ fontSize: '0.85rem', color: 'var(--primary-700)', fontWeight: 600 }}>
            ← Back to Patient Dashboard
          </Link>
          <h1 className="page-title" style={{ marginTop: '0.5rem' }}>
            Follow-Up & Chronic Disease Reminders
          </h1>
          <p className="page-subtitle">
            Scheduled return visits for hypertension and diabetes monitoring
          </p>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ fontSize: '1.1rem', color: 'var(--slate-900)' }}>Quarterly NCD Checkup (Ramesh Sharma)</strong>
              <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>Scheduled for 28 Sep 2026 · Primary Health Centre, Wazirabad</p>
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, padding: '0.25rem 0.6rem', background: 'var(--primary-50)', color: 'var(--primary-800)', borderRadius: 'var(--radius-sm)' }}>
              Scheduled
            </span>
          </div>
        </div>
      </div>
    </StateHandler>
  );
}
