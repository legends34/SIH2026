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
        <div className="card" style={{ background: 'var(--primary-50)', border: '1px solid var(--primary-200)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-800)', textTransform: 'uppercase' }}>
                National List of Essential Medicines (NLEM)
              </span>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-900)' }}>
                {selectedMed.genericName} {selectedMed.strength}
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>
                {selectedMed.dosageForm} · Category: {selectedMed.therapeuticCategory}
              </p>
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, padding: '0.3rem 0.6rem', background: 'var(--white)', borderRadius: 'var(--radius-sm)', color: 'var(--primary-800)' }}>
              NLEM Level: {selectedMed.nlemLevel}
            </span>
          </div>
        </div>
      )}

      {/* Stock at Nearby Government Facilities */}
      <div style={{ marginTop: '1.5rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--slate-900)' }}>
          Availability at Nearby Government Facilities
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {facilityStockList.map(({ facility, status, distanceKm }) => (
            <div
              key={facility.id}
              className="card"
              data-testid={`medicine-result-${facility.id}`}
              data-stock-status={status}
              style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <strong style={{ fontSize: '1.05rem', color: 'var(--slate-900)' }}>
                    {facility.name}
                  </strong>
                  <FacilityTierBadge tier={facility.tier} />
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginTop: '0.2rem' }}>
                  📍 {facility.taluka}, {facility.district} · <strong>{distanceKm} km away</strong>
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <StockIndicator status={status} />
                {status === 'available' && (
                  <span style={{ fontSize: '0.8rem', color: 'var(--emerald-800)', fontWeight: 600 }}>
                    ✓ Dispensing Active
                  </span>
                )}
                {status === 'out' && (
                  <span style={{ fontSize: '0.8rem', color: 'var(--crimson-800)', fontWeight: 600 }}>
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
