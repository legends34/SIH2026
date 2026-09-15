import * as fs from 'fs';
import * as path from 'path';
import { triage } from '../triage';
import { EVAL_CASES } from '../__fixtures__/eval-cases';
import { HOLDOUT_CASES } from '../__fixtures__/holdout-cases';
import { RED_TEAM_CASES } from '../__fixtures__/red-team-cases';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface CaseResult {
  id: string;
  category: string;
  fixtureFile: string;
  inputSummary: string;
  expectedUrgency: string;
  actualUrgency: string;
  expectedDept: string;
  actualDept: string;
  firedRules: string[];
  urgencyMatch: boolean;
  deptMatch: boolean;
  emergencyRecallPass: boolean;
  isFalsePositiveEmergency: boolean;
}

export function runEvaluation() {
  const allSets = [
    { file: 'eval-cases.ts', cases: EVAL_CASES },
    { file: 'holdout-cases.ts', cases: HOLDOUT_CASES },
    { file: 'red-team-cases.ts', cases: RED_TEAM_CASES },
  ];

  const results: CaseResult[] = [];

  for (const set of allSets) {
    for (const c of set.cases) {
      const output = triage(c.input);

      const isExpectedEmergency = c.expected.urgency === 'emergency';
      const isActualEmergency = output.urgency === 'emergency';

      const urgencyMatch = output.urgency === c.expected.urgency;
      const deptMatch = output.department === c.expected.department;
      const emergencyRecallPass = !isExpectedEmergency || isActualEmergency;
      const isFalsePositiveEmergency = !isExpectedEmergency && isActualEmergency;

      results.push({
        id: c.id,
        category: c.category,
        fixtureFile: set.file,
        inputSummary: (c.input.freeText ?? c.input.symptomChips?.join(', ') ?? '').slice(0, 60),
        expectedUrgency: c.expected.urgency,
        actualUrgency: output.urgency,
        expectedDept: c.expected.department,
        actualDept: output.department,
        firedRules: output.firedRuleIds,
        urgencyMatch,
        deptMatch,
        emergencyRecallPass,
        isFalsePositiveEmergency,
      });
    }
  }

  // Aggregate metrics
  const totalCases = results.length;
  const emergencyCases = results.filter((r) => r.expectedUrgency === 'emergency');
  const nonEmergencyCases = results.filter((r) => r.expectedUrgency !== 'emergency');

  const emergencyRecall =
    emergencyCases.filter((r) => r.actualUrgency === 'emergency').length /
    (emergencyCases.length || 1);

  const emergencyFpRate =
    nonEmergencyCases.filter((r) => r.isFalsePositiveEmergency).length /
    (nonEmergencyCases.length || 1);

  const overallUrgencyAcc =
    results.filter((r) => r.urgencyMatch).length / totalCases;

  const nonEmergencyDeptAcc =
    nonEmergencyCases.filter((r) => r.deptMatch).length / (nonEmergencyCases.length || 1);

  // Markdown report generation
  const timestamp = new Date().toISOString();
  let md = `# Triage Evaluation & Safety Audit Report\n\n`;
  md += `**Date:** ${timestamp}  \n`;
  md += `**Evaluation Pipeline:** Lane C Deterministic Triage Engine  \n`;
  md += `**Total Fixtures Evaluated:** ${totalCases} cases across 3 datasets  \n\n`;

  md += `## 1. Executive Safety & Performance Summary\n\n`;
  md += `| Metric | Value | Gate Threshold | Status |\n`;
  md += `|---|---|---|---|\n`;
  md += `| **Emergency Recall** | **${(emergencyRecall * 100).toFixed(1)}%** | 100.0% | ${emergencyRecall === 1.0 ? '✅ PASSED' : '❌ FAILED'} |\n`;
  md += `| **Emergency False Positive Rate** | **${(emergencyFpRate * 100).toFixed(1)}%** | ≤ 5.0% | ${emergencyFpRate <= 0.05 ? '✅ PASSED' : '⚠️ REVIEW'} |\n`;
  md += `| **Non-Emergency Dept Accuracy** | **${(nonEmergencyDeptAcc * 100).toFixed(1)}%** | ≥ 80.0% | ${nonEmergencyDeptAcc >= 0.8 ? '✅ PASSED' : '❌ FAILED'} |\n`;
  md += `| **Overall Urgency Accuracy** | **${(overallUrgencyAcc * 100).toFixed(1)}%** | ≥ 85.0% | ${overallUrgencyAcc >= 0.85 ? '✅ PASSED' : '⚠️ REVIEW'} |\n\n`;

  md += `## 2. Breakdown by Fixture File\n\n`;
  md += `| Fixture File | Cases | Emergency Recall | Dept Accuracy | Urgency Accuracy |\n`;
  md += `|---|---|---|---|---|\n`;

  for (const set of allSets) {
    const fileCases = results.filter((r) => r.fixtureFile === set.file);
    const fileEmerg = fileCases.filter((r) => r.expectedUrgency === 'emergency');
    const recall =
      fileEmerg.filter((r) => r.actualUrgency === 'emergency').length / (fileEmerg.length || 1);
    const deptAcc = fileCases.filter((r) => r.deptMatch).length / fileCases.length;
    const urgAcc = fileCases.filter((r) => r.urgencyMatch).length / fileCases.length;

    md += `| \`${set.file}\` | ${fileCases.length} | ${(recall * 100).toFixed(1)}% | ${(deptAcc * 100).toFixed(1)}% | ${(urgAcc * 100).toFixed(1)}% |\n`;
  }

  md += `\n## 3. Breakdown by Presentation Category\n\n`;
  md += `| Category | Cases | Urgency Match Rate | Dept Match Rate |\n`;
  md += `|---|---|---|---|\n`;

  const categories = Array.from(new Set(results.map((r) => r.category)));
  for (const cat of categories) {
    const catCases = results.filter((r) => r.category === cat);
    const urgRate = catCases.filter((r) => r.urgencyMatch).length / catCases.length;
    const deptRate = catCases.filter((r) => r.deptMatch).length / catCases.length;
    md += `| \`${cat}\` | ${catCases.length} | ${(urgRate * 100).toFixed(1)}% | ${(deptRate * 100).toFixed(1)}% |\n`;
  }

  const failingCases = results.filter((r) => !r.urgencyMatch || !r.deptMatch);
  md += `\n## 4. Discrepancy & Near-Miss Log (${failingCases.length} cases)\n\n`;

  if (failingCases.length === 0) {
    md += `*Zero failing cases. All fixtures matched expected urgency and department targets perfectly.*\n`;
  } else {
    md += `| ID | Fixture | Input (Truncated) | Expected | Actual | Fired Rules |\n`;
    md += `|---|---|---|---|---|---|\n`;
    for (const f of failingCases) {
      md += `| \`${f.id}\` | \`${f.fixtureFile}\` | "${f.inputSummary}..." | ${f.expectedUrgency} / ${f.expectedDept} | ${f.actualUrgency} / ${f.actualDept} | ${f.firedRules.join(', ') || 'none'} |\n`;
    }
  }

  md += `\n---\n*Report generated deterministically by \`src/lib/triage/eval/run.ts\`*\n`;

  const outPath = path.resolve(__dirname, '../../../../docs/triage/eval-triage.md');
  fs.writeFileSync(outPath, md, 'utf-8');
  console.log(`Report generated successfully at: ${outPath}`);
  return { emergencyRecall, nonEmergencyDeptAcc, overallUrgencyAcc };
}

// This file is an ESM module (package.json has "type": "module"), so there's no
// CommonJS `require`/`module` to check against — it only ever runs via
// `npm run eval:triage`, so we just call it directly.
runEvaluation();