---
name: deliberation-gate
description: "Use AUTOMATICALLY before drafting architecture for any complex tier-3 task. Spawns three stakeholder roles (Skeptic, Minimalist, Maintainer) to critique the core idea from competing lenses before the blueprint is written."
---

# Dynamic Deliberation — Multi-Perspective Architecture Audit

## The Problem

When given a complex task, the controller agent jumps straight into brainstorming a solution.
If the initial prompt is even slightly misframed, the agent blindly designs a massive system
on top of a flawed assumption. Research shows that forcing an agent to view a problem through
**competing lenses** before drafting a plan produces significantly more robust designs.

## The Deliberation Gate

Before writing any blueprint, architecture doc, or implementation plan for a **tier-3 task**
(complex, multi-file, cross-cutting), pause and spawn exactly **three** distinct virtual
stakeholder roles. Each gets exactly **one un-debated response** — no back-and-forth, no
rebuttal. Just their raw critique of the core idea.

### Role 1: The Skeptic

**Focus:** Why this architecture will fail at scale.

- Where are the concurrency bottlenecks?
- What race conditions exist in this design?
- Which assumptions break under load (10x, 100x, 1000x)?
- What happens at the failure boundaries? Are they clean?
- Which third-party dependencies become single points of failure?

The Skeptic does not propose alternatives. The Skeptic **only finds faults**.

### Role 2: The Minimalist

**Focus:** How to achieve the goal using existing project utilities.

- What already exists in this project that solves part of the problem?
- Can this be done without adding new dependencies?
- Which files can be extended instead of created?
- What is the smallest, most reversible change that delivers value?
- Which requirements are actually optional?

The Minimalist does not accept "new file" as the default answer. The Minimalist
**challenges every addition**.

### Role 3: The Maintainer

**Focus:** Long-term technical debt and testability.

- How hard is this to test? Where are the untestable seams?
- What tech debt does this design introduce?
- Will the next developer understand the architecture from reading the code?
- What happens when someone needs to modify this in 6 months?
- Which parts are most likely to be misunderstood and cause future bugs?
- Is there a simpler design that achieves the same goals with less surface area?

The Maintainer thinks in quarters and years, not minutes and hours.

## Gate Protocol

```
┌──────────────────────────────────────────────┐
│  1. Identify task complexity                  │
│     └─ Simple (tier-1) → skip gate            │
│     └─ Moderate (tier-2) → optional gate       │
│     └─ Complex (tier-3) → MANDATORY gate       │
├──────────────────────────────────────────────┤
│  2. Present core idea to all three roles       │
│     (same prompt, no framing bias)             │
├──────────────────────────────────────────────┤
│  3. Collect exactly one response per role      │
│     (no inter-role debate, no follow-ups)      │
├──────────────────────────────────────────────┤
│  4. Synthesize:                               │
│     └─ What survived all three critiques?      │
│     └─ What must change before proceeding?     │
│     └─ What is the revised architecture?       │
├──────────────────────────────────────────────┤
│  5. Present revised architecture for approval  │
│     (if user rejects, re-run gate with new     │
│      constraints before drafting again)        │
└──────────────────────────────────────────────┘
```

## Tier Classification

| Tier | Criterion | Gate |
|------|-----------|------|
| 1 | Single file, < 50 lines changed, no new deps | Skip |
| 2 | 2-3 files, existing patterns, optional new deps | Optional |
| 3 | 4+ files, new subsystem, cross-cutting concerns, new deps | **Mandatory** |

## When to Trigger

This skill activates **automatically** when:

- The user says "build a [system/platform/architecture]"
- The brainstorming phase reveals a cross-cutting design
- The task touches 4+ files or introduces a new subsystem
- Dependencies, databases, or external services are involved
- The initial prompt is vague or could be interpreted multiple ways

## Synthesis Format

After collecting all three responses, produce a structured synthesis:

```markdown
## Deliberation Synthesis

### Survived critique (keep)
- [finding 1]
- [finding 2]

### Must change (revise)
- [finding 1] → [revised approach]
- [finding 2] → [revised approach]

### Revised architecture
[2-3 sentence summary of the corrected approach]
```

## Red Flags

| Pattern | Problem |
|---------|---------|
| Skipping the gate because "I already understand the architecture" | Confirmation bias |
| Letting the Skeptic propose alternatives | Role scope creep |
| Dismissing the Minimalist as "it won't work" without evidence | Defaulting to complexity |
| Combining roles or having them debate | Loses independent perspective |
| Skipping synthesis ("the critiques speak for themselves") | No actionable output |
