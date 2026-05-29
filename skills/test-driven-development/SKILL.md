---
name: test-driven-development
description: Strict behavioral verification. No production code without a failing test first.
---

# Test-Driven Development

Code is Guilty until Proven Green.

## The Iron Law
**Delete production code written before a test.** No exceptions.

## The Cycle
1.  **RED:** Write ONE failing test for ONE behavior.
2.  **FAIL:** Run and confirm failure reason (not a syntax error).
3.  **GREEN:** Write MINIMAL code to pass.
4.  **PASS:** Confirm target and suite pass.
5.  **REFACTOR:** Structural cleanup. Stay green.

## Quality Rules
- One behavior per test.
- Prefer real dependencies over mocks where possible.
- Cover error paths and boundaries.

## Rationalization Table

| Temptation | Danger |
| :--- | :--- |
| "I'll write tests after" | After never comes. Tests written after prove nothing. |
| "Simple code doesn't need tests" | Simple code lives longest and is broken most easily by "improvements." |
| "Tests slow me down" | Tests save 10x investigation time later. |

## Completion
Every behavior change MUST have an observed-failing regression test.
