import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { DateTime } from '../dist/esm/index.js';

describe('DateTime.fromISO', () => {
  it('parses UTC instant with milliseconds', () => {
    const dt = DateTime.fromISO('2024-06-09T10:30:00.123Z');
    assert.equal(dt.toISO(), '2024-06-09T10:30:00.123Z');
    assert.equal(dt.toUnix(), 1717929000);
  });

  it('parses date-only as midnight UTC', () => {
    const dt = DateTime.fromISO('2024-06-09');
    assert.equal(dt.toISO(), '2024-06-09T00:00:00.000Z');
  });

  it('parses date-only in a timezone', () => {
    const dt = DateTime.fromISO('2024-06-09', { timezone: 'America/New_York' });
    assert.equal(dt.toISO(), '2024-06-09T00:00:00.000-04:00');
  });

  it('parses fixed offset suffix with colon', () => {
    const dt = DateTime.fromISO('2024-06-09T19:30:00+09:00');
    assert.equal(dt.toUTC().toISO(), '2024-06-09T10:30:00.000Z');
  });

  it('parses fixed offset suffix without colon', () => {
    const dt = DateTime.fromISO('2024-06-09T05:00:00-0530');
    assert.equal(dt.toUTC().toISO(), '2024-06-09T10:30:00.000Z');
  });

  it('parses suffix-less string as wall clock in given timezone', () => {
    const dt = DateTime.fromISO('2024-06-09T19:30:00', { timezone: 'Asia/Tokyo' });
    assert.equal(dt.toUTC().toISO(), '2024-06-09T10:30:00.000Z');
  });

  it('pads short millisecond fractions', () => {
    assert.equal(DateTime.fromISO('2024-06-09T00:00:00.5Z').millisecond, 500);
    assert.equal(DateTime.fromISO('2024-06-09T00:00:00.05Z').millisecond, 50);
  });

  it('accepts leap day in leap year', () => {
    assert.equal(DateTime.fromISO('2024-02-29').day, 29);
  });

  for (const bad of [
    '2023-02-29',           // not a leap year
    '2024-02-30',           // impossible day
    '2024-13-01',           // month 13
    '2024-00-01',           // month 0
    '2024-06-00',           // day 0
    '2024-06-09T24:00:00',  // hour 24
    '2024-06-09T10:60:00',  // minute 60
    '2024-06-09T10:30:60',  // second 60
    '2024-06',              // partial
    '2024-6-9',             // unpadded
    '06/09/2024',           // wrong format
    'not a date',
    '',
    '2024-06-09T10:30:00+15:00' // offset out of range
  ]) {
    it(`rejects "${bad}"`, () => {
      assert.throws(() => DateTime.fromISO(bad));
    });
  }

  it('rejects non-string input', () => {
    assert.throws(() => DateTime.fromISO(12345));
    assert.throws(() => DateTime.fromISO(null));
  });
});

