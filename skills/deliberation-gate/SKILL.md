---
name: deliberation-gate
description: "MANDATORY before architecture for tier-3 tasks (4+ files, new subsystem, cross-cutting). Internal reasoning: simulate Skeptic, Minimalist, Maintainer. Maximum 2 user-rejection cycles. Security-triage override applies."
---

# Deliberation Gate — Multi-Perspective Architecture Audit

Internal reasoning exercise. Simulate all three roles sequentially in your own context. No external tools, no sub-agents.

**Cross-skill contract:** If `security-triage` flagged any file in this task as T1-T3, deliberation is mandatory regardless of tier. Confirm at start: has `security-triage` already run? If yes and it fired → skip the tier check, run deliberation.

## Tier Gate

- **Tier 1** (1 file, <50 lines, no new deps) → skip.
- **Tier 2** (2-3 files, existing patterns, optional new deps) → optional.
- **Tier 3** (4+ files OR new subsystem OR cross-cutting OR new dependency) → **MANDATORY**.

## Core Idea

Write **one paragraph of 3-5 sentences** stating what you intend to build. Must include: problem solved, main components, and how they connect. Must not include: bullet points, code snippets, library names, file paths, line counts, or questions.

## Three Roles

For each role, produce **one paragraph of 2-5 sentences** in response to the core idea. Generate all roles, then re-read them in reverse order (Maintainer → Minimalist → Skeptic) before synthesizing. Do not skip any critique; every role must produce at least one point.

### Skeptic — pure fault-finding, no alternatives
At most 5 bullet points. Each must name the **specific component/assumption from the core idea** that creates the risk, and why. Format:

- Risk: [component/interaction] — [consequence at 10×/100×/scale, or failure mode]
- Failure: [component/interaction] — [what breaks when assumption fails]

No solutions. No "we should".

### Minimalist — challenge every addition
At most 5 bullet points. Each challenge must cite a **concrete existing module, function, or pattern** that could be extended instead, and why extension is or is not sufficient. Format:

- Challenge: [existing code that covers this] — [why it cannot be extended, or what requirement forces the addition]

Accept a new dep/file only if extension would break a shared module used by 10+ features.

### Maintainer — 6-month and 2-year horizon
At most 5 bullet points, each anchored to a testability, debt, or clarity concern. Format:

- Test: [component] — [how it would be tested in one sentence]; if untestable, state the missing seam.
- Debt: [what degrades over time]
- Clarity: [what the next developer won't understand]

## Synthesis Protocol

After re-reading roles in reverse:

1. **Agreement** — what all three roles flagged. Must be addressed.
2. **Conflict resolution** — where roles disagree. Rule: if Skeptic and Maintainer agree, keep the critique. Minimalist alone doesn't veto. A single-role flag is deprioritized unless clearly critical.
3. **Revised direction** — 2-4 sentences incorporating all kept critiques. If impossible, generate a new core idea and re-run roles (this is a self-rejection cycle, doesn't count toward user limit).

Output:

```
## Deliberation Synthesis
### Core idea evaluated
[original or last revised paragraph]
### Survived critique (adopted)
- [finding] — from [role]
### Overruled (with rationale)
- [finding] — from [role]. Overruled because [reason].
### Revised direction
[2-4 sentences]
### Confidence
[High/Medium/Low] — one-sentence justification
### Unresolved questions (if any)
- [question]
```

## User Rejection

**Full rejection** → incorporate constraints, re-run from core idea. Maximum 2 cycles; after 2, state "returning to brainstorming" and stop.

**Partial acceptance** → apply revision to the direction, don't re-run. If the revision contradicts an adopted critique, flag the contradiction.

**Silence** → synthesis is final; do not implement without explicit approval.

## Post-Synthesis Verification (execute in this order)

1. Re-read role responses in reverse before synthesizing.
2. Confirm Minimalist cited concrete existing code for every challenge; if not, re-do that role.
3. Confirm security-triage override was checked; if it fired, deliberation was run regardless of tier.
