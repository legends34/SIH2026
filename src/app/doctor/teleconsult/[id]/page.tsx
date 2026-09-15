'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { StateHandler } from '@/components/ui/states';

export default function DoctorTeleconsultPage() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <StateHandler>
      <div style={{ maxWidth: 740, margin: '0 auto', textAlign: 'center' }}>
        <div className="card" style={{ padding: '2rem' }}>
          <span style={{ fontSize: '3rem' }}>👨‍⚕️</span>
          <h1 className="page-title" style={{ marginTop: '0.5rem', fontSize: '1.5rem' }}>
            Doctor Teleconsultation Room
          </h1>
          <p className="page-subtitle" style={{ margin: '0.5rem 0 1.5rem' }}>
            Remote consultation call for session #{id || 'tele_001'}
          </p>

          <div style={{ padding: '1rem', background: 'var(--emerald-50)', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--emerald-900)' }}>
              🟢 Secure WebRTC connection established with patient terminal.
            </p>
          </div>

          <Link href="/doctor" className="btn btn-secondary">
            ← Back to Doctor OPD
          </Link>
        </div>
      </div>
    </StateHandler>
  );
}
