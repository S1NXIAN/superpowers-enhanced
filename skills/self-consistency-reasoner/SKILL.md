---
name: self-consistency-reasoner
description: Multi-path hypothesis testing to eliminate "confidence hallucinations" in high-stakes reasoning.
---

# Self-Consistency Reasoner

Confidence through consensus. Majority vote wins.

## Internal Logic
Generate **5 independent reasoning paths** (default) for complex conclusions. Diversity in approach is mandatory.

## The Process

1.  **Generate N Independent Paths**: 
    - Path A: Forward from input.
    - Path B: Backward from error.
    - Path C: From structural patterns.
    - Path D: From recent changes.
    - Path E: From adversarial edge cases.
2.  **Majority Vote**: Collect final answers. The most frequent answer is the Winner.
3.  **Confidence Check**: 
    - **100% agreement**: Elite Confidence. Proceed.
    - **60-99% agreement**: High Confidence. Proceed but mention the minority view.
    - **≤ 50% agreement**: **FATAL UNCERTAINTY**. STOP. Gather more evidence.

## Scaling Table

| Task Difficulty | Paths Required |
| :--- | :--- |
| Simple verification (Yes/No) | 3 Paths |
| Root cause hypothesis (2-3 leads) | 5 Paths |
| Multi-causal bug / High-stakes refactor | 7 Paths |

## Output Format (Internal Use Only)
```markdown
**[Diagnosis/Verdict]**: [Winner]
**Confidence**: [X/N agreement] [Level]
**Minority View**: [Brief note if < 80% agreement]
```

## Iron Law
A confident-sounding single-path answer is a hallucination risk. Never trust the first path for complex logic.
