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
| Bundle size | date-fns grew to 21MB | Core is **11KB gzipped**, enforced in CI |

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
now.isBefore(tomorrow);          // true
now.isSameOrBefore(tomorrow);    // true (inclusive)
now.isSame(tomorrow, 'month');   // unit-based, timezone-aware
DateTime.min(now, tomorrow);     // earliest
DateTime.max(now, tomorrow);     // latest

// Calendar getters (all timezone-aware)
parsed.quarter;       // 2
parsed.dayOfYear;     // 161
parsed.weekOfYear;    // 23  (ISO 8601)
parsed.daysInMonth;   // 30
parsed.isLeapYear;    // true
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
don't import. English is built in. 30 more ship with the package:
`zh` `hi` `es` `ar` `bn` `pt` `ru` `ur` `id` `de` `ja` `tr` `ko` `fr` `vi`
`it` `fa` `pl` `uk` `ro` `nl` `el` `hu` `sv` `da` `fi` `nb` `bg` `is` `th`.

```typescript
import { DateTime, Duration, setDefaultLocale, es, ru, ja } from '@yedoma-labs/tuuru-chrono-tz';

// Global default
DateTime.setDefaultLocale(es);          // or setDefaultLocale(es)
DateTime.now().format('MMMM');          // "junio"
Duration.fromObject({ hours: 1 }).humanize(); // "1 hora"

// Per instance (immutable)
dt.setLocale(ja).format('MMMM dddd');   // "6月 日曜日"

// Per call
dt.fromNow({ locale: ru });             // "5 минут назад"
dt.toRelative({ locale: ja });          // "昨日"
```

Grammar is handled properly, not just a singular/plural split:

- **Multi-form plurals** — Russian, Ukrainian and Polish select three CLDR forms
  (`1 минуту` / `2 минуты` / `5 минут`) via a `plural(n)` function.
- **Numeral agreement** — Arabic drops the numeral entirely for one and two
  (`منذ دقيقة`, `منذ دقيقتين`), shows numeral + plural for 3–10 (`منذ 5 دقائق`)
  and numeral + singular for 11+ (`منذ 11 دقيقة`), via a `formatCount` hook.
  Romanian inserts "de" from 20 (`20 de minute`).
- **Case by direction** — Finnish and Icelandic inflect the unit's case
  depending on past vs future: Finnish `5 minuutin päästä` (genitive) vs
  `5 minuuttia sitten` (partitive); Icelandic `eftir 5 mínútur` (accusative) vs
  `fyrir 5 mínútum síðan` (dative). `formatCount` receives a `future` flag.
- **No-space scripts** — CJK and Korean drop the number/unit gap (`2小时30分钟`).
- **Gendered calendar** — `toRelative` week phrases agree in gender and case
  (`в следующую среду`, `domenica prossima`, `próximo domingo`).

Custom locales are plain objects implementing the exported `Locale` interface —
supply a `plural(n)` selector, `formatCount`, multi-form arrays, and
function-form week phrases as needed. (West/South Slavic — Czech, Slovak,
Croatian, Serbian — aren't bundled yet; they need direction-dependent case
forms, the same `formatCount(future)` mechanism Finnish and Icelandic use.)

### Format Tokens

`YYYY` `YY` year · `Q` quarter · `MMMM` `MMM` `MM` `M` month · `DD` `D` day ·
`DDDD` `DDD` day-of-year · `WW` `W` ISO week · `dddd` `ddd` weekday ·
`HH` `H` hour 0-23 · `hh` `h` hour 1-12 · `mm` `m` minute · `ss` `s` second ·
`SSS` millisecond · `A` `a` AM/PM · `Z` `ZZ` offset · `[text]` escaped literal

Custom-format parsing accepts the same name tokens, in any locale:

```typescript
DateTime.fromFormat('Jan 5 2024', 'MMM D YYYY');               // month abbreviation
DateTime.fromFormat('9 Juni 2024', 'D MMMM YYYY', { locale: de }); // localized
DateTime.fromFormat('Sunday, June 9 2024', 'dddd, MMMM D YYYY');   // weekday consumed
```

### LocalDate & LocalTime

For a calendar date or a time of day with **no timezone** — birthdays, store
hours, due dates — where a wall-clock instant would mislead:

```typescript
import { LocalDate, LocalTime } from '@yedoma-labs/tuuru-chrono-tz';

const d = LocalDate.fromISO('2024-06-09');
d.weekday;                       // 7 (Sunday)
d.add({ months: 1 }).toISO();    // "2024-07-09"  (Jan 31 + 1mo clamps to Feb 29)
d.until(LocalDate.fromISO('2024-06-20')); // 11 days
d.toDateTime('Asia/Tokyo', { hour: 9 });  // → DateTime at 09:00 Tokyo

const t = LocalTime.fromISO('10:30');
t.add({ hours: 2, minutes: 15 }).toISO(); // "12:45:00"
LocalTime.of(23, 30).add({ hours: 1 });   // wraps → 00:30:00
t.format('h:mm A');                        // "10:30 AM"
```

