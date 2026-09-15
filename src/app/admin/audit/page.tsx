'use client';

import React from 'react';
import Link from 'next/link';
import { auditLogs } from '@/lib/mock-data/audit';
import { StateHandler } from '@/components/ui/states';

export default function AdminAuditLogPage() {
  return (
    <StateHandler>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div className="page-header">
          <Link href="/admin" style={{ fontSize: '0.85rem', color: 'var(--primary-700)', fontWeight: 600 }}>
            ← Back to Admin Analytics
          </Link>
          <h1 className="page-title" style={{ marginTop: '0.5rem' }}>
            DPDP Compliance Immutable Audit Log
          </h1>
          <p className="page-subtitle">
            Cryptographically sealed access log for health record reads, prescription writes, and break-glass emergency events
          </p>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--slate-100)', borderBottom: '2px solid var(--slate-200)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Audit ID</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Action</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Actor</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Target Entity</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.slice(0, 10).map((log) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid var(--slate-200)' }}>
                    <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace' }}>{log.id}</td>
                    <td style={{ padding: '0.75rem 1rem', textTransform: 'uppercase', fontWeight: 700 }}>
                      <span style={{ color: log.action === 'break_glass' ? 'var(--crimson-800)' : 'var(--primary-800)' }}>
                        {log.action}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>{log.actorUserId}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>{log.targetEntityType} ({log.targetEntityId})</td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--slate-500)' }}>{log.occurredAt}</td>
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