describe('DateTime.fromFormat', () => {
  it('parses standard pattern', () => {
    const dt = DateTime.fromFormat('2024-06-09 10:30', 'YYYY-MM-DD HH:mm');
    assert.equal(dt.toISO(), '2024-06-09T10:30:00.000Z');
  });

  it('parses European date with 12-hour clock', () => {
    const dt = DateTime.fromFormat('09/06/2024 7:05 PM', 'DD/MM/YYYY h:mm A');
    assert.equal(dt.hour, 19);
    assert.equal(dt.minute, 5);
  });

  it('handles 12 AM as midnight and 12 PM as noon', () => {
    assert.equal(DateTime.fromFormat('2024-01-01 12:00 AM', 'YYYY-MM-DD hh:mm A').hour, 0);
    assert.equal(DateTime.fromFormat('2024-01-01 12:00 PM', 'YYYY-MM-DD hh:mm A').hour, 12);
  });

  it('supports escaped literals', () => {
    const dt = DateTime.fromFormat('year 2024-01, day 09', '[year] YYYY-MM, [day] DD');
    assert.equal(dt.year, 2024);
    assert.equal(dt.day, 9);
    assert.equal(dt.month, 1);
  });

  it('parses single-digit tokens', () => {
    const dt = DateTime.fromFormat('9.6.2024', 'D.M.YYYY');
    assert.equal(dt.format('YYYY-MM-DD'), '2024-06-09');
  });

  it('interprets in the given timezone', () => {
    const dt = DateTime.fromFormat('2024-06-09 19:30', 'YYYY-MM-DD HH:mm', { timezone: 'Asia/Tokyo' });
    assert.equal(dt.toUTC().toISO(), '2024-06-09T10:30:00.000Z');
  });

  it('rejects input not matching the pattern', () => {
    assert.throws(() => DateTime.fromFormat('2024/06/09', 'YYYY-MM-DD'));
    assert.throws(() => DateTime.fromFormat('2024-06-09 extra', 'YYYY-MM-DD'));
  });

  it('rejects impossible dates', () => {
    assert.throws(() => DateTime.fromFormat('2024-02-30', 'YYYY-MM-DD'));
  });

  it('rejects format without year/month/day', () => {
    assert.throws(() => DateTime.fromFormat('10:30', 'HH:mm'));
  });

  it('rejects 12-hour token without AM/PM', () => {
    assert.throws(() => DateTime.fromFormat('2024-06-09 7', 'YYYY-MM-DD h'));
  });

  it('rejects mixed 12/24-hour tokens', () => {
    assert.throws(() => DateTime.fromFormat('2024-06-09 7 7 AM', 'YYYY-MM-DD H h A'));
  });

  it('rejects duplicate tokens', () => {
    assert.throws(() => DateTime.fromFormat('2024 2024-06-09', 'YYYY YYYY-MM-DD'));
  });

  it('does not treat regex metacharacters in literals as patterns', () => {
    assert.throws(() => DateTime.fromFormat('2024x06x09', 'YYYY.MM.DD'));
    const dt = DateTime.fromFormat('2024.06.09', 'YYYY.MM.DD');
    assert.equal(dt.format('YYYY-MM-DD'), '2024-06-09');
  });
});

describe('DateTime factories', () => {
  it('fromUnix / fromMilliseconds / fromDate round-trip', () => {
    const ms = 1717929000123;
    assert.equal(DateTime.fromMilliseconds(ms).valueOf(), ms);
    assert.equal(DateTime.fromUnix(1717929000).toUnix(), 1717929000);
    assert.equal(DateTime.fromDate(new Date(ms)).valueOf(), ms);
  });

  it('fromObject builds wall-clock time in timezone', () => {
    const dt = DateTime.fromObject(
      { year: 2024, month: 6, day: 9, hour: 19, minute: 30 },
      { timezone: 'Asia/Tokyo' }
    );
    assert.equal(dt.toUTC().toISO(), '2024-06-09T10:30:00.000Z');
  });

  it('fromObject validates ranges', () => {
    assert.throws(() => DateTime.fromObject({ year: 2024, month: 13, day: 1 }));
    assert.throws(() => DateTime.fromObject({ year: 2024, month: 2, day: 30 }));
    assert.throws(() => DateTime.fromObject({ year: 2024, month: 6, day: 9, hour: 24 }));
  });

  it('now/nowUTC return current time', () => {
    const before = Date.now();
    const now = DateTime.now().valueOf();
    const after = Date.now();
    assert.ok(now >= before && now <= after);
    assert.equal(DateTime.nowUTC().timezone, 'UTC');
  });

  it('rejects invalid timezones in all factories', () => {
    assert.throws(() => DateTime.now('Invalid/Zone'));
    assert.throws(() => DateTime.fromUnix(0, 'Invalid/Zone'));
    assert.throws(() => DateTime.fromISO('2024-06-09', { timezone: 'Invalid/Zone' }));
  });

  it("supports 'local' timezone alias", () => {
    const dt = DateTime.now('local');
    assert.notEqual(dt.timezone, 'local');
    assert.ok(dt.timezone.length > 0);
  });
});

