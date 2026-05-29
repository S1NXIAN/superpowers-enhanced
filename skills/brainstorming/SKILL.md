---
name: brainstorming
description: Elite architectural design gate. Turns rough requests into approved specs with failure-mode analysis.
---

# Brainstorming

Design for Scale. Design for Isolation.

## Hard Gates
1.  **Approval Required:** No code, no implementation plans until the spec is approved.
2.  **Scope Check:** If 4+ subsystems or 20+ tasks, decompose into sub-projects.
3.  **Failure-Mode Check:** You MUST state 3 ways the design could fail before asking for approval.

## Operational Checklist
1.  **Inspect Context:** Recent commits, current docs, and hot files.
2.  **Clarify Turn:** One Turn. Collect all questions. Use multiple-choice.
3.  **Propose Options:** Provide 3 approaches with trade-offs. Recommend the one with highest SNR.
4.  **Draft Spec:** Use the Failure-Mode Check to pressure-test the choice.
5.  **Self-Review:** Scan for TBDs, contradictions, or over-engineering.

## Design Patterns
- **Small Units:** One purpose, defined interfaces.
- **Minimal Surface Area:** Changes should not require coordinating across many files.
- **Existing Alignment:** Match the project's established style.

## Rationalization Table

| Temptation | Danger |
| :--- | :--- |
| "This is too simple to design" | Unexamined assumptions cost 10x more to fix in implementation. |
| "I'll just explain one approach" | Single-path reasoning leads to suboptimal architecture. |
| "I'll ask questions Turn-by-Turn" | Wastes token efficiency and slows the developer. |

## Exit
Invoke `writing-plans`.
