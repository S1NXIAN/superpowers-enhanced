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