describe('DateTime getters', () => {
  const dt = DateTime.fromISO('2024-06-09T10:30:45.123Z');

  it('returns timezone-aware components', () => {
    assert.equal(dt.year, 2024);
    assert.equal(dt.month, 6);
    assert.equal(dt.day, 9);
    assert.equal(dt.hour, 10);
    assert.equal(dt.minute, 30);
    assert.equal(dt.second, 45);
    assert.equal(dt.millisecond, 123);
  });

  it('weekday is ISO (Monday=1, Sunday=7)', () => {
    assert.equal(dt.weekday, 7); // 2024-06-09 is a Sunday
    assert.equal(DateTime.fromISO('2024-06-10').weekday, 1); // Monday
  });

  it('components shift with timezone', () => {
    const tokyo = dt.setTimezone('Asia/Tokyo');
    assert.equal(tokyo.hour, 19);
    assert.equal(tokyo.day, 9);
    assert.equal(tokyo.offset, 540);

    const ny = dt.setTimezone('America/New_York');
    assert.equal(ny.hour, 6);
    assert.equal(ny.offset, -240); // DST

    const nyWinter = DateTime.fromISO('2024-01-15T12:00:00Z').setTimezone('America/New_York');
    assert.equal(nyWinter.offset, -300);
  });

  it('day rolls over across timezone conversion', () => {
    const lateUTC = DateTime.fromISO('2024-06-09T23:00:00Z');
    assert.equal(lateUTC.setTimezone('Asia/Tokyo').day, 10);
  });
});

describe('DateTime setters', () => {
  const dt = DateTime.fromISO('2024-06-09T10:30:00Z');

  it('are immutable', () => {
    const changed = dt.setYear(2030);
    assert.equal(changed.year, 2030);
    assert.equal(dt.year, 2024);
  });

  it('set merges components', () => {
    const result = dt.set({ month: 1, day: 15, hour: 0 });
    assert.equal(result.format('YYYY-MM-DD HH:mm'), '2024-01-15 00:30');
  });

  it('setTime resets seconds and milliseconds', () => {
    assert.equal(dt.setTime(23, 45).format('HH:mm:ss.SSS'), '23:45:00.000');
  });

  it('validates merged result', () => {
    assert.throws(() => dt.set({ month: 2, day: 30 }));
    assert.throws(() => dt.set({ hour: 25 }));
  });
});

