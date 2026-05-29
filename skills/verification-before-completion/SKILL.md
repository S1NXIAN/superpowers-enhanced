---
name: verification-before-completion
description: Mandatory quality gate for every technical task. Proves success via command-line evidence.
---

# Verification Before Completion

Zero Claims. 100% Evidence.

## The Gate
Before saying "Done" or "Tests pass":
1.  Identify the proving command.
2.  Run the full command NOW.
3.  Report output and exit code verbatim.

## Verification Scenarios

### Bugfixes
Write test -> PASS -> Revert fix -> FAIL -> Restore fix -> PASS.
Verification is invalid if the test hasn't been observed failing.

### Configuration
Verify the **Outcome**, not the success message. If you changed a provider, verify the response contains the new provider's ID.

### Sub-Agents
Verify the **Diff**. Do not trust the summary. Read the code changed to ensure it matches the task intent.

## Self-Consistency (Gate 3)
For complex verification, generate 3 independent paths. If they don't agree, the evidence is insufficient.

## Rationalization Table

| Temptation | Risk |
| :--- | :--- |
| "It should pass now" | "Should" is the word of the mediocre. |
| "Trusting the agent report" | Blind trust leads to logic drift. |
| "Old output is enough" | Stale evidence is noise. |
