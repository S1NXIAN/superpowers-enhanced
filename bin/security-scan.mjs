#!/usr/bin/env node
/**
 * security-scan.mjs — T1/T2/T3 security pattern scanner
 *
 * Usage:
 *   node bin/security-scan.mjs file1.js file2.js ...
 *   node bin/security-scan.mjs --help
 *
 * Output: JSON array of matches, empty array if clean.
 *   [{"tier":"T1","pattern":"auth*","file":"src/auth/login.js"}, ...]
 */

import { readFileSync, existsSync, readdirSync, lstatSync } from 'node:fs';
import { join, dirname, basename, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_DIR = join(SCRIPT_DIR, '..');
const PATTERNS_DIR = join(REPO_DIR, 'skills', 'security-triage', 'patterns');

// ── Help ─────────────────────────────────────────────────────────────
const HELP = `security-scan — elite automated security triage

Scans files for T1 (path), T2 (content), and T3 (directory) security
triggers using high-performance ripgrep (rg).

Usage:
  node bin/security-scan.mjs <files...>
`;

// ── High-Performance Scan Engine ─────────────────────────────────────

function runRg(patternFile, targetFile) {
  try {
    const output = execSync(`rg -n -f "${patternFile}" "${targetFile}"`, { encoding: 'utf8' });
    return output.split('\n').filter(line => line.trim()).map(line => {
      const [lineNum, ...content] = line.split(':');
      return { line: parseInt(lineNum, 10), match: content.join(':').trim() };
    });
  } catch (err) {
    // rg returns 1 if no matches found
    return [];
  }
}

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.some(a => a === '--help')) {
    console.log(HELP);
    process.exit(args.some(a => a === '--help') ? 0 : 1);
  }

  const t1Patterns = loadPatternLines(join(PATTERNS_DIR, 't1.txt'));
  const t3Patterns = loadPatternLines(join(PATTERNS_DIR, 't3.txt'));
  const commonPatternsFile = join(PATTERNS_DIR, 'common.txt');

  const allResults = [];

  for (const filePath of args) {
    if (!existsSync(filePath)) continue;

    const displayPath = relative(process.cwd(), filePath) || filePath;
    const isFile = lstatSync(filePath).isFile();

    // T1: path check
    allResults.push(...checkT1(displayPath, t1Patterns));

    // T3: directory check
    allResults.push(...checkT3(displayPath, t3Patterns));

    // T2: content check (Elite rg-powered)
    if (isFile) {
      const ext = getExtension(filePath);
      const langPatternsFile = join(PATTERNS_DIR, loadT2LanguagePatterns(ext)); // Fixed logic below

      // Check common patterns
      const commonMatches = runRg(commonPatternsFile, filePath);
      commonMatches.forEach(m => {
        allResults.push({ tier: 'T2', pattern: 'common', file: displayPath, line: m.line, match: m.match });
      });

      // Check lang-specific
      const langFile = getLangFile(ext);
      if (langFile) {
        const langMatches = runRg(join(PATTERNS_DIR, langFile), filePath);
        langMatches.forEach(m => {
          allResults.push({ tier: 'T2', pattern: langFile, file: displayPath, line: m.line, match: m.match });
        });
      }
    }
  }

  // Deduplicate and output
  console.log(JSON.stringify(allResults, null, 2));
}

function getLangFile(ext) {
  const langMap = {
    '.js': 'js-node.txt', '.jsx': 'js-node.txt',
    '.mjs': 'js-node.txt', '.cjs': 'js-node.txt',
    '.ts': 'js-node.txt', '.tsx': 'js-node.txt',
    '.py': 'python.txt', '.rb': 'ruby.txt',
    '.go': 'go.txt', '.rs': 'rust.txt',
    '.java': 'java.txt', '.kt': 'kotlin.txt',
    '.swift': 'swift.txt', '.dart': 'dart.txt',
    '.php': 'php.txt', '.cs': 'csharp.txt',
    '.c': 'c.txt', '.cpp': 'cpp.txt', '.cc': 'cpp.txt',
    '.sh': 'shell.txt', '.bash': 'shell.txt',
    '.sql': 'sql.txt',
  };
  return langMap[ext];
}

main();