describe('DateTime arithmetic', () => {
  const dt = DateTime.fromISO('2024-06-09T10:30:00Z');

  it('adds time units to the instant', () => {
    assert.equal(dt.add({ hours: 2 }).hour, 12);
    assert.equal(dt.add({ minutes: 45 }).format('HH:mm'), '11:15');
    assert.equal(dt.add({ milliseconds: 1 }).valueOf(), dt.valueOf() + 1);
  });

  it('adds calendar units to the wall clock', () => {
    assert.equal(dt.add({ days: 1 }).format('YYYY-MM-DD'), '2024-06-10');
    assert.equal(dt.add({ weeks: 2 }).format('YYYY-MM-DD'), '2024-06-23');
    assert.equal(dt.add({ months: 1 }).format('YYYY-MM-DD'), '2024-07-09');
    assert.equal(dt.add({ years: 1 }).format('YYYY-MM-DD'), '2025-06-09');
  });

  it('clamps month-end overflow', () => {
    assert.equal(DateTime.fromISO('2024-01-31').add({ months: 1 }).format('YYYY-MM-DD'), '2024-02-29');
    assert.equal(DateTime.fromISO('2023-01-31').add({ months: 1 }).format('YYYY-MM-DD'), '2023-02-28');
    assert.equal(DateTime.fromISO('2024-03-31').subtract({ months: 1 }).format('YYYY-MM-DD'), '2024-02-29');
  });

  it('rolls over year boundaries', () => {
    assert.equal(DateTime.fromISO('2024-12-31').add({ days: 1 }).format('YYYY-MM-DD'), '2025-01-01');
    assert.equal(DateTime.fromISO('2024-11-15').add({ months: 3 }).format('YYYY-MM-DD'), '2025-02-15');
    assert.equal(DateTime.fromISO('2024-01-15').subtract({ months: 2 }).format('YYYY-MM-DD'), '2023-11-15');
  });

  it('keeps local time across DST spring-forward when adding days', () => {
    const before = DateTime.fromObject(
      { year: 2024, month: 3, day: 9, hour: 12 },
      { timezone: 'America/New_York' }
    );
    const after = before.add({ days: 1 });
    assert.equal(after.hour, 12);
    assert.equal((after.valueOf() - before.valueOf()) / 3600000, 23);
  });

  it('keeps local time across DST fall-back when adding days', () => {
    const before = DateTime.fromObject(
      { year: 2024, month: 11, day: 2, hour: 12 },
      { timezone: 'America/New_York' }
    );
    const after = before.add({ days: 1 });
    assert.equal(after.hour, 12);
    assert.equal((after.valueOf() - before.valueOf()) / 3600000, 25);
  });

  it('adding hours crosses DST as absolute time', () => {
    // 2024-03-10 01:30 EST + 1 hour = 03:30 EDT (02:30 does not exist)
    const before = DateTime.fromObject(
      { year: 2024, month: 3, day: 10, hour: 1, minute: 30 },
      { timezone: 'America/New_York' }
    );
    assert.equal(before.add({ hours: 1 }).hour, 3);
  });

  it('subtract mirrors add', () => {
    assert.equal(dt.subtract({ days: 7 }).format('YYYY-MM-DD'), '2024-06-02');
    assert.equal(dt.add({ months: 2 }).subtract({ months: 2 }).valueOf(), dt.valueOf());
  });

  it('rejects non-finite duration components', () => {
    assert.throws(() => dt.add({ hours: Infinity }), /finite/);
    assert.throws(() => dt.add({ days: NaN }), /finite/);
    assert.throws(() => dt.add({ months: -Infinity }), /finite/);
    assert.throws(() => dt.subtract({ seconds: Infinity }), /finite/);
  });

  it('diff returns a signed Duration', () => {
    const a = DateTime.fromISO('2024-06-09T10:00:00Z');
    const b = DateTime.fromISO('2024-06-09T12:30:00Z');
    assert.equal(b.diff(a).totalMilliseconds, 2.5 * 3600000);
    assert.ok(a.diff(b).isNegative());
    assert.equal(b.diff(a).humanize(), '2 hours, 30 minutes');
  });
});

describe('DateTime comparison', () => {
  const a = DateTime.fromISO('2024-06-09T10:00:00Z');
  const b = DateTime.fromISO('2024-06-09T12:00:00Z');

  it('isBefore / isAfter / isBetween', () => {
    assert.ok(a.isBefore(b));
    assert.ok(b.isAfter(a));
    assert.ok(DateTime.fromISO('2024-06-09T11:00:00Z').isBetween(a, b));
    assert.ok(!a.isBefore(a));
  });

  it('isSame without unit compares instants', () => {
    assert.ok(a.isSame(DateTime.fromMilliseconds(a.valueOf())));
    assert.ok(!a.isSame(b));
  });

  it('isSame with unit compares calendar buckets', () => {
    assert.ok(a.isSame(b, 'day'));
    assert.ok(!a.isSame(b, 'hour'));
    assert.ok(a.isSame(b, 'month'));
    assert.ok(a.isSame(b, 'year'));
  });

  it('isSame day is timezone-aware', () => {
    // 16:00Z is June 10 in Tokyo; 20:00Z is also June 10 in Tokyo
    const tokyoView = DateTime.fromISO('2024-06-09T16:00:00Z').setTimezone('Asia/Tokyo');
    assert.ok(tokyoView.isSame(DateTime.fromISO('2024-06-09T20:00:00Z'), 'day'));
    // ...but in UTC those are both June 9
    assert.ok(DateTime.fromISO('2024-06-09T16:00:00Z').isSame(DateTime.fromISO('2024-06-09T20:00:00Z'), 'day'));
  });
});

