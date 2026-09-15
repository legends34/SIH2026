'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { StateHandler } from '@/components/ui/states';

export default function PatientTeleconsultPage() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <StateHandler>
      <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
        <div className="card" style={{ padding: '2rem' }}>
          <span style={{ fontSize: '3rem' }}>📹</span>
          <h1 className="page-title" style={{ marginTop: '0.5rem', fontSize: '1.5rem' }}>
            Teleconsultation Waiting Room
          </h1>
          <p className="page-subtitle" style={{ margin: '0.5rem 0 1.5rem' }}>
            Session #{id || 'tele_001'} · Dr. Rakesh Sharma will connect shortly
          </p>

          <div style={{ padding: '1rem', background: 'var(--primary-50)', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--primary-900)' }}>
              🎥 Video & Audio stream ready. Please ensure your microphone is enabled.
            </p>
          </div>

          <Link href="/patient" className="btn btn-secondary">
            ← Back to Patient Dashboard
          </Link>
        </div>
      </div>
    </StateHandler>
  );
}
