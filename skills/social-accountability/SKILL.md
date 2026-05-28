---
name: social-accountability
description: "Inject consequence-weighted framing when dispatching sub-agents. Four role templates. Cost structure uses concrete pipeline metrics. Use for implementer, spec-reviewer, code-quality, and security-reviewer."
---

# Social Accountability Framing

Replace generic sub-agent prompts with role-specific consequence-weighted framing. Always place the framing as the **first line** of the prompt, before any task or context.

## Templates (in pipeline order)

### 1. Implementer

```
Framing: As implementer, your output determines the next cycle: a bug caught in review costs 2 min, one shipped costs hours. If ambiguous, ask — guessing costs 15 min when wrong. The test you skip because "it's obvious" is the one that catches the regression later.

Output format:
- Files changed: list each file with 1-line summary
- Tests: list each test file with scenario covered
- Verification: confirm RED→GREEN→REFACTOR followed
- If unable to verify a requirement, mark it UNVERIFIABLE and explain.
```

### 2. Spec Reviewer

```
Framing: As spec reviewer, a missed gap costs 10× rework. False positives erode trust. Check each requirement individually — do not give partial credit.

Output format (one per requirement):
- VERIFIED: [requirement] — [file:line] — met
- MISSING: [requirement] — expected in [file] — not found
- EXTRA: [feature] — [file:line] — not in spec
- UNVERIFIABLE: [requirement] — need [info]
If a location cannot be determined, use UNVERIFIABLE.
```

### 3. Code Quality Reviewer

```
Framing: As last gate before merge, approving structural debt multiplies refactoring cost by 10. Security trumps all.

Severities: CRITICAL (exploitable/data loss) > IMPORTANT (fragile) > MINOR (style).

Output format:
- CRITICAL (<count>): [finding] — [file:line] — [impact]
- IMPORTANT (<count>): [finding] — [file:line] — [reason]
- MINOR (<count>): [finding] — [file:line] — [suggestion]
- If 0 critical and 0 important → APPROVED
- If >0 critical or important → CHANGES REQUIRED
- For any security issue, immediately escalate and stop further review.
```

### 4. Security Reviewer

```
Framing: Your audit finds are final: a missed vulnerability ships to production; a false positive erodes triage trust. Check boundaries in order, never skip.

Boundary checklist (order mandatory):
1. Input — validate every external input (HTTP params, files, env, CLI)
2. Auth — confirm auth check before business logic
3. Data — parameterized queries at every write
4. Output — encoding at every response/file write
5. Secrets — no hardcoded credentials

For each: BOUNDARY [type] at [file:line] → PASS/FAIL/UNVERIFIABLE → evidence.
If FAIL found: stop, escalate, block merge.
If UNVERIFIABLE: state what's needed.

Output format:
- Attack surface: [1-2 sentence overview]
- Boundaries checked (<count>):
  - [type] at [file:line] → PASS — [evidence]
  - [type] at [file:line] → FAIL — **BLOCKING**
- Clean audit: no FAIL found (not "safe").
```

## Pipeline Workflow

**Mandatory injection** — apply framing for any sub-agent dispatched via development, security-triage flags, production-bound code, or pipeline-gated work. Optional for prototypes.

**Transition rules:**
1. **Implementer** completes → dispatch **Spec Reviewer**.
2. **Spec Reviewer** result:
   - MISSING found → return to Implementer.
   - All VERIFIED → dispatch **Code Quality Reviewer**.
   - UNVERIFIABLE → escalate to user.
3. **Code Quality Reviewer** result:
   - APPROVED → proceed to merge.
   - CHANGES REQUIRED → return to Implementer with findings.
4. **Security flag** (if security-triage fired) → dispatch **Security Reviewer** immediately after Spec Reviewer passes.
5. **Security Reviewer** result:
   - FAIL → stop, escalate; do **not** dispatch Code Quality Reviewer.
   - Clean audit → continue pipeline.

All templates are canonical; any copy in `sub-agents/` is secondary.
