'use client';

import React from 'react';
import { useAppState } from '@/lib/state/app-state';

interface EmergencyOverlayProps {
  onDismiss?: () => void;
  facilityName?: string;
  facilityAddress?: string;
}

export function EmergencyOverlay({ onDismiss, facilityName, facilityAddress }: EmergencyOverlayProps) {
  const { t } = useAppState();

  return (
    <div className="emergency-overlay-backdrop" data-testid="emergency-overlay">
      <div className="emergency-card" role="alert" aria-live="assertive">
        <div className="emergency-icon-pulse">🚨</div>
        
        <h1 className="emergency-headline">
          {t('triage.urgency.EMERGENCY.headline') || 'Immediate Medical Attention Required'}
        </h1>
        
        <p className="emergency-timeframe">
          {t('triage.urgency.EMERGENCY.timeframe') || 'Go immediately — every minute counts.'}
        </p>

        <div className="emergency-action-box">
          <p className="emergency-directive">
            {t('triage.urgency.EMERGENCY.whereToGo') || 'Go to the nearest emergency ward or call 108.'}
          </p>

          <a
            href="tel:108"
            className="call-108-button"
            data-testid="emergency-call-108"
          >
            <span className="phone-icon">📞</span>
            <span>{t('emergency.call108') || 'Call 108 Ambulance Now'}</span>
          </a>
        </div>

        {facilityName && (
          <div className="nearest-emergency-facility">
            <span className="facility-label">{t('emergency.nearestFacility') || 'Nearest Emergency Facility:'}</span>
            <strong className="facility-val">{facilityName}</strong>
            {facilityAddress && <span className="facility-addr">{facilityAddress}</span>}
          </div>
        )}

        <div className="emergency-footer">
          <p className="emergency-warning-signs">
            {t('triage.urgency.EMERGENCY.warnSigns') || 'Go sooner or call 108 if the situation gets worse.'}
          </p>

          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              className="emergency-dismiss-btn"
            >
              {t('common.actions.close') || 'Close Emergency View'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