describe('DateTime.format', () => {
  const dt = DateTime.fromISO('2024-06-09T10:30:45.123Z');

  it('renders numeric tokens', () => {
    assert.equal(dt.format('YYYY-MM-DD HH:mm:ss.SSS'), '2024-06-09 10:30:45.123');
    assert.equal(dt.format('YY M D H m s'), '24 6 9 10 30 45');
  });

  it('renders names and meridiem', () => {
    assert.equal(dt.format('dddd, MMMM D, YYYY'), 'Sunday, June 9, 2024');
    assert.equal(dt.format('ddd MMM'), 'Sun Jun');
    assert.equal(dt.format('h:mm A'), '10:30 AM');
    assert.equal(dt.format('h:mm a'), '10:30 am');
  });

  it('renders 12-hour edge cases', () => {
    assert.equal(DateTime.fromISO('2024-06-09T00:05:00Z').format('h A'), '12 AM');
    assert.equal(DateTime.fromISO('2024-06-09T12:05:00Z').format('h A'), '12 PM');
    assert.equal(DateTime.fromISO('2024-06-09T15:00:00Z').format('h A'), '3 PM');
  });

  it('renders offsets', () => {
    assert.equal(dt.format('Z'), '+00:00');
    assert.equal(dt.setTimezone('Asia/Tokyo').format('Z'), '+09:00');
    assert.equal(dt.setTimezone('Asia/Tokyo').format('ZZ'), '+0900');
    assert.equal(dt.setTimezone('America/New_York').format('Z'), '-04:00');
  });

  it('escapes literals', () => {
    assert.equal(dt.format('[Year:] YYYY'), 'Year: 2024');
    assert.equal(dt.format('[MM] MM'), 'MM 06');
  });
});

describe('DateTime.toISO', () => {
  it('uses Z for UTC, offset otherwise', () => {
    const dt = DateTime.fromISO('2024-06-09T10:30:00.123Z');
    assert.equal(dt.toISO(), '2024-06-09T10:30:00.123Z');
    assert.equal(dt.setTimezone('Asia/Tokyo').toISO(), '2024-06-09T19:30:00.123+09:00');
    assert.equal(dt.setTimezone('America/New_York').toISO(), '2024-06-09T06:30:00.123-04:00');
  });

  it('round-trips through fromISO', () => {
    const original = DateTime.fromISO('2024-06-09T19:30:00.123+09:00');
    const reparsed = DateTime.fromISO(original.toISO());
    assert.equal(reparsed.valueOf(), original.valueOf());
  });

  it('toString and toJSON match toISO', () => {
    const dt = DateTime.fromISO('2024-06-09T10:30:00Z');
    assert.equal(String(dt), dt.toISO());
    assert.equal(JSON.stringify(dt), `"${dt.toISO()}"`);
  });
});

