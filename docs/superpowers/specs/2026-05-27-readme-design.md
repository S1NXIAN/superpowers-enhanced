# Design Spec: Rewriting the README.md

This specification details the structure, content, and formatting rules for rewriting the `README.md` file of the **Superpowers Enhanced** project.

## 1. Goals & Value Proposition

The rewritten README should:
* Clarify the differences between standard OpenCode workflows and the high-discipline environment provided by Superpowers Enhanced.
* Provide an immediate, copy-pasteable installation path for developers.
* Document the internal protocols (the six quality gates) and classification heuristics (Zeus routing) clearly without overloading the reader.
* Align with the tone, structure, and professional look of high-quality sample READMEs.

## 2. Structure & Sections

The rewritten README will consist of:

1. **Title Header**
   * Centered `⚡ Superpowers Enhanced` title.
   * Curated badges for Node.js compatibility (`>=18`), Installers (Bash & PowerShell), License (MIT), and GitHub star call-to-action.
   * Navigation links linking directly to sections.

2. **Core Concept Comparison Table**
   * Clear comparison table demonstrating how Superpowers Enhanced enforces design, security, critiques, and tests compared to default OpenCode implementation-first behavior.

3. **Quick Start**
   * Prerequisites for Unix/WSL/macOS (Node.js LTS, Git, Bash) and Windows (PowerShell 7+).
   * One-line script install commands for Unix/macOS (`curl` via `bash`) and Windows (`irm` via `iex`).
   * Manual setup steps (`git clone` followed by interactive `setup.mjs` instructions).
   * Verification steps to verify config files, default agent setting (`zeus`), and skill path registration.

4. **Complexity-Aware Routing (Zeus Orchestrator)**
   * Explanation of heuristic routing (Fast Path vs Full Path).
   * Mermaid or ASCII flowchart showing decision making.
   * Heuristic metrics table (Files modified, keywords, security triggers, scope).
   * Instruction on manual override tags (`@quick` and `@full`).

5. **The Six Quality Gates**
   * Separate detailed items for the six quality assurance protocols:
     * **Security Triage**:zero-trust file path, content, and folder scans. (With `> [!IMPORTANT]` block).
     * **Deliberation Gate**: Skeptic, Minimalist, and Maintainer critiques.
     * **Social Accountability**: Consequence-weighted sub-agent prompt templates.
     * **ASI Loop**: Sequential single-bug patching.
     * **Ephemeral State Hashing**: Anti-TOCTOU SHA-256 validation.
     * **Self-Consistency**: Multi-path reasoning for debugging and verification.

6. **Project Structure**
   * A clean, formatted directory tree mapping the files in the repository.

7. **Troubleshooting & Uninstallation**
   * Sections for config validation issues (addressing `enable_experimental_skills` constraints) and uninstallation commands.

## 3. Formatting & Design Rules

* **GFM & Badges**: Use clean flat-square badges.
* **Admonitions**: Use GitHub Markdown syntax:
  ```markdown
  > [!NOTE]
  > Useful information.
  ```
* **No placeholders**: Every code block, path, and link must be fully realized.
* **Conciseness**: Keep paragraphs short and to the point.
* **No LICENSE/CONTRIBUTING sections**: These belong in separate files.
