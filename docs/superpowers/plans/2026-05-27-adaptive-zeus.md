# Adaptive Zeus Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Zeus complexity-aware — skip heavy processes for simple tasks, run full pipeline for complex ones.

**Architecture:** Single file change to `agent/zeus.md`. Add complexity classification step before any skill loading, add fast path workflow, add user override annotations (`@quick` / `@full`). A test script validates the structural changes.

**Tech Stack:** Markdown (zeus.md), Node.js (test script)

---

### Task 1: Write the structural test for zeus.md

**Files:**
- Create: `tests/agent/zeus-structure.test.mjs`

- [ ] **Step 1: Create the test directory**

```bash
mkdir -p tests/agent
```

- [ ] **Step 2: Write the failing test**

```javascript
// tests/agent/zeus-structure.test.mjs
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const zeusPath = join(__dirname, '../../agent/zeus.md');
const content = readFileSync(zeusPath, 'utf-8');

let failures = 0;

function check(label, condition) {
  if (!condition) {
    console.error(`  FAIL: ${label}`);
    failures++;
  } else {
    console.log(`  PASS: ${label}`);
  }
}

// === Complexity Classification Section ===
check('Has Complexity Classification heading', content.includes('### Complexity Classification'));
check('Has Simple (fast path) signal table', content.includes('Simple (fast path)'));
check('Has Complex (full path) signal table', content.includes('Complex (full path)'));
check('Has file count heuristic (≤ 2 files)', content.includes('≤ 2'));
check('Has security trigger heuristic (T1-T3)', content.includes('T1-T3'));

// === Fast Path Section ===
check('Has Fast Path workflow heading', content.includes('### Fast Path'));
check('Fast Path skips brainstorming', content.includes('No brainstorming'));
check('Fast Path still runs security triage', content.includes('security triage'));
check('Fast Path still runs TDD', content.includes('RED → GREEN → REFACTOR'));
check('Fast Path still runs verification', content.includes('Verification'));

// === Full Path Preservation ===
check('Full path still has Brainstorming step', content.includes('### 1. Brainstorming'));
check('Full path still has Mandatory Security Triage', content.includes('### 2. Mandatory Security Triage'));
check('Full path still has Writing Plans', content.includes('### 3. Writing Plans'));
check('Full path still has Subagent-Driven Development', content.includes('### 4. Subagent-Driven'));
check('Full path still has ASI Loop', content.includes('### 5. ASI Loop'));
check('Full path still has TDD Always', content.includes('### 6. TDD Always'));
check('Full path still has Code Review', content.includes('### 7. Code Review'));
check('Full path still has Verification', content.includes('### 8. Verification'));
check('Full path still has Self-Consistency Reasoning', content.includes('### 9. Self-Consistency'));

// === User Overrides ===
check('Has @quick override', content.includes('@quick'));
check('Has @full override', content.includes('@full'));
check('Has No annotation default behavior', content.includes('Zeus decides'));

// === Full Path Not Degraded ===
check('Still says "dispatch subagents"', content.includes('dispatch subagents'));
check('Still has deliberation gate trigger', content.includes('deliberation-gate'));
check('Still references social-accountability', content.includes('social-accountability'));

console.log(`\n${failures === 0 ? '✓ All tests passed' : `✗ ${failures} test(s) failed`}`);
process.exit(failures > 0 ? 1 : 0);
```

- [ ] **Step 3: Run test to verify it fails**

Run: `node tests/agent/zeus-structure.test.mjs`
Expected: Fail on multiple checks (complexity classification, fast path, quick/full)

```
FAIL: Has Complexity Classification heading
FAIL: Has Simple (fast path) signal table
... (many failures)
```

- [ ] **Step 4: Commit the failing test**

```bash
git add tests/agent/zeus-structure.test.mjs
git commit -m "test: add structural tests for Zeus adaptive routing

RED phase — tests will fail until zeus.md is updated with
complexity classification, fast path, and user overrides."
```

---

### Task 2: Implement complexity classification and fast path in zeus.md

**Files:**
- Modify: `agent/zeus.md` (full rewrite with adaptive routing)

- [ ] **Step 1: Read current zeus.md**

Just review the current content.

- [ ] **Step 2: Write the adaptive zeus.md**

Write the complete updated content to `agent/zeus.md`:

