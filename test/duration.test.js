import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { Duration } from '../dist/esm/index.js';

describe('Duration factories', () => {
  it('fromMilliseconds / fromObject', () => {
    assert.equal(Duration.fromMilliseconds(1500).totalMilliseconds, 1500);
    assert.equal(Duration.fromObject({ hours: 2, minutes: 30 }).totalMinutes, 150);
    assert.equal(Duration.fromObject({ days: 1, hours: 12 }).totalHours, 36);
    assert.equal(Duration.fromObject({ weeks: 2 }).totalDays, 14);
  });

  it('fromISO parses time components', () => {
    assert.equal(Duration.fromISO('PT2H30M').totalMinutes, 150);
    assert.equal(Duration.fromISO('PT0.5S').totalMilliseconds, 500);
    assert.equal(Duration.fromISO('PT90S').totalSeconds, 90);
  });

  it('fromISO parses date components and weeks', () => {
    assert.equal(Duration.fromISO('P1DT12H').totalHours, 36);
    assert.equal(Duration.fromISO('P2W').totalDays, 14);
    assert.equal(Duration.fromISO('P1Y').totalDays, 365);
    assert.equal(Duration.fromISO('P2M').totalDays, 60);
  });

  it('fromISO parses negative durations', () => {
    const d = Duration.fromISO('-PT30S');
    assert.ok(d.isNegative());
    assert.equal(d.totalSeconds, -30);
  });

  for (const bad of ['P', 'PT', '', '2H30M', 'PT2H30', 'P1W2D', 'one hour', 'P-1D']) {
    it(`fromISO rejects "${bad}"`, () => {
      assert.throws(() => Duration.fromISO(bad));
    });
  }

  it('fromISO rejects non-string input', () => {
    assert.throws(() => Duration.fromISO(5000));
  });
});

describe('Duration getters', () => {
  const d = Duration.fromObject({ days: 1, hours: 2, minutes: 30, seconds: 45, milliseconds: 500 });

  it('component getters break down the duration', () => {
    assert.equal(d.days, 1);
    assert.equal(d.hours, 2);
    assert.equal(d.minutes, 30);
    assert.equal(d.seconds, 45);
    assert.equal(d.milliseconds, 500);
  });

  it('components cascade consistently for long durations', () => {
    const oneYear = Duration.fromObject({ days: 365 });
    assert.equal(oneYear.years, 1);
    assert.equal(oneYear.months, 0);
    assert.equal(oneYear.days, 0);

    // 400 days = 365 (1y) + 30 (1mo) + 5
    const long = Duration.fromObject({ days: 400 });
    assert.equal(long.years, 1);
    assert.equal(long.months, 1);
    assert.equal(long.days, 5);
  });

  it('component getters keep the sign', () => {
    const d = Duration.fromObject({ minutes: -90 });
    assert.equal(d.hours, -1);
    assert.equal(d.minutes, -30);
  });

  it('total getters return fractional totals', () => {
    const twoAndAHalfHours = Duration.fromObject({ hours: 2, minutes: 30 });
    assert.equal(twoAndAHalfHours.totalHours, 2.5);
    assert.equal(twoAndAHalfHours.totalMinutes, 150);
    assert.equal(twoAndAHalfHours.totalSeconds, 9000);
    assert.equal(Duration.fromObject({ hours: 36 }).totalDays, 1.5);
  });
});

describe('Duration.humanize', () => {
  it('long form', () => {
    assert.equal(Duration.fromObject({ hours: 2, minutes: 30 }).humanize(), '2 hours, 30 minutes');
    assert.equal(Duration.fromObject({ minutes: 1 }).humanize(), '1 minute');
    assert.equal(Duration.fromMilliseconds(0).humanize(), '0 seconds');
  });

  it('short form', () => {
    assert.equal(Duration.fromObject({ hours: 2, minutes: 30 }).humanize({ short: true }), '2h 30m');
    assert.equal(Duration.fromMilliseconds(0).humanize({ short: true }), '0s');
  });

  it('largest option limits parts', () => {
    const d = Duration.fromObject({ days: 1, hours: 2, minutes: 30 });
    assert.equal(d.humanize({ largest: 1 }), '1 day');
    assert.equal(d.humanize({ largest: 2 }), '1 day, 2 hours');
  });

  it('humanizes magnitude of negative durations', () => {
    assert.equal(Duration.fromObject({ minutes: -90 }).humanize(), '1 hour, 30 minutes');
  });
});

