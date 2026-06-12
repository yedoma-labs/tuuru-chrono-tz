import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { Timezone, DateTime, TIMEZONE_NAMES, TIMEZONE_COUNT, TZDATA_VERSION } from '../dist/esm/index.js';
import { getTimezoneData } from '../dist/esm/tzdata/index.js';

describe('getTimezoneData', () => {
  it('returns the full IANA tables', () => {
    const data = getTimezoneData();
    assert.equal(data.version, TZDATA_VERSION);
    assert.ok(Object.keys(data.zones).length > 300);
    assert.ok(Object.keys(data.rules).length > 100);
    assert.equal(data.links['US/Eastern'], 'America/New_York');
    assert.ok(Array.isArray(data.zones['Africa/Algiers']));
  });
});

describe('Timezone.listAll', () => {
  it('returns the full timezone list', () => {
    const zones = Timezone.listAll();
    assert.equal(zones.length, TIMEZONE_COUNT);
    assert.ok(zones.includes('America/New_York'));
    assert.ok(zones.includes('Asia/Tokyo'));
    assert.ok(zones.includes('UTC'));
  });

  it('exposes tzdata version', () => {
    assert.match(TZDATA_VERSION, /^\d{4}[a-z]$/);
  });
});

describe('Timezone.search', () => {
  it('finds zones by city name with spaces', () => {
    assert.deepEqual(Timezone.search('New York'), ['America/New_York']);
  });

  it('finds zones by substring', () => {
    assert.ok(Timezone.search('Tokyo').includes('Asia/Tokyo'));
    assert.ok(Timezone.search('Pacific').length > 10);
  });

  it('is case-insensitive', () => {
    assert.ok(Timezone.search('tokyo').includes('Asia/Tokyo'));
  });

  it('returns empty array for no match', () => {
    assert.deepEqual(Timezone.search('Atlantis Prime'), []);
  });
});

describe('Timezone.isValid', () => {
  it('accepts canonical names and aliases', () => {
    assert.ok(Timezone.isValid('America/New_York'));
    assert.ok(Timezone.isValid('US/Eastern'));
    assert.ok(Timezone.isValid('UTC'));
  });

  it('rejects unknown names', () => {
    assert.ok(!Timezone.isValid('Invalid/Zone'));
    assert.ok(!Timezone.isValid(''));
    assert.ok(!Timezone.isValid('constructor'));
    assert.ok(!Timezone.isValid('__proto__'));
  });
});

describe('Timezone.getOffset', () => {
  it('is east-positive', () => {
    const summer = Date.UTC(2024, 5, 15);
    assert.equal(Timezone.getOffset('Asia/Tokyo', summer), 540);
    assert.equal(Timezone.getOffset('America/New_York', summer), -240);
    assert.equal(Timezone.getOffset('UTC', summer), 0);
  });

  it('reflects DST changes', () => {
    const winter = Date.UTC(2024, 0, 15);
    assert.equal(Timezone.getOffset('America/New_York', winter), -300);
    assert.equal(Timezone.getOffset('Asia/Tokyo', winter), 540); // no DST in Japan
  });

  it('handles half-hour offsets', () => {
    assert.equal(Timezone.getOffset('Asia/Kolkata', Date.UTC(2024, 5, 15)), 330);
  });

  it('throws on invalid timezone', () => {
    assert.throws(() => Timezone.getOffset('Invalid/Zone', Date.now()));
  });
});

describe('Timezone.getCanonical', () => {
  it('resolves aliases', () => {
    assert.equal(Timezone.getCanonical('US/Eastern'), 'America/New_York');
    assert.equal(Timezone.getCanonical('Japan'), 'Asia/Tokyo');
  });

  it('returns canonical names unchanged', () => {
    assert.equal(Timezone.getCanonical('America/New_York'), 'America/New_York');
    assert.equal(Timezone.getCanonical('Asia/Tokyo'), 'Asia/Tokyo');
  });

  it('throws on invalid timezone', () => {
    assert.throws(() => Timezone.getCanonical('Invalid/Zone'));
    assert.throws(() => Timezone.getCanonical('constructor'));
  });
});

