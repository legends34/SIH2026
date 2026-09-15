'use client';

import React, { useState } from 'react';
import { useAppState } from '@/lib/state/app-state';
import { HERO } from '@/lib/mock-data/hero';
import { medicines } from '@/lib/mock-data/inventory';
import { StockIndicator } from '@/components/ui/badge';
import { StateHandler } from '@/components/ui/states';

export default function PharmacistInventoryPage() {
  const { t, stockItems, updateStock } = useAppState();
  const [quantities, setQuantities] = useState<Record<string, string>>({});

  const handleQuantityChange = (medicineId: string, val: string) => {
    setQuantities((prev) => ({ ...prev, [medicineId]: val }));
  };

  const handleSaveStock = (medicineId: string) => {
    const qty = Number(quantities[medicineId] ?? 0);
    updateStock(medicineId, qty);
  };

  return (
    <StateHandler>
      <div className="pharmacist-page" style={{ maxWidth: 960, margin: '0 auto' }}>
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--primary-700)', fontWeight: 700, textTransform: 'uppercase' }}>
              Primary Health Centre, Wazirabad · Dispensary
            </span>
            <h1 className="page-title">
              {t('pharmacist.title') || 'Dispensary Stock & Ledger Management'}
            </h1>
            <p className="page-subtitle">
              Pharmacist: <strong>Mehta Ramesh · License #PH-HR-98412</strong>
            </p>
          </div>
        </div>

        {/* Stock Ledger Guidelines */}
        <div className="card" style={{ background: 'var(--primary-50)', border: '1px solid var(--primary-200)' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--primary-900)' }}>
            📦 <strong>Immutable Stock Ledger:</strong> Restocking entries create append-only audit events in the government ledger. Updates immediately sync to doctor OPD prescribers and citizen stock locators.
          </p>
        </div>

        {/* Inventory Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--slate-100)', color: 'var(--slate-700)', borderBottom: '2px solid var(--slate-200)' }}>
                  <th style={{ padding: '0.85rem 1rem' }}>Medicine Generic Name</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Category</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Current Stock</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Add / Update Quantity</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {medicines.map((med) => {
                  const stockRecord = stockItems.find(
                    (s) => s.facilityId === HERO.phcId && s.medicineId === med.id
                  );
                  // Default status for Metformin is 'out' initially
                  let status = stockRecord?.status || 'available';
                  if (med.id === HERO.medicine.id && !stockRecord) {
                    status = 'out';
                  }

                  const currentQty = stockRecord?.currentQuantity ?? (status === 'out' ? 0 : 150);

                  return (
                    <tr
                      key={med.id}
                      data-testid={`inventory-row-${med.id}`}
                      data-stock-status={status}
                      style={{ borderBottom: '1px solid var(--slate-200)', background: med.id === HERO.medicine.id ? '#fffde7' : 'transparent' }}
                    >
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <strong style={{ color: 'var(--slate-900)' }}>{med.genericName} {med.strength}</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', display: 'block' }}>
                          {med.dosageForm} · NLEM {med.nlemLevel}
                        </span>
                      </td>

                      <td style={{ padding: '0.85rem 1rem', color: 'var(--slate-600)' }}>
                        {med.therapeuticCategory}
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <strong style={{ fontSize: '1.05rem', color: status === 'out' ? 'var(--crimson-800)' : 'var(--slate-900)' }}>
                          {currentQty} units
                        </strong>
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <StockIndicator status={status} />
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <input
                          type="number"
                          className="form-input"
                          data-testid="inventory-quantity-input"
                          value={quantities[med.id] ?? ''}
                          onChange={(e) => handleQuantityChange(med.id, e.target.value)}
                          placeholder="e.g. 200"
                          style={{ minHeight: 36, padding: '0.35rem 0.6rem', width: 110 }}
                        />
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <button
                          type="button"
                          className="btn btn-primary"
                          data-testid="inventory-save"
                          onClick={() => handleSaveStock(med.id)}
                          style={{ minHeight: 36, padding: '0.35rem 0.8rem', fontSize: '0.8rem' }}
                        >
                          💾 Save
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </StateHandler>
  );
}
