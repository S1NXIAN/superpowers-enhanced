---
name: asi-loop
description: Fix one overlapping-code issue per cycle. Required when 3+ issues share a file.
---

# ASI Loop

One Issue. One Cycle. Zero Conflicts.

## The Iron Rule
**NEVER fix >1 issue per cycle.** 
- Overlapping fixes cause regression cascades and nullification. 
- All operations must use the state machine driver: `scripts/asi.sh`.

## Operational Cycle

1.  **Phase 1 (Isolate)**: Run `asi.sh select`. Apply the priority waterfall (Critical &rarr; Dependencies &rarr; Severity).
2.  **Phase 2 (Bias Check)**: 
    - *Confirmation:* Why might this fix be incorrect?
    - *Anchoring:* If this is 3x harder, does priority shift?
3.  **Phase 3 (Fix)**: Reproducer-First TDD. Write failing test for the bug &rarr; Fix &rarr; PASS.
4.  **Phase 4 (Update)**: `asi.sh mark-fixed <id>` &rarr; `asi.sh complete-cycle`.

## Halt Guard
If `cycle >= 4`, stop and save the diff to `asi-loop-patch-<ts>.diff`. Do not auto-resume without user confirmation.

## Rationalization Table

| Temptation | Danger |
| :--- | :--- |
| "I'll fix these 2 related issues together" | High risk of merge conflict or side-effect regression. |
| "I'll skip the state machine" | Loss of situational awareness on the remaining debt. |
| "It's too slow to cycle" | Debugging a regression cascade takes 10x longer than cycling. |

## Exit
Complete until `asi.sh list-open` is empty.
