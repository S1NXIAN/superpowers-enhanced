# CLI Reorganization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clean up the root directory by moving CLI tools and installers into `bin/`, `installers/`, and `templates/` folders.

**Architecture:** We are moving files and updating internal references (`__dirname` -> `join(__dirname, '..')`) and package.json pointers. The one-liner documentation will be updated to point to the new remote paths.

**Tech Stack:** Node.js, bash, powershell.

---

### Task 1: Create Directories and Move Files

**Files:**
- Create: `bin/`, `installers/`, `templates/`
- Modify: (Moves files via `git mv`)

- [ ] **Step 1: Create Directories**

```bash
mkdir -p bin installers templates
```

- [ ] **Step 2: Move files via git**

```bash
git mv setup.mjs bin/setup.mjs
git mv uninstall.mjs bin/uninstall.mjs
git mv install.sh installers/install.sh
git mv install.ps1 installers/install.ps1
git mv uninstall.sh installers/uninstall.sh
git mv uninstall.ps1 installers/uninstall.ps1
git mv opencode-template.json templates/opencode-template.json
```

- [ ] **Step 3: Commit**

```bash
git commit -m "refactor: relocate files to bin, installers, and templates"
```

---

### Task 2: Update Node CLI Scripts

**Files:**
- Modify: `bin/setup.mjs`
- Modify: `bin/uninstall.mjs`

- [ ] **Step 1: Update REPO_DIR in bin/setup.mjs**

```javascript
// Change:
const REPO_DIR = __dirname;
// To:
const REPO_DIR = join(__dirname, '..');
```

- [ ] **Step 2: Update REPO_DIR in bin/uninstall.mjs**

```javascript
// Change:
const REPO_DIR = __dirname;
// To:
const REPO_DIR = join(__dirname, '..');
```

- [ ] **Step 3: Run existing CLI tests**

Run: `node --test tests/integration/cli.test.mjs`
Expected: FAIL (because `package.json` setup scripts haven't been updated yet, but wait, the tests run `node setup.mjs` which will fail because the files moved!).

Let's fix the tests first.

- [ ] **Step 4: Update CLI tests to use new paths**

Modify `tests/integration/cli.test.mjs`:
```javascript
// Change:
const out = execSync('node setup.mjs --help', { cwd: REPO_DIR, encoding: 'utf8' });
// To:
const out = execSync('node bin/setup.mjs --help', { cwd: REPO_DIR, encoding: 'utf8' });

// Change:
const out = execSync('node setup.mjs --dry-run', { cwd: REPO_DIR, encoding: 'utf8' });
// To:
const out = execSync('node bin/setup.mjs --dry-run', { cwd: REPO_DIR, encoding: 'utf8' });

// Change:
const out = execSync('node uninstall.mjs --help', { cwd: REPO_DIR, encoding: 'utf8' });
// To:
const out = execSync('node bin/uninstall.mjs --help', { cwd: REPO_DIR, encoding: 'utf8' });

// Change:
const out = execSync('node uninstall.mjs --dry-run', { cwd: REPO_DIR, encoding: 'utf8' });
// To:
const out = execSync('node bin/uninstall.mjs --dry-run', { cwd: REPO_DIR, encoding: 'utf8' });
```

- [ ] **Step 5: Run CLI tests**

Run: `node --test tests/integration/cli.test.mjs`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add bin/setup.mjs bin/uninstall.mjs tests/integration/cli.test.mjs
git commit -m "fix: update REPO_DIR path in CLI scripts and update tests"
```

---

### Task 3: Update `package.json`

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Update scripts in package.json**

```json
  "scripts": {
    "test": "node --test tests/**/*.test.mjs",
    "test:unit": "node --test tests/lib/*.test.mjs",
    "test:integration": "node --test tests/integration/*.test.mjs",
    "test:agent": "node --test tests/agent/*.test.mjs",
    "setup": "node bin/setup.mjs",
    "uninstall": "node bin/uninstall.mjs"
  },
```

- [ ] **Step 2: Verify npm scripts run**

Run: `npm run setup -- --help`
Expected: PASS (Displays setup help)

Run: `npm run uninstall -- --help`
Expected: PASS (Displays uninstall help)

- [ ] **Step 3: Commit**

```bash
git add package.json
git commit -m "fix: update package.json scripts to point to bin/ directory"
```

---

### Task 4: Update Documentation and Installer Shell Scripts

**Files:**
- Modify: `README.md`
- Modify: `installers/install.sh`
- Modify: `installers/install.ps1`
- Modify: `installers/uninstall.sh`
- Modify: `installers/uninstall.ps1`

- [ ] **Step 1: Update README.md quick start URLs**

Update `README.md` to use `/main/installers/install.sh` and `/main/installers/install.ps1`.
Update manual instructions from `node setup.mjs` to `node bin/setup.mjs`.

- [ ] **Step 2: Update Shell scripts**

In `installers/install.sh`, change:
`node setup.mjs "$@"` to `node bin/setup.mjs "$@"`

In `installers/install.ps1`, change:
`node setup.mjs --force` to `node bin/setup.mjs --force` (or whatever arguments it passes).

In `installers/uninstall.sh`, change:
`node uninstall.mjs "$@"` to `node bin/uninstall.mjs "$@"`

In `installers/uninstall.ps1`, change:
`node uninstall.mjs --force` to `node bin/uninstall.mjs --force`

- [ ] **Step 3: Commit**

```bash
git add README.md installers/
git commit -m "docs: update paths in README and shell scripts"
```
