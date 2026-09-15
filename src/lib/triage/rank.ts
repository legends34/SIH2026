import type {
  DepartmentCode,
  Facility,
  FacilityLoadMap,
  FacilityTier,
  GeoLocation,
  UrgencyBand,
} from './types';

export interface RankFacilitiesOptions {
  origin?: GeoLocation;
  department: DepartmentCode;
  urgency: UrgencyBand;
  facilities: Facility[];
  loadByFacility: FacilityLoadMap;
  limit?: number;
}

export const RANKING_WEIGHTS: Record<
  UrgencyBand,
  { proximity: number; capability: number; availability: number }
> = {
  'self-care': { proximity: 0.45, capability: 0.35, availability: 0.2 },
  routine: { proximity: 0.45, capability: 0.35, availability: 0.2 },
  urgent: { proximity: 0.55, capability: 0.35, availability: 0.1 },
  emergency: { proximity: 0.7, capability: 0.3, availability: 0.0 },
};

/**
 * Tiers capable of stabilizing and referring patients if the department
 * is not directly offered at the facility. Derived from docs/triage/vocabulary.md.
 */
const STABILIZING_TIERS_BY_DEPARTMENT: Record<DepartmentCode, FacilityTier[]> = {
  EMERGENCY: ['SC', 'PHC'],
  GEN_MED: ['SC'],
  PAEDS: ['SC'],
  NEONATAL: ['PHC'],
  OBGYN: ['SC'],
  SURGERY_GEN: ['PHC'],
  ORTHO: ['PHC'],
  CARDIO: ['CHC', 'SDH'],
  NEURO: ['CHC', 'SDH'],
  ENT: ['SC'],
  OPHTHALMOLOGY: ['PHC'],
  DERMATOLOGY: ['SC'],
  PSYCHIATRY: ['PHC', 'CHC'],
  TOXICOLOGY: ['PHC'],
};

/** Haversine great-circle distance in kilometres */
export function calculateHaversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

interface ScoredFacility {
  facility: Facility;
  distanceKm?: number;
  proximityScore: number;
  capabilityScore: number;
  availabilityScore: number;
  totalScore: number;
}

export function rankFacilities(options: RankFacilitiesOptions): string[] {
  const {
    origin,
    department,
    urgency,
    facilities,
    loadByFacility,
    limit = 3,
  } = options;

  const weights = RANKING_WEIGHTS[urgency];
  const scoredList: ScoredFacility[] = [];

  for (const facility of facilities) {
    // 1. Determine capability
    let capabilityScore = 0;
    if (facility.departments.includes(department)) {
      capabilityScore = 1.0;
    } else {
      const stabilizingTiers = STABILIZING_TIERS_BY_DEPARTMENT[department] ?? [];
      if (stabilizingTiers.includes(facility.tier)) {
        capabilityScore = 0.5;
      }
    }

    // Facilities with 0 capability cannot treat or stabilize this department — exclude them
    if (capabilityScore === 0) {
      continue;
    }

    // 2. Determine proximity
    let proximityScore = 1.0;
    let distanceKm: number | undefined;

    if (origin) {
      distanceKm = calculateHaversineKm(
        origin.latitude,
        origin.longitude,
        facility.latitude,
        facility.longitude
      );
      // 1 at 0 km, falling linearly to 0 at 50 km
      proximityScore = Math.max(0, 1 - distanceKm / 50);
    }

    // 3. Determine availability
    const queueLength = loadByFacility[facility.id] ?? 0;
    const capacity = facility.dailyCapacity > 0 ? facility.dailyCapacity : 1;
    const availabilityScore = 1 - Math.min(1, queueLength / capacity);

    // 4. Calculate total score
    const totalScore =
      weights.proximity * proximityScore +
      weights.capability * capabilityScore +
      weights.availability * availabilityScore;

    scoredList.push({
      facility,
      distanceKm,
      proximityScore,
      capabilityScore,
      availabilityScore,
      totalScore,
    });
  }

  // 5. Sort candidates
  scoredList.sort((a, b) => {
    if (origin) {
      // Primary: total score descending
      if (Math.abs(b.totalScore - a.totalScore) > 1e-6) {
        return b.totalScore - a.totalScore;
      }
      // Tie-break 1: nearer distance first
      const distA = a.distanceKm ?? 0;
      const distB = b.distanceKm ?? 0;
      if (Math.abs(distA - distB) > 1e-6) {
        return distA - distB;
      }
      // Tie-break 2: lower FacilityId lexicographically
      return a.facility.id.localeCompare(b.facility.id);
    } else {
      // No origin: sort by capability, then availability, then lower FacilityId
      if (Math.abs(b.capabilityScore - a.capabilityScore) > 1e-6) {
        return b.capabilityScore - a.capabilityScore;
      }
      if (Math.abs(b.availabilityScore - a.availabilityScore) > 1e-6) {
        return b.availabilityScore - a.availabilityScore;
      }
      return a.facility.id.localeCompare(b.facility.id);
    }
  });

  return scoredList.slice(0, limit).map((s) => s.facility.id);
}
