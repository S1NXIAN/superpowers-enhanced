# Adaptive Zeus — Complexity-Aware Routing

**Date:** 2026-05-27
**Status:** Draft

## Problem

Zeus runs the full Superpowers workflow (brainstorming → writing-plans → subagent dispatch → reviews) on **every** task, regardless of complexity. For simple tasks like typo fixes, renames, or config changes, this wastes 16K–23K tokens per task on overhead that adds zero value.

## Goals

1. Save tokens by skipping heavy processes for simple tasks
2. Maintain full quality gates for complex tasks
3. Single agent — no agent-switching required
4. User override when auto-detection is wrong (`@quick` / `@full`)

## Non-Goals

- Not removing any quality gates from the full path
- Not changing the existing Zeus full-path behavior
- Not adding dependencies or new skills

## Design

### Complexity Classification

Zeus inspects the user's request **before any skill is loaded**, using a multi-signal heuristic:

| Signal | Simple (fast path) | Complex (full path) |
|--------|-------------------|---------------------|
| Files touched | ≤ 2 | ≥ 3 or new subsystem |
| Task keywords | "fix", "typo", "rename", "update", "bump", "refactor" | "implement", "add", "create", "design", "architect" |
| Security triggers | No T1-T3 match | Any T1-T3 match → force full |
| Cross-cutting | Single concern | New capability, integration |
| User annotation | `@quick` | `@full` |

### Fast Path (simple tasks)

```
User request
  → complexity check = "simple"
  → security triage (T1 halt, T2 halt, T3 warn)
  → TDD (write failing test, implement, verify)
  → Done
```

**Skipped:** brainstorming skill, writing-plans skill, subagent dispatch, deliberation gate, ASI loop, adversarial review, spec/code reviews.

**Still runs:** security triage, TDD (RED → GREEN → REFACTOR), verification, self-consistency.

### Full Path (complex tasks)

Identical to current Zeus behavior. No changes.

### User Overrides

- `@quick` — force fast path (bypasses heuristics)
- `@full` — force full path (bypasses heuristics)
- No annotation — Zeus decides via heuristics

### Security Guarantee

Security triage runs **before** the path decision. If T1 or T2 triggers fire, the task is forced to the full path regardless of other signals. The fast path never handles security-sensitive work.

### Token Savings (estimated)

| Task type | Before | After | Savings |
|-----------|--------|-------|---------|
| Typo fix | ~18K tokens | ~2K tokens | ~89% |
| Config change | ~18K tokens | ~3K tokens | ~83% |
| Rename/refactor | ~18K tokens | ~4K tokens | ~78% |
| Complex feature | ~30K tokens | ~30K tokens | 0% |
| Mixed day (80% simple) | ~100K tokens | ~35K tokens | ~65% |

## Implementation Plan

### Files to modify

1. **`agent/zeus.md`** — Add complexity classification step, fast path workflow, user override docs

### What changes in zeus.md

- **New top-level step:** Complexity Classification (before step 1)
- **Step 1 (conditional):** If complex → brainstorming as before. If simple → skip to fast path.
- **New section:** Fast Path Workflow
- **New section:** User Overrides (`@quick` / `@full`)
- **Principles:** Add note about complexity awareness
- All existing full-path steps remain unchanged

### What does NOT change

- `AGENTS.md` — stays as-is (Zeus references it, but the agent itself becomes adaptive)
- No new skills, no new files
- All existing behavior preserved for complex tasks

## Verification

1. Simple task test: "fix typo in README.md" → should skip brainstorming, go straight to TDD
2. Complex task test: "add OAuth login" → should run full Zeus pipeline
3. Override test: "@quick add OAuth" → should skip full pipeline despite complexity
4. Override test: "@full fix typo" → should run full pipeline despite simplicity
5. Security test: request touching auth/ secrets → force full path regardless
