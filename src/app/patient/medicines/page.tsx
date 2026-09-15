'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAppState } from '@/lib/state/app-state';
import { HERO } from '@/lib/mock-data/hero';
import { medicines } from '@/lib/mock-data/inventory';
import { StockIndicator, FacilityTierBadge } from '@/components/ui/badge';
import { StateHandler } from '@/components/ui/states';

function MedicinesSearchInner() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('search') || '';
  const { t, stockItems, facilities } = useAppState();

  const [query, setQuery] = useState(initialQuery);

  // Filter medicines
  const matchingMedicines = medicines.filter((m) =>
    query === '' ||
    m.genericName.toLowerCase().includes(query.toLowerCase()) ||
    m.therapeuticCategory.toLowerCase().includes(query.toLowerCase())
  );

  const selectedMed = matchingMedicines[0] || medicines.find(m => m.id === HERO.medicine.id) || medicines[0]!;

  // Facilities stock map for selected medicine
  const facilityStockList = facilities.map((fac) => {
    const stockRecord = stockItems.find(
      (s) => s.facilityId === fac.id && s.medicineId === selectedMed.id
    );

    // Deterministic distance for hero facilities (phc: 0km, chc: 11km)
    let distanceKm = 15;
    if (fac.id === HERO.phcId) distanceKm = 0;
    else if (fac.id === HERO.chcId) distanceKm = HERO.medicine.distanceKm; // 11 km

    // Default status: out at PHC, available at CHC for hero Metformin
    let status: 'available' | 'low' | 'out' = stockRecord?.status || 'available';
    if (selectedMed.id === HERO.medicine.id) {
      if (fac.id === HERO.phcId) status = stockRecord?.status ?? 'out';
      if (fac.id === HERO.chcId) status = stockRecord?.status ?? 'available';
    }

    return {
      facility: fac,
      status,
      quantity: stockRecord?.currentQuantity ?? (status === 'available' ? 120 : 0),
      distanceKm,
    };
  });

  return (
    <div className="medicines-page" style={{ maxWidth: 840, margin: '0 auto' }}>
      <div className="page-header">
        <h1 className="page-title">
          {t('medicines.title') || 'Essential Medicine Stock Locator / दवा उपलब्धता'}
        </h1>
        <p className="page-subtitle">
          Check real-time availability of generic essential drugs across government dispensaries
        </p>
      </div>

      {/* Search Bar */}
      <div className="card">
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label htmlFor="med-search-input" className="form-label">
            Search by Medicine or Salt Name / दवा का नाम खोजें
          </label>
          <input
            id="med-search-input"
            type="text"
            className="form-input"
            data-testid="medicine-search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Metformin, Paracetamol, Amoxicillin, Amlodipine…"
          />
        </div>
      </div>

      {/* Medicine Overview */}
      {selectedMed && (
        <div className="card" style={{ background: 'var(--teal-50)', border: '1px solid var(--teal-100)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--teal-800)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                National List of Essential Medicines (NLEM)
              </span>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-900)', marginTop: '0.15rem' }}>
                {selectedMed.genericName} {selectedMed.strength}
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {selectedMed.dosageForm} · Category: {selectedMed.therapeuticCategory}
              </p>
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, padding: '0.35rem 0.75rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-xs)', color: 'var(--primary-900)', border: '1px solid var(--border-color)' }}>
              NLEM Level: {selectedMed.nlemLevel}
            </span>
          </div>
        </div>
      )}

      {/* Stock at Nearby Government Facilities */}
      <div style={{ marginTop: '1.5rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.85rem', color: 'var(--primary-900)' }}>
          Availability at Nearby Government Facilities
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {facilityStockList.map(({ facility, status, distanceKm }) => (
            <div
              key={facility.id}
              className="card"
              data-testid={`medicine-result-${facility.id}`}
              data-stock-status={status}
              style={{ padding: '1.1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <strong style={{ fontSize: '1.1rem', color: 'var(--primary-900)' }}>
                    {facility.name}
                  </strong>
                  <FacilityTierBadge tier={facility.tier} />
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  📍 {facility.taluka}, {facility.district} · <strong>{distanceKm} km away</strong>
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <StockIndicator status={status} />
                {status === 'available' && (
                  <span style={{ fontSize: '0.8rem', color: 'var(--emerald-800)', fontWeight: 700 }}>
                    ✓ Dispensing Active
                  </span>
                )}
                {status === 'out' && (
                  <span style={{ fontSize: '0.8rem', color: 'var(--crimson-800)', fontWeight: 700 }}>
                    ⚠️ Stockout Reported
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MedicinesSearchPage() {
  return (
    <StateHandler>
      <Suspense fallback={<div className="spinner" />}>
        <MedicinesSearchInner />
      </Suspense>
    </StateHandler>
  );
}
