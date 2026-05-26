---
name: social-accountability
description: "Use when dispatching sub-agents for implementation, spec review, or code quality review. Injects consequence-aware framing into prompts to reduce hallucination rates and increase analytical precision."
---

# Social Accountability Framing

## The Problem

Standard sub-agent prompts say things like "review this code for bugs." This produces acceptable
results, but empirical benchmarks show that LLMs respond to **consequence-weighted instructions**
with significantly lower hallucination rates and higher analytical depth. When an agent understands
the real-world cost of a mistake, it allocates more cognitive resources to verification.

## The Mechanism

Assign **clear downstream weight** and **severe failure definitions** to each role.

### Framing Template

Replace generic task descriptions with consequence-weighted framing:

```
An automated pipeline depends completely on your findings:
  ↓
You are the LAST quality gate before this ships.
  ↓
If you miss a [role-specific failure], it will [specific consequence].
  ↓
Your accuracy rating directly determines task progression.
```

### Role-Specific Framing

#### Implementer

```
An automated validation pipeline depends entirely on your implementation being correct.
Your code is scanned for vulnerabilities, style violations, and test coverage before it
proceeds to review.

If you introduce a bug:
  - A full validation cycle is wasted (minutes of compute)
  - A reviewer must diagnose and reject your work
  - You erode trust in your implementation accuracy

If you miss a test case:
  - An edge case ships without coverage
  - Future regressions go undetected

Your implementation accuracy rating determines whether you receive more complex tasks.

Your task:
[concrete task description]
```

#### Spec Reviewer

```
An automated auto-fix pipeline depends completely on your findings.

If you report a false positive:
  - A full validation cycle is wasted
  - An implementer spends time fixing something that wasn't broken
  - Pipeline throughput is reduced

If you miss a critical spec gap:
  - The implementation will ship without a required feature
  - Redeveloping it later costs 10x the effort
  - The deployment may be compromised

Your review accuracy rating determines task progression.

Review scope:
[concrete review instructions]
```

#### Code Quality Reviewer

```
Your review is the LAST quality gate before code ships to production.

If you approve code with structural issues:
  - Technical debt compounds in every future sprint
  - Other developers build on top of fragile patterns
  - Refactoring costs grow exponentially

If you reject code for style preferences:
  - You waste implementer time on cosmetic changes
  - You damage team velocity

Your precision rating (finding real issues without false positives) determines
whether you continue in this role.

Review scope:
[concrete review instructions]
```

## When to Use

This framing is **mandatory** when:

- Dispatching sub-agents in the subagent-driven-development workflow
- Running security-critical reviews
- Auditing production-bound code
- Working in a pipeline with automated gates

It is **optional** for:

- Throwaway prototypes
- Internal-only utilities
- Exploratory code

## Integration

This skill is invoked as part of subagent dispatch. The orchestrator:

1. Loads this skill to get the framing templates
2. Injects the appropriate framing into each subagent prompt
3. The framing goes at the TOP of the prompt (before task instructions)

For pre-written prompts in `prompts/`, the framing is already baked into the template.

## Red Flags

| Pattern | Problem |
|---------|---------|
| "The task is simple, the framing is overkill" | Habits form at every scale |
| Framing without concrete consequences | "Mistakes are bad" is meaningless |
| Same framing for every role | Each role has different failure modes |
| Framing at the END of the prompt | Read last = weighted least |
