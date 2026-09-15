'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppState } from '@/lib/state/app-state';
import { HERO } from '@/lib/mock-data/hero';
import type { Complaint, ComplaintCategory, SeverityLevel } from '@/types';
import { StateHandler } from '@/components/ui/states';

export default function ComplaintPreviewPage() {
  const router = useRouter();
  const { t, activePatient, addComplaint } = useAppState();

  const [narrative, setNarrative] = useState('Metformin was not available at the PHC for two weeks.');
  const [category, setCategory] = useState<ComplaintCategory>('medicine_unavailable');
  const [severity, setSeverity] = useState<SeverityLevel>('high');
  const [facilityId, setFacilityId] = useState('fac_0005');

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('demo.pending_complaint');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.narrative) setNarrative(parsed.narrative);
        if (parsed.category) setCategory(parsed.category);
        if (parsed.severity) setSeverity(parsed.severity);
        if (parsed.facilityId) setFacilityId(parsed.facilityId);
      }
    } catch {
      // Storage unavailable
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newComplaint: Complaint = {
      id: HERO.complaint.id,
      patientId: activePatient.id,
      facilityId: facilityId as any,
      category,
      severity,
      status: 'in_review',
      description: narrative,
      slaDueAt: '2026-09-17', // SLA due in 2 days
      timeline: [
        {
          status: 'open',
          note: 'Grievance lodged digitally by citizen via portal.',
          updatedAt: '2026-09-15T09:00:00+05:30',
          updatedByUserId: activePatient.id as any,
        },
        {
          status: 'in_review',
          note: 'Assigned to Block Medical Officer (BMO) Gurugram for emergency medicine stock reallocation.',
          updatedAt: '2026-09-15T09:30:00+05:30',
          updatedByUserId: HERO.doctor.userId,
        },
      ],
      createdAt: '2026-09-15T09:00:00+05:30',
    };

    addComplaint(newComplaint);
    router.push(`/patient/complaints/${newComplaint.id}`);
  };

  return (
    <StateHandler>
      <div className="complaint-preview-page" style={{ maxWidth: 680, margin: '0 auto' }}>
        <div className="page-header">
          <span style={{ fontSize: '0.85rem', color: 'var(--amber-900)', fontWeight: 700, textTransform: 'uppercase' }}>
            Review & Edit Form
          </span>
          <h1 className="page-title">
            {t('complaints.preview.title') || 'AI Grievance Structure Preview'}
          </h1>
          <p className="page-subtitle">
            Every categorized field is fully editable before final submission to district authorities
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card">
            {/* Original Citizen Narrative */}
            <div className="form-group">
              <label className="form-label">Original Statement / नागरिक विवरण</label>
              <div style={{ padding: '0.75rem', background: 'var(--slate-50)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--slate-200)', fontStyle: 'italic', color: 'var(--slate-800)' }}>
                "{narrative}"
              </div>
            </div>

            {/* Editable Category */}
            <div className="form-group">
              <label htmlFor="comp-category" className="form-label">
                Structured Category (Editable) / शिकायत श्रेणी
              </label>
              <select
                id="comp-category"
                className="form-select"
                data-testid="complaint-field-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
              >
                <option value="medicine_unavailable">Medicine Unavailable / दवा अनुपलब्धता</option>
                <option value="long_wait">Excessive Wait Time / लंबी प्रतीक्षा</option>
                <option value="staff_behaviour">Staff Behaviour / कर्मचारी व्यवहार</option>
                <option value="cleanliness">Cleanliness & Hygiene / स्वच्छता</option>
                <option value="equipment_failure">Equipment Issue / उपकरण समस्या</option>
                <option value="billing">Billing & Charges / शुल्क संबंधित</option>
                <option value="other">Other Grievance / अन्य</option>
              </select>
            </div>

            {/* Editable Severity */}
            <div className="form-group">
              <label htmlFor="comp-severity" className="form-label">
                Assessed Severity Level (Editable) / गंभीरता स्तर
              </label>
              <select
                id="comp-severity"
                className="form-select"
                data-testid="complaint-field-severity"
                value={severity}
                onChange={(e) => setSeverity(e.target.value as SeverityLevel)}
              >
                <option value="critical">Critical (Immediate Escalation)</option>
                <option value="high">High Priority (48h SLA)</option>
                <option value="medium">Medium Priority (72h SLA)</option>
                <option value="low">Low Priority (7-Day SLA)</option>
              </select>
            </div>

            {/* Estimated SLA Badge */}
            <div style={{ padding: '0.75rem 1rem', background: 'var(--amber-50)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--amber-300)' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--amber-900)', textTransform: 'uppercase' }}>
                Guaranteed Resolution Deadline (SLA)
              </span>
              <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--amber-900)', marginTop: '0.2rem' }}>
                ⏱️ Resolution Due: <strong>17 Sep 2026 (48 Hours)</strong>
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={() => router.back()}
              className="btn btn-secondary"
              style={{ flex: 1 }}
            >
              ← Edit Narrative
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 2, fontSize: '1.05rem' }}
            >
              {t('complaints.submit') || 'Submit Official Grievance'} ➔
            </button>
          </div>
        </form>
      </div>
    </StateHandler>
  );
}
