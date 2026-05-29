---
name: systematic-debugging
description: Hypothesis-driven root cause analysis. No fix without proven evidence.
---

# Systematic Debugging

Fix the Root, not the Symptom.

## The Iron Law
**No fix without evidence.** Masking an error is not solving it.

## Four Phases

### Phase 0: Knowledge Base
Consult `known-issues.md` FIRST. 10 min of investigation can be saved in 2 seconds.

### Phase 1: Investigation
- Reproduce the bug reliably. No reproduction = no fix.
- Backward Tracing: Trace from error back to source.
- Boundary Logging: Add logging at every component layer.

### Phase 2: Hypothesis (Self-Consistency)
Generate **5 independent leads**. 
- Majority vote decides the lead.
- Confidence must be > 60% to proceed.

### Phase 3: Minimal Fix
Apply ONE focused change. Re-run verification. 

## Rationalization Table

| Temptation | Danger |
| :--- | :--- |
| "I'll try a few things" | Shotgun debugging creates new ghosts. |
| "It's obviously this line" | Confidence is not evidence. Prove it with a log or test. |
| "Revert to last working state" | Wastes the opportunity to understand the failure. |

## Post-Fix
Offer to update `known-issues.md` if the bug was platform or env related.
