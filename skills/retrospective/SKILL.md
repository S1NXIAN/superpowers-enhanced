---
name: retrospective
description: Use after a significant incident, bug escape, plan failure, or session end to capture what went wrong, what went right, and what process changes are needed. Do NOT use for routine work that went smoothly.
---

# Retrospective

## Overview

Turn every failure into a system improvement. Without a retrospective, you fix the code but not the process — and the same type of failure repeats.

**Core principle:** Fix the process that allowed the failure. Code fixes are necessary but insufficient.

**Announce at start:** "I'm running a retrospective on this incident."

## When to Use

**Use this when:**
- A bug escaped to production or was found after merge
- A plan failed or had to be significantly reworked
- A dependency update caused unexpected breakage
- A decision proved wrong and had to be reversed
- At session end if the session involved significant work or failures

**Don't use when:**
- Everything went smoothly (no learning opportunity)
- The issue was purely mechanical (typo, simple mistake)
- The user is asking a question or exploring

## The Process

### Phase 1: Gather Facts

Build a concise timeline of what happened:

```
What: [Brief description of the incident]
When: [When was it introduced? When was it found?]
Impact: [What was the cost? Time lost, bugs caused, rework needed]
Detection: [How was it found? Test? User report? Random discovery?]
```

### Phase 2: Process Root Cause

Do NOT focus on the code bug — focus on why the process let it through:

| Question | Purpose |
|----------|---------|
| Which gate should have caught this? | Was TDD skipped? Was verification incomplete? Was triage missed? |
| Why did that gate fail? | Was the skill not loaded? Was the rule unclear? Was it a skill gap? |
| Is this a one-off or a pattern? | Have we seen this failure mode before? |
| What would prevent this specific failure? | Concrete change to a skill, rule, or workflow. |

### Phase 3: Action Items

Output exactly 1-3 concrete changes:

```
1. [Change to a skill, rule, or process] — prevents recurrence
2. [Optional: change to a tool or config] — strengthens the system
3. [Optional: documentation update] — captures the lesson
```

Each action item must be:
- **Specific** ("add a verification step for X" not "be more careful")
- **Actionable** (can be done now or next session)
- **Owned** (assigned to a skill, a rule, or agent instructions)

### Phase 4: Apply

If the action item is a change to a skill, rule, or config — apply it immediately. Do not defer.

If the action item is a change to a tool or test — create a task and either dispatch or queue it.

### Phase 5: Close

Document the retrospective in one line in the commit message or session log:

```
retro: [incident] → [action taken]
```

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Blaming the code instead of the process | Code bugs happen. What process let it through? |
| Too many action items | 1-3. More than 3 and none get done. |
| Action items that aren't specific | "Be more careful" is not an action item. |
| Deferring action items | If it's worth finding, it's worth fixing now. |
| Using retro for routine work | Only use when something went wrong or surprised you. |

## Integration

**Used after:**
- `systematic-debugging` — after root cause is found, run retro to capture the process gap
- `verification-before-completion` — if verification exposed a gap in test coverage or process
- `finishing-a-development-branch` — if the work involved surprises, failures, or rework
- `error-recovery` — after documenting the issue, evaluate if the process needs fixing

**Related skills:**
- `error-recovery` — documents platform-level issues in known-issues.md (complementary: retro fixes the process, error-recovery records the symptom)
- `pre-mortem` — run before complex work to prevent the failures retro would analyze