describe('Duration.format', () => {
  it('pads tokens to width', () => {
    const d = Duration.fromObject({ hours: 2, minutes: 30 });
    assert.equal(d.format('HH:mm:ss'), '02:30:00');
    assert.equal(d.format('H:m:s'), '2:30:0');
  });

  it('largest token absorbs overflow (the luxon fix)', () => {
    assert.equal(Duration.fromObject({ hours: 26 }).format('HH:mm'), '26:00');
    assert.equal(Duration.fromObject({ hours: 1, minutes: 5, seconds: 7 }).format('mm:ss'), '65:07');
    assert.equal(Duration.fromObject({ days: 2, hours: 3 }).format('HH:mm'), '51:00');
  });

  it('cascades when days token present', () => {
    assert.equal(Duration.fromObject({ hours: 26 }).format('d[d] HH:mm'), '1d 02:00');
  });

  it('escaped literals are not parsed as tokens', () => {
    assert.equal(Duration.fromObject({ hours: 2, minutes: 30 }).format('h[h] m[m]'), '2h 30m');
    assert.equal(Duration.fromObject({ minutes: 5 }).format('[mm] mm'), 'mm 05');
  });

  it('prefixes negative durations', () => {
    assert.equal(Duration.fromObject({ minutes: -90 }).format('H:mm'), '-1:30');
  });

  it('renders milliseconds', () => {
    assert.equal(Duration.fromMilliseconds(1234).format('s.SSS'), '1.234');
  });
});

describe('Duration.toISO', () => {
  it('renders date and time parts', () => {
    assert.equal(Duration.fromObject({ hours: 2, minutes: 30 }).toISO(), 'PT2H30M');
    assert.equal(Duration.fromObject({ days: 1, hours: 12 }).toISO(), 'P1DT12H');
    assert.equal(Duration.fromObject({ days: 2 }).toISO(), 'P2D');
    assert.equal(Duration.fromMilliseconds(0).toISO(), 'PT0S');
  });

  it('renders fractional seconds and negatives', () => {
    assert.equal(Duration.fromMilliseconds(1500).toISO(), 'PT1.5S');
    assert.equal(Duration.fromObject({ seconds: -30 }).toISO(), '-PT30S');
  });

  it('round-trips through fromISO', () => {
    const d = Duration.fromObject({ days: 1, hours: 2, minutes: 30, seconds: 45 });
    assert.equal(Duration.fromISO(d.toISO()).totalMilliseconds, d.totalMilliseconds);
  });

  it('toJSON uses ISO form', () => {
    assert.equal(JSON.stringify(Duration.fromObject({ hours: 1 })), '"PT1H"');
  });
});

describe('Duration arithmetic', () => {
  it('add / subtract accept Duration or object', () => {
    const d = Duration.fromObject({ hours: 1 });
    assert.equal(d.add({ minutes: 30 }).totalMinutes, 90);
    assert.equal(d.add(Duration.fromObject({ hours: 1 })).totalHours, 2);
    assert.equal(d.subtract({ minutes: 30 }).totalMinutes, 30);
  });

  it('negate / abs / isZero / isNegative', () => {
    const d = Duration.fromObject({ minutes: 5 });
    assert.ok(d.negate().isNegative());
    assert.equal(d.negate().abs().totalMinutes, 5);
    assert.ok(Duration.fromMilliseconds(0).isZero());
    assert.ok(!d.isZero());
  });

  it('valueOf enables comparison', () => {
    assert.ok(Duration.fromObject({ minutes: 5 }) < Duration.fromObject({ hours: 1 }));
  });
});