describe('DateTime startOf / endOf', () => {
  const dt = DateTime.fromISO('2024-06-09T10:30:45.123Z');

  it('startOf truncates', () => {
    assert.equal(dt.startOf('year').toISO(), '2024-01-01T00:00:00.000Z');
    assert.equal(dt.startOf('month').toISO(), '2024-06-01T00:00:00.000Z');
    assert.equal(dt.startOf('day').toISO(), '2024-06-09T00:00:00.000Z');
    assert.equal(dt.startOf('hour').toISO(), '2024-06-09T10:00:00.000Z');
    assert.equal(dt.startOf('minute').toISO(), '2024-06-09T10:30:00.000Z');
    assert.equal(dt.startOf('second').toISO(), '2024-06-09T10:30:45.000Z');
    assert.equal(dt.startOf('millisecond').valueOf(), dt.valueOf());
  });

  it('startOf week is Monday', () => {
    assert.equal(dt.startOf('week').format('YYYY-MM-DD dddd'), '2024-06-03 Monday');
    // A Monday stays put
    assert.equal(DateTime.fromISO('2024-06-10T15:00:00Z').startOf('week').format('YYYY-MM-DD'), '2024-06-10');
  });

  it('endOf is last millisecond of unit', () => {
    assert.equal(dt.endOf('day').toISO(), '2024-06-09T23:59:59.999Z');
    assert.equal(dt.endOf('month').format('YYYY-MM-DD'), '2024-06-30');
    assert.equal(DateTime.fromISO('2024-02-10').endOf('month').day, 29);
    assert.equal(DateTime.fromISO('2023-02-10').endOf('month').day, 28);
  });

  it('startOf day is timezone-aware', () => {
    const tokyo = DateTime.fromISO('2024-06-09T20:00:00Z').setTimezone('Asia/Tokyo'); // June 10 05:00 in Tokyo
    assert.equal(tokyo.startOf('day').toISO(), '2024-06-10T00:00:00.000+09:00');
  });

  it('rejects invalid unit', () => {
    assert.throws(() => dt.startOf('fortnight'));
  });
});

