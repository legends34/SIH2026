'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppState } from '@/lib/state/app-state';
import { FacilityTierBadge } from '@/components/ui/badge';
import { StateHandler } from '@/components/ui/states';

export default function FacilitiesListPage() {
  const { t, facilities } = useAppState();
  const [filterTier, setFilterTier] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = facilities.filter((f) => {
    const matchesTier = filterTier === 'all' || f.tier === filterTier;
    const matchesSearch =
      searchQuery === '' ||
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.taluka.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTier && matchesSearch;
  });

  return (
    <StateHandler>
      <div className="facilities-page">
        <div className="page-header">
          <h1 className="page-title">
            {t('facilities.title') || 'Government Health Facilities'}
          </h1>
          <p className="page-subtitle">
            {t('facilities.subtitle') || 'Find nearby Primary Health Centres, Community Health Centres, and Hospitals'}
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="card" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <label htmlFor="fac-search" className="sr-only">Search facilities</label>
            <input
              id="fac-search"
              type="text"
              className="form-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by facility name, district, or block…"
            />
          </div>

          <div style={{ minWidth: 160 }}>
            <label htmlFor="fac-tier" className="sr-only">Filter by Tier</label>
            <select
              id="fac-tier"
              className="form-select"
              value={filterTier}
              onChange={(e) => setFilterTier(e.target.value)}
            >
              <option value="all">All Facility Tiers</option>
              <option value="phc">PHC (Primary Health Centre)</option>
              <option value="chc">CHC (Community Health Centre)</option>
              <option value="dh">District Hospital (DH)</option>
              <option value="sdh">Sub-Divisional Hospital (SDH)</option>
              <option value="sub_centre">Sub-Centre (SC)</option>
            </select>
          </div>
        </div>

        {/* Facility Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map((fac) => (
            <Link
              key={fac.id}
              href={`/patient/facilities/${fac.id}`}
              className="card card-clickable"
              data-testid={`facility-card-${fac.id}`}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                    {fac.name}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginTop: '0.2rem' }}>
                    📍 {fac.taluka}, {fac.district} · PIN {fac.pincode}
                  </p>
                </div>

                <FacilityTierBadge tier={fac.tier} />
              </div>

              <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {fac.departments.map((dept) => (
                  <span
                    key={dept}
                    style={{
                      fontSize: '0.75rem',
                      background: 'var(--slate-100)',
                      padding: '0.2rem 0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--slate-700)',
                    }}
                  >
                    {dept.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </StateHandler>
  );
}
