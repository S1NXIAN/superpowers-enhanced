# Architecture Refactoring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract shared utilities from `setup.mjs` and `uninstall.mjs` into a modular `lib/` layer, add comprehensive test coverage using `node:test`, implement JSON schema validation, and establish a `package.json`.

**Architecture:** Four focused ES modules under `lib/` (constants, console, fs-utils, config-schema), refactored entry points importing from `lib/`, comprehensive `node:test` test suite with temp directory isolation for integration tests.

**Tech Stack:** Node.js ≥18, ESM modules (`.mjs`), `node:test`, `node:assert/strict`

---

### Task 1: Create `package.json` and `lib/constants.mjs` with Tests

**Files:**
* Create: `package.json`
* Create: `lib/constants.mjs`
* Create: `tests/lib/constants.test.mjs`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "superpowers-enhanced",
  "version": "1.0.0",
  "description": "A high-discipline engineering pipeline and quality gate overlay for OpenCode",
  "type": "module",
  "scripts": {
    "test": "node --test tests/**/*.test.mjs",
    "test:unit": "node --test tests/lib/*.test.mjs",
    "test:integration": "node --test tests/integration/*.test.mjs",
    "test:agent": "node --test tests/agent/*.test.mjs",
    "setup": "node setup.mjs",
    "uninstall": "node uninstall.mjs"
  },
  "engines": {
    "node": ">=18"
  },
  "license": "MIT"
}
```

- [ ] **Step 2: Write failing tests for `lib/constants.mjs`**

```javascript
// tests/lib/constants.test.mjs
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  SUPERPOWERS_PLUGIN,
  SKILLS_PATH,
  CONFIG_DIR,
  CONFIG_JSON_PATH,
  BACKUP_PARENT,
  FILE_COPIES,
  DIR_COPIES,
  MANAGED_FILES,
  MANAGED_DIRS,
} from '../../lib/constants.mjs';

