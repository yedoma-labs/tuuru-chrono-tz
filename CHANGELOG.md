# Changelog

All notable changes to `@yedoma-labs/tuuru-chrono-tz` follow [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added

**Convenience methods**
- `DateTime.clone()` — create shallow copy (useful for mutation-heavy code migration).
- `DateTime.isSameDay(other)` — compare dates ignoring time/timezone.
- `DateTime.daysUntil(other)` — days between two dates (positive if other is later).
- `DateTime.compareTo(other)` → `-1 | 0 | 1` — safe for `Array.sort`.
- `DateTime.isToday()` / `isTomorrow()` / `isYesterday()` — evaluated in the instance's own timezone.
- `DateTime.isWeekend()` / `isWeekday()` — weekday 6-7 vs 1-5.
- `DateTime.clamp(min, max)` — bound by absolute timestamp.
- `DateTime.weeksInYear` getter — ISO 8601 weeks in the instance's year (52 or 53).
- `LocalDate.compareTo()` / `isToday(tz?)` / `isWeekend()` / `isWeekday()`.
- `LocalTime.compareTo()` / `isBetween(start, end)`.

**CLDR Locales**
- Fully automated CLDR download & conversion pipeline (`pnpm run build-cldr-all`).
- Script extracts months, weekdays, meridiem, unit translations, and plural rules from CLDR JSON.
- 41 locales auto-generated from CLDR v45 (includes ar, bg, bn, ca, cs, da, de, el, es, fa, fi, fr, gu, he, hi, hr, hu, id, is, it, ja, ko, mr, ms, nb, nl, pl, pt, ro, ru, sk, sr, sv, sw, ta, th, tr, uk, ur, vi, zh).

**Testing & Quality**
- New comprehensive test suite for convenience methods (41 new tests, `test/convenience.test.js`).
- Total test count: 378 tests across 11 test files (2266 lines).
- Verified: clone behavior, date comparison edge cases, timezone handling, duration sign checks, CLDR data extraction.

**New locales (51 total, up from 43)**
- `ms` (Malay) — single-form, like Indonesian.
- `sw` (Swahili) — binary with noun-class plurals.
- `he` (Hebrew) — 3 forms including dual (`n === 2`).
- `ca` (Catalan) — binary.
- `tl` (Filipino/Tagalog) — single-form.
- `gu` (Gujarati) — binary.
- `mr` (Marathi) — binary.
- `ta` (Tamil) — single-form.

---

## [0.1.0] — 2026-06-13

First public release. Full feature set documented in [README](./README.md).

### Added

**Core classes**
- `DateTime` — immutable, timezone-aware. Backed by `Intl.DateTimeFormat.formatToParts`; no manual IANA rule math.
- `Duration` — ISO 8601 parse/format, cascade arithmetic, `humanize()`.
- `Timezone` — IANA validity, canonical alias resolution, DST detection, UTC offset.
- `LocalDate` — calendar date without time or timezone. ISO parse, arithmetic with month-end clamp, `until()`.
- `LocalTime` — wall-clock time without date or timezone. ISO parse, wrapping arithmetic.

**Parsing and formatting**
- `DateTime.fromISO()`, `fromObject()`, `fromTimestamp()`, `fromFormat()` (including month-name tokens).
- `format()` with YYYY/MM/DD/HH/mm/ss/SSS/z/Z/ddd/dddd/MMM/MMMM tokens.
- `toISO()`, `toLocalISO()`, `toObject()`, `toDate()`.
- `Duration.fromISO()`, `Duration.format()`, `Duration.humanize()`.

**Timezone**
- `setTimezone(tz, { keepLocalTime? })` — move instant across zones or re-anchor wall clock.
- `wallClock()` — fast zoned getters cached per `(zone, second)` with FIFO 4 096-entry bound (≈25× speedup vs. uncached).
- Two-pass DST resolution: spring-forward gaps shift forward, fall-back overlaps pick earlier instant.
- `./tzdata` subpath export with `getTimezoneData()` — raw IANA 2026b tables kept out of default bundle.
- `TIMEZONE_NAMES`, `TIMEZONE_COUNT`, `TIMEZONE_LINKS`, `TZDATA_VERSION` in root barrel.

**Locale system (35 languages)**
- Built-in `en`. All others tree-shakeable via `./locales/<code>` subpath.
- `setDefaultLocale()` / `getDefaultLocale()`.
- Per-instance `locale` option on `DateTime` and `Duration`.
- CLDR plural rules: binary (en/de/fr/es/pt/it/nl/da/sv/nb/bg/el), three-form Russian-style (ru/uk/pl/hr/sr), three-form Czech-style (cs/sk), Romanian, single-form (zh/ja/ko/id/hu/tr/vi/th/fa/bn/hi).
- Direction-inflected `humanize()` for Finnish, Icelandic, Czech, Slovak, Croatian, Serbian (past vs. future selects correct grammatical case).
- Gender-inflected calendar phrases for Russian, Ukrainian, Polish, Italian, Portuguese, Czech, Slovak, Croatian, Serbian.
- Arabic dual form and numeral-suppression rules.

**Locales included:** ar, bg, bn, cs, da, de, el, es, fa, fi, fr, hi, hr, hu, id, is, it, ja, ko, nb, nl, pl, pt, ro, ru, sk, sr, sv, th, tr, uk, ur, vi, zh

**Build**
- Dual ESM + CJS output with correct `package.json` type markers.
- CDN IIFE bundle (`dist/tuuru.min.js`) — `window.tuuru` global, no sourcemap.
- `sideEffects: false` for full tree-shaking.
- `unpkg` / `jsdelivr` fields.
- Bundle size CI gate: core < 20 KB gzip; Duration-only < 3 KB gzip.

**CI / DX**
- GitHub Actions matrix: Node 18/20/22/24 on Ubuntu, Node 22 on macOS + Windows.
- `pnpm typecheck` (`tsc --noEmit`) as first CI step.
- `pnpm bench` — 23 operations, median of 5 batches.
- `pnpm size` — esbuild bundle size report.
- `prepack` hook runs clean build before `npm publish`.

### Security

- `fromFormat()` uses string-literal alternation regex built from locale data — no `eval`, no `RegExp` from user input.
- All arithmetic validates `Number.isFinite()` on every component; non-finite values throw before mutating state.
- `Timezone` constructor validates against known IANA set (O(1) `Set` lookup) — rejects arbitrary strings silently passed to `Intl`.

---

[0.1.0]: https://github.com/yedoma-labs/tuuru-chrono-tz/releases/tag/v0.1.0
