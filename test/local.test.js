import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { LocalDate, LocalTime, DateTime } from '../dist/esm/index.js';

describe('LocalDate', () => {
  it('parses strict ISO and rejects bad input', () => {
    assert.equal(LocalDate.fromISO('2024-06-09').toISO(), '2024-06-09');
    assert.throws(() => LocalDate.fromISO('2024-02-30'));
    assert.throws(() => LocalDate.fromISO('2024-13-01'));
    assert.throws(() => LocalDate.fromISO('2024-06-09T10:00')); // has time
    assert.throws(() => LocalDate.fromISO(20240609));
  });

  it('of / fromObject validate', () => {
    assert.equal(LocalDate.of(2024, 6, 9).day, 9);
    assert.throws(() => LocalDate.of(2023, 2, 29));
    assert.equal(LocalDate.fromObject({ year: 2024, month: 6, day: 9 }).month, 6);
  });

  it('getters', () => {
    const d = LocalDate.fromISO('2024-06-09'); // Sunday
    assert.equal(d.weekday, 7);
    assert.equal(d.quarter, 2);
    assert.equal(d.dayOfYear, 161);
    assert.equal(d.daysInMonth, 30);
    assert.ok(d.isLeapYear);
  });

  it('arithmetic is immutable and clamps month-end', () => {
    const d = LocalDate.of(2024, 1, 31);
    assert.equal(d.add({ months: 1 }).toISO(), '2024-02-29');
    assert.equal(d.add({ days: 1 }).toISO(), '2024-02-01');
    assert.equal(d.add({ years: 1, days: 1 }).toISO(), '2025-02-01');
    assert.equal(d.subtract({ days: 31 }).toISO(), '2023-12-31');
    assert.equal(d.toISO(), '2024-01-31'); // unchanged
    assert.throws(() => d.add({ days: Infinity }));
  });

  it('until counts whole days', () => {
    assert.equal(LocalDate.fromISO('2024-06-09').until(LocalDate.fromISO('2024-06-20')), 11);
    assert.equal(LocalDate.fromISO('2024-06-20').until(LocalDate.fromISO('2024-06-09')), -11);
  });

  it('comparison and min/max', () => {
    const a = LocalDate.fromISO('2024-01-01');
    const b = LocalDate.fromISO('2024-06-09');
    assert.ok(a.isBefore(b));
    assert.ok(b.isAfter(a));
    assert.ok(a.isSameOrBefore(LocalDate.fromISO('2024-01-01')));
    assert.ok(b.isBetween(a, LocalDate.fromISO('2024-12-31')));
    assert.ok(a.equals(LocalDate.of(2024, 1, 1)));
    assert.equal(LocalDate.min(b, a).toISO(), '2024-01-01');
    assert.equal(LocalDate.max(b, a).toISO(), '2024-06-09');
    assert.throws(() => LocalDate.min());
  });

  it('format delegates to date tokens', () => {
    const d = LocalDate.fromISO('2024-06-09');
    assert.equal(d.format('dddd, MMMM D, YYYY'), 'Sunday, June 9, 2024');
    assert.equal(d.format('Q [quarter]'), '2 quarter');
  });

  it('toDateTime attaches time and zone', () => {
    const d = LocalDate.fromISO('2024-06-09');
    assert.equal(d.toDateTime('UTC').toISO(), '2024-06-09T00:00:00.000Z');
    assert.equal(d.toDateTime('Asia/Tokyo', { hour: 9 }).toISO(), '2024-06-09T09:00:00.000+09:00');
  });

  it('fromDateTime drops time and zone', () => {
    const dt = DateTime.fromISO('2024-06-09T23:30:00Z').setTimezone('Asia/Tokyo'); // June 10 in Tokyo
    assert.equal(LocalDate.fromDateTime(dt).toISO(), '2024-06-10');
  });

  it('toJSON / valueOf', () => {
    const d = LocalDate.fromISO('2024-06-09');
    assert.equal(JSON.stringify(d), '"2024-06-09"');
    assert.ok(LocalDate.fromISO('2024-01-01') < LocalDate.fromISO('2024-06-09'));
  });
});

describe('LocalTime', () => {
  it('parses ISO variants', () => {
    assert.equal(LocalTime.fromISO('10:30').toISO(), '10:30:00');
    assert.equal(LocalTime.fromISO('10:30:45').toISO(), '10:30:45');
    assert.equal(LocalTime.fromISO('10:30:45.123').toISO(), '10:30:45.123');
    assert.equal(LocalTime.fromISO('10:30:00.5').millisecond, 500);
    assert.throws(() => LocalTime.fromISO('25:00'));
    assert.throws(() => LocalTime.fromISO('10:60'));
    assert.throws(() => LocalTime.fromISO('foo'));
  });

  it('getters', () => {
    const t = LocalTime.of(10, 30, 45, 123);
    assert.equal(t.hour, 10);
    assert.equal(t.minute, 30);
    assert.equal(t.second, 45);
    assert.equal(t.millisecond, 123);
    assert.equal(t.millisecondOfDay, ((10 * 60 + 30) * 60 + 45) * 1000 + 123);
  });

  it('arithmetic wraps within the day', () => {
    assert.equal(LocalTime.of(10, 30).add({ hours: 2, minutes: 15 }).toISO(), '12:45:00');
    assert.equal(LocalTime.of(23, 30).add({ hours: 1 }).toISO(), '00:30:00');
    assert.equal(LocalTime.of(0, 30).subtract({ hours: 1 }).toISO(), '23:30:00');
    assert.throws(() => LocalTime.of(1, 0).add({ hours: Infinity }));
  });

  it('comparison', () => {
    const a = LocalTime.fromISO('09:00');
    const b = LocalTime.fromISO('17:30');
    assert.ok(a.isBefore(b));
    assert.ok(b.isAfter(a));
    assert.ok(a.equals(LocalTime.of(9, 0)));
    assert.ok(a.isSameOrBefore(LocalTime.of(9, 0)));
  });

  it('format delegates to time tokens', () => {
    const t = LocalTime.fromISO('15:05:00');
    assert.equal(t.format('h:mm A'), '3:05 PM');
    assert.equal(t.format('HH:mm'), '15:05');
  });

  it('fromDateTime / now', () => {
    const dt = DateTime.fromISO('2024-06-09T15:05:45.500Z');
    assert.equal(LocalTime.fromDateTime(dt).toISO(), '15:05:45.500');
    assert.ok(LocalTime.now() instanceof LocalTime);
  });

  it('toJSON / valueOf', () => {
    assert.equal(JSON.stringify(LocalTime.fromISO('10:30')), '"10:30:00"');
    assert.ok(LocalTime.fromISO('09:00') < LocalTime.fromISO('17:00'));
  });
});
