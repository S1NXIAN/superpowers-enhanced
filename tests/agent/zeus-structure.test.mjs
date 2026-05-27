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
check('Has T1-T3 mentioned (classification or triage)', content.includes('T1-T3'));

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
check('Still references subagent dispatch', content.includes('subagent'));
check('Still has deliberation gate trigger', content.includes('deliberation-gate'));
check('Still references social-accountability', content.includes('social-accountability'));

console.log(`\n${failures === 0 ? '✓ All tests passed' : `✗ ${failures} test(s) failed`}`);
process.exit(failures > 0 ? 1 : 0);
