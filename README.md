<a id="readme-top"></a>

<div align="center">
  
  # ⚡ Superpowers Enhanced
  *A high-discipline operating system and quality pipeline for OpenCode*

  [![Node version](https://img.shields.io/badge/Node.js-%3E%3D18-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
  [![Install - Bash](https://img.shields.io/badge/Bash-4EAA25?style=flat-square&logo=gnubash&logoColor=white)](install.sh)
  [![Install - PowerShell](https://img.shields.io/badge/PowerShell-5391FE?style=flat-square&logo=powershell&logoColor=white)](install.ps1)
  [![License - MIT](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

  ⭐ If you find this configuration helpful, star the repository!

  [Features](#features) • [Quick Start](#quick-start) • [Quality Gates](#the-six-quality-gates) • [Complexity Routing](#complexity-aware-routing) • [Troubleshooting](#troubleshooting)

</div>

---

OpenCode agents default to an **implementation-first** mode: describe what you want, and they immediately begin writing code. While fast, this ad-hoc approach often leads to regressive bugs, missed security boundaries, and architectural debt.

**Superpowers Enhanced** acts as a structured operating system overlay on top of [`obra/superpowers`](https://github.com/obra/superpowers). It wraps your OpenCode environment in a strict engineering pipeline—enforcing design, security auditing, multi-perspective reviews, and automated verification.

| Workflow Gate | Default OpenCode | Superpowers Enhanced |
| :--- | :--- | :--- |
| **Task Initiation** | Jump straight to implementation | **Brainstorm** intent, propose approaches, design first |
| **Security Auditing** | Manual oversight or post-factum scans | **Hard-coded triage** triggered automatically on file paths/content |
| **Architecture** | Single-minded design execution | **Deliberation Gate** with triple-role critic audit |
| **Sub-agent Dispatch** | Flat commands with no downstream context | **Social Accountability** consequence-weighted prompts |
| **Bug Isolation** | Bulk sequential patching (creates conflicts) | **ASI Loop** isolates, fixes with TDD, re-scans sequentially |
| **Integrity Assurance** | Trust based on model confidence | **SHA-256 state hashing** to prevent TOCTOU exploits |
| **Simple Work** | Heavyweight workflow overhead | **Fast Path** auto-routing (TDD directly, skip ceremony) |

---

## Features

- 🛡️ **Zero-Trust Security Triage** - Automated trigger rules check paths, contents, and directories to force audits before any code executes.
- ⚖️ **Adversarial Deliberation** - Spawns distinct virtual personas (Skeptic, Minimalist, Maintainer) to critique complex architectures.
- 🔁 **ASI Batch Patching** - Restricts bug fixing to one isolated issue at a time with dynamic re-scanning and an anti-infinite loop guard.
- 🤝 **Consequence-Weighted Prompts** - Shapes sub-agent behaviors through role-specific social accountability framing.
- 🔑 **Anti-TOCTOU Hashing** - Uses ephemeral state hashing to guarantee file integrity between check and execution on security-sensitive code.
- 🎯 **Multi-Path Self-Consistency** - Validates root cause hypotheses and completion claims through independent checks.
- ⚡ **Complexity-Aware Routing** - Leverages heuristic analysis to fast-path trivial tasks and save up to 89% in token costs.

---

## Quick Start

> [!NOTE]
> No manual dependencies or external package setups are required. The cross-platform installer handles Node.js validation, backs up your active configuration, and registers all modules automatically.

### Installation

```bash
# Linux / macOS / WSL
bash <(curl -fsSL https://raw.githubusercontent.com/S1NXIAN/superpowers-enhanced/main/install.sh)

# Windows (PowerShell)
irm https://raw.githubusercontent.com/S1NXIAN/superpowers-enhanced/main/install.ps1 | iex
```

Once installed, restart your OpenCode session and try initiating a task:
> _"Let's build a secure session manager"_

### Manual Installation

If you prefer to inspect and run the installation locally:

```bash
git clone https://github.com/S1NXIAN/superpowers-enhanced.git ~/superpowers-enhanced
cd ~/superpowers-enhanced

node setup.mjs            # Interactive setup
node setup.mjs --force    # Non-interactive, skip prompts
node setup.mjs --dry-run  # Preview config and file changes only
```

> [!IMPORTANT]
> You must completely restart the OpenCode application/daemon after installation for the changes and skills to load.

### Verifying the Installation

To confirm that the orchestrator and instruction paths are successfully registered:

```bash
# Verify agent configuration files exist
ls ~/.config/opencode/AGENTS.md ~/.config/opencode/agent/zeus.md

# Verify default agent is set to Zeus
node -e "console.log(JSON.parse(require('fs').readFileSync(require('path').join(require('os').homedir(),'.config','opencode','opencode.json'),'utf8')).default_agent)"
# Expected Output: zeus
```

---

## The Six Quality Gates

Superpowers Enhanced integrates six key protocols directly into the agentic loop.

```text
       [Deliberation Gate] — before architecture for complex tasks
                │
                ▼
        brainstorming ──► design doc ──► user approval
                │
                ▼
        [Security Triage] — before every task, hard-coded pattern match
                │
                ▼
        writing-plans ──► implementation plan ──► user approval
                │
                ▼
        [Social Accountability] — injected in sub-agent prompts
                │
                ▼
        subagent-driven-development ──► task-by-task execution
                │
                ▼
          [ASI Loop] ──► isolate & patch one bug at a time
          [Hash Verification] ──► anti-TOCTOU payload check
          [Self-Consistency] ──► multi-path root cause audit
                │
                ▼
        finishing-a-development-branch ──► merge / PR / cleanup
```

### 🛡️ Security Triage (`skills/security-triage/`)
A hard-coded trigger system that intercepts requests touching sensitive files or patterns.
- **T1 Paths**: Matches file patterns like `*auth*/**`, `*secret*/**`, `*token*/**`, `*.pem`, `*rbac*/**`.
- **T2 Code**: Scans file modifications for terms such as `def authenticate*`, `SECRET_KEY`, `eval(`, `os.system`.
- **T3 Directories**: Automatically flags files residing in `auth/`, `crypto/`, `secrets/`, `middleware/auth*/`.
- **Action**: Bypasses LLM judgment, halts the workflow, flags the task as `[SECURITY-TRIAGE]`, and triggers a mandatory 4-point security audit.

### ⚖️ Deliberation Gate (`skills/deliberation-gate/`)
Triggered automatically before architecting tier-3 tasks (4+ files, new subsystems, or cross-cutting changes).
- **The Skeptic**: Audits where the design will fail at scale, identifying race conditions and bottleneck vulnerabilities.
- **The Minimalist**: Evaluates how the goal can be met using existing utilities, without adding dependencies or creating files.
- **The Maintainer**: Projects long-term technical debt, testing complexities, and future developer comprehension.
- **Action**: Collects exactly one un-debated critique per role and synthesizes a revised design document for user approval.

### 🤝 Social Accountability (`skills/social-accountability/`)
Injects consequence-weighted framing into sub-agent prompts. Empirical data shows LLMs allocate more cognitive resources and experience lower hallucination rates when failure modes are defined.
- **Implementers**: Warned that introducing bugs or omitting test coverage wastes pipeline compute and erodes accuracy scores.
- **Spec Reviewers**: Instructed that false positives waste engineering hours, while missed requirements cost 10x more to patch later.
- **Code Reviewers**: Reminded they are the last gate before production—technical debt from structural approvals compounds exponentially.

### 🔁 ASI Loop (`skills/asi-loop/`)
An Actionable Side Information protocol for batch bug fixes and audit findings.
- **Isolation**: Strictly isolates and resolves exactly **one** issue per cycle.
- **Verification**: Fixes the issue using TDD (RED-GREEN-REFACTOR), then runs tests and scans *only* on the affected files.
- **Re-Scan**: Dynamically updates the issue backlog and re-checks for structural side-effects before selecting the next issue.
- **Infinite Loop Guard**: Automatically halts after 4 cycles to preserve the active diff state and present a diagnostic report to the user.

### 🔑 Ephemeral Hashing (`scripts/verify-hash.sh`)
An anti-TOCTOU (Time-of-Check to Time-of-Use) cryptographic shield.
- **Capture**: Automatically generates a SHA-256 hash of a file immediately after a sub-agent writes or modifies it.
- **Verification**: Recalculates and verifies the hash right before test execution or deployment.
- **Response**: Instantly terminates the pipeline and alerts the user if the hash has mutated, neutralizing code-swapping exploits.

### 🎯 Self-Consistency Reasoning
Forces multi-path validation during debugging and verification to prevent confident-but-wrong single-chain failures.
- **During Debugging**: Generates 3-5 independent root-cause explanations using different logical tracks. If fewer than 60% of paths agree, it halts to gather further diagnostic evidence.
- **During Verification**: Generates 2-3 distinct, multi-angle tests (e.g., negative boundaries, side-effect audits) before declaring a task complete.

---

## Complexity-Aware Routing

The **Zeus Orchestrator** (`agent/zeus.md`) manages the development loop. It automatically classifies incoming requests to select the most token-efficient route:

```text
             User Request
                  │
                  ▼
         [Complexity Check]
          /              \
    (Simple)           (Complex)
      /                    \
  Fast Path              Full Path
 TDD Directly      Brainstorm → Plan → Review
```

### Classification Heuristics

| Attribute | Simple (Fast Path) | Complex (Full Path) |
|:---|:---|:---|
| **Files Touched** | $\le 2$ files | $\ge 3$ files or new subsystem |
| **Keywords** | *fix, typo, rename, update, bump, refactor* | *implement, add, create, design, architect* |
| **Security Triggers** | No T1-T3 matches | **Any** T1-T3 match (Forces full path) |
| **Scope** | Single localized concern | New capability, integration, cross-cutting |
| **Manual Override** | Prefix request with `@quick` | Prefix request with `@full` |

### Manual Overrides

You can explicitly bypass the heuristic routing at any time:
- **`@quick`**: Forces the fast path—ideal for quick refactors, typo fixes, and styling updates.
- **`@full`**: Forces the complete, audited Superpowers pipeline—recommended when adding crucial features.

---

## Project Structure

```text
superpowers-enhanced/
├── AGENTS.md                 # User instructions (highest priority rulebook)
├── opencode-template.json    # Base OpenCode config template
├── install.sh                # Unix installation entrypoint
├── install.ps1               # Windows PowerShell installation entrypoint
├── setup.mjs                 # Cross-platform JSON-merge configuration setup
├── uninstall.sh              # Unix uninstallation cleanup script
├── uninstall.ps1             # Windows uninstallation cleanup script
├── uninstall.mjs             # Cross-platform configuration restorer
├── agent/
│   └── zeus.md               # Adaptive Zeus Orchestrator (default agent)
├── prompts/
│   ├── implementer.md        # Consequence-weighted sub-agent implementer template
│   ├── spec-reviewer.md     # Consequence-weighted sub-agent spec reviewer template
│   └── code-quality-reviewer.md # Consequence-weighted sub-agent quality reviewer template
├── scripts/
│   └── verify-hash.sh        # SHA-256 state hashing script
├── skills/
│   ├── asi-loop/             # Dynamic bug-isolation skill
│   ├── deliberation-gate/    # Personas-driven architecture critique
│   ├── security-triage/      # Zero-trust trigger logic
│   └── social-accountability/ # Consequence-weighting engine
└── tests/
    └── agent/
        └── zeus-structure.test.mjs  # Lint and structural checks for zeus.md
```

---

## Troubleshooting

### Config Schema Validation Crashes

> [!WARNING]
> OpenCode versions 1.15.10+ reject unrecognized top-level keys like `enable_experimental_skills`.

If you experience crashes immediately on startup, check your global `~/.config/opencode/opencode.json` file. Ensure that:
1. No vestigial config fields (like `enable_experimental_skills`) are present.
2. The `model` field is set to a valid, resolvable model ID (such as `"opencode/deepseek-v4-flash-free"` or `"google/gemini-3-flash-preview"`).

### Skills or Agents Not Loading

1. Verify that `skills.paths` in your global `opencode.json` contains `"skills/superpowers-enhanced"`.
2. Verify that the files exist at `~/.config/opencode/skills/superpowers-enhanced/`.
3. Check that the `instructions` array contains `"AGENTS.md"`.
4. **Restart OpenCode**—skills, agents, and instructions are loaded into memory *only* during boot.

### Uninstalling

To clean up all registered directories and restore your original `opencode.json` configuration from the automatic backup:

```bash
# Unix (Linux / macOS / WSL)
bash <(curl -fsSL https://raw.githubusercontent.com/S1NXIAN/superpowers-enhanced/main/uninstall.sh)

# Windows (PowerShell)
irm https://raw.githubusercontent.com/S1NXIAN/superpowers-enhanced/main/uninstall.ps1 | iex
```

([back to top](#readme-top))