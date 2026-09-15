/**
 * inventory.ts — Medicine catalogue + stock levels across all facilities
 * Hero medicine (med_0042, Metformin 500mg) must be OUT at fac_0005 and IN at fac_0004.
 * Stock currentQuantity is strictly derived from sum of ledger deltas.
 * // TODO(backend): GET /api/v1/inventory
 */

import type { Medicine, StockItem, LedgerEntry, StockStatus } from '@/types';
import { medicineId, facilityId } from './_ids';
import { at } from './_clock';
import { createRng } from './_rng';
import { HERO } from './hero';

const rng = createRng('inventory-v1');

export const LOW_STOCK_THRESHOLD = 20;
export const OUT_OF_STOCK_THRESHOLD = 0;

// ── 80 medicines from India's NLEM ──────────────────────────────────────────

export const medicines: Medicine[] = [
  { id: medicineId(1),  genericName: 'Paracetamol',        strength: '500 mg',   dosageForm: 'Tablet',   therapeuticCategory: 'Analgesic',          nlemLevel: 'P' },
  { id: medicineId(2),  genericName: 'Amoxicillin',         strength: '250 mg',   dosageForm: 'Capsule',  therapeuticCategory: 'Antibiotic',          nlemLevel: 'P' },
  { id: medicineId(3),  genericName: 'Amoxicillin',         strength: '500 mg',   dosageForm: 'Capsule',  therapeuticCategory: 'Antibiotic',          nlemLevel: 'P' },
  { id: medicineId(4),  genericName: 'Ibuprofen',           strength: '400 mg',   dosageForm: 'Tablet',   therapeuticCategory: 'NSAID',               nlemLevel: 'P' },
  { id: medicineId(5),  genericName: 'Ciprofloxacin',       strength: '500 mg',   dosageForm: 'Tablet',   therapeuticCategory: 'Antibiotic',          nlemLevel: 'S' },
  { id: medicineId(6),  genericName: 'Metronidazole',       strength: '400 mg',   dosageForm: 'Tablet',   therapeuticCategory: 'Antiprotozoal',       nlemLevel: 'P' },
  { id: medicineId(7),  genericName: 'Omeprazole',          strength: '20 mg',    dosageForm: 'Capsule',  therapeuticCategory: 'PPI',                 nlemLevel: 'P' },
  { id: medicineId(8),  genericName: 'Amlodipine',          strength: '5 mg',     dosageForm: 'Tablet',   therapeuticCategory: 'Antihypertensive',    nlemLevel: 'P' },
  { id: medicineId(9),  genericName: 'Amlodipine',          strength: '10 mg',    dosageForm: 'Tablet',   therapeuticCategory: 'Antihypertensive',    nlemLevel: 'P' },
  { id: medicineId(10), genericName: 'Atenolol',            strength: '50 mg',    dosageForm: 'Tablet',   therapeuticCategory: 'Beta Blocker',        nlemLevel: 'P' },
  { id: medicineId(11), genericName: 'Enalapril',           strength: '5 mg',     dosageForm: 'Tablet',   therapeuticCategory: 'ACE Inhibitor',       nlemLevel: 'P' },
  { id: medicineId(12), genericName: 'Losartan',            strength: '50 mg',    dosageForm: 'Tablet',   therapeuticCategory: 'ARB',                 nlemLevel: 'S' },
  { id: medicineId(13), genericName: 'Hydrochlorothiazide', strength: '25 mg',    dosageForm: 'Tablet',   therapeuticCategory: 'Diuretic',            nlemLevel: 'P' },
  { id: medicineId(14), genericName: 'Furosemide',          strength: '40 mg',    dosageForm: 'Tablet',   therapeuticCategory: 'Loop Diuretic',       nlemLevel: 'P' },
  { id: medicineId(15), genericName: 'Aspirin',             strength: '75 mg',    dosageForm: 'Tablet',   therapeuticCategory: 'Antiplatelet',        nlemLevel: 'P' },
  { id: medicineId(16), genericName: 'Atorvastatin',        strength: '10 mg',    dosageForm: 'Tablet',   therapeuticCategory: 'Statin',              nlemLevel: 'P' },
  { id: medicineId(17), genericName: 'Atorvastatin',        strength: '20 mg',    dosageForm: 'Tablet',   therapeuticCategory: 'Statin',              nlemLevel: 'P' },
  { id: medicineId(18), genericName: 'Glibenclamide',       strength: '5 mg',     dosageForm: 'Tablet',   therapeuticCategory: 'Antidiabetic',        nlemLevel: 'P' },
  { id: medicineId(19), genericName: 'Glimepiride',         strength: '2 mg',     dosageForm: 'Tablet',   therapeuticCategory: 'Antidiabetic',        nlemLevel: 'S' },
  { id: medicineId(20), genericName: 'Insulin Regular',     strength: '100 IU/ml',dosageForm: 'Injection',therapeuticCategory: 'Antidiabetic',        nlemLevel: 'P' },
  { id: medicineId(21), genericName: 'Levothyroxine',       strength: '50 mcg',   dosageForm: 'Tablet',   therapeuticCategory: 'Thyroid Hormone',     nlemLevel: 'P' },
  { id: medicineId(22), genericName: 'Prednisolone',        strength: '5 mg',     dosageForm: 'Tablet',   therapeuticCategory: 'Corticosteroid',      nlemLevel: 'P' },
  { id: medicineId(23), genericName: 'Dexamethasone',       strength: '4 mg',     dosageForm: 'Injection',therapeuticCategory: 'Corticosteroid',      nlemLevel: 'P' },
  { id: medicineId(24), genericName: 'Salbutamol',          strength: '100 mcg',  dosageForm: 'Inhaler',  therapeuticCategory: 'Bronchodilator',      nlemLevel: 'P' },
  { id: medicineId(25), genericName: 'Beclomethasone',      strength: '100 mcg',  dosageForm: 'Inhaler',  therapeuticCategory: 'Inhaled Steroid',     nlemLevel: 'S' },
  { id: medicineId(26), genericName: 'Cetirizine',          strength: '10 mg',    dosageForm: 'Tablet',   therapeuticCategory: 'Antihistamine',       nlemLevel: 'P' },
  { id: medicineId(27), genericName: 'Chlorpheniramine',    strength: '4 mg',     dosageForm: 'Tablet',   therapeuticCategory: 'Antihistamine',       nlemLevel: 'P' },
  { id: medicineId(28), genericName: 'Ranitidine',          strength: '150 mg',   dosageForm: 'Tablet',   therapeuticCategory: 'H2 Blocker',          nlemLevel: 'P' },
  { id: medicineId(29), genericName: 'Antacid',             strength: '—',        dosageForm: 'Suspension',therapeuticCategory:'Antacid',             nlemLevel: 'P' },
  { id: medicineId(30), genericName: 'ORS',                 strength: '—',        dosageForm: 'Sachet',   therapeuticCategory: 'Rehydration',         nlemLevel: 'P' },
  { id: medicineId(31), genericName: 'Zinc Sulphate',       strength: '20 mg',    dosageForm: 'Tablet',   therapeuticCategory: 'Supplement',          nlemLevel: 'P' },
  { id: medicineId(32), genericName: 'Iron + Folic Acid',   strength: '100+0.5mg',dosageForm: 'Tablet',   therapeuticCategory: 'Haematinic',          nlemLevel: 'P' },
  { id: medicineId(33), genericName: 'Calcium Carbonate',   strength: '500 mg',   dosageForm: 'Tablet',   therapeuticCategory: 'Supplement',          nlemLevel: 'P' },
  { id: medicineId(34), genericName: 'Vitamin D3',          strength: '60000 IU', dosageForm: 'Capsule',  therapeuticCategory: 'Supplement',          nlemLevel: 'S' },
  { id: medicineId(35), genericName: 'Albendazole',         strength: '400 mg',   dosageForm: 'Tablet',   therapeuticCategory: 'Anthelmintic',        nlemLevel: 'P' },
  { id: medicineId(36), genericName: 'Cotrimoxazole',       strength: '480 mg',   dosageForm: 'Tablet',   therapeuticCategory: 'Antibiotic',          nlemLevel: 'P' },
  { id: medicineId(37), genericName: 'Doxycycline',         strength: '100 mg',   dosageForm: 'Capsule',  therapeuticCategory: 'Antibiotic',          nlemLevel: 'S' },
  { id: medicineId(38), genericName: 'Azithromycin',        strength: '500 mg',   dosageForm: 'Tablet',   therapeuticCategory: 'Antibiotic',          nlemLevel: 'S' },
  { id: medicineId(39), genericName: 'Cefixime',            strength: '200 mg',   dosageForm: 'Capsule',  therapeuticCategory: 'Antibiotic',          nlemLevel: 'S' },
  { id: medicineId(40), genericName: 'Cloxacillin',         strength: '250 mg',   dosageForm: 'Capsule',  therapeuticCategory: 'Antibiotic',          nlemLevel: 'S' },
  { id: medicineId(41), genericName: 'Gentamicin',          strength: '80 mg',    dosageForm: 'Injection',therapeuticCategory: 'Antibiotic',          nlemLevel: 'S' },
  /** HERO MEDICINE — Metformin 500mg — out at fac_0005, available at fac_0004 */
  { id: HERO.medicine.id, genericName: 'Metformin',         strength: '500 mg',   dosageForm: 'Tablet',   therapeuticCategory: 'Antidiabetic',        nlemLevel: 'P' },
  { id: medicineId(43), genericName: 'Metformin',           strength: '850 mg',   dosageForm: 'Tablet',   therapeuticCategory: 'Antidiabetic',        nlemLevel: 'P' },
  { id: medicineId(44), genericName: 'Fluconazole',         strength: '150 mg',   dosageForm: 'Tablet',   therapeuticCategory: 'Antifungal',          nlemLevel: 'P' },
  { id: medicineId(45), genericName: 'Clotrimazole',        strength: '1%',       dosageForm: 'Cream',    therapeuticCategory: 'Antifungal',          nlemLevel: 'P' },
  { id: medicineId(46), genericName: 'Betamethasone',       strength: '0.1%',     dosageForm: 'Cream',    therapeuticCategory: 'Topical Steroid',     nlemLevel: 'P' },
  { id: medicineId(47), genericName: 'Silver Sulfadiazine', strength: '1%',       dosageForm: 'Cream',    therapeuticCategory: 'Burn Care',           nlemLevel: 'P' },
  { id: medicineId(48), genericName: 'Povidone Iodine',     strength: '5%',       dosageForm: 'Solution', therapeuticCategory: 'Antiseptic',          nlemLevel: 'P' },
  { id: medicineId(49), genericName: 'Hydrogen Peroxide',   strength: '3%',       dosageForm: 'Solution', therapeuticCategory: 'Antiseptic',          nlemLevel: 'P' },
  { id: medicineId(50), genericName: 'Spirit Surgical',     strength: '70%',      dosageForm: 'Solution', therapeuticCategory: 'Antiseptic',          nlemLevel: 'P' },
  { id: medicineId(51), genericName: 'Normal Saline (0.9%)',strength: '500 ml',  dosageForm: 'IV Fluid',  therapeuticCategory: 'Fluid Replacement',   nlemLevel: 'P' },
  { id: medicineId(52), genericName: 'Ringer Lactate',      strength: '500 ml',   dosageForm: 'IV Fluid',  therapeuticCategory: 'Fluid Replacement',   nlemLevel: 'P' },
  { id: medicineId(53), genericName: 'Dextrose 5%',         strength: '500 ml',   dosageForm: 'IV Fluid',  therapeuticCategory: 'Fluid Replacement',   nlemLevel: 'P' },
  { id: medicineId(54), genericName: 'Ondansetron',         strength: '4 mg',     dosageForm: 'Tablet',   therapeuticCategory: 'Antiemetic',          nlemLevel: 'P' },
  { id: medicineId(55), genericName: 'Metoclopramide',      strength: '10 mg',    dosageForm: 'Tablet',   therapeuticCategory: 'Antiemetic',          nlemLevel: 'P' },
  { id: medicineId(56), genericName: 'Domperidone',         strength: '10 mg',    dosageForm: 'Tablet',   therapeuticCategory: 'Antiemetic',          nlemLevel: 'P' },
  { id: medicineId(57), genericName: 'Diclofenac',          strength: '50 mg',    dosageForm: 'Tablet',   therapeuticCategory: 'NSAID',               nlemLevel: 'P' },
  { id: medicineId(58), genericName: 'Diclofenac',          strength: '75 mg/ml', dosageForm: 'Injection',therapeuticCategory: 'NSAID',               nlemLevel: 'P' },
  { id: medicineId(59), genericName: 'Tramadol',            strength: '50 mg',    dosageForm: 'Capsule',  therapeuticCategory: 'Opioid Analgesic',    nlemLevel: 'S' },
  { id: medicineId(60), genericName: 'Morphine',            strength: '10 mg',    dosageForm: 'Tablet',   therapeuticCategory: 'Palliative Care',     nlemLevel: 'T' },
  { id: medicineId(61), genericName: 'Diazepam',            strength: '5 mg',     dosageForm: 'Tablet',   therapeuticCategory: 'Anxiolytic',          nlemLevel: 'P' },
  { id: medicineId(62), genericName: 'Lorazepam',           strength: '2 mg',     dosageForm: 'Tablet',   therapeuticCategory: 'Anxiolytic',          nlemLevel: 'S' },
  { id: medicineId(63), genericName: 'Phenytoin',           strength: '100 mg',   dosageForm: 'Tablet',   therapeuticCategory: 'Antiepileptic',       nlemLevel: 'P' },
  { id: medicineId(64), genericName: 'Sodium Valproate',    strength: '200 mg',   dosageForm: 'Tablet',   therapeuticCategory: 'Antiepileptic',       nlemLevel: 'S' },
  { id: medicineId(65), genericName: 'Carbamazepine',       strength: '200 mg',   dosageForm: 'Tablet',   therapeuticCategory: 'Antiepileptic',       nlemLevel: 'P' },
  { id: medicineId(66), genericName: 'Amitriptyline',       strength: '25 mg',    dosageForm: 'Tablet',   therapeuticCategory: 'Antidepressant',      nlemLevel: 'P' },
  { id: medicineId(67), genericName: 'Fluoxetine',          strength: '20 mg',    dosageForm: 'Capsule',  therapeuticCategory: 'Antidepressant',      nlemLevel: 'S' },
  { id: medicineId(68), genericName: 'Haloperidol',         strength: '5 mg',     dosageForm: 'Tablet',   therapeuticCategory: 'Antipsychotic',       nlemLevel: 'P' },
  { id: medicineId(69), genericName: 'Olanzapine',          strength: '5 mg',     dosageForm: 'Tablet',   therapeuticCategory: 'Antipsychotic',       nlemLevel: 'S' },
  { id: medicineId(70), genericName: 'Rabies Vaccine',      strength: '2.5 IU',   dosageForm: 'Injection',therapeuticCategory: 'Vaccine',             nlemLevel: 'P' },
  { id: medicineId(71), genericName: 'Tetanus Toxoid',      strength: '0.5 ml',   dosageForm: 'Injection',therapeuticCategory: 'Vaccine',             nlemLevel: 'P' },
  { id: medicineId(72), genericName: 'Anti-Rabies Serum',   strength: '1000 IU',  dosageForm: 'Injection',therapeuticCategory: 'Immunoglobulin',     nlemLevel: 'S' },
  { id: medicineId(73), genericName: 'Anti-Snake Venom',    strength: '10 ml',    dosageForm: 'Injection',therapeuticCategory: 'Antiserum',          nlemLevel: 'P' },
  { id: medicineId(74), genericName: 'Adrenaline',          strength: '1 mg/ml',  dosageForm: 'Injection',therapeuticCategory: 'Emergency Drug',      nlemLevel: 'P' },
  { id: medicineId(75), genericName: 'Atropine',            strength: '0.6 mg/ml',dosageForm: 'Injection',therapeuticCategory: 'Emergency Drug',      nlemLevel: 'P' },
  { id: medicineId(76), genericName: 'Hydrocortisone',      strength: '100 mg',   dosageForm: 'Injection',therapeuticCategory: 'Emergency Drug',      nlemLevel: 'P' },
  { id: medicineId(77), genericName: 'Oxytocin',            strength: '5 IU/ml',  dosageForm: 'Injection',therapeuticCategory: 'Obstetric Drug',      nlemLevel: 'P' },
  { id: medicineId(78), genericName: 'Misoprostol',         strength: '200 mcg',  dosageForm: 'Tablet',   therapeuticCategory: 'Obstetric Drug',      nlemLevel: 'P' },
  { id: medicineId(79), genericName: 'Magnesium Sulphate',  strength: '50%',      dosageForm: 'Injection',therapeuticCategory: 'Obstetric Drug',      nlemLevel: 'P' },
  { id: medicineId(80), genericName: 'Methergine',          strength: '0.2 mg',   dosageForm: 'Tablet',   therapeuticCategory: 'Obstetric Drug',      nlemLevel: 'P' },
];

