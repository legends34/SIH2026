/**
 * _rng.ts — Seeded PRNG utilities
 * Uses mulberry32 algorithm. No Math.random() anywhere.
 * // TODO(backend): endpoint pending Lane D
 */

/** mulberry32 seeded pseudo-random number generator */
function mulberry32(seed: number) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

/** Hash a string to a 32-bit seed integer */
function hashSeed(str: string): number {
  let h = 0x12345678;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i) | 0;
  }
  return h >>> 0;
}

export type Rng = ReturnType<typeof createRng>;

/** Create a reproducible RNG from a string seed */
export function createRng(seed: string) {
  const rand = mulberry32(hashSeed(seed));

  return {
    /** Raw float in [0, 1) */
    float: (): number => rand(),

    /** Integer in [min, max] inclusive */
    int: (min: number, max: number): number =>
      Math.floor(rand() * (max - min + 1)) + min,

    /** True with probability p (0–1) */
    chance: (p: number): boolean => rand() < p,

    /** Pick one element from an array */
    pick: <T>(arr: readonly T[]): T =>
      arr[Math.floor(rand() * arr.length)],

    /** Pick one element using relative weights */
    pickWeighted: <T>(items: readonly T[], weights: readonly number[]): T => {
      const total = weights.reduce((a, b) => a + b, 0);
      let r = rand() * total;
      for (let i = 0; i < items.length; i++) {
        r -= weights[i];
        if (r <= 0) return items[i];
      }
      return items[items.length - 1];
    },

    /** Return a shuffled copy of an array */
    shuffle: <T>(arr: readonly T[]): T[] => {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    },

    /** Pick n unique elements from an array */
    sample: <T>(arr: readonly T[], n: number): T[] => {
      const shuffled = [...arr];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled.slice(0, n);
    },
  };
}
