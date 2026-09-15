'use client';

import React, { useState } from 'react';
import { useAppState } from '@/lib/state/app-state';
import { getDistrictSummary, analytics } from '@/lib/mock-data/analytics';
import { StateHandler } from '@/components/ui/states';

export default function AdminAnalyticsPage() {
  const { t, complaints, facilities } = useAppState();
  const [activeTab, setActiveTab] = useState<'operational' | 'clinical'>('operational');

  const facilityIds = facilities.map((f) => f.id);
  const summary = getDistrictSummary('Gurugram', facilityIds);

  // Aggregated KPIs
  const totalFootfall = summary.totalFootfall || 1240;
  const avgWait = 24;
  const noShowRate = 0.12;
  const totalStockOuts = summary.totalStockOuts || 3;
  const openComplaintsCount = complaints.filter((c) => c.status === 'open' || c.status === 'in_review').length;

  return (
    <StateHandler>
      <div className="admin-analytics-page" style={{ maxWidth: 1040, margin: '0 auto' }}>
        <div className="page-header">
          <span style={{ fontSize: '0.85rem', color: 'var(--primary-700)', fontWeight: 700, textTransform: 'uppercase' }}>
            National Health Mission · Gurugram District Administration
          </span>
          <h1 className="page-title">
            {t('admin.title') || 'District Health Operations & Clinical Intelligence'}
          </h1>
          <p className="page-subtitle">
            Officer: <strong>Priya Singh (Chief Medical Officer / District Collectorate)</strong>
          </p>
        </div>

        {/* 5 Core KPI Tiles */}
        <div className="kpi-grid">
          <div className="kpi-card" data-testid="kpi-footfall">
            <span className="kpi-label">Today's Total Footfall</span>
            <p className="kpi-val">{totalFootfall}</p>
            <span style={{ fontSize: '0.75rem', color: 'var(--emerald-800)', fontWeight: 600 }}>
              ↑ 8.4% vs last week
            </span>
          </div>

          <div className="kpi-card" data-testid="kpi-avg-wait">
            <span className="kpi-label">Avg OPD Wait Time</span>
            <p className="kpi-val" style={{ color: avgWait > 30 ? 'var(--amber-900)' : 'var(--slate-900)' }}>
              {avgWait}m
            </p>
            <span style={{ fontSize: '0.75rem', color: 'var(--emerald-800)', fontWeight: 600 }}>
              Target: &lt; 30 mins
            </span>
          </div>

          <div className="kpi-card" data-testid="kpi-no-show">
            <span className="kpi-label">No-Show Rate</span>
            <p className="kpi-val">{Math.round(noShowRate * 100)}%</p>
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: 600 }}>
              SMS reminder active
            </span>
          </div>

          <div className="kpi-card" data-testid="kpi-stockouts">
            <span className="kpi-label">Active Stockouts</span>
            <p className="kpi-val" style={{ color: totalStockOuts > 0 ? 'var(--crimson-800)' : 'var(--slate-900)' }}>
              {totalStockOuts}
            </p>
            <span style={{ fontSize: '0.75rem', color: 'var(--crimson-800)', fontWeight: 600 }}>
              Action required
            </span>
          </div>

          <div className="kpi-card" data-testid="kpi-open-complaints">
            <span className="kpi-label">Open Grievances</span>
            <p className="kpi-val" style={{ color: openComplaintsCount > 0 ? 'var(--amber-900)' : 'var(--slate-900)' }}>
              {openComplaintsCount}
            </p>
            <span style={{ fontSize: '0.75rem', color: 'var(--amber-900)', fontWeight: 600 }}>
              Within 48h SLA
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tabs-nav">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'operational' ? 'active' : ''}`}
            data-testid="analytics-tab-operational"
            onClick={() => setActiveTab('operational')}
          >
            🏢 Operational Health Operations
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'clinical' ? 'active' : ''}`}
            data-testid="analytics-tab-clinical"
            onClick={() => setActiveTab('clinical')}
          >
            🩺 Clinical & Disease Surveillance
          </button>
        </div>

        {/* Operational Panel */}
        {activeTab === 'operational' && (
          <div data-testid="analytics-panel-operational" className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--slate-900)' }}>
              Facility Performance & Queue Load Breakdown
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginBottom: '1.25rem' }}>
              Monitoring 23 government healthcare units across Gurugram, Sohna, Pataudi, and Farrukhnagar.
            </p>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'var(--slate-100)', borderBottom: '2px solid var(--slate-200)' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Facility Name</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Tier</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Today's Footfall</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Avg Wait Time</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Stock Status</th>
                  </tr>
                </thead>
                <tbody>
                  {facilities.slice(0, 8).map((f) => (
                    <tr key={f.id} style={{ borderBottom: '1px solid var(--slate-200)' }}>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>{f.name}</td>
                      <td style={{ padding: '0.75rem 1rem', textTransform: 'uppercase', fontSize: '0.75rem' }}>{f.tier}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>{f.tier === 'dh' ? '340 patients' : f.tier === 'chc' ? '180 patients' : '95 patients'}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>{f.tier === 'dh' ? '32 mins' : '18 mins'}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span style={{ color: f.id === 'fac_0005' ? 'var(--amber-900)' : 'var(--emerald-800)', fontWeight: 700 }}>
                          {f.id === 'fac_0005' ? '⚠️ 1 Stockout (Metformin)' : '✓ Stock Adequate'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Clinical Panel */}
        {activeTab === 'clinical' && (
          <div data-testid="analytics-panel-clinical" className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--slate-900)' }}>
              Syndromic Disease Triage & Epidemiological Alerts
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginBottom: '1.25rem' }}>
              Real-time symptom clustering from citizen triage intakes across the district.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: 'var(--primary-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary-200)' }}>
                <strong style={{ color: 'var(--primary-900)', fontSize: '1rem' }}>Upper Respiratory Infections</strong>
                <p style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-800)', margin: '0.25rem 0' }}>42%</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--slate-600)' }}>Cough, Fever, Sore Throat presentations</span>
              </div>

              <div style={{ padding: '1rem', background: 'var(--amber-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--amber-300)' }}>
                <strong style={{ color: 'var(--amber-900)', fontSize: '1rem' }}>Hypertension & Diabetes</strong>
                <p style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--amber-900)', margin: '0.25rem 0' }}>26%</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--slate-600)' }}>NCD follow-ups & regular prescription refills</span>
              </div>

              <div style={{ padding: '1rem', background: 'var(--emerald-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--emerald-300)' }}>
                <strong style={{ color: 'var(--emerald-900)', fontSize: '1rem' }}>Maternal & Child Health</strong>
                <p style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--emerald-800)', margin: '0.25rem 0' }}>19%</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--slate-600)' }}>Immunizations & Antenatal checkups</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </StateHandler>
  );
}
