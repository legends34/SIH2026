import { describe, it, expect } from 'vitest';
import { triage } from '../triage';
import { EVAL_CASES } from '../__fixtures__/eval-cases';
import { HOLDOUT_CASES } from '../__fixtures__/holdout-cases';
import { RED_TEAM_CASES } from '../__fixtures__/red-team-cases';
import type { EvalCase } from '../__fixtures__/eval-cases';

/**
 * Department accuracy threshold for non-emergency presentations.
 * set by lane owner
 */
export const DEPT_ACCURACY_THRESHOLD = 0.8;

describe('CI Gate — Production Triage Safety & Accuracy', () => {
  const allFixtures: { name: string; cases: readonly EvalCase[] }[] = [
    { name: 'eval-cases', cases: EVAL_CASES },
    { name: 'holdout-cases', cases: HOLDOUT_CASES },
    { name: 'red-team-cases', cases: RED_TEAM_CASES },
  ];

  it('Emergency Recall = 100% across all fixture files (zero exceptions)', () => {
    let totalEmergencyCases = 0;
    let successfulEmergencyCalls = 0;
    const failures: Array<{ id: string; input: unknown; actual: string }> = [];

    for (const fixture of allFixtures) {
      for (const c of fixture.cases) {
        if (c.expected.urgency === 'emergency') {
          totalEmergencyCases++;
          const result = triage(c.input);
          if (result.urgency === 'emergency') {
            successfulEmergencyCalls++;
          } else {
            failures.push({ id: c.id, input: c.input, actual: result.urgency });
          }
        }
      }
    }

    expect(
      totalEmergencyCases,
      'Must have at least 15 emergency cases tested across fixtures'
    ).toBeGreaterThanOrEqual(15);

    expect(
      failures,
      `FATAL SAFETY VIOLATION: Emergency recall failure in: ${JSON.stringify(failures)}`
    ).toEqual([]);

    expect(successfulEmergencyCalls).toBe(totalEmergencyCases);
  });

  it('Department accuracy on non-emergency eval cases meets or exceeds DEPT_ACCURACY_THRESHOLD', () => {
    const nonEmergencyEvalCases = EVAL_CASES.filter(
      (c) => c.expected.urgency !== 'emergency'
    );
    expect(nonEmergencyEvalCases.length).toBeGreaterThan(0);

    let correctDeptCount = 0;
    const misroutedCases: Array<{
      id: string;
      expectedDept: string;
      actualDept: string;
    }> = [];

    for (const c of nonEmergencyEvalCases) {
      const result = triage(c.input);
      if (result.department === c.expected.department) {
        correctDeptCount++;
      } else {
        misroutedCases.push({
          id: c.id,
          expectedDept: c.expected.department,
          actualDept: result.department,
        });
      }
    }

    const accuracy = correctDeptCount / nonEmergencyEvalCases.length;

    expect(
      accuracy,
      `Non-emergency department accuracy was ${(accuracy * 100).toFixed(1)}%, below threshold ${(DEPT_ACCURACY_THRESHOLD * 100)}%. Misrouted: ${JSON.stringify(misroutedCases)}`
    ).toBeGreaterThanOrEqual(DEPT_ACCURACY_THRESHOLD);
  });
});
