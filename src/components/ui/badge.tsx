import React from 'react';
import type { UrgencyBand, FacilityTier, StockStatus, ComplaintStatus } from '@/types';

export function UrgencyBadge({ urgency, label }: { urgency: UrgencyBand; label?: string }) {
  const badgeClass = `urgency-badge badge-${urgency}`;
  const defaultLabels: Record<UrgencyBand, string> = {
    routine: 'Routine Care (नियमित देखभाल)',
    'self-care': 'Self-Care at Home (घरेलू देखभाल)',
    urgent: 'Urgent Care (त्वरित देखभाल)',
    emergency: 'Emergency — Immediate Care (आपातकालीन)',
  };
  return (
    <span
      className={badgeClass}
      data-testid="triage-urgency"
      data-urgency={urgency}
    >
      {label || defaultLabels[urgency] || urgency}
    </span>
  );
}

export function FacilityTierBadge({ tier }: { tier: FacilityTier }) {
  const labels: Record<FacilityTier, string> = {
    sub_centre: 'Sub-Centre (SC)',
    phc: 'Primary Health Centre (PHC)',
    chc: 'Community Health Centre (CHC)',
    sdh: 'Sub-Divisional Hospital (SDH)',
    dh: 'District Hospital (DH)',
  };

  return (
    <span className={`tier-badge tier-${tier}`} data-testid="facility-tier">
      {labels[tier] || tier.toUpperCase()}
    </span>
  );
}

export function StockIndicator({ status, medicineId, label }: { status: StockStatus; medicineId?: string; label?: string }) {
  const testId = medicineId ? `rx-stock-indicator-${medicineId}` : undefined;
  return (
    <span
      className={`stock-indicator stock-${status}`}
      data-testid={testId}
      data-stock-status={status}
    >
      <span className="stock-dot" />
      {label || (status === 'available' ? 'In Stock' : status === 'low' ? 'Low Stock' : 'Out of Stock')}
    </span>
  );
}

export function ComplaintStatusBadge({ status }: { status: ComplaintStatus }) {
  const labels: Record<ComplaintStatus, string> = {
    open: 'Open',
    in_review: 'In Review',
    escalated: 'Escalated',
    resolved: 'Resolved',
    closed: 'Closed',
  };

  return (
    <span
      className={`complaint-badge status-${status}`}
      data-testid="complaint-status"
      data-status={status}
    >
      {labels[status] || status}
    </span>
  );
}
