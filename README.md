# 🌍 tuuru-chrono-tz

> **Time zones for the whole world**

TypeScript-first date/time library with **built-in IANA timezone support**. No external packages. No moment-timezone. Just immutable, tree-shakeable time handling that works everywhere.

[![CI](https://github.com/yedoma-labs/tuuru-chrono-tz/actions/workflows/ci.yml/badge.svg)](https://github.com/yedoma-labs/tuuru-chrono-tz/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@yedoma-labs/tuuru-chrono-tz.svg)](https://www.npmjs.com/package/@yedoma-labs/tuuru-chrono-tz)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Built to solve **298 real user pain points** collected from date-fns, moment.js, and luxon issue trackers and Stack Overflow.

---

## Why?

| Pain point | Evidence | Here |
|------------|----------|------|
| No timezone support | 273 👍 on date-fns | Built-in IANA database, zero extra packages |
| Mutable API | #1 reason moment.js was deprecated | Every method returns a new instance |
| Broken duration formatting | luxon truncates 26h to 02h | Cascading tokens: 26h as `HH:mm` → `26:00` |
| Lenient parsing | Security issue | Strict by default — impossible dates throw |
| No global locale | 89 👍 on date-fns | `setDefaultLocale()` + tree-shakeable locale objects |
| Poor TypeScript | Retrofitted types | TypeScript-first, literal types for timezones |
| Confusing UTC | 116 👍 | Explicit `toUTC()` / `toLocal()` / offsets in ISO output |
| Bundle size | date-fns grew to 21MB | Core is **10.7KB gzipped**, enforced in CI |

---

## Installation

```bash
pnpm add @yedoma-labs/tuuru-chrono-tz   # or npm install / yarn add
```

Zero runtime dependencies. Dual ESM + CommonJS build. Node >= 18.

---

## Quick Start

```typescript
import { DateTime, Duration, Timezone } from '@yedoma-labs/tuuru-chrono-tz';

// Create
const now = DateTime.now();                          // UTC
const tokyo = DateTime.now('Asia/Tokyo');
const local = DateTime.now('local');
const parsed = DateTime.fromISO('2024-06-09T10:30:00Z');

// Format
now.format('YYYY-MM-DD HH:mm:ss');  // "2024-06-09 10:30:00"
now.format('ddd, MMM D [at] h:mm A'); // "Sun, Jun 9 at 10:30 AM"
tokyo.toISO();                       // "2024-06-09T19:30:00.000+09:00"

// Arithmetic (immutable, calendar-aware)
const tomorrow = now.add({ days: 1 });     // keeps local time across DST
const lastMonth = now.subtract({ months: 1 }); // clamps month-end overflow

// Comparison
now.isBefore(tomorrow);      // true
now.isSame(tomorrow, 'month'); // unit-based, timezone-aware
```

### Timezones

```typescript
// Convert (same instant, different wall clock)
const nyc = tokyo.setTimezone('America/New_York');
const utc = tokyo.toUTC();

// Keep the wall clock instead (moment's tz(zone, true))
const nineAmTokyo = nyc.setTimezone('Asia/Tokyo', { keepLocalTime: true });

// Getters are timezone-aware; month is 1-12, weekday 1-7 (Monday=1)
tokyo.hour;    // 19
tokyo.offset;  // 540 (east-positive minutes)

// Utilities
Timezone.search('New York');        // ['America/New_York']
Timezone.isValid('Asia/Tokyo');     // true
Timezone.getCanonical('US/Eastern'); // 'America/New_York'
Timezone.getOffset('Asia/Kolkata');  // 330
Timezone.isDST('America/New_York'); // true in summer
Timezone.listAll();                  // all 568 zones (incl. aliases)
```

### Strict Parsing

```typescript
DateTime.fromISO('2024-02-30');            // ❌ throws: day out of range
DateTime.fromISO('2024-13-01');            // ❌ throws: month out of range
DateTime.fromISO('2024-06-09T10:30:00Z');  // ✅

// Custom formats are strict too — input must match exactly
DateTime.fromFormat('09/06/2024 7:05 PM', 'DD/MM/YYYY h:mm A');
DateTime.fromFormat('2024-06-09', 'YYYY-MM-DD', { timezone: 'Asia/Tokyo' });
```

### Durations & Relative Time

```typescript
const duration = later.diff(earlier);        // returns Duration

duration.humanize();                // "2 hours, 30 minutes"
duration.humanize({ short: true }); // "2h 30m"
duration.format('HH:mm:ss');        // "02:30:00"
Duration.fromObject({ hours: 26 }).format('HH:mm'); // "26:00" — no truncation
Duration.fromISO('P1DT12H').totalHours;             // 36

posted.fromNow();     // "5 minutes ago" / "in 2 hours"
posted.toRelative();  // "today", "yesterday", "last Tuesday"
```

### Locales

Locales are plain objects (like date-fns), so bundlers drop every locale you
don't import. English is built in; `de` and `fr` ship with the package.

```typescript
import { DateTime, Duration, setDefaultLocale, de, fr } from '@yedoma-labs/tuuru-chrono-tz';

// Global default
DateTime.setDefaultLocale(fr);          // or setDefaultLocale(fr)
DateTime.now().format('MMMM');          // "juin"
Duration.fromObject({ hours: 1 }).humanize(); // "1 heure"

// Per instance (immutable)
dt.setLocale(de).format('dddd, MMMM D'); // "Sonntag, Juni 9"

// Per call
dt.format('MMMM', { locale: de });       // "Juni"
dt.fromNow({ locale: fr });              // "il y a 5 minutes"
dt.toRelative({ locale: de });           // "gestern"
```

Custom locales are just objects implementing the exported `Locale` interface.

### Format Tokens

`YYYY` `YY` year · `MMMM` `MMM` `MM` `M` month · `DD` `D` day · `dddd` `ddd` weekday ·
`HH` `H` hour 0-23 · `hh` `h` hour 1-12 · `mm` `m` minute · `ss` `s` second ·
`SSS` millisecond · `A` `a` AM/PM · `Z` `ZZ` offset · `[text]` escaped literal

---

## Status

Core is complete and covered by 143 automated tests (parsing rejection tables, DST
spring-forward/fall-back arithmetic, timezone-aware bucketing, dual-package smoke test).
CI runs Node 18/20/22/24 on Linux plus Node 22 on macOS and Windows.

| Component | Status |
|-----------|--------|
| DateTime (parse, format, arithmetic, zones) | ✅ |
| Duration (fromISO, humanize, cascading format) | ✅ |
| Timezone utilities (search, canonical links, DST) | ✅ |
| Locales (global, per-instance, tree-shakeable) | ✅ en, de, fr |
| IANA data pipeline (2026b, 568 zones, 256 links) | ✅ |
| ESM + CJS dual build | ✅ |
| Bundle size (10.7KB gzipped core, CI-enforced < 20KB) | ✅ |

**Roadmap to v1.0**: native IANA-rule offset math (current math uses cached
`Intl.DateTimeFormat` — accurate, but rule-based math will be faster), more
locales, optional LocalDate/LocalTime types, CDN build.

### Performance

`pnpm bench` (Node 24, x86-64; median of 5 timed batches). Pure-JS operations
are fast; anything that reads a wall clock in a timezone goes through
`Intl.DateTimeFormat.formatToParts`, which dominates those paths.

| Operation | ops/sec | ns/op |
|-----------|--------:|------:|
| `diff` | 69M | 15 |
| `Timezone.isValid` | 64M | 15 |
| `Timezone.getCanonical` | 15M | 66 |
| `fromObject` (UTC) | 4.1M | 244 |
| `fromNow` | 3.8M | 261 |
| `Duration.humanize` | 1.1M | 940 |
| `Duration.format` | 870K | 1153 |
| `fromISO` (UTC) | 990K | 1010 |
| `fromFormat` | 233K | 4295 |
| `get year` / `get offset` (zoned) | ~130K | ~7700 |
| `add hours` (UTC) | 126K | 7916 |
| `format` (UTC) | 87K | 11552 |
| `format` (zoned, names) | 54K | 18640 |
| `startOf day` (zoned) | 42K | 24055 |
| `add days` (zoned, DST-safe) | 39K | 25749 |

The ~130K-ops/sec ceiling on zoned getters is one `formatToParts` call each;
this is the motivation for the roadmap's native rule-based offset math. Wins
already taken: `Intl.DateTimeFormat` instances are cached per timezone, and
`format()` derives the weekday from the wall clock it already read instead of
making a second `Intl` call (2.5× faster).

### Security

No runtime dependencies, so no supply-chain surface. The parsing layer was
fuzzed with adversarial input (`scripts`-level pentest):

- **No ReDoS** — every regex is anchored and linear; 100K-character inputs to
  `fromISO`/`fromFormat`/`Duration.fromISO` reject in < 2ms.
- **No format-string injection** — `fromFormat` escapes all literal text before
  it reaches a `RegExp`; regex metacharacters in a pattern are matched literally.
- **No prototype pollution** — timezone lookups use a `Set` and `Object.hasOwn`;
  `__proto__` / `constructor` as a zone name are rejected, and parse-value maps
  use `Object.create(null)`.
- **Strict numeric handling** — non-finite (`Infinity`/`NaN`) arithmetic
  components throw a clear error instead of producing an instance that fails
  later; `fromMilliseconds(NaN)` is detectable via `isValid()`.

**Design notes**:
- All timezone offsets are east-positive (Tokyo `+540`, New York `-240` in DST), matching ISO 8601.
- DST gaps shift forward: `2024-03-10 02:30` doesn't exist in New York, so it resolves to `03:30 EDT`. DST overlaps pick the earlier instant: `2024-11-03 01:30` resolves to the EDT occurrence. Both behaviors are tested.
- `Duration` months/years use fixed 30/365-day approximations; use `DateTime.add()` for calendar-accurate month math.
- **Regex safety**: parsing does use regular expressions, but every pattern is anchored and linear — no nested quantifiers, no backtracking blowup, so no ReDoS surface (the moment.js #4163 class of bug). `fromFormat` escapes all literal text before it reaches a `RegExp`, so user-supplied format strings cannot inject patterns.

---

## Development

```bash
git clone https://github.com/yedoma-labs/tuuru-chrono-tz.git
cd tuuru-chrono-tz
pnpm install
pnpm build     # ESM + CJS into dist/
pnpm test      # builds, then runs node:test suite
```

Requires Node >= 18 and pnpm (`corepack enable` activates the pinned version).

### Project Structure

```
src/
├── datetime.ts       # DateTime class (immutable, timezone-aware)
├── duration.ts       # Duration class
├── timezone.ts       # Timezone utilities
├── internal.ts       # Shared timezone math (Intl-backed)
├── locale.ts         # Locale interface + built-in English
├── locales/          # Additional locales (de, fr) — tree-shakeable
├── types.ts          # Public types
├── index.ts          # Entry point
└── tzdata/           # Generated from IANA (do not edit)
    ├── timezones.ts  # 568 timezone names (literal types)
    ├── links.ts      # 256 alias → canonical mappings
    ├── iana-data.ts  # Full zone/rule tables
    └── data.ts       # Types + getTimezoneData()
scripts/
├── download-iana.js  # Fetch tzdata release from iana.org
├── parse-iana.js     # Generate src/tzdata/ modules
├── check-size.js     # CI bundle-size guard (pnpm size)
└── benchmark.js      # Performance benchmark (pnpm bench)
test/                 # node:test suite (190 tests, incl. security.test.js)
```

### Updating IANA Timezone Data

IANA releases new tzdata several times a year.

```bash
pnpm download-iana          # latest (or: pnpm download-iana 2026b)
pnpm parse-iana             # regenerate src/tzdata/
pnpm build && pnpm test
```

The downloader validates the version argument, follows https-only redirects,
and extracts with `tar` via `execFileSync` (no shell). Current data version:
`TZDATA_VERSION` export (2026b).

### Troubleshooting

- **`tar: command not found` (Windows)** — install Git Bash or WSL, or extract `data/tzdata.tar.gz` manually.
- **HTTP 404 on download** — version doesn't exist; check https://data.iana.org/time-zones/releases/ or use `pnpm download-iana` for latest.
- **`require()` of the package fails** — rebuild; `pnpm build` writes the `dist/cjs/package.json` type marker the CJS build needs.

---

## Migrating

### From moment.js

```typescript
// Before
const m = moment.tz('2024-06-09', 'America/New_York');
m.add(1, 'day');                       // mutates!
m.format('YYYY-MM-DD');
m.fromNow();
moment.duration(150, 'minutes').humanize();

// After
const dt = DateTime.fromISO('2024-06-09', { timezone: 'America/New_York' });
const tomorrow = dt.add({ days: 1 });  // immutable
dt.format('YYYY-MM-DD');               // same tokens
dt.fromNow();
Duration.fromObject({ minutes: 150 }).humanize();
```

### From date-fns (+ date-fns-tz)

```typescript
// Before
import { format, addDays } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
const zoned = utcToZonedTime(new Date('2024-06-09T10:30:00Z'), 'America/New_York');
format(addDays(zoned, 1), 'yyyy-MM-dd HH:mm:ss');

// After — timezones built in, no second package
DateTime.fromISO('2024-06-09T10:30:00Z')
  .setTimezone('America/New_York')
  .add({ days: 1 })
  .format('YYYY-MM-DD HH:mm:ss');
```

### From luxon

```typescript
// Before
const dt = LuxonDateTime.fromISO('2024-06-09', { zone: 'America/New_York' });
dt.plus({ days: 1 }).toFormat('yyyy-MM-dd');
dur.toHuman(); // broken output (luxon #1134)

// After
const dt = DateTime.fromISO('2024-06-09', { timezone: 'America/New_York' });
dt.add({ days: 1 }).format('YYYY-MM-DD');
dur.humanize(); // "2 hours, 30 minutes"
```

Token differences: this library uses moment-style tokens (`YYYY`, `DD`, `HH`)
— date-fns/luxon users translate `yyyy → YYYY`, `dd → DD`.

---

## About "tuuru"

**tuuru** (Yakutian: туору) means "world" in the Yakut language. Yakutia spans
**11 time zones** — more than any other region. Fitting namesake for a timezone library.

---

## Contributing

This library is evidence-based — every feature solves a documented user problem.
Before adding features: find evidence (GitHub issue with reactions, high-score
Stack Overflow question), open an issue, then PR.

## License

MIT © [yedoma-labs](https://github.com/yedoma-labs)

## Acknowledgments

- **IANA** for the timezone database
- **298 developers** who shared their pain points
- **Yakutian culture** for the name