### CDN (no build step)

```html
<script src="https://unpkg.com/@yedoma-labs/tuuru-chrono-tz"></script>
<script>
  const { DateTime, LocalDate } = window.tuuru;
  DateTime.now('Asia/Tokyo').toISO();
</script>
```

A minified IIFE (`dist/tuuru.min.js`, ~21KB gzipped) exposing a `tuuru` global,
with the full API and all locales but without the raw IANA rule tables.

### Raw IANA data (advanced)

The full zone/rule tables ship behind a subpath so they never enter your
bundle unless you ask for them:

```typescript
import { getTimezoneData } from '@yedoma-labs/tuuru-chrono-tz/tzdata';
const data = getTimezoneData(); // { version, zones, rules, links, metadata }
```

---

## Status

Core is complete and covered by 324 automated tests (parsing rejection tables, DST
spring-forward/fall-back arithmetic, timezone-aware bucketing, locale plurals,
wall-clock cache vs. an Intl oracle, dual-package smoke test). CI runs Node
18/20/22/24 on Linux plus Node 22 on macOS and Windows.

| Component | Status |
|-----------|--------|
| DateTime (parse, format, arithmetic, zones) | ✅ |
| Custom-format parsing incl. `MMM`/`MMMM` month names | ✅ |
| LocalDate / LocalTime (date-only / time-only, no zone) | ✅ |
| Calendar getters (quarter, dayOfYear, weekOfYear, daysInMonth, isLeapYear) | ✅ |
| Comparison (isBefore/After, isSameOrBefore/After, isBetween, min/max) | ✅ |
| Duration (fromISO, humanize, cascading format) | ✅ |
| Timezone utilities (search, canonical links, DST) | ✅ |
| Locales (global, per-instance, tree-shakeable, CLDR plurals) | ✅ 31 languages |
| IANA data pipeline (2026b, 568 zones, 256 links) | ✅ |
| ESM + CJS dual build + CDN bundle | ✅ |
| Bundle size (11KB gzipped core, CI-enforced < 20KB + tree-shaking) | ✅ |

Everything in the implementation guide is shipped: built-in IANA timezones,
immutable API, strict parsing (ISO + custom formats with month names), duration
and relative-time formatting, full localization for 31 languages (Arabic numeral
agreement, Slavic three-form plurals, gendered calendar phrases), LocalDate /
LocalTime types, tree-shakeable ESM + CJS + CDN builds, and a memoized
timezone-math fast path. No outstanding roadmap items.

### Performance

`pnpm bench` (Node 24, x86-64; median of 5 timed batches).

| Operation | ops/sec | ns/op |
|-----------|--------:|------:|
| `Timezone.isValid` | 71M | 14 |
| `diff` | 65M | 15 |
| `Timezone.getCanonical` | 15M | 69 |
| `fromObject` (UTC) | 3.9M | 257 |
| `fromNow` | 3.4M | 294 |
| `get year` (zoned) | 3.3M | 305 |
| `Timezone.getOffset` (zoned) | 2.8M | 363 |
| `get offset` (zoned) | 2.4M | 410 |
| `add hours` (UTC) | 1.8M | 560 |
| `toISO` (UTC) | 1.5M | 657 |
| `add months` | 1.2M | 869 |
| `fromISO` (UTC) | 1.1M | 883 |
| `fromObject` (zoned) | 910K | 1099 |
| `toISO` (zoned) | 831K | 1203 |
| `startOf day` (zoned) | 725K | 1380 |
| `add days` (zoned, DST-safe) | 557K | 1794 |
| `fromFormat` | 194K | 5143 |
| `format` (zoned, names) | 179K | 5575 |

Timezone math goes through `Intl.DateTimeFormat.formatToParts`, which is the
cost centre. Two optimizations make it cheap:

- **Wall-clock memoization** — results are cached per `(zone, second)`. A
  single `format()` reads the wall clock and the offset (which derives from it)
  for the same instant, and each getter re-derives it; the cache makes those
  redundant `Intl` calls free. This is a pure-function cache — DST transitions,
  overlaps, and sub-second precision stay exact (verified against `Intl` as an
  oracle across zones and dates). It lifted zoned getters from ~130K to ~3M
  ops/sec (≈25×) and zoned `toISO` ≈13×.
- `format()` derives the weekday from the wall clock it already read instead of
  making a second `Intl` call.

A from-scratch IANA rule interpreter was considered for the remaining `format`
cost but rejected: `Intl` is already exact, and re-deriving offsets from raw
zone/rule tables would trade guaranteed correctness for marginal speed. The
memoized `Intl` path keeps correctness and gets most of the win.

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
├── localdate.ts      # LocalDate (date-only)
├── localtime.ts      # LocalTime (time-only)
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
├── benchmark.js      # Performance benchmark (pnpm bench)
src/locales/          # de fr es pt it ru zh ja id hi bn ko tr vi pl nl th ar fa ur uk
test/                 # node:test suite (324 tests)
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
