'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppState } from '@/lib/state/app-state';
import { UrgencyBadge, FacilityTierBadge } from '@/components/ui/badge';
import { EmergencyOverlay } from '@/components/ui/emergency-overlay';
import { HERO } from '@/lib/mock-data/hero';
import type { TriageResult, UrgencyBand } from '@/types';
import { StateHandler } from '@/components/ui/states';

export default function TriageResultPage() {
  const { t, facilities } = useAppState();
  const [result, setResult] = useState<(TriageResult & { patientName?: string; selectedSymptoms?: string[] }) | null>(null);
  const [showEmergencyOverlay, setShowEmergencyOverlay] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('demo.triage_result');
      if (stored) {
        const parsed = JSON.parse(stored);
        setResult(parsed);
        if (parsed.urgency === 'emergency') {
          setShowEmergencyOverlay(true);
        }
      } else {
        // Fallback default routine result
        const fallback: TriageResult = {
          urgency: 'routine',
          department: 'GEN_MED' as any,
          confidence: 0.9,
          recommendedFacilityIds: [HERO.phcId, HERO.chcId],
          firedRuleIds: [],
          matchedSymptomIds: ['cough'],
        };
        setResult(fallback);
      }
    } catch {
      // Storage unavailable
    }
  }, []);

  const urgency: UrgencyBand = result?.urgency ?? 'routine';
  const isEmergency = urgency === 'emergency';

  // Find recommended facilities
  const recommendedFacilities = facilities.filter((f) =>
    result?.recommendedFacilityIds?.includes(f.id)
  );

  const nearestFacility = recommendedFacilities[0] || facilities.find(f => f.id === HERO.phcId) || facilities[0];

  const urgencyTitles: Record<UrgencyBand, string> = {
    emergency: 'Immediate Medical Attention Required',
    urgent: 'See a Doctor Within 2 Hours',
    routine: 'Book an Appointment at Your Nearest OPD',
    'self-care': 'Rest and Home Care Guidance',
  };

  const urgencyGuidance: Record<UrgencyBand, string> = {
    emergency: 'Go immediately to the nearest emergency room or casualty ward.',
    urgent: 'Please visit a community health centre or hospital OPD today.',
    routine: 'Schedule an appointment at your primary health centre in the next few days.',
    'self-care': 'Watch symptoms carefully for 1–2 days. Visit the OPD if symptoms worsen.',
  };

  return (
    <StateHandler>
      <div className="triage-result-page" style={{ maxWidth: 800, margin: '0 auto' }}>
        {/* Emergency Modal Overlay (only when emergency triggered) */}
        {showEmergencyOverlay && isEmergency && (
          <EmergencyOverlay
            facilityName={nearestFacility?.name}
            facilityAddress={`${nearestFacility?.district}, ${nearestFacility?.taluka}`}
            onDismiss={() => setShowEmergencyOverlay(false)}
          />
        )}

        <div className="page-header">
          <Link href="/patient/triage" style={{ fontSize: '0.85rem', color: 'var(--primary-700)', fontWeight: 600 }}>
            ← {t('common.actions.back') || 'Back to Symptom Checklist'}
          </Link>
          <h1 className="page-title" style={{ marginTop: '0.5rem' }}>
            {t('triage.result.urgencyLabel') || 'Guidance & Recommended Care'}
          </h1>
        </div>

        {/* Triage Result Card */}
        <div className="card" data-testid="triage-result-card" style={{ borderLeft: `6px solid ${isEmergency ? 'var(--crimson-600)' : urgency === 'urgent' ? 'var(--amber-700)' : 'var(--primary-600)'}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)', textTransform: 'uppercase', fontWeight: 700 }}>
                {t('triage.result.urgencyLabel') || 'Assessed Urgency Level'}
              </span>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '0.25rem' }}>
                {urgencyTitles[urgency]}
              </h2>
            </div>

            <UrgencyBadge urgency={urgency} />
          </div>

          <p style={{ marginTop: '0.75rem', fontSize: '0.95rem', color: 'var(--slate-700)', lineHeight: 1.6 }}>
            {urgencyGuidance[urgency]}
          </p>

          {/* Department Recommendation */}
          <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'var(--slate-50)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--slate-200)' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-600)', textTransform: 'uppercase' }}>
              Recommended Department:
            </span>
            <p style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary-800)', marginTop: '0.15rem' }}>
              {result?.department === 'GEN_MED' ? 'General Medicine (OPD)' : result?.department === 'PAEDS' ? 'Paediatrics (Children)' : result?.department === 'EMERGENCY' ? 'Emergency / Casualty' : 'General OPD'}
            </p>
          </div>

          {/* Clinical Disclaimer (Safety Requirement) */}
          <div style={{ marginTop: '1.25rem', padding: '0.75rem', background: '#fef3c7', borderRadius: 'var(--radius-sm)', border: '1px solid #fde68a' }} data-testid="triage-disclaimer">
            <p style={{ fontSize: '0.85rem', color: '#92400e', fontWeight: 600 }}>
              ⚠️ {t('triage.result.disclaimer') || 'This guidance helps you reach the right government care. It is not a diagnosis. A qualified medical officer will examine you.'}
            </p>
          </div>
        </div>

        {/* Recommended Government Facilities */}
        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--slate-900)' }}>
            {t('triage.result.whereToGo') || 'Recommended Government Health Facilities'}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {(recommendedFacilities.length > 0 ? recommendedFacilities : [nearestFacility]).map((fac) => (
              <div key={fac.id} className="card" data-testid="triage-facility-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                      {fac.name}
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginTop: '0.15rem' }}>
                      📍 {fac.taluka}, {fac.district} ({fac.pincode})
                    </p>
                  </div>

                  <FacilityTierBadge tier={fac.tier} />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                  <Link
                    href={`/patient/book/${fac.id}`}
                    className="btn btn-primary"
                    style={{ flex: 1, minWidth: 140 }}
                  >
                    📅 {t('booking.bookSlot') || 'Book OPD Slot'}
                  </Link>
                  <Link
                    href={`/patient/facilities/${fac.id}`}
                    className="btn btn-secondary"
                    style={{ flex: 1, minWidth: 140 }}
                  >
                    ℹ️ {t('facilities.viewDetail') || 'Facility Details'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </StateHandler>
  );
}
