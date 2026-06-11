import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { DateTime } from '../dist/esm/index.js';

describe('calendar getters', () => {
  it('quarter', () => {
    assert.equal(DateTime.fromISO('2024-01-15').quarter, 1);
    assert.equal(DateTime.fromISO('2024-03-31').quarter, 1);
    assert.equal(DateTime.fromISO('2024-04-01').quarter, 2);
    assert.equal(DateTime.fromISO('2024-06-09').quarter, 2);
    assert.equal(DateTime.fromISO('2024-09-30').quarter, 3);
    assert.equal(DateTime.fromISO('2024-12-31').quarter, 4);
  });

  it('dayOfYear', () => {
    assert.equal(DateTime.fromISO('2024-01-01').dayOfYear, 1);
    assert.equal(DateTime.fromISO('2024-06-09').dayOfYear, 161); // leap year
    assert.equal(DateTime.fromISO('2024-12-31').dayOfYear, 366); // leap year has 366
    assert.equal(DateTime.fromISO('2023-12-31').dayOfYear, 365);
    assert.equal(DateTime.fromISO('2024-03-01').dayOfYear, 61); // Jan 31 + Feb 29 + 1
    assert.equal(DateTime.fromISO('2023-03-01').dayOfYear, 60);
  });

  it('daysInMonth', () => {
    assert.equal(DateTime.fromISO('2024-02-15').daysInMonth, 29); // leap February
    assert.equal(DateTime.fromISO('2023-02-15').daysInMonth, 28);
    assert.equal(DateTime.fromISO('2024-04-15').daysInMonth, 30);
    assert.equal(DateTime.fromISO('2024-01-15').daysInMonth, 31);
  });

  it('isLeapYear', () => {
    assert.ok(DateTime.fromISO('2024-01-01').isLeapYear);
    assert.ok(!DateTime.fromISO('2023-01-01').isLeapYear);
    assert.ok(DateTime.fromISO('2000-01-01').isLeapYear);   // divisible by 400
    assert.ok(!DateTime.fromISO('1900-01-01').isLeapYear);  // divisible by 100 not 400
  });

  it('weekOfYear follows ISO 8601', () => {
    // 2024-01-01 is a Monday → week 1
    assert.equal(DateTime.fromISO('2024-01-01').weekOfYear, 1);
    assert.equal(DateTime.fromISO('2024-06-09').weekOfYear, 23);
    assert.equal(DateTime.fromISO('2024-12-30').weekOfYear, 1); // belongs to 2025 W1
    // 2021-01-01 is a Friday → belongs to 2020 week 53
    assert.equal(DateTime.fromISO('2021-01-01').weekOfYear, 53);
    // 2023-01-01 is a Sunday → still 2022 week 52
    assert.equal(DateTime.fromISO('2023-01-01').weekOfYear, 52);
  });

  it('getters are timezone-aware', () => {
    // 2024-12-31 20:00Z is 2025-01-01 in Tokyo
    const dt = DateTime.fromISO('2024-12-31T20:00:00Z').setTimezone('Asia/Tokyo');
    assert.equal(dt.year, 2025);
    assert.equal(dt.dayOfYear, 1);
    assert.equal(dt.quarter, 1);
  });
});

describe('calendar format tokens', () => {
  const dt = DateTime.fromISO('2024-06-09T10:30:00Z');

  it('Q, DDD/DDDD, W/WW', () => {
    assert.equal(dt.format('Q'), '2');
    assert.equal(dt.format('DDD'), '161');
    assert.equal(dt.format('DDDD'), '161');
    assert.equal(dt.format('W'), '23');
    assert.equal(dt.format('WW'), '23');
    assert.equal(DateTime.fromISO('2024-01-05').format('DDDD'), '005');
    assert.equal(DateTime.fromISO('2024-01-01').format('WW'), '01');
  });

  it('combines with date tokens and literals', () => {
    assert.equal(dt.format('YYYY-[Q]Q [week] WW'), '2024-Q2 week 23');
    assert.equal(dt.format('YYYY-DDDD'), '2024-161');
  });
});

describe('comparison helpers', () => {
  const a = DateTime.fromISO('2024-06-09T10:00:00Z');
  const b = DateTime.fromISO('2024-06-09T12:00:00Z');
  const aCopy = DateTime.fromMilliseconds(a.valueOf());

  it('isSameOrBefore / isSameOrAfter', () => {
    assert.ok(a.isSameOrBefore(b));
    assert.ok(a.isSameOrBefore(aCopy));
    assert.ok(!b.isSameOrBefore(a));

    assert.ok(b.isSameOrAfter(a));
    assert.ok(a.isSameOrAfter(aCopy));
    assert.ok(!a.isSameOrAfter(b));
  });
});

describe('DateTime.min / max', () => {
  const a = DateTime.fromISO('2024-01-01T00:00:00Z');
  const b = DateTime.fromISO('2024-06-09T00:00:00Z');
  const c = DateTime.fromISO('2024-12-31T00:00:00Z');

  it('min returns earliest, max returns latest', () => {
    assert.equal(DateTime.min(b, a, c).toISO(), a.toISO());
    assert.equal(DateTime.max(b, a, c).toISO(), c.toISO());
  });

  it('single argument returns itself', () => {
    assert.equal(DateTime.min(b), b);
    assert.equal(DateTime.max(b), b);
  });

  it('preserves the winning instance (timezone/locale)', () => {
    const tokyo = b.setTimezone('Asia/Tokyo');
    assert.equal(DateTime.min(c, tokyo).timezone, 'Asia/Tokyo');
  });

  it('throws with no arguments', () => {
    assert.throws(() => DateTime.min());
    assert.throws(() => DateTime.max());
  });
});
