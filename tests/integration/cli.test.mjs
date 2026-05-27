import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_DIR = join(__dirname, '..', '..');

describe('CLI Integration', () => {
  it('bin/setup.mjs --help executes without error', () => {
    const out = execSync('node bin/setup.mjs --help', { cwd: REPO_DIR, encoding: 'utf8' });
    assert.ok(out.includes('opencode-zeus'));
    assert.ok(out.includes('Usage:'));
  });

  it('bin/setup.mjs --dry-run executes without error', () => {
    const out = execSync('node bin/setup.mjs --dry-run', { cwd: REPO_DIR, encoding: 'utf8' });
    assert.ok(out.includes('Dry run complete.'));
  });

  it('bin/uninstall.mjs --help executes without error', () => {
    const out = execSync('node bin/uninstall.mjs --help', { cwd: REPO_DIR, encoding: 'utf8' });
    assert.ok(out.includes('opencode-zeus'));
    assert.ok(out.includes('Usage:'));
  });

  it('bin/uninstall.mjs --dry-run executes without error', () => {
    const out = execSync('node bin/uninstall.mjs --dry-run', { cwd: REPO_DIR, encoding: 'utf8' });
    assert.ok(out.includes('Dry run complete.'));
  });
});
