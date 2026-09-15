'use client';

import React from 'react';
import Link from 'next/link';
import { StateHandler } from '@/components/ui/states';

export default function DiagnosticsPage() {
  return (
    <StateHandler>
      <div style={{ maxWidth: 740, margin: '0 auto' }}>
        <div className="page-header">
          <Link href="/patient" style={{ fontSize: '0.85rem', color: 'var(--primary-700)', fontWeight: 600 }}>
            ← Back to Patient Dashboard
          </Link>
          <h1 className="page-title" style={{ marginTop: '0.5rem' }}>
            Diagnostic & Pathology Orders
          </h1>
          <p className="page-subtitle">
            Track status of blood work, imaging, and microbiology test orders
          </p>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ fontSize: '1.1rem', color: 'var(--slate-900)' }}>Complete Blood Count (CBC) & HbA1c</strong>
              <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>Sample Collected · District Combined Hospital Ghaziabad</p>
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, padding: '0.25rem 0.6rem', background: 'var(--amber-50)', color: 'var(--amber-900)', borderRadius: 'var(--radius-sm)' }}>
              Processing
            </span>
          </div>
        </div>
      </div>
    </StateHandler>
  );
}
