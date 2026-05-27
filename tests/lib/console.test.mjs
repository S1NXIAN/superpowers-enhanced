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
      const result = con.c('\x1b[31m', 'hello');
      assert.equal(result, 'hello');
    });

    it('in TTY mode, c() wraps string with ANSI codes and RESET', () => {
      const con = createConsole(true);
      const result = con.c('\x1b[31m', 'hello');
      assert.ok(result.includes('\x1b[31m'));
      assert.ok(result.includes('hello'));
      assert.ok(result.includes('\x1b[0m'));
    });

    it('exports ANSI color code constants as strings', () => {
      const con = createConsole(true);
      assert.equal(typeof con.BOLD, 'string');
      assert.equal(typeof con.DIM, 'string');
      assert.equal(typeof con.RED, 'string');
      assert.equal(typeof con.GREEN, 'string');
      assert.equal(typeof con.YELLOW, 'string');
      assert.equal(typeof con.BLUE, 'string');
      assert.equal(typeof con.RESET, 'string');
    });

    it('BOLD constant matches expected ANSI code', () => {
      const con = createConsole(true);
      assert.equal(con.BOLD, '\x1b[1m');
    });

    it('non-TTY console c() strips all provided ANSI codes', () => {
      const con = createConsole(false);
      assert.equal(con.c(con.BOLD, 'test'), 'test');
      assert.equal(con.c(con.RED, 'test'), 'test');
      assert.equal(con.c(con.GREEN, 'test'), 'test');
    });

    it('TTY console c() applies RESET at end', () => {
      const con = createConsole(true);
      const result = con.c(con.RED, 'error');
      assert.ok(result.endsWith(con.RESET));
      assert.ok(result.startsWith(con.RED));
    });
  });
});
