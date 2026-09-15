'use client';

import React from 'react';
import Link from 'next/link';
import { users } from '@/lib/mock-data/users';
import { StateHandler } from '@/components/ui/states';

export default function AdminUsersPage() {
  return (
    <StateHandler>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div className="page-header">
          <Link href="/admin" style={{ fontSize: '0.85rem', color: 'var(--primary-700)', fontWeight: 600 }}>
            ← Back to Admin Analytics
          </Link>
          <h1 className="page-title" style={{ marginTop: '0.5rem' }}>
            Health Staff & District User Management
          </h1>
          <p className="page-subtitle">
            Role-based access control (RBAC) across doctors, pharmacists, and facility administrators
          </p>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--slate-100)', borderBottom: '2px solid var(--slate-200)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>User ID</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Phone Number</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Role</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Assigned Facility</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Department</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 10).map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--slate-200)' }}>
                    <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace' }}>{u.id}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>{u.phone}</td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--primary-800)' }}>{u.role}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>{u.facilityId || '—'}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>{u.departmentCode || '—'}</td>
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
