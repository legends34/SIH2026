# Triage Evaluation & Safety Audit Report

**Date:** 2026-09-15T17:36:04.812Z  
**Evaluation Pipeline:** Lane C Deterministic Triage Engine  
**Total Fixtures Evaluated:** 46 cases across 3 datasets  

## 1. Executive Safety & Performance Summary

| Metric | Value | Gate Threshold | Status |
|---|---|---|---|
| **Emergency Recall** | **100.0%** | 100.0% | ✅ PASSED |
| **Emergency False Positive Rate** | **0.0%** | ≤ 5.0% | ✅ PASSED |
| **Non-Emergency Dept Accuracy** | **100.0%** | ≥ 80.0% | ✅ PASSED |
| **Overall Urgency Accuracy** | **100.0%** | ≥ 85.0% | ✅ PASSED |

## 2. Breakdown by Fixture File

| Fixture File | Cases | Emergency Recall | Dept Accuracy | Urgency Accuracy |
|---|---|---|---|---|
| `eval-cases.ts` | 30 | 100.0% | 100.0% | 100.0% |
| `holdout-cases.ts` | 10 | 100.0% | 100.0% | 100.0% |
| `red-team-cases.ts` | 6 | 100.0% | 100.0% | 100.0% |

## 3. Breakdown by Presentation Category

| Category | Cases | Urgency Match Rate | Dept Match Rate |
|---|---|---|---|
| `red_flag` | 18 | 100.0% | 100.0% |
| `near_miss` | 6 | 100.0% | 100.0% |
| `multilingual` | 6 | 100.0% | 100.0% |
| `negation` | 5 | 100.0% | 100.0% |
| `paediatric` | 5 | 100.0% | 100.0% |
| `obstetric` | 4 | 100.0% | 100.0% |
| `self_diagnosing` | 2 | 100.0% | 100.0% |

## 4. Discrepancy & Near-Miss Log (0 cases)

*Zero failing cases. All fixtures matched expected urgency and department targets perfectly.*

---
*Report generated deterministically by `src/lib/triage/eval/run.ts`*