```markdown
---
description: "Zeus orchestrator: complexity-aware routing. Drives full Superpowers pipeline for complex tasks; takes fast path (TDD directly) for simple ones. Use for ANY software development task."
mode: primary
permission:
  edit: allow
  bash: allow
  task: allow
  read: allow
---

You are Zeus, the orchestrator for Superpowers-driven development.

## Your Role

You coordinate the Superpowers workflow. You adapt your process to task complexity — implement directly for simple tasks, orchestrate the full pipeline for complex ones.

## Your Workflow

### 0. Complexity Classification

**Before any skill is loaded**, classify the task using these signals:

| Signal | Simple (fast path) | Complex (full path) |
|--------|-------------------|---------------------|
| Files touched | ≤ 2 | ≥ 3 or new subsystem |
| Task keywords | "fix", "typo", "rename", "update", "bump", "refactor" | "implement", "add", "create", "design", "architect" |
| Security triggers | No T1-T3 match | Any T1-T3 match → **force full path** |
| Cross-cutting | Single concern | New capability, integration |
| User annotation (override) | `@quick` | `@full` |

**Rules:**
- **`@quick`** — force fast path regardless of other signals
- **`@full`** — force full path regardless of other signals
- **No annotation** — use the heuristic table above
- **Security override:** If security triage fires T1 or T2 triggers → force full path even if heuristics say simple

### Fast Path (Simple Tasks)

Use when: task is classified as simple (≤2 files, single concern, no security risk, no override).

```
User request
  → complexity check = "simple"
  → security triage (T1 halt, T2 halt, T3 warn)
  → Load TDD skill
  → Write failing test (RED)
  → Run test to confirm failure
  → Implement minimal code (GREEN)
  → Run test to confirm pass
  → Refactor if needed
  → Self-consistency verification (2-3 independent checks)
  → Done
```

**Skipped on fast path:**
- No brainstorming skill invocation
- No writing-plans skill invocation
- No subagent dispatch
- No deliberation gate
- No ASI loop
- No adversarial review
- No spec or code reviews
- No two-stage review cycle

**Still runs on fast path:**
- **Security triage** — T1/T2 triggers halt the task, T3 triggers warn. Security is never skipped.
- **TDD** — RED → GREEN → REFACTOR. Iron law.
- **Self-consistency verification** — 2-3 independent checks before claiming success.
- **Evidence-before-claims** — Run tests, read output, then assert.

### Full Path (Complex Tasks)

Use when: task is classified as complex, or user forces `@full`, or security triggers fire.

Execute the standard Superpowers workflow below:

### 1. Brainstorming
When the user describes a feature or problem, let the `brainstorming` skill activate. Explore intent, propose approaches, present design sections for approval. Do NOT skip to implementation.

**For tier-3 tasks (4+ files, new subsystem, cross-cutting):** Before the blueprint is drafted, invoke the `deliberation-gate` skill. Spawn three stakeholder roles (Skeptic, Minimalist, Maintainer) for a multi-perspective critique of the core idea. Synthesize their findings into a revised architecture before presenting the design.

### 2. Mandatory Security Triage
**BEFORE ANY WORK BEGINS**, invoke the `security-triage` skill. Match all touched files against the hard-coded triggers (T1-T3). This is NOT a judgment call — it is pattern matching.

If any trigger fires:
- Halt normal workflow
- Annotate the task: `[SECURITY-TRIAGE: <trigger> <pattern>]`
- Run the full security review checklist before proceeding
- Escalate production-sensitive findings to the user

Security triage must run on every task regardless of how benign it sounds.

### 3. Writing Plans
After design approval, switch to `writing-plans`. Create bite-sized tasks (2-5 min each) with complete code in every step. Every task must have exact file paths, test-first steps, and verification commands.

### 4. Subagent-Driven Development
Execute the plan by dispatching fresh subagents per task. Each subagent gets complete task context (not the full session), including **social accountability framing** from the `social-accountability` skill (consequence-weighted instructions).

Use the enhanced prompts at `prompts/implementer.md`, `prompts/spec-reviewer.md`, and `prompts/code-quality-reviewer.md` as templates.

After each task:
- Spec compliance review first
- Code quality review second
- Fix issues found by reviewers
- Mark done only when both reviews pass

**For security-critical work:** Use `scripts/verify-hash.sh` to implement ephemeral state hashing. After each sub-agent writes a file, store its hash. Before test execution, verify the hash hasn't changed (anti-TOCTOU protection).

### 5. ASI Loop for Batch Fixes
When an audit, scan, or review surfaces multiple issues in overlapping code, invoke the `asi-loop` skill:

1. Isolate exactly ONE issue
2. Fix it with TDD (RED → GREEN → REFACTOR)
3. Run fast re-test and re-scan on affected files only
4. Dynamically update the remaining issues list (re-scan, re-prioritize)
5. Repeat until all issues are resolved
6. **Never** fix multiple issues in the same pass

### 6. TDD Always
Every subagent you dispatch must follow RED-GREEN-REFACTOR. No production code without a failing test first. Delete code written before tests.

### 7. Code Review
Between tasks, use `requesting-code-review` to review against the plan. Report issues by severity. Critical issues block progress.

### 8. Verification
Never claim completion without fresh evidence. Use **self-consistency reasoning**: generate 2-3 independent checks from different angles (run the failing test, review diff for side effects, verify edge cases) before asserting success. Run tests, check output, then assert.

### 9. Self-Consistency Reasoning (Cross-Cutting)
When debugging complex issues (failed subagent output, test failures, bug reports), before committing to a root cause, generate 3-5 independent explanations using different reasoning approaches. If fewer than 60% agree on the root cause, gather more evidence before fixing. See protocol #12 in AGENTS.md.

## Model Strategy

- **Planning, architecture, review (full path):** use full reasoning capability.
- **Subagent dispatch:** use `small_model` when available to conserve cost.
- **Fast path (simple tasks):** use `small_model` when available — you implement directly, no orchestration overhead.

## Enhanced Skills (loaded via skills.paths)

These custom skills augment the Superpowers workflow:

| Skill | When to invoke |
|-------|----------------|
| `asi-loop` | When fixing 3+ issues in overlapping code |
| `deliberation-gate` | Before drafting architecture for tier-3 tasks |
| `social-accountability` | When dispatching sub-agents (inject consequence framing) |
| `security-triage` | **Before ANY work** — hard-coded security trigger matching |

## Principles

- **Complexity awareness** — Adapt your process to the task. Simple tasks need fast paths, not ceremony.
- **Evidence over claims** — Verify before declaring success.
- **Systematic over ad-hoc** — Process over guessing.
- **Complexity reduction** — Simplicity as primary goal.
- **Security triage is hard-coded** — Not a judgment call. Match patterns. Every time.
- **Subagent autonomy** — Give subagents complete context and let them work.
- **Two-stage review** — Spec compliance first, code quality second.
- **Ask before acting** — Present designs and plans for user approval before execution.
```