describe('DateTime relative time', () => {
  it('fromNow for past and future', () => {
    const past = DateTime.fromMilliseconds(Date.now() - 5 * 60000);
    const future = DateTime.fromMilliseconds(Date.now() + 2 * 3600000);
    assert.equal(past.fromNow(), '5 minutes ago');
    assert.equal(past.fromNow({ short: true }), '5m ago');
    assert.equal(future.fromNow(), 'in 2 hours');
  });

  it('handles near-now as "a few seconds"', () => {
    assert.equal(DateTime.now().fromNow(), 'in a few seconds');
  });

  it('toNow is inverse of fromNow', () => {
    const past = DateTime.fromMilliseconds(Date.now() - 5 * 60000);
    assert.equal(past.toNow(), 'in 5 minutes');
  });

  it('to() respects rounding options', () => {
    const a = DateTime.fromISO('2024-06-09T10:00:00Z');
    const b = DateTime.fromISO('2024-06-09T12:30:00Z');
    assert.equal(a.to(b), 'in 3 hours');
    assert.equal(a.to(b, { rounding: 'floor' }), 'in 2 hours');
    assert.equal(b.to(a), '3 hours ago');
  });

  it('toRelative names nearby days', () => {
    assert.equal(DateTime.now().toRelative(), 'today');
    assert.equal(DateTime.now().subtract({ days: 1 }).toRelative(), 'yesterday');
    assert.equal(DateTime.now().add({ days: 1 }).toRelative(), 'tomorrow');
    assert.match(DateTime.now().add({ days: 3 }).toRelative(), /^next /);
    assert.match(DateTime.now().subtract({ days: 3 }).toRelative(), /^last /);
    assert.match(DateTime.now().add({ days: 30 }).toRelative(), /^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('DateTime setTimezone keepLocalTime', () => {
  const nyc = DateTime.fromISO('2024-06-09T09:00:00', { timezone: 'America/New_York' });

  it('default conversion keeps the instant', () => {
    const tokyo = nyc.setTimezone('Asia/Tokyo');
    assert.equal(tokyo.valueOf(), nyc.valueOf());
    assert.equal(tokyo.hour, 22);
  });

  it('keepLocalTime keeps the wall clock and shifts the instant', () => {
    const tokyo = nyc.setTimezone('Asia/Tokyo', { keepLocalTime: true });
    assert.equal(tokyo.hour, 9);
    assert.equal(tokyo.toISO(), '2024-06-09T09:00:00.000+09:00');
    assert.notEqual(tokyo.valueOf(), nyc.valueOf());
    // NY is UTC-4 (DST), Tokyo +9 → same wall clock is 13 hours earlier as an instant
    assert.equal((nyc.valueOf() - tokyo.valueOf()) / 3600000, 13);
  });

  it('keepLocalTime to UTC', () => {
    const utc = nyc.setTimezone('UTC', { keepLocalTime: true });
    assert.equal(utc.toISO(), '2024-06-09T09:00:00.000Z');
  });
});

describe('DateTime DST overlap and gap resolution', () => {
  it('fall-back overlap picks the earlier instant', () => {
    // 2024-11-03 01:30 happens twice in America/New_York (EDT then EST).
    // Documented behavior: the first (earlier, EDT) occurrence wins.
    const ambiguous = DateTime.fromObject(
      { year: 2024, month: 11, day: 3, hour: 1, minute: 30 },
      { timezone: 'America/New_York' }
    );
    assert.equal(ambiguous.offset, -240); // EDT
    assert.equal(ambiguous.toUTC().toISO(), '2024-11-03T05:30:00.000Z');
  });

  it('spring-forward gap shifts forward', () => {
    // 2024-03-10 02:30 does not exist in America/New_York
    const gap = DateTime.fromObject(
      { year: 2024, month: 3, day: 10, hour: 2, minute: 30 },
      { timezone: 'America/New_York' }
    );
    assert.equal(gap.hour, 3); // lands on 03:30 EDT
  });
});

describe('DateTime coverage extras', () => {
  it('fromUnix with timezone argument', () => {
    const dt = DateTime.fromUnix(1717929000, 'Asia/Tokyo');
    assert.equal(dt.timezone, 'Asia/Tokyo');
    assert.equal(dt.hour, 19);
  });

  it('fromFormat with SSS and lowercase meridiem', () => {
    const ms = DateTime.fromFormat('2024-06-09 10:30:45.123', 'YYYY-MM-DD HH:mm:ss.SSS');
    assert.equal(ms.millisecond, 123);
    const pm = DateTime.fromFormat('2024-06-09 7:05 pm', 'YYYY-MM-DD h:mm a');
    assert.equal(pm.hour, 19);
  });

  it('fromNow ceil rounding', () => {
    const past = DateTime.fromMilliseconds(Date.now() - 90 * 60000); // 1.5h ago
    assert.equal(past.fromNow({ rounding: 'ceil' }), '2 hours ago');
    assert.equal(past.fromNow({ rounding: 'floor' }), '1 hour ago');
  });

  it('endOf week and year', () => {
    const dt = DateTime.fromISO('2024-06-09T10:30:00Z'); // Sunday
    assert.equal(dt.endOf('week').toISO(), '2024-06-09T23:59:59.999Z'); // Sunday is last day
    assert.equal(DateTime.fromISO('2024-06-05').endOf('week').format('YYYY-MM-DD dddd'), '2024-06-09 Sunday');
    assert.equal(dt.endOf('year').toISO(), '2024-12-31T23:59:59.999Z');
  });
});

describe('DateTime validity & misc', () => {
  it('isValid detects NaN timestamps', () => {
    assert.ok(DateTime.now().isValid());
    assert.ok(!DateTime.fromMilliseconds(NaN).isValid());
  });

  it('valueOf enables direct comparison', () => {
    const a = DateTime.fromISO('2024-06-09T10:00:00Z');
    const b = DateTime.fromISO('2024-06-09T12:00:00Z');
    assert.ok(a < b);
  });

  it('setTimezone returns same instance for same zone', () => {
    const dt = DateTime.now('Asia/Tokyo');
    assert.equal(dt.setTimezone('Asia/Tokyo'), dt);
  });

  it('toLocal resolves to a concrete zone', () => {
    const local = DateTime.nowUTC().toLocal();
    assert.notEqual(local.timezone, 'local');
  });
});
