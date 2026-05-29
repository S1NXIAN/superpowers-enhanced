---
name: writing-plans
description: Elite task decomposition. Produces atomic implementation plans with TDD ordering and verification commands.
---

# Writing Plans

Plan for Machine Execution. Minimize Ambiguity.

## Plan Header
Must include Goal, Architecture, Stack, and Assumptions (with exclusions).

## File Structure Map
Define every file change before tasks. Favor small, focused files with clear boundaries.

## Task Rules
1.  **RED-GREEN Sequence:** Every logic change requires a failing test first.
2.  **Atomic (2-5 min):** One action per task.
3.  **Verification Command:** Precise command and expected outcome required.
4.  **No Placeholders:** Never use "TBD", "update logic", or "add validation." Show the code.

## Self-Review Checklist
- [ ] **Spec Coverage:** Does every requirement have a task?
- [ ] **Zero Red-Flags:** No "TODO" or "Basic version."
- [ ] **Type Consistency:** Method names and types match across all tasks.

## Ready Gate
Invoke `subagent-driven-development` or `executing-plans`.

## Rationalization Table

| Temptation | Risk |
| :--- | :--- |
| "I'll update the logic in one task" | Unverifiable. High risk of regression. |
| "Write tests after implementation" | Tests will pass immediately, proving nothing. |
| "Add error handling later" | Placeholders in plans result in placeholders in production. |
