<!-- prettier-ignore -->
<div align="center">

# Superpowers Enhanced

*An opinionated OpenCode configuration that enforces disciplined, secure, and systematic software development through the [Superpowers](https://github.com/obra/superpowers) methodology.*

[![Node version](https://img.shields.io/badge/Node.js->=18-3c873a?style=flat-square)](https://nodejs.org/)
[![Bash](https://img.shields.io/badge/Install-Bash-4EAA25?style=flat-square&logo=gnu-bash&logoColor=white)](install.sh)
[![PowerShell](https://img.shields.io/badge/Install-PowerShell-5391FE?style=flat-square&logo=powershell&logoColor=white)](install.ps1)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

[Features](#features) • [Quick Start](#quick-start) • [Protocols](#enhanced-protocols) • [Project Structure](#project-structure) • [Troubleshooting](#troubleshooting)

</div>

Turns OpenCode from a chat interface into a disciplined orchestrator. Instead of blindly implementing, your agent brainstorms designs, writes plans, dispatches sub-agents with TDD, reviews code systematically, and verifies before claiming completion. Every action is gated by hard-coded security triage and review checkpoints.

## Features

- **Zeus Default Agent** — Every session starts with an orchestrator that plans and delegates instead of jumping into implementation. Security triage is hard-coded, not a judgment call.
- **Instruction Hierarchy** — AGENTS.md outranks everything, ensuring the workflow is followed systematically. Skills are mandatory, not optional.
- **Five Enhanced Protocols** — Security triage, ASI batch-patching, deliberation gate, ephemeral state hashing, and social accountability framing. Built on top of Superpowers' standard skills.
- **Cross-Platform Setup** — One-liner installers for Linux, macOS, and Windows. Auto-detects OS, installs Node.js if missing, and applies the configuration in seconds.
- **Surgical Config Merge** — Your existing OpenCode settings are preserved. Only the necessary fields (`plugin`, `default_agent`, `instructions`, `skills.paths`) are updated, everything else stays as-is.
- **Safe by Default** — Existing files are backed up before any changes are made. Dry-run mode previews everything without touching your config.

## Quick Start

The installer auto-detects your OS, installs Node.js if needed, downloads the configuration, and applies it to your OpenCode setup.

> [!NOTE]
> No dependencies needed — the installer handles everything automatically.

### Linux / macOS / WSL

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/S1NXIAN/superpowers-enhanced/main/install.sh)
```

### Windows (PowerShell)

```powershell
irm https://raw.githubusercontent.com/S1NXIAN/superpowers-enhanced/main/install.ps1 | iex
```

### Manual Install

If you prefer to inspect the code before installing:

```bash
git clone https://github.com/S1NXIAN/superpowers-enhanced.git ~/superpowers-enhanced
cd ~/superpowers-enhanced
node setup.mjs
```

### Non-Interactive

```bash
node setup.mjs --force      # skip confirmation prompts
node setup.mjs --dry-run    # preview changes without modifying anything
```

> [!IMPORTANT]
> **Restart OpenCode** after installation for the changes to take effect.

## Verification

After installing and restarting, you can verify the configuration is active:

```bash
# Check that the installed files exist
ls ~/.config/opencode/AGENTS.md
ls ~/.config/opencode/agent/zeus.md
ls ~/.config/opencode/skills/superpowers-enhanced/

# Verify the config was merged
node -e "console.log(JSON.parse(require('fs').readFileSync(require('path').join(require('os').homedir(), '.config', 'opencode', 'opencode.json'), 'utf8')).default_agent)"
# Should output: zeus
```

Then start a new OpenCode session and try:

> "Let's build a todo list"

Superpowers should auto-trigger the `brainstorming` skill before any code is written. If it jumps straight to implementation, something is misconfigured.

## What Happens During Install

The installer performs a surgical merge of your existing `~/.config/opencode/opencode.json`, preserving everything you've already configured:

| Field | Change |
|---|---|
| `plugin` | Adds `superpowers@git+https://github.com/obra/superpowers.git` if not present |
| `default_agent` | Sets to `zeus` |
| `instructions` | Adds `AGENTS.md` to the list |
| `skills.paths` | Adds `skills/superpowers-enhanced` |
| `model` / `small_model` | **Not touched** — your model choices are preserved |
| Everything else | **Preserved as-is** — provider config, auth settings, etc. |

It then copies these files into your config directory:

- **`AGENTS.md`** — Instruction hierarchy that enforces the Superpowers workflow
- **`agent/zeus.md`** — Zeus orchestrator agent, set as default
- **`skills/superpowers-enhanced/`** — Custom skills (security triage, ASI loop, deliberation gate, social accountability)
- **`prompts/`** — Pre-framed sub-agent prompt templates with accountability weighting
- **`scripts/verify-hash.sh`** — SHA-256 hash verification for anti-TOCTOU protection

> [!TIP]
> If anything goes wrong, the installer backs up your original files to `~/.config/opencode/.backups/<timestamp>/`. Run `node uninstall.mjs` to revert.

## Enhanced Protocols

These five custom protocols augment the standard Superpowers skills to enforce discipline and security at every stage of development.

### 1. Mandatory Security Triage

Before **any** work begins, every file to be created or modified is checked against hard-coded trigger rules. This is not a judgment call — it is pattern matching.

- **T1:** File paths matching `*auth*/**`, `*secret*/**`, `*token*/**`, `*crypto*/**`, etc.
- **T2:** Code content containing `SECRET_KEY`, `def authenticate*`, `import *crypto*`, `eval(`, etc.
- **T3:** Files in security-adjacent directories (`auth/`, `security/`, `crypto/`, `secrets/`, etc.)

When a trigger fires, the agent halts, annotates the task with `[SECURITY-TRIAGE: <trigger> <pattern>]`, runs a full security review checklist, and escalates production-sensitive findings to you.

### 2. ASI Loop (Batch Fix Isolation)

When an audit or scan surfaces multiple issues in overlapping code, the ASI Loop prevents the most common failure mode of batch-fixing: breaking one fix while applying another.

It isolates exactly **one issue per iteration**, fixes it with TDD (RED → GREEN → REFACTOR), runs fast re-tests on only the affected files, re-scans, and dynamically re-prioritizes the remaining issues. A cycle counter halts execution after 4 iterations to prevent infinite loops on coupled issues.

### 3. Deliberation Gate (Architecture Audit)

Before drafting blueprints for complex tasks (4+ files, new subsystem, cross-cutting concerns), the agent spawns three stakeholder roles with competing lenses:

- **Skeptic** — Finds where the architecture fails at scale (concurrency, bottlenecks, race conditions)
- **Minimalist** — Challenges every addition; can the goal be achieved with existing utilities?
- **Maintainer** — Thinks in quarters and years; assesses testability, tech debt, and next-developer comprehension

Each role gets exactly one un-debated response. The agent synthesizes surviving critiques into a revised architecture before presenting the design.

### 4. Ephemeral State Hashing (Anti-TOCTOU)

Prevents Time-of-Check to Time-of-Use exploits where a compromised sub-agent passes a scan then swaps the payload before execution.

```bash
scripts/verify-hash.sh store path/to/file.py    # store hash after write
scripts/verify-hash.sh verify path/to/file.py   # verify before test/execution
scripts/verify-hash.sh check                     # verify all tracked files
scripts/verify-hash.sh status                    # show tracked files
scripts/verify-hash.sh clear                     # clear all stored hashes
```

If a hash mutates between check and use, execution is blocked with a tampering alert.

### 5. Social Accountability Framing

Sub-agent prompts are weighted with explicit consequences for failure. Instead of generic instructions like "review this code," each role gets clear downstream costs:

- **Implementer:** "A missed test case ships regressions. A bug wastes a full validation cycle."
- **Spec Reviewer:** "A false positive wastes a cycle. A missed spec gap ships without a feature."
- **Code Reviewer:** "You are the LAST gate before production. Structural issues compound tech debt."

### Integration Flow

These five protocols integrate into the standard Superpowers workflow at strategic gates:

```text
[Deliberation Gate] — before architecture for complex tasks
         ↓
  brainstorming → design → user approval
         ↓
  [Security Triage] — before every task, hard-coded pattern matching
         ↓
  writing-plans → implementation plan → user approval
         ↓
  [Social Accountability] — injected into sub-agent dispatch prompts
         ↓
  subagent-driven-development → task-by-task with reviews
         ↓
    [ASI Loop] — when multiple issues found in overlapping code
    [Hash Verification] — for security-critical patches
         ↓
  finishing-a-development-branch → merge / PR / cleanup
```

## How It Works

When OpenCode starts with this configuration:

1. The **Superpowers plugin** loads and injects its bootstrap, making skills auto-trigger based on context.
2. **AGENTS.md** is loaded as the highest-priority instruction, forcing the agent to follow the Superpowers workflow.
3. The **Zeus agent** is used by default, giving every session an orchestrator mindset.
4. **Enhanced skills** are registered via `skills.paths`, making them available for the orchestrator to invoke.

The result is an agent that:

- Runs security triage before every task (pattern matching, not judgment)
- Brainstorms before building (explores intent, proposes approaches)
- Deliberates before architecture (triple-critique for complex tasks)
- Writes plans with bite-sized tasks (3-5 minutes each, complete code in every step)
- Dispatches sub-agents with accountability-weighted prompts
- Uses ASI Loop when fixing batch issues (one fix at a time, re-scan between each)
- Verifies file integrity with SHA-256 hashing for security-critical work
- Reviews spec compliance then code quality between tasks
- Never claims completion without fresh verification evidence

## Project Structure

```text
superpowers-enhanced/
├── AGENTS.md              # User instructions (highest priority)
├── opencode-template.json # OpenCode configuration template
├── install.sh             # One-liner installer (Linux / macOS / WSL)
├── install.ps1            # One-liner installer (Windows PowerShell)
├── setup.mjs              # Installer script (cross-platform Node.js)
├── uninstall.mjs          # Uninstaller script (cross-platform Node.js)
├── agent/
│   └── zeus.md            # Custom orchestrator agent (default)
├── prompts/
│   ├── implementer.md           # Pre-framed implementer prompt
│   ├── spec-reviewer.md         # Pre-framed spec reviewer prompt
│   └── code-quality-reviewer.md # Pre-framed code quality reviewer prompt
├── scripts/
│   └── verify-hash.sh     # Ephemeral State Hashing (anti-TOCTOU)
└── skills/
    ├── asi-loop/           # ASI Batch Patching protocol
    ├── deliberation-gate/  # Multi-perspective architecture audit
    ├── security-triage/    # Hard-coded security trigger rules
    └── social-accountability/ # Consequence-weighted sub-agent framing
```

## Updating

```bash
cd ~/superpowers-enhanced
git pull
node setup.mjs --force
```

Changes take effect after restarting OpenCode.

## Uninstall

```bash
cd ~/superpowers-enhanced
node uninstall.mjs
```

This reverts the `opencode.json` merge, removes the copied files and directories, and restores your most recent backup if one exists.

To fully remove the Superpowers plugin from OpenCode, also edit your `opencode.json`:

```diff
- "superpowers@git+https://github.com/obra/superpowers.git",
```

## Troubleshooting

### "Superpowers is not installed" error

1. Add the plugin to `~/.config/opencode/opencode.json`:
   ```json
   "plugin": ["superpowers@git+https://github.com/obra/superpowers.git"]
   ```
2. Restart OpenCode so it resolves and installs the plugin.
3. Run `node setup.mjs --force` again.

### Enhanced skills not auto-triggering

1. Verify the files exist: `ls ~/.config/opencode/skills/superpowers-enhanced/`
2. Check `skills.paths` in `opencode.json` contains `"skills/superpowers-enhanced"`
3. Verify each skill has a valid `SKILL.md` with YAML frontmatter
4. Restart OpenCode — skills are loaded at startup

### Agent jumps straight to implementation

This means the Superpowers plugin or AGENTS.md is not being loaded. Check:

1. The plugin is in your `opencode.json` plugin array and OpenCode has been restarted
2. `~/.config/opencode/AGENTS.md` exists and is readable
3. Your `opencode.json` has `"instructions": ["AGENTS.md"]` set

### Setup script fails

The installer requires Node.js (which OpenCode also requires). Install Node.js from [nodejs.org](https://nodejs.org/) if not already available.

If you encounter permission errors, check that `~/.config/opencode/` is writable by your user.
