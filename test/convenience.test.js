import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { DateTime, Duration } from '../dist/esm/index.js';

describe('DateTime convenience methods', () => {
  describe('clone', () => {
    it('creates independent copy', () => {
      const dt = DateTime.fromISO('2024-06-09T10:30:00Z');
      const cloned = dt.clone();

      assert.equal(dt.toISO(), cloned.toISO());
      assert.equal(dt.timezone, cloned.timezone);
    });

    it('clone preserves timezone', () => {
      const dt = DateTime.fromISO('2024-06-09T10:30:00', { timezone: 'Asia/Tokyo' });
      const cloned = dt.clone();

      assert.equal(cloned.timezone, 'Asia/Tokyo');
    });

    it('clone is independent (immutability)', () => {
      const dt1 = DateTime.fromISO('2024-06-09T10:30:00Z');
      const dt2 = dt1.clone().add({ days: 1 });

      assert.notEqual(dt1.toISO(), dt2.toISO());
    });
  });

  describe('isSameDay', () => {
    it('compares dates ignoring time', () => {
      const dt1 = DateTime.fromISO('2024-06-09T10:30:00Z');
      const dt2 = DateTime.fromISO('2024-06-09T22:00:00Z');

      assert.ok(dt1.isSameDay(dt2));
    });

    it('returns false for different dates', () => {
      const dt1 = DateTime.fromISO('2024-06-09T10:30:00Z');
      const dt2 = DateTime.fromISO('2024-06-10T10:30:00Z');

      assert.ok(!dt1.isSameDay(dt2));
    });

    it('ignores timezone in comparison', () => {
      const dt1 = DateTime.fromISO('2024-06-09T10:30:00Z');
      const dt2 = DateTime.fromISO('2024-06-09T22:00:00+09:00', { timezone: 'Asia/Tokyo' });

      // dt2 is 2024-06-09 in Tokyo, so should be same day
      assert.ok(dt1.isSameDay(dt2));
    });

    it('handles year boundaries', () => {
      const dt1 = DateTime.fromISO('2024-12-31T23:59:59Z');
      const dt2 = DateTime.fromISO('2025-01-01T00:00:00Z');

      assert.ok(!dt1.isSameDay(dt2));
    });
  });

  describe('daysUntil', () => {
    it('calculates days to future date', () => {
      const dt1 = DateTime.fromISO('2024-06-09T10:30:00Z');
      const dt2 = DateTime.fromISO('2024-06-19T22:00:00Z');

      assert.equal(dt1.daysUntil(dt2), 10);
    });

    it('calculates negative days to past date', () => {
      const dt1 = DateTime.fromISO('2024-06-09T10:30:00Z');
      const dt2 = DateTime.fromISO('2024-05-30T22:00:00Z');

      assert.equal(dt1.daysUntil(dt2), -10);
    });

    it('returns 0 for same day', () => {
      const dt1 = DateTime.fromISO('2024-06-09T10:30:00Z');
      const dt2 = DateTime.fromISO('2024-06-09T22:00:00Z');

      assert.equal(dt1.daysUntil(dt2), 0);
    });

    it('counts whole days', () => {
      const dt1 = DateTime.fromISO('2024-06-09T23:00:00Z');
      const dt2 = DateTime.fromISO('2024-06-10T23:00:00Z');

      // Exactly 1 day apart
      assert.equal(dt1.daysUntil(dt2), 1);
    });

    it('handles timezone in calculation', () => {
      const dt1 = DateTime.fromISO('2024-06-09T10:30:00Z', { timezone: 'UTC' });
      const dt2 = DateTime.fromISO('2024-06-19T10:30:00Z', { timezone: 'Asia/Tokyo' });

      // 10 days apart regardless of timezone
      assert.equal(dt1.daysUntil(dt2), 10);
    });

    it('handles year boundaries', () => {
      const dt1 = DateTime.fromISO('2024-12-31T10:30:00Z');
      const dt2 = DateTime.fromISO('2025-01-01T10:30:00Z');

      assert.equal(dt1.daysUntil(dt2), 1);
    });
  });
});

describe('Duration convenience methods', () => {
  describe('isZero', () => {
    it('returns true for zero duration', () => {
      const d = Duration.fromObject({});
      assert.ok(d.isZero());
    });

    it('returns false for positive duration', () => {
      const d = Duration.fromObject({ hours: 1 });
      assert.ok(!d.isZero());
    });

    it('returns false for negative duration', () => {
      const d = Duration.fromObject({ hours: -1 });
      assert.ok(!d.isZero());
    });

    it('recognizes zero even with offset fields', () => {
      const d = Duration.fromObject({ days: 1, hours: -24 });
      assert.ok(d.isZero());
    });
  });

  describe('isNegative', () => {
    it('returns true for negative duration', () => {
      const d = Duration.fromObject({ hours: -1 });
      assert.ok(d.isNegative());
    });

    it('returns false for zero duration', () => {
      const d = Duration.fromObject({});
      assert.ok(!d.isNegative());
    });

    it('returns false for positive duration', () => {
      const d = Duration.fromObject({ hours: 1 });
      assert.ok(!d.isNegative());
    });
  });

  describe('roundtrip with negate', () => {
    it('negating positive becomes negative', () => {
      const d = Duration.fromObject({ hours: 5, minutes: 30 });
      const negated = d.negate();

      assert.ok(!d.isNegative());
      assert.ok(negated.isNegative());
    });

    it('double negation restores original', () => {
      const d = Duration.fromObject({ hours: 5, minutes: 30 });
      const restored = d.negate().negate();

      assert.equal(d.totalMilliseconds, restored.totalMilliseconds);
    });

    it('negating zero stays zero', () => {
      const d = Duration.fromObject({});
      const negated = d.negate();

      assert.ok(negated.isZero());
    });
  });
});
