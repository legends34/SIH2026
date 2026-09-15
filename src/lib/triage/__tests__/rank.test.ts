import { describe, it, expect } from 'vitest';
import { rankFacilities, calculateHaversineKm, RANKING_WEIGHTS } from '../rank';
import type { Facility } from '../types';

describe('Facility Ranking Suite', () => {
  const mockFacilities: Facility[] = [
    {
      id: 'fac_sc_01',
      name: 'Pimpri Sub-Centre',
      tier: 'SC',
      latitude: 18.5204,
      longitude: 73.8567, // 0 km from origin
      departments: ['GEN_MED'],
      dailyCapacity: 50,
    },
    {
      id: 'fac_phc_02',
      name: 'Chakan Primary Health Centre',
      tier: 'PHC',
      latitude: 18.65,
      longitude: 73.8567, // ~14.4 km north
      departments: ['GEN_MED', 'PAEDS', 'OBGYN'],
      dailyCapacity: 100,
    },
    {
      id: 'fac_chc_03',
      name: 'Manchar Community Health Centre',
      tier: 'CHC',
      latitude: 18.75,
      longitude: 73.8567, // ~25.5 km north
      departments: ['GEN_MED', 'PAEDS', 'OBGYN', 'EMERGENCY', 'SURGERY_GEN', 'ORTHO'],
      dailyCapacity: 200,
    },
  ];

  it('exports valid ranking weights', () => {
    expect(RANKING_WEIGHTS.emergency).toEqual({
      proximity: 0.7,
      capability: 0.3,
      availability: 0.0,
    });
    expect(RANKING_WEIGHTS.urgent).toEqual({
      proximity: 0.55,
      capability: 0.35,
      availability: 0.1,
    });
    expect(RANKING_WEIGHTS.routine).toEqual({
      proximity: 0.45,
      capability: 0.35,
      availability: 0.2,
    });
  });

  it('computes accurate Haversine distance', () => {
    const d = calculateHaversineKm(18.5204, 73.8567, 18.5204, 73.8567);
    expect(d).toBeCloseTo(0, 4);

    const d10km = calculateHaversineKm(18.5204, 73.8567, 18.6104, 73.8567);
    expect(d10km).toBeGreaterThan(9);
    expect(d10km).toBeLessThan(11);
  });

  it('hand-computed 3-facility example', () => {
    const origin = { latitude: 18.5204, longitude: 73.8567 };
    const ranked = rankFacilities({
      origin,
      department: 'PAEDS',
      urgency: 'routine',
      facilities: mockFacilities,
      loadByFacility: { fac_sc_01: 10, fac_phc_02: 20, fac_chc_03: 30 },
      limit: 3,
    });

    // fac_phc_02 directly offers PAEDS (cap 1.0, dist ~14.4km)
    // fac_sc_01 can stabilise/refer PAEDS (cap 0.5, dist 0km)
    // fac_chc_03 offers PAEDS (cap 1.0, dist ~25.5km)
    expect(ranked.length).toBe(3);
    expect(ranked).toContain('fac_phc_02');
    expect(ranked).toContain('fac_sc_01');
    expect(ranked).toContain('fac_chc_03');
  });

  it('emergency excludes an incapable facility even when it is the closest', () => {
    const origin = { latitude: 18.5204, longitude: 73.8567 }; // right at SC_01
    const incapableClosestSC: Facility = {
      id: 'fac_sc_zero',
      name: 'Zero Capability SC',
      tier: 'SC',
      latitude: 18.5204,
      longitude: 73.8567,
      departments: ['DERMATOLOGY'], // does NOT have EMERGENCY and SC cannot stabilise CARDIO
      dailyCapacity: 20,
    };

    const capableDistantCHC: Facility = {
      id: 'fac_chc_distant',
      name: 'Distant CHC',
      tier: 'CHC',
      latitude: 18.7204,
      longitude: 73.8567, // ~22 km away
      departments: ['EMERGENCY', 'CARDIO'],
      dailyCapacity: 200,
    };

    const ranked = rankFacilities({
      origin,
      department: 'CARDIO',
      urgency: 'emergency',
      facilities: [incapableClosestSC, capableDistantCHC],
      loadByFacility: {},
      limit: 3,
    });

    // Incapable SC must be completely excluded
    expect(ranked).not.toContain('fac_sc_zero');
    expect(ranked).toContain('fac_chc_distant');
  });

  it('sorts by capability then availability when no origin is provided', () => {
    const ranked = rankFacilities({
      department: 'SURGERY_GEN',
      urgency: 'urgent',
      facilities: mockFacilities,
      loadByFacility: { fac_chc_03: 190, fac_phc_02: 10 },
      limit: 3,
    });

    // CHC has direct capability (1.0), PHC can stabilise (0.5), SC has 0 capability for surgery
    expect(ranked[0]).toBe('fac_chc_03');
    expect(ranked[1]).toBe('fac_phc_02');
    expect(ranked).not.toContain('fac_sc_01');
  });

  it('deterministic order on tie-breaks', () => {
    const fA: Facility = {
      id: 'fac_aaa',
      name: 'Alpha Clinic',
      tier: 'PHC',
      latitude: 18.5,
      longitude: 73.8,
      departments: ['GEN_MED'],
      dailyCapacity: 100,
    };
    const fB: Facility = {
      id: 'fac_bbb',
      name: 'Beta Clinic',
      tier: 'PHC',
      latitude: 18.5,
      longitude: 73.8, // identical location and stats
      departments: ['GEN_MED'],
      dailyCapacity: 100,
    };

    const ranked = rankFacilities({
      origin: { latitude: 18.5, longitude: 73.8 },
      department: 'GEN_MED',
      urgency: 'routine',
      facilities: [fB, fA], // passed in reverse order
      loadByFacility: {},
      limit: 2,
    });

    // fac_aaa must come before fac_bbb due to alphabetical tie-breaking
    expect(ranked).toEqual(['fac_aaa', 'fac_bbb']);
  });
});