describe('Timezone.isDST', () => {
  it('detects DST in observing zones', () => {
    assert.ok(Timezone.isDST('America/New_York', Date.UTC(2024, 6, 1)));
    assert.ok(!Timezone.isDST('America/New_York', Date.UTC(2024, 0, 1)));
  });

  it('handles southern hemisphere', () => {
    assert.ok(Timezone.isDST('Australia/Sydney', Date.UTC(2024, 0, 1)));
    assert.ok(!Timezone.isDST('Australia/Sydney', Date.UTC(2024, 6, 1)));
  });

  it('returns false for non-observing zones', () => {
    assert.ok(!Timezone.isDST('Asia/Tokyo', Date.UTC(2024, 6, 1)));
    assert.ok(!Timezone.isDST('UTC', Date.UTC(2024, 6, 1)));
  });
});

describe('Timezone.getAbbreviation', () => {
  it('returns DST-aware abbreviations', () => {
    assert.equal(Timezone.getAbbreviation('America/New_York', Date.UTC(2024, 6, 1)), 'EDT');
    assert.equal(Timezone.getAbbreviation('America/New_York', Date.UTC(2024, 0, 1)), 'EST');
  });

  it('throws on invalid timezone', () => {
    assert.throws(() => Timezone.getAbbreviation('Invalid/Zone', Date.now()));
  });
});

describe('Timezone.guessLocal', () => {
  it('returns a valid IANA zone', () => {
    const local = Timezone.guessLocal();
    assert.equal(typeof local, 'string');
    assert.ok(local.length > 0);
  });
});

describe('tzdata exports', () => {
  it('TIMEZONE_NAMES is consistent', () => {
    assert.equal(TIMEZONE_NAMES.length, TIMEZONE_COUNT);
    assert.equal(new Set(TIMEZONE_NAMES).size, TIMEZONE_NAMES.length);
  });
});

describe('wall-clock cache correctness', () => {
  // The memoization keyed by (zone, second) must never change results,
  // including across DST transitions and for sub-second precision.
  it('repeated and interleaved reads across a DST transition stay exact', () => {
    const springForward = Date.UTC(2024, 2, 10, 7, 0, 0); // 02:00 EST → 03:00 EDT
    for (let pass = 0; pass < 3; pass++) {
      for (let m = -120; m <= 120; m += 5) {
        const ts = springForward + m * 60000;
        const dt = DateTime.fromMilliseconds(ts).setTimezone('America/New_York');
        // Compare against a fresh Intl-derived offset (oracle)
        const oracleHour = new Intl.DateTimeFormat('en-US', {
          timeZone: 'America/New_York', hour: '2-digit', hourCycle: 'h23'
        }).formatToParts(new Date(ts)).find(p => p.type === 'hour').value;
        assert.equal(dt.hour, parseInt(oracleHour, 10));
      }
    }
  });

  it('sub-second precision is preserved within a cached second', () => {
    const base = 1717929000000;
    for (const ms of [0, 1, 123, 456, 999]) {
      assert.equal(DateTime.fromMilliseconds(base + ms).setTimezone('Asia/Tokyo').millisecond, ms);
    }
  });

  it('offset matches Intl across many zones and dates', () => {
    const zones = ['America/New_York', 'Asia/Tokyo', 'Australia/Sydney', 'Europe/London', 'Asia/Kolkata', 'Pacific/Chatham'];
    const dates = [Date.UTC(2024, 0, 15), Date.UTC(2024, 6, 15), Date.UTC(2023, 9, 1)];
    for (const tz of zones) {
      for (const ts of dates) {
        const got = Timezone.getOffset(tz, ts);
        // derive oracle offset from Intl wall clock
        const p = new Intl.DateTimeFormat('en-US', {
          timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit',
          hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
        }).formatToParts(new Date(ts)).reduce((o, x) => (x.type !== 'literal' && (o[x.type] = +x.value), o), {});
        const asUTC = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
        const oracle = Math.round((asUTC - ts) / 60000);
        assert.equal(got, oracle, `${tz} @ ${ts}`);
      }
    }
  });
});
