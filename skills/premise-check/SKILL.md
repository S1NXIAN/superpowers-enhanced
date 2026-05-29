---
name: premise-check
description: Mandatory pre-design gate. Validates if the work should exist at all.
---

# Premise Check

Stop building unnecessary things with conviction.

## The Iron Rule
**X Shouldn't Exist** is always a valid architectural conclusion. Never treat a design request as an unconditional command.

## The Check (3 Brutal Questions)

1.  **Does the problem actually exist?**
    Check if existing mechanisms already handle this. If it's hypothetical, has it been proven?
2.  **Is the solution proportional?**
    Three lines of code don't need an abstraction. A rare edge case doesn't justify a framework.
3.  **What's the cost of NOT building this?**
    If the answer is "nothing breaks, it's just slightly less elegant," **SKIP IT**.

## Decision Logic
- **All Pass:** Proceed to Brainstorming. Note the justification.
- **Any Fail:** **STOP**. Say so directly to the user. Recommend against the work and provide the simpler alternative.

## Rationalization Table

| Temptation | Danger |
| :--- | :--- |
| "User asked for it, I must build it" | Effort flows into slop. You become a typist, not an engineer. |
| "I'll just add one small abstraction" | Abstractions are permanent maintenance debt. |
| "It's cleaner this way" | Clean code that doesn't need to exist is still technical debt. |