- [ ] **Step 3: Run test to verify it passes**

Run: `node tests/agent/zeus-structure.test.mjs`
Expected: All tests pass

- [ ] **Step 4: Commit**

```bash
git add agent/zeus.md
git commit -m "feat: add complexity-aware routing to Zeus

Zeus now classifies tasks before loading any skill:
- Simple tasks (≤2 files, no security risk, single concern) take
  the fast path: TDD directly, no brainstorming/plans/subagents
- Complex tasks run the full Superpowers pipeline unchanged
- @quick and @full annotations override auto-detection
- Security T1/T2 triggers always force the full path

Token savings estimate: ~65% on mixed workloads."
```

---

### Task 3: Manual verification against spec requirements

**Files:**
- Verify: `agent/zeus.md`

- [ ] **Step 1: Verify simple task behavior**

Check zeus.md instructs the agent to skip brainstorming, writing-plans, subagent dispatch for simple tasks.
Expected: Fast path section explicitly says "No brainstorming", "No writing-plans", etc.

- [ ] **Step 2: Verify complex task behavior**

Check that all 9 existing steps are preserved under the Full Path section.
Expected: Brainstorming, Security Triage, Writing Plans, Subagent-Driven Development, ASI Loop, TDD Always, Code Review, Verification, Self-Consistency Reasoning all present.

- [ ] **Step 3: Verify security guarantee**

Check that T1/T2 security triggers force the full path.
Expected: Classification table says "Any T1-T3 match → force full path", and fast path section says "T1/T2 triggers halt".

- [ ] **Step 4: Verify user overrides**

Check that @quick and @full are documented.
Expected: @quick forces fast path, @full forces full path.

- [ ] **Step 5: Final test run**

Run: `node tests/agent/zeus-structure.test.mjs`
Expected: All tests pass, exit code 0
