/**
 * lib/command-guard.mjs
 * Hardened patterns for system-level self-preservation.
 */

export const PATTERNS = {
  CRITICAL: [
    /rm\s+.*(-rf|-f|--recursive).*\s+(\/|\$HOME|\$USER|\~)/,
    /git\s+push\s+.*(--force|-f)/,
    /chmod\s+.*777/,
    /dd\s+if=.*of=\/dev\/(sd|nvme)/,
    /mkfs\..*/,
    />\s*\/etc\/.*/
  ],
  DANGEROUS: [
    /rm\s+.*-rf/,
    /npm\s+publish/,
    /git\s+reset\s+--hard/,
    /truncate\s+/,
    /drop\s+(table|database|schema)/i,
    /delete\s+from\s+.*/i
  ],
  SUSPICIOUS: [
    /curl\s+.*\s*\|\s*bash/,
    /sudo\s+/,
    /eval\s+/,
    /exec\s+/,
    /ssh\s+/
  ]
};

/**
 * Audit turn-level command execution against somatic integrity rules.
 * @param {string} command - The command about to be executed.
 */
export function checkCommand(command) {
  if (command.startsWith('DANGEROUS_CMD_ACCEPTED=true')) {
    return null;
  }

  for (const pattern of PATTERNS.CRITICAL) {
    if (pattern.test(command)) {
      return { severity: 'CRITICAL', pattern: pattern.toString(), match: pattern };
    }
  }
  for (const pattern of PATTERNS.DANGEROUS) {
    if (pattern.test(command)) {
      return { severity: 'DANGEROUS', pattern: pattern.toString(), match: pattern };
    }
  }
  for (const pattern of PATTERNS.SUSPICIOUS) {
    if (pattern.test(command)) {
      return { severity: 'SUSPICIOUS', pattern: pattern.toString(), match: pattern };
    }
  }
  return null;
}