export const medicineMap = new Map(medicines.map(m => [m.id, m]));

// ── Stock items and ledger entries ──────────────────────────────────────────

export const stockItems: StockItem[] = [];
export const ledgerEntries: LedgerEntry[] = [];

let ledgerCounter = 1;

for (let facN = 1; facN <= 23; facN++) {
  const fid = facilityId(facN);

  for (const med of medicines) {
    const isHeroMedAtPHC = fid === HERO.medicine.outAtFacility && med.id === HERO.medicine.id;
    const isHeroMedAtCHC = fid === HERO.medicine.availableAtFacility && med.id === HERO.medicine.id;

    let targetQty = 0;
    let status: StockStatus = 'out';

    if (isHeroMedAtPHC) {
      // Hero story: Metformin OUT at Sunita's PHC
      targetQty = 0;
      status = 'out';
    } else if (isHeroMedAtCHC) {
      // Hero story: Metformin AVAILABLE at nearby CHC
      targetQty = 250;
      status = 'available';
    } else {
      // Distribution: ~10% out, ~25% low, ~65% available
      const r = rng.float();
      if (r < 0.10) {
        targetQty = 0;
        status = 'out';
      } else if (r < 0.35) {
        targetQty = rng.int(1, LOW_STOCK_THRESHOLD);
        status = 'low';
      } else {
        targetQty = rng.int(LOW_STOCK_THRESHOLD + 1, 350);
        status = 'available';
      }
    }

    // Create ledger entries that sum to targetQty
    if (targetQty === 0) {
      // Receipt followed by complete dispense
      const initial = rng.int(50, 150);
      const lId1 = ledgerCounter++;
      ledgerEntries.push({
        id: `led_${String(lId1).padStart(6, '0')}`,
        medicineId: med.id,
        facilityId: fid,
        eventType: 'receipt',
        delta: initial,
        idempotencyKey: `idem_${String(lId1).padStart(6, '0')}`,
        recordedAt: at(-45, '10:00'),
      });

      const lId2 = ledgerCounter++;
      ledgerEntries.push({
        id: `led_${String(lId2).padStart(6, '0')}`,
        medicineId: med.id,
        facilityId: fid,
        eventType: 'dispense',
        delta: -initial,
        idempotencyKey: `idem_${String(lId2).padStart(6, '0')}`,
        recordedAt: at(-rng.int(1, 10), '14:30'),
      });
    } else {
      // Receipt followed by partial dispense
      const extra = rng.int(20, 80);
      const initial = targetQty + extra;

      const lId1 = ledgerCounter++;
      ledgerEntries.push({
        id: `led_${String(lId1).padStart(6, '0')}`,
        medicineId: med.id,
        facilityId: fid,
        eventType: 'receipt',
        delta: initial,
        idempotencyKey: `idem_${String(lId1).padStart(6, '0')}`,
        recordedAt: at(-rng.int(30, 58), '09:30'),
      });

      const lId2 = ledgerCounter++;
      ledgerEntries.push({
        id: `led_${String(lId2).padStart(6, '0')}`,
        medicineId: med.id,
        facilityId: fid,
        eventType: 'dispense',
        delta: -extra,
        idempotencyKey: `idem_${String(lId2).padStart(6, '0')}`,
        recordedAt: at(-rng.int(1, 15), '15:00'),
      });
    }

    stockItems.push({
      medicineId: med.id,
      facilityId: fid,
      currentQuantity: targetQty,
      status,
      lastUpdatedAt: at(-rng.int(0, 3), '16:00'),
      lastIdempotencyKey: `idem_${String(ledgerCounter - 1).padStart(6, '0')}`,
    });
  }
}
