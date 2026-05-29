---
name: error-recovery
description: Maintains a project-level error→solution mapping to eliminate re-investigation costs for known platform/env issues.
---

# Error Recovery

Project-level memory for ghosts in the machine.

## Operational Rule
**Consult FIRST, Fix SECOND.** Before any debugging turn, Zeus MUST check for existing leads in `known-issues.md`.

## The Database: `known-issues.md`
- **Location:** Project root.
- **Scope:** Env errors, port conflicts, version skew, platform quirks (Mac vs Linux), flaky tests due to state, complex investigated bugs.
- **Hard Exclusions:** One-off logic bugs, README info, transient API failures.

## Verification Cycle
1.  **Phase 0 (Consult):** Search `known-issues.md` for error substrings.
2.  **Phase 1 (Apply):** If a match is found, try the documented **Fix** immediately.
3.  **Phase 2 (Capture):** If a new complex bug is solved, offer to record it in the registry using the canonical format.

## Entry Schema (Concise)
```markdown
## [Title]
**Error:** `Exact pattern`
**Root Cause:** One-sentence technical explanation.
**Fix:** 
```bash
[Exact command]
```
**Context:** When it fires (e.g., "Windows only", "After npm install").
```

## Maintenance Gates
- Max 50 entries. Prune stale ghosts.
- If a root cause is deleted from the codebase, the entry MUST be removed.

## Rationalization Table

| Temptation | Danger |
| :--- | :--- |
| "I'll just re-investigate to be sure" | Wastes 15 min of token/time cost. |
| "This bug is too small to record" | Small environment bugs recur most often. |
| "I'll record every bug" | Information noise. Stick to complex/platform issues. |