describe('lib/constants', () => {
  it('exports SUPERPOWERS_PLUGIN as a non-empty string', () => {
    assert.equal(typeof SUPERPOWERS_PLUGIN, 'string');
    assert.ok(SUPERPOWERS_PLUGIN.length > 0);
    assert.ok(SUPERPOWERS_PLUGIN.includes('superpowers'));
  });

  it('exports SKILLS_PATH as a non-empty string', () => {
    assert.equal(typeof SKILLS_PATH, 'string');
    assert.ok(SKILLS_PATH.length > 0);
  });

  it('exports CONFIG_DIR as an absolute path', () => {
    assert.equal(typeof CONFIG_DIR, 'string');
    assert.ok(CONFIG_DIR.startsWith('/') || CONFIG_DIR.match(/^[A-Z]:\\/));
    assert.ok(CONFIG_DIR.includes('opencode'));
  });

  it('exports CONFIG_JSON_PATH ending in opencode.json', () => {
    assert.ok(CONFIG_JSON_PATH.endsWith('opencode.json'));
    assert.ok(CONFIG_JSON_PATH.startsWith(CONFIG_DIR));
  });

  it('exports BACKUP_PARENT under CONFIG_DIR', () => {
    assert.ok(BACKUP_PARENT.startsWith(CONFIG_DIR));
    assert.ok(BACKUP_PARENT.includes('.backups'));
  });

  it('exports FILE_COPIES as array with required properties', () => {
    assert.ok(Array.isArray(FILE_COPIES));
    assert.ok(FILE_COPIES.length > 0);
    for (const entry of FILE_COPIES) {
      assert.equal(typeof entry.repoRel, 'string');
      assert.equal(typeof entry.configRel, 'string');
      assert.equal(typeof entry.executable, 'boolean');
    }
  });

  it('exports DIR_COPIES as array with required properties', () => {
    assert.ok(Array.isArray(DIR_COPIES));
    assert.ok(DIR_COPIES.length > 0);
    for (const entry of DIR_COPIES) {
      assert.equal(typeof entry.repoRel, 'string');
      assert.equal(typeof entry.configRel, 'string');
    }
  });

  it('exports MANAGED_FILES as non-empty array of strings', () => {
    assert.ok(Array.isArray(MANAGED_FILES));
    assert.ok(MANAGED_FILES.length > 0);
    for (const entry of MANAGED_FILES) {
      assert.equal(typeof entry, 'string');
    }
  });

  it('exports MANAGED_DIRS as non-empty array of strings', () => {
    assert.ok(Array.isArray(MANAGED_DIRS));
    assert.ok(MANAGED_DIRS.length > 0);
    for (const entry of MANAGED_DIRS) {
      assert.equal(typeof entry, 'string');
    }
  });

  it('MANAGED_FILES matches FILE_COPIES configRel values', () => {
    const configRels = FILE_COPIES.map(fc => fc.configRel);
    for (const managed of MANAGED_FILES) {
      assert.ok(configRels.includes(managed), `${managed} not in FILE_COPIES`);
    }
  });

  it('MANAGED_DIRS matches DIR_COPIES configRel values', () => {
    const configRels = DIR_COPIES.map(dc => dc.configRel);
    for (const managed of MANAGED_DIRS) {
      assert.ok(configRels.includes(managed), `${managed} not in DIR_COPIES`);
    }
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**
```bash
node --test tests/lib/constants.test.mjs
```
Expected: FAIL — module `../../lib/constants.mjs` not found.

- [ ] **Step 4: Implement `lib/constants.mjs`**

Extract constants from `setup.mjs` lines 11-16, 295-304 and `uninstall.mjs` lines 10-16, 151-160:

```javascript
// lib/constants.mjs
import { join } from 'node:path';
import { homedir } from 'node:os';

export const SUPERPOWERS_PLUGIN = 'superpowers@git+https://github.com/obra/superpowers.git';
export const SKILLS_PATH = 'skills/superpowers-enhanced';

export const CONFIG_DIR = join(homedir(), '.config', 'opencode');
export const CONFIG_JSON_PATH = join(CONFIG_DIR, 'opencode.json');
export const BACKUP_PARENT = join(CONFIG_DIR, '.backups');

export const FILE_COPIES = [
  { repoRel: 'AGENTS.md', configRel: 'AGENTS.md', executable: false },
  { repoRel: 'agent/zeus.md', configRel: 'agent/zeus.md', executable: false },
  { repoRel: 'scripts/verify-hash.sh', configRel: 'scripts/verify-hash.sh', executable: true },
];

export const DIR_COPIES = [
  { repoRel: 'skills', configRel: SKILLS_PATH },
  { repoRel: 'prompts', configRel: 'prompts' },
];

export const MANAGED_FILES = FILE_COPIES.map(fc => fc.configRel);
export const MANAGED_DIRS = DIR_COPIES.map(dc => dc.configRel);
```

- [ ] **Step 5: Run tests to verify they pass**
```bash
node --test tests/lib/constants.test.mjs
```
Expected: All tests PASS.

- [ ] **Step 6: Commit**
```bash
git add package.json lib/constants.mjs tests/lib/constants.test.mjs
git commit -m "feat: add package.json and extract lib/constants.mjs with tests"
```

---

### Task 2: Create `lib/console.mjs` with Tests

**Files:**
* Create: `lib/console.mjs`
* Create: `tests/lib/console.test.mjs`

- [ ] **Step 1: Write failing tests for `lib/console.mjs`**

```javascript
// tests/lib/console.test.mjs
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createConsole } from '../../lib/console.mjs';

describe('lib/console', () => {
  describe('createConsole()', () => {
    it('returns an object with all expected output functions', () => {
      const con = createConsole(false);
      assert.equal(typeof con.c, 'function');
      assert.equal(typeof con.outInfo, 'function');
      assert.equal(typeof con.outOk, 'function');
      assert.equal(typeof con.outWarn, 'function');
      assert.equal(typeof con.outError, 'function');
      assert.equal(typeof con.outHeader, 'function');
      assert.equal(typeof con.outSubdued, 'function');
    });

    it('in non-TTY mode, c() returns raw string without ANSI codes', () => {
      const con = createConsole(false);
      const result = con.c('\\x1b[31m', 'hello');
      assert.equal(result, 'hello');
    });

    it('in TTY mode, c() wraps string with ANSI codes', () => {
      const con = createConsole(true);
      const result = con.c('\\x1b[31m', 'hello');
      assert.ok(result.includes('\\x1b[31m'));
      assert.ok(result.includes('hello'));
      assert.ok(result.includes('\\x1b[0m'));
    });

    it('exports color code constants', () => {
      const con = createConsole(true);
      assert.equal(typeof con.BOLD, 'string');
      assert.equal(typeof con.DIM, 'string');
      assert.equal(typeof con.RED, 'string');
      assert.equal(typeof con.GREEN, 'string');
      assert.equal(typeof con.YELLOW, 'string');
      assert.equal(typeof con.BLUE, 'string');
    });
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**
```bash
node --test tests/lib/console.test.mjs
```
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `lib/console.mjs`**

```javascript
// lib/console.mjs
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const RESET = '\x1b[0m';

export function createConsole(isTTY = process.stdout.isTTY) {
  const useColor = !!isTTY;

  function c(code, str) {
    return useColor ? `${code}${str}${RESET}` : str;
  }

  return {
    c,
    BOLD, DIM, RED, GREEN, YELLOW, BLUE, RESET,
    outInfo:    (msg) => console.log(`  ${c(BLUE, '\u2022')} ${msg}`),
    outOk:      (msg) => console.log(`  ${c(GREEN, '\u2713')} ${msg}`),
    outWarn:    (msg) => console.log(`  ${c(YELLOW, '\u26A0')} ${msg}`),
    outError:   (msg) => console.log(`  ${c(RED, '\u2717')} ${msg}`),
    outHeader:  (msg) => console.log(`\n${c(BOLD, msg)}`),
    outSubdued: (msg) => console.log(`  ${c(DIM, msg)}`),
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**
```bash
node --test tests/lib/console.test.mjs
```
Expected: All tests PASS.

- [ ] **Step 5: Commit**
```bash
git add lib/console.mjs tests/lib/console.test.mjs
git commit -m "feat: extract lib/console.mjs with factory pattern and tests"
```

---

### Task 3: Create `lib/fs-utils.mjs` with Tests

**Files:**
* Create: `lib/fs-utils.mjs`
* Create: `tests/lib/fs-utils.test.mjs`

- [ ] **Step 1: Write failing tests for `lib/fs-utils.mjs`**

Tests must use `beforeEach`/`afterEach` with `fs.mkdtemp` for temp directory isolation. Test the following functions:

- `readJson(path)` — valid JSON, missing file (returns null), invalid JSON (returns null)
- `writeJson(path, data)` — 2-space indent, trailing newline
- `readJson`/`writeJson` roundtrip
- `copyFileChecked(src, dest, options)` — basic copy, symlink replacement, dry-run mode
- `copyDirRecursive(src, dest, options)` — nested structure
- `backupFile(configRelPath, configDir, backupDir)` — creates backup
- `removeFile(configRel, configDir)` — removes file
- `removeDir(configRel, configDir)` — removes directory tree
- `removeEmptyAncestors(destPath, boundaryDir)` — stops at boundary
- `gitAvailable()` — returns boolean
- `getGitDiff(fileA, fileB)` — returns string

- [ ] **Step 2: Run tests to verify they fail**
```bash
node --test tests/lib/fs-utils.test.mjs
```
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `lib/fs-utils.mjs`**

Consolidate filesystem operations from `setup.mjs` (lines 80-195) and `uninstall.mjs` (lines 70-80, 318-405). All functions accept explicit path parameters — no global state.

- [ ] **Step 4: Run tests to verify they pass**
```bash
node --test tests/lib/fs-utils.test.mjs
```
Expected: All tests PASS.

- [ ] **Step 5: Commit**
```bash
git add lib/fs-utils.mjs tests/lib/fs-utils.test.mjs
git commit -m "feat: extract lib/fs-utils.mjs with comprehensive tests"
```

---

### Task 4: Create `lib/config-schema.mjs` with Tests

**Files:**
* Create: `lib/config-schema.mjs`
* Create: `tests/lib/config-schema.test.mjs`

- [ ] **Step 1: Write failing tests for `lib/config-schema.mjs`**

Test cases:
- Valid minimal config `{}` passes
- Valid full config (all known fields, correct types) passes
- Invalid `plugin` type (not array) → error
- Invalid `default_agent` type (not string) → error
- Invalid `instructions` type (number) → error
- String `instructions` passes (allowed per spec)
- Invalid `skills` type (not object) → error
- Invalid `skills.paths` type (not array) → error
- Unknown top-level key → warning (not error), `valid` still true
- `enable_experimental_skills` specifically → warning
- Plugin array with non-string entry → error
- `skills.paths` with non-string entry → error
- `instructions` array with non-string entry → error
- Result object has `warnings`, `errors`, `valid` properties

- [ ] **Step 2: Run tests to verify they fail**
```bash
node --test tests/lib/config-schema.test.mjs
```

- [ ] **Step 3: Implement `lib/config-schema.mjs`**

Allowlist approach: iterate known schema fields, type-check each. Warn on unknown keys.

```javascript
// lib/config-schema.mjs
const KNOWN_KEYS = new Set([
  '$schema', 'plugin', 'provider', 'autoupdate',
  'default_agent', 'instructions', 'skills', 'model',
]);

export function validateConfig(config) {
  const warnings = [];
  const errors = [];
  // Type checks for known fields ...
  // Unknown key warnings ...
  return { warnings, errors, valid: errors.length === 0 };
}
```

- [ ] **Step 4: Run tests to verify they pass**
```bash
node --test tests/lib/config-schema.test.mjs
```

- [ ] **Step 5: Commit**
```bash
git add lib/config-schema.mjs tests/lib/config-schema.test.mjs
git commit -m "feat: add lib/config-schema.mjs with defensive validation and tests"
```

---

### Task 5: Refactor `setup.mjs` to Use `lib/`

**Files:**
* Modify: `setup.mjs`

- [ ] **Step 1: Refactor `setup.mjs`**

Replace all duplicated utility code with imports from `lib/`:
- Import `SUPERPOWERS_PLUGIN, SKILLS_PATH, CONFIG_DIR, CONFIG_JSON_PATH, FILE_COPIES, DIR_COPIES` from `lib/constants.mjs`
- Import `createConsole` from `lib/console.mjs`
- Import `readJson, writeJson, copyFileChecked, copyDirRecursive, copyDir, backupFile, backupDirContent, ensureBackupDir, gitAvailable, getGitDiff` from `lib/fs-utils.mjs`
- Import `validateConfig` from `lib/config-schema.mjs`
- Remove all inlined utility functions that are now in `lib/`
- Keep setup-specific logic: `parseArgs`, `showHelp`, `checkNodeVersion`, `preflight`, `planJsonMerge`, `planFileChanges`, `planDirChanges`, `displayPlannedChanges`, `confirm`, `installConfig`, `installFiles`, `verify`, `main`
- Add schema validation call in `verify()` function
- Initialize console via `const con = createConsole()` and use `con.outInfo`, `con.outOk`, etc.

Target: ~180 lines.

- [ ] **Step 2: Run existing tests to verify nothing broke**
```bash
node --test tests/lib/*.test.mjs
node tests/agent/zeus-structure.test.mjs
```

- [ ] **Step 3: Run `setup.mjs --help` and `setup.mjs --dry-run` to verify entry point works**
```bash
node setup.mjs --help
node setup.mjs --dry-run
```

- [ ] **Step 4: Commit**
```bash
git add setup.mjs
git commit -m "refactor: slim setup.mjs to use lib/ modules"
```

---

### Task 6: Refactor `uninstall.mjs` to Use `lib/`

**Files:**
* Modify: `uninstall.mjs`

- [ ] **Step 1: Refactor `uninstall.mjs`**

Same pattern as Task 5:
- Import shared modules from `lib/`
- Remove all duplicated utility functions
- Keep uninstall-specific logic: `parseArgs`, `showHelp`, `findLatestBackup`, `planJsonRevert`, `planFileRemovals`, `planDirRemovals`, `planBackupRestores`, `displayPlannedChanges`, `confirm`, `revertConfig`, `restoreFromBackup`, `verify`, `main`
- Initialize console via `createConsole()`

Target: ~180 lines.

- [ ] **Step 2: Run existing tests to verify nothing broke**
```bash
node --test tests/lib/*.test.mjs
```

- [ ] **Step 3: Run `uninstall.mjs --help` and `uninstall.mjs --dry-run` to verify entry point works**
```bash
node uninstall.mjs --help
node uninstall.mjs --dry-run
```

- [ ] **Step 4: Commit**
```bash
git add uninstall.mjs
git commit -m "refactor: slim uninstall.mjs to use lib/ modules"
```

---

### Task 7: Create Integration Tests

**Files:**
* Create: `tests/integration/setup.test.mjs`
* Create: `tests/integration/uninstall.test.mjs`

- [ ] **Step 1: Write integration tests for setup**

Test a full install cycle in a temp directory:
- Create temp dir as fake `CONFIG_DIR`
- Write minimal `opencode.json`
- Import and exercise the setup planning functions
- Verify config state after merge
- Verify managed files would be created

- [ ] **Step 2: Write integration tests for uninstall**

Test uninstall cycle in a temp directory:
- Set up a directory with installed state
- Import and exercise uninstall planning functions
- Verify config entries are reverted
- Verify files are removed

- [ ] **Step 3: Run integration tests**
```bash
node --test tests/integration/*.test.mjs
```

- [ ] **Step 4: Commit**
```bash
git add tests/integration/setup.test.mjs tests/integration/uninstall.test.mjs
git commit -m "test: add integration tests for setup and uninstall lifecycle"
```

---

### Task 8: Migrate `zeus-structure.test.mjs` to `node:test`

**Files:**
* Modify: `tests/agent/zeus-structure.test.mjs`

- [ ] **Step 1: Rewrite using `node:test` `describe`/`it`/`assert`**

Preserve all 25 existing assertions. Replace the manual `check()` function and `process.exit()` pattern with proper `node:test` structure.

- [ ] **Step 2: Run migrated tests**
```bash
node --test tests/agent/zeus-structure.test.mjs
```
Expected: All 25 tests PASS.

- [ ] **Step 3: Commit**
```bash
git add tests/agent/zeus-structure.test.mjs
git commit -m "test: migrate zeus-structure tests to node:test runner"
```

---

### Task 9: Final Verification

- [ ] **Step 1: Run full test suite**
```bash
npm test
```
Expected: All unit, integration, and agent tests PASS.

- [ ] **Step 2: Verify `setup.mjs` and `uninstall.mjs` still function**
```bash
node setup.mjs --help
node setup.mjs --dry-run
node uninstall.mjs --help
node uninstall.mjs --dry-run
```

- [ ] **Step 3: Verify line counts (setup ~180, uninstall ~180)**
```bash
wc -l setup.mjs uninstall.mjs
```

- [ ] **Step 4: Final commit (if any cleanup needed)**
```bash
git add -A && git commit -m "chore: final cleanup after architecture refactor" || true
```
