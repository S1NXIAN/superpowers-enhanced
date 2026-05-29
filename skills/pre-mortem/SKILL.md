---
name: pre-mortem
description: Use before starting complex or high-risk work to identify failure modes before they happen. Imagine the work has already failed, then work backwards to find what went wrong. Do NOT use for simple, well-understood tasks.
---

# Pre-Mortem

## Overview

A pre-mortem is the mirror of a retrospective: instead of analyzing a failure that already happened, imagine the work has already failed and work backwards to identify why.

**Core principle:** Assume failure. Ask "what could go wrong?" before it does. The answer is almost always something you wouldn't have thought of otherwise.

**Announce at start:** "I'm running a pre-mortem on this work."

## When to Use

**Use this when:**
- Starting complex multi-file work
- Making changes to critical paths (auth, data, payment, security)
- Modifying core infrastructure (database, deployment, API layer)
- The work has high cost of failure (hard to roll back)
- The work involves external integrations or unfamiliar APIs
- After `deliberation-gate` outputs PROCEED — validate execution risk

**Don't use when:**
- Simple, one-file, well-understood changes
- After the work is already done (use `retrospective` instead)
- The work is a rollback or revert (the risk was already realized)
- The task is purely mechanical (rename, typo fix, config change)

## The Process

### Phase 1: State the Premise

Define the work in one sentence:

```
We are going to [do X] and it has failed completely. What went wrong?
```

### Phase 2: Imagine Failures

Without filtering, list failure modes across categories:

| Category | Examples |
|----------|----------|
| **Technical** | Bug in new code, performance regression, edge case not handled |
| **Integration** | API changed without notice, dependency broke, lockfile conflict |
| **Assumption** | We assumed X but Y is true, wrong interpretation of requirements |
| **Timing** | Takes longer than expected, blocks other work, misses deadline |
| **Recovery** | Can't roll back cleanly, migration can't be reversed, data loss |

### Phase 3: Identify the Top 3 Risks

From the list, pick the 3 most likely or most damaging:

```
1. [Risk] → [Mitigation or explicit acceptance]
2. [Risk] → [Mitigation or explicit acceptance]
3. [Risk] → [Mitigation or explicit acceptance]
```

### Phase 4: Decide

| Verdict | Action |
|---------|--------|
| **PROCEED** | Risks are understood and mitigated. Start work. |
| **RETHINK** | One or more risks require a different approach. Return to deliberation-gate or brainstorming. |

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Skipping because "it's just a small change" | Small changes in critical paths cause big failures. |
| Only listing technical failures | Assumptions and integration risks are equally dangerous. |
| Generating risks without mitigations | Every risk needs either a mitigation or an explicit acceptance. |
| Letting fear block all work | Pre-mortem reveals risks so you can address them, not avoid them. |

## Integration

**Used before:**
- `writing-plans` — identify risks before planning the implementation sequence
- `subagent-driven-development` — check for integration risks before dispatching parallel tasks
- `dependency-management` — before major version upgrades with migration or breaking-change risk
- `brainstorming` — during design exploration, identify failure modes before committing to a direction

**Used after:**
- `deliberation-gate` — if PROCEED, run pre-mortem to examine execution risk (deliberation evaluated the approach, pre-mortem evaluates the execution)

**Related skills:**
- `deliberation-gate` — evaluates which approach to take (pre-mortem assumes approach is chosen and looks at execution risk)
- `retrospective` — the mirror skill, used after failures instead of before
