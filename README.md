<div align="center">

# opencode-zeus

*Sovereign Elite engineering processor and skill-based quality system for [OpenCode](https://opencode.ai)*

[![Build Status](https://img.shields.io/github/actions/workflow/status/S1NXIAN/opencode-zeus/build-test.yaml?style=flat-square&label=Build)](https://github.com/S1NXIAN/opencode-zeus/actions)
![Node version](https://img.shields.io/badge/Node.js->=18-3c873a?style=flat-square)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

⭐ If you like this project, star it on GitHub — it helps a lot!

[Overview](#overview) • [Features](#features) • [Getting Started](#getting-started) • [How it Works](#how-it-works) • [Skills Reference](#skills-reference) • [Testing](#testing) • [Uninstallation](#uninstallation)

</div>

## Overview

`opencode-zeus` is a 100% independent engineering system that transforms OpenCode into a structured, skill-driven processor. It enforces mandatory test-driven development, security triage, and multi-perspective reviews through a team of specialized skills — each with a clear role, clear handoffs, and no overlap.

Orchestrated by a modular Zeus core, the system routes tasks through a coherent engineering pipeline: validate the premise, deliberate the approach, brainstorm the design, plan the implementation, execute via subagents, verify before claiming done, and finish the branch.

## Features

* 🧠 **Skill Team** — 17 specialized skills, each a distinct engineering role (Architect, QA Lead, Security Engineer, Risk Analyst, etc.). Skills are loaded by CSO description matching — zero routing overhead.
* 🛡️ **Iron Rules** — TDD is mandatory (`test-driven-development`). Every file is security-scanned (`security-triage`). Every completion claim is verified (`verification-before-completion`).
* ⚡ **Efficient Loading** — Skills are loaded only when needed. Integration chains distinguish Required (must-load) from Related (advisory). `token-efficiency` fires only at session start and compaction.
* 🤖 **Subagent Dispatch** — Complex work is delegated to specialized subagents with fresh contexts. Plans use YAML DAG with auto-computed waves and critical path.
* 🔄 **Learning Loop** — `retrospective` captures process failures and feeds improvements back into the system. `pre-mortem` identifies execution risks before they happen.
* 📦 **Zero Dependencies** — Pure Node.js built-in modules. No npm packages, no plugins, no external CLI tools.

## Getting Started

### Prerequisites

* [OpenCode](https://opencode.ai) CLI
* Node.js LTS (v18+)
* Linux or macOS (Windows/PowerShell is NOT supported)

### Installation

#### Option A: One-Liner Installer (Quickest)

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/S1NXIAN/opencode-zeus/main/installers/install.sh)
```

#### Option B: Standard Manual Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/S1NXIAN/opencode-zeus.git
   cd opencode-zeus
   ```

2. Execute the setup utility:
   ```bash
   node bin/setup.mjs
   ```

### Verification

```bash
node bin/setup.mjs        # Run setup
node --test 'tests/**/*.test.mjs'   # 109+ tests should pass
```

## How it Works

Zeus Elite operates as a **skill-driven engineering processor** with three layers:

1. **The Orchestrator (`zeus.md`)** — Entry point that handles task classification, skill selection via CSO description matching, and subagent dispatch.

2. **The Skills (`skills/`)** — 17 specialized engineering roles. Each skill is a standalone SKILL.md file with a clear trigger condition, process, and Integration section. Skills form a pipeline:

   ```
   Request → premise-check → deliberation-gate → brainstorming → pre-mortem
         → writing-plans → subagent-driven-development → verification-before-completion
         → finishing-a-development-branch
   ```

3. **The Subagents (`agents/`)** — 10 specialized subagents (`task-planner`, `security-audit`, `root-cause-analysis`, etc.) dispatched for focused execution in fresh contexts.

## Skills Reference

| Skill | Team Role | When It Fires |
| :--- | :-------- | :------------ |
| `premise-check` | Product Owner — validates work should exist | Before any new work |
| `deliberation-gate` | Architect — evaluates trade-offs | High-stakes architectural decisions |
| `brainstorming` | Designer — creative direction | After premise or deliberation approves |
| `pre-mortem` | Risk Analyst — identifies failure modes | Before complex or risky work |
| `writing-plans` | Tech Lead — produces executable blueprint | After design direction is approved |
| `subagent-driven-development` | Engineering Team (parallel) — builds in waves | Executing plans with independent tasks |
| `executing-plans` | Engineer (sequential) — builds tightly-coupled tasks | Fallback when tasks share files |
| `test-driven-development` | QA Engineer — test-first methodology | Every implementation task |
| `systematic-debugging` | Investigator — root cause analysis | Any bug or test failure |
| `self-consistency-reasoner` | Analyst — multi-path reasoning verification | Complex reasoning problems |
| `error-recovery` | Support Engineer — known-issues database | Environment or platform errors |
| `dependency-management` | Build Engineer — safe dependency updates | Adding or upgrading dependencies |
| `security-triage` | Security Engineer — scans every file | Every file touch (Iron Rule) |
| `verification-before-completion` | QA Lead — demands proof before "done" | Before any completion claim |
| `retrospective` | Process Lead — learns from failures | After incidents or plan failures |
| `finishing-a-development-branch` | Release Manager — merge/PR/discard decision | When implementation is complete |
| `token-efficiency` | Editor — compresses signal, kills preambles | Session start and compaction |

## Testing

Zeus Elite is backed by 109+ native Node.js tests verifying architectural integrity, routing logic, security scanning, and configuration.

```bash
node --test 'tests/**/*.test.mjs'   # Run full suite (109 tests)
```

## Uninstallation

To restore your original OpenCode configuration and remove all Zeus Elite assets:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/S1NXIAN/opencode-zeus/main/installers/uninstall.sh)
```

---

<div align="center">
  <sub>Diverged & Sovereign. Optimized for Linux/macOS. Zero-Slop Engineering.</sub>
</div>
