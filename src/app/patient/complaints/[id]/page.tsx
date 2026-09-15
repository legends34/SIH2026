'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAppState } from '@/lib/state/app-state';
import { HERO } from '@/lib/mock-data/hero';
import { ComplaintStatusBadge } from '@/components/ui/badge';
import { StateHandler } from '@/components/ui/states';

export default function ComplaintTrackerPage() {
  const params = useParams();
  const complaintId = params?.id as string;
  const { t, complaints, facilities } = useAppState();

  const complaint = complaints.find((c) => c.id === complaintId) ?? {
    id: HERO.complaint.id,
    category: 'medicine_unavailable',
    severity: 'high',
    status: 'in_review',
    description: 'Metformin was not available at the PHC for two weeks.',
    facilityId: HERO.phcId,
    slaDueAt: '2026-09-17',
    timeline: [
      {
        status: 'open',
        note: 'Grievance lodged digitally by citizen via portal.',
        updatedAt: '2026-09-15T09:00:00+05:30',
        updatedByUserId: HERO.sunita.userId,
      },
      {
        status: 'in_review',
        note: 'Assigned to Block Medical Officer (BMO) Gurugram for stock reallocation.',
        updatedAt: '2026-09-15T09:30:00+05:30',
        updatedByUserId: HERO.doctor.userId,
      },
    ],
    createdAt: '2026-09-15T09:00:00+05:30',
  };

  const facility = facilities.find((f) => f.id === complaint.facilityId);

  return (
    <StateHandler>
      <div className="complaint-tracker-page" style={{ maxWidth: 740, margin: '0 auto' }}>
        <div style={{ marginBottom: '1rem' }}>
          <Link href="/patient" style={{ fontSize: '0.85rem', color: 'var(--primary-700)', fontWeight: 600 }}>
            ← {t('patientHome.title') || 'Back to Dashboard'}
          </Link>
        </div>

        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 700, textTransform: 'uppercase' }}>
                Grievance Tracking ID: {complaint.id}
              </span>
              <h1 className="page-title" style={{ fontSize: '1.5rem', marginTop: '0.2rem' }}>
                {complaint.category === 'medicine_unavailable' ? 'Medicine Shortage Grievance' : 'Citizen Service Grievance'}
              </h1>
              <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>
                Facility: <strong>{facility?.name || 'Primary Health Centre, Wazirabad'}</strong>
              </p>
            </div>

            <ComplaintStatusBadge status={complaint.status as any} />
          </div>

          <div style={{ margin: '1.25rem 0', padding: '1rem', background: 'var(--slate-50)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--slate-200)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 700 }}>CITIZEN STATEMENT</span>
            <p style={{ fontSize: '0.95rem', color: 'var(--slate-800)', marginTop: '0.25rem' }}>
              "{complaint.description}"
            </p>
          </div>

          {/* SLA Tracking Indicator */}
          <div
            className="sla-banner"
            data-testid="complaint-sla"
            style={{ padding: '0.85rem 1rem', background: 'var(--amber-50)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--amber-300)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}
          >
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--amber-900)' }}>
                GOVERNMENT SLA DEADLINE
              </span>
              <p style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--amber-900)' }}>
                Target Resolution: {complaint.slaDueAt || 'Tomorrow (17 Sep 2026)'}
              </p>
            </div>

            <span style={{ fontSize: '0.8rem', fontWeight: 700, padding: '0.3rem 0.6rem', background: 'var(--amber-200)', borderRadius: 'var(--radius-full)', color: 'var(--amber-900)' }}>
              ⏳ 48 Hours Remaining
            </span>
          </div>

          {/* Grievance Progression Timeline */}
          <div style={{ marginTop: '1.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--slate-900)' }}>
              Resolution Timeline / समाधान प्रगति
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {complaint.timeline.map((entry, idx) => (
                <div
                  key={idx}
                  className="card"
                  data-testid="complaint-timeline-entry"
                  style={{ padding: '0.9rem 1.1rem', borderLeft: '4px solid var(--primary-700)', marginBottom: 0 }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '0.95rem', color: 'var(--slate-900)' }}>
                      {entry.status === 'in_review' ? 'Under Official Review' : entry.status === 'escalated' ? 'Escalated to Officer' : entry.status === 'resolved' ? 'Grievance Resolved' : entry.status === 'closed' ? 'Grievance Closed' : 'Grievance Open'}
                    </strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                      {new Date(entry.updatedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--slate-700)', marginTop: '0.25rem' }}>
                    {entry.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </StateHandler>
  );
}
