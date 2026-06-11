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
| Poor TypeScript | Retrofitted types | TypeScript-first, literal types for timezones |
| Confusing UTC | 116 👍 | Explicit `toUTC()` / `toLocal()` / offsets in ISO output |

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
| IANA data pipeline (2026b, 568 zones, 256 links) | ✅ |
| ESM + CJS dual build | ✅ |

**Roadmap to v1.0**: native IANA-rule offset math (current math uses cached
`Intl.DateTimeFormat` — accurate, but rule-based math will be faster), locale
support for month/weekday names, bundle-size pass (< 20KB gzipped target).

**Design notes**:
- All timezone offsets are east-positive (Tokyo `+540`, New York `-240` in DST), matching ISO 8601.
- Wall-clock resolution uses the standard two-pass guess: DST gaps shift forward, overlaps pick the earlier instant.
- `Duration` months/years use fixed 30/365-day approximations; use `DateTime.add()` for calendar-accurate month math.

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
├── types.ts          # Public types
├── index.ts          # Entry point
└── tzdata/           # Generated from IANA (do not edit)
    ├── timezones.ts  # 568 timezone names (literal types)
    ├── links.ts      # 256 alias → canonical mappings
    ├── iana-data.ts  # Full zone/rule tables
    └── data.ts       # Types + getTimezoneData()
scripts/
├── download-iana.js  # Fetch tzdata release from iana.org
└── parse-iana.js     # Generate src/tzdata/ modules
test/                 # node:test suite (143 tests)
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
