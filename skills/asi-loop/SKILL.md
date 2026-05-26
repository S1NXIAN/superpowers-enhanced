---
name: asi-loop
description: "Use when fixing multiple security vulnerabilities, structural defects, or batch bugs that may share overlapping code. Implements ASI (Actionable Side Information) Batch Patching to prevent merge conflicts and regressions."
---

# ASI Loop — Actionable Side Information Batch Patching

## The Problem

When an auditor or review surfaces multiple issues, the natural instinct is to fix them all in one pass.
**Sequential batch-fixing is fragile when bugs share overlapping code.** An agent that tries to fix
Bug A and Bug B in the same file simultaneously nearly always:

- Creates merge conflicts with its own changes
- Nullifies one fix while applying another
- Introduces regression bugs from overlapping edits
- Cannot isolate which change caused a new failure

## The Protocol

### Step 1: Receive Issue List

You receive N issues from a scan, review, or audit. Each issue has:

- **ID** — unique identifier
- **File(s)** — affected file paths
- **Severity** — critical / high / medium / low
- **Description** — what is wrong
- **Dependencies** — issues that must be fixed first

### Step 2: Isolate One Issue

Select exactly **one** issue to fix. Priority order:

1. Critical severity, no dependencies
2. Issues that unblock others (dependency root)
3. Highest severity with fewest file overlaps
4. Smallest change surface

**NEVER** attempt to fix more than one issue simultaneously, even if they appear trivially independent.

### Step 3: Fix the Isolated Issue

- Apply the minimal change required
- Follow TDD: RED → GREEN → REFACTOR for this single fix
- Do not touch any file outside the issue's scope
- Do not "opportunistically" fix nearby code

### Step 4: Fast Re-test and Re-scan

Run tests and scans **only on the affected files**:

```bash
# Run tests for affected files
pytest tests/path/to/affected_test.py -v

# Run linter on affected files
ruff check path/to/affected.py

# Run type checker on affected files
mypy path/to/affected.py
```

**ALL tests must pass before proceeding.**

### Step 5: Dynamically Update Issue List

Before touching the next issue, recalculate:

1. **Re-scan fixed files** — does the fix resolve any other issues? Mark them as fixed.
2. **Re-check remaining issues** — did the fix change the code such that a remaining issue
   now requires a different approach? Update the description.
3. **Re-prioritize** — did the fix create new work items? Add them to the list.
4. **Check for conflicts** — do any remaining issues now touch code that was just changed?
   Flag them for extra care.

Remove the fixed issue from the list.

### Step 6: Cycle Counter — Anti-Infinite Loop Guard

Increment a cycle counter at the end of each iteration:

```
Current cycle: C
Max cycles:    4
```

If `C > 4` on the same macro-task (top-level issue set):

1. **Halt immediately.** Do not attempt cycle #5.
2. **Preserve the active diff state** — save `git diff` output (or equivalent patch file) so no work is lost.
3. **Prompt the user with a diagnostic summary:**

   ```
   [ASI-LOOP] Cycle limit reached (4/4) on: <macro-task description>
   
   Fixed so far:
     - Issue #<id>: <outcome>
     - Issue #<id>: <outcome>
   
   Remaining:
     - Issue #<id>: <reason not fixed>
     - Issue #<id>: <reason not fixed>
   
   Stuck on: Issue #<id> — <reason the loop keeps cycling>
   
   Suggested causes:
     a) Fix creates new issues faster than it resolves them
     b) Fix changes an interface used by 5+ files — waterfall effect
     c) Remaining issues depend on a structural change that cascades
   
   Patch preserved at: /tmp/asi-loop-patch-<timestamp>.diff
   ```

4. **Do not auto-resume.** Wait for user direction — they may accept partial progress, approve a broader refactor, or divide the work into independent sub-tasks.

### Step 7: Repeat

Return to Step 2 with the updated list. Continue until all issues are resolved.

## When to Use

The ASI Loop is **mandatory** when:

- 3+ issues affect the same file or module
- Issues have overlapping dependencies
- The fix for one issue could change the assumptions another issue was based on
- An earlier batch-fix attempt failed or caused regressions

It is **optional but recommended** for:

- 2 independent issues in separate files
- Cosmetic issues (naming, formatting)

## Red Flags — Stop and Reassess

| Pattern | Problem |
|---------|---------|
| "These are all independent, I can fix them together" | Overlapping edits are invisible until they conflict |
| "I'll fix the easy ones quickly, then tackle the hard one" | Easy fixes change state the hard one depends on |
| "Let me just also fix this nearby issue while I'm here" | Scope creep breaks isolation |
| Fixing issue #3 without re-checking issues #1, #2 first | Dynamic update step was skipped |
| "One more cycle should do it" (after cycle 4) | Coupling limit — fix cascades across files. Halt & escalate. |

## Checklist

- [ ] All N issues formally identified with files, severity, dependencies
- [ ] Exactly one issue isolated per iteration
- [ ] TDD cycle for the fix (RED → GREEN → REFACTOR)
- [ ] Fast re-test on affected files only (exit 0)
- [ ] Issue list updated and re-prioritized after each fix
- [ ] No scope creep during any iteration
- [ ] Cycle counter tracked (C ≤ 4); if limit reached, save diff + prompt user
