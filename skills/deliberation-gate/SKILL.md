---
name: deliberation-gate
description: Multi-perspective architecture audit for Tier-3 tasks. Simulates Skeptic, Minimalist, and Maintainer roles.
---

# Deliberation Gate

Conflict is clarity. Consensus is stability.

## The Iron Rule
**Tier-3 tasks REQUIRE Deliberation.** 
- Mandatory if: 4+ files, new subsystem, cross-cutting logic, or security trigger.
- Internal Reasoning: Simulate roles sequentially. No tools. No sub-agents.

## The Roles

1.  **SKEPTIC (Fault-Finder)**: Focus ONLY on risks and assumptions. Format: `Risk: [X] - [Impact]`. No solutions allowed.
2.  **MINIMALIST (Addition-Challenger)**: Cite concrete existing code that could be extended instead. Only accept new files if extension is impossible.
3.  **MAINTAINER (Horizon-Scanner)**: Evaluate 2-year debt, testability, and clarity for the next developer.

## Synthesis Protocol
Re-read roles in reverse (Maintainer &rarr; Minimalist &rarr; Skeptic) then synthesize:
- **Agreement**: Must be addressed in revised design.
- **Conflict**: Skeptic + Maintainer agreement trumps Minimalist.
- **Revised Direction**: 2-4 sentences incorporating all surviving critiques.

## Rationalization Table

| Temptation | Risk |
| :--- | :--- |
| "I've already decided on the design" | Confirmation bias leads to expensive architectural debt. |
| "Minimalist is being too strict" | Every line of code is a liability. Keep the footprint small. |
| "Skip roles for speed" | A 5-min role-play saves a 5-hour refactor next month. |

## Exit Criteria
User approval of the **Revised Direction**. Max 2 self-rejection cycles.
