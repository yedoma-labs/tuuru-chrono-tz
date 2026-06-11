import { describe, it, afterEach } from 'node:test';
import assert from 'node:assert/strict';

import { DateTime, Duration, Timezone, setDefaultLocale, en } from '../dist/esm/index.js';

afterEach(() => setDefaultLocale(en));

/** Assert `fn` runs in under `limitMs` (ReDoS / pathological-input guard) */
function fast(fn, limitMs = 50) {
  const start = performance.now();
  try { fn(); } catch { /* rejection is fine; we only care about time */ }
  const elapsed = performance.now() - start;
  assert.ok(elapsed < limitMs, `took ${elapsed.toFixed(1)}ms (limit ${limitMs}ms)`);
}

describe('ReDoS / pathological input', () => {
  it('fromISO rejects 100k-char inputs quickly', () => {
    fast(() => DateTime.fromISO('1'.repeat(100000)));
    fast(() => DateTime.fromISO('2024-' + '0'.repeat(100000)));
    fast(() => DateTime.fromISO('2024-06-09T10:30:00.' + '9'.repeat(100000) + 'Z'));
  });

  it('Duration.fromISO rejects 100k-char input quickly', () => {
    fast(() => Duration.fromISO('P' + '1'.repeat(100000) + 'Y'));
  });

  it('fromFormat handles huge literal patterns quickly', () => {
    fast(() => DateTime.fromFormat('x'.repeat(50000), '[' + 'a'.repeat(50000) + ']'));
  });
});

describe('format-string injection (fromFormat)', () => {
  it('regex metacharacters in the pattern are literal', () => {
    // '.' must match a literal dot, not any character
    assert.throws(() => DateTime.fromFormat('2024X06X09', 'YYYY.MM.DD'));
    assert.equal(DateTime.fromFormat('2024.06.09', 'YYYY.MM.DD').month, 6);
  });

  it('pattern is fully anchored', () => {
    assert.throws(() => DateTime.fromFormat('prefix2024-06-09', 'YYYY-MM-DD'));
    assert.throws(() => DateTime.fromFormat('2024-06-09suffix', 'YYYY-MM-DD'));
  });

  it('regex-like literals are inert', () => {
    assert.equal(DateTime.fromFormat('2024-06-09 (1)', 'YYYY-MM-DD [(1)]').year, 2024);
    assert.equal(DateTime.fromFormat('2024|06|09', 'YYYY|MM|DD').month, 6);
  });
});

describe('prototype pollution', () => {
  it('dangerous keys are not valid timezones', () => {
    assert.ok(!Timezone.isValid('__proto__'));
    assert.ok(!Timezone.isValid('constructor'));
    assert.ok(!Timezone.isValid('prototype'));
    assert.throws(() => DateTime.now('__proto__'));
    assert.throws(() => DateTime.now('constructor'));
    assert.throws(() => Timezone.getCanonical('__proto__'));
  });

  it('parsing does not pollute Object.prototype', () => {
    try { DateTime.fromFormat('2024-06-09', 'YYYY-MM-DD'); } catch { /* */ }
    Timezone.getCanonical('US/Eastern');
    assert.equal(({}).polluted, undefined);
    assert.ok(!Object.prototype.hasOwnProperty('year'));
    assert.ok(!Object.prototype.hasOwnProperty('month'));
  });
});

describe('non-finite and malformed numeric input', () => {
  it('arithmetic rejects Infinity/NaN components', () => {
    const dt = DateTime.fromISO('2024-06-09');
    assert.throws(() => dt.add({ hours: Infinity }), /finite/);
    assert.throws(() => dt.add({ days: NaN }), /finite/);
    assert.throws(() => dt.subtract({ minutes: -Infinity }), /finite/);
  });

  it('fromObject rejects non-finite components', () => {
    assert.throws(() => DateTime.fromObject({ year: NaN, month: 1, day: 1 }));
    assert.throws(() => DateTime.fromObject({ year: 2024, month: 1, day: Infinity }));
  });

  it('NaN/Infinity timestamps are detectable as invalid', () => {
    assert.ok(!DateTime.fromMilliseconds(NaN).isValid());
    assert.ok(!DateTime.fromMilliseconds(Infinity).isValid());
  });
});

describe('type confusion', () => {
  for (const bad of [123, null, {}, ['2024-06-09'], undefined, true]) {
    it(`fromISO rejects ${JSON.stringify(bad)}`, () => {
      assert.throws(() => DateTime.fromISO(bad));
    });
  }

  it('fromFormat and Duration.fromISO reject non-strings', () => {
    assert.throws(() => DateTime.fromFormat('2024-06-09', 123));
    assert.throws(() => Duration.fromISO(5000));
  });
});

describe('locale tampering resilience', () => {
  it('a structurally invalid global locale does not corrupt later resets', () => {
    try {
      setDefaultLocale({ name: 'evil' });
      DateTime.now().format('MMMM');
    } catch {
      // throwing is acceptable; crashing the process is not
    }
    setDefaultLocale(en);
    assert.equal(DateTime.fromISO('2024-06-09').format('MMMM'), 'June');
  });
});
