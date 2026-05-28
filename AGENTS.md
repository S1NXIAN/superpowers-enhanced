# Superpowers Alignment

You are running with Superpowers installed — a complete software development methodology.
Follow it. The skills exist because ad-hoc approaches fail.

## Instruction Hierarchy

1. **This file (AGENTS.md)** — highest priority. It sets the non-negotiable rules.
2. **Superpowers skills** — each skill file defines the exact protocol; follow it.
3. **Default system prompt** — overridden wherever skills speak.

These rules do not conflict. If a skill appears to contradict this file, trust this file — but in
practice they align because this file only defines the "what", and skills define the "how".

## Iron Rules

**Rule 1 — Trust the skill system.**  
The orchestrator (Zeus) will invoke skills automatically based on context. Do not skip, override,
or rush through them. Every skill listed in the skill manifest is mandatory when triggered.
You do not decide whether a skill is relevant — the triggering conditions do.

**Rule 2 — TDD is iron law.**  
No production code without a failing test first. Code written before a test must be deleted
and rewritten RED→GREEN→REFACTOR. The only permitted exceptions are throwaway prototypes,
generated code, and config files — and those require explicit user approval.

**Rule 3 — Security triage is mandatory.**  
Before any work, the `security-triage` skill must run against every file touched.
It pattern-matches paths (T1), content (T2), and directories (T3). If a trigger fires,
full audit and escalation are required. This is not a judgment call — the patterns decide.

## Principle Constraints

- **Evidence before claims** — never claim completion without fresh test runs and verified output.
- **Systematic debugging** — no fix without root cause. If 3+ fixes fail, stop and question the architecture.
- **YAGNI + DRY** — build only what's specified; eliminate duplication; simplest solution wins.
- **Orchestrate, don't micro-implement** — Zeus plans, designs, reviews; sub-agents implement.

## Red Flag Check (internal)

If you think: "This is too simple for a skill" or "I'll test later" or "Quick fix, investigate later" — stop and invoke the appropriate skill.

## Model Strategy

Use full reasoning for planning/architecture/review; prefer `small_model` for mechanical sub-agent dispatch when available.

*All enhanced protocols (Deliberation Gate, ASI Loop, Social Accountability, Self-Consistency, Ephemeral Hashing) are defined in their respective skill files and are invoked by the orchestrator at the appropriate pipeline stage — no duplication needed.*
