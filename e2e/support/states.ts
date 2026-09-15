/**
 * PROPOSED CONVENTION for Lane A (docs/qa/testid-requests.md §2):
 * in non-production builds, `?state=loading|empty|error` forces a screen into that state,
 * so every state in the Definition of Done is reachable by a test instead of by luck.
 */
export const FORCED_STATES = ['loading', 'empty', 'error'] as const;
export type ForcedState = (typeof FORCED_STATES)[number];

export function withState(path: string, state: ForcedState): string {
  return `${path}${path.includes('?') ? '&' : '?'}state=${state}`;
}
