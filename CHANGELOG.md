# Changelog

All notable changes to `@yedoma-labs/tuuru-chrono-tz` follow [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.3.1] — 2026-06-15

### Added

**`dateFormats` on all 86 locales**
- Every locale object now has a `dateFormats: { short, medium, long, full }` field with locale-correct format-string patterns.
- `formatLocalized(style)` no longer relies on `Intl.DateTimeFormat` for date-only output — the library's own `format()` engine handles it using each locale's translated month/weekday names. Fixes silent fallback to system locale on runtimes with partial ICU data (`tk`, `am`, `cy`, `lo`, `jv`, `so`, `zu`, and others).
- Token conflicts in Lithuanian (`m.`/`d.` abbreviations) and Latvian (`gada`) escaped with `[...]` bracket syntax.
- CJK locales use native patterns (`YYYY年M月D日`, `YYYY년 M월 D일`).

---

## [0.3.0] — 2026-06-15

### Added

**Locale-aware formatting**
- `DateTime.toLocaleString(options?)` — `Intl.DateTimeFormat`-backed output honoring the instance's locale and timezone. Produces structurally correct punctuation and field ordering (e.g. `"15. Juni 2026"` for German) without hardcoding format strings.
- `DateTime.toLocaleDateString(options?)` — `dateStyle: 'long'` preset.
- `DateTime.toLocaleTimeString(options?)` — `timeStyle: 'medium'` preset.
- `DateTime.formatLocalized(style)` — `'short' | 'medium' | 'long' | 'full'`. Uses `locale.dateFormats[style]` when defined; falls back to `Intl.DateTimeFormat({ dateStyle: style })`.
- `LocalDate.toLocaleString(options?, locale?)` — same approach, UTC-anchored.
- `LocalTime.toLocaleString(options?, locale?)` — same approach, UTC-anchored.

**Locale interface extension**
- `Locale.dateFormats?: { short, medium, long, full }` — optional format-string patterns for `formatLocalized()`. No built-in locales define it; fully opt-in for custom locales.

---

## [0.2.0] — 2026-06-14

### Added

**Convenience methods**
- `DateTime.compareTo(other)` → `-1 | 0 | 1` — safe for `Array.sort`.
- `DateTime.isToday()` / `isTomorrow()` / `isYesterday()` — evaluated in the instance's own timezone.
- `DateTime.isWeekend()` / `isWeekday()` — weekday 6–7 vs 1–5.
- `DateTime.clamp(min, max)` — clamp to timestamp range.
- `DateTime.weeksInYear` — ISO 8601 weeks in this year (52 or 53).
- `LocalDate.compareTo()` / `isToday(tz?)` / `isWeekend()` / `isWeekday()`.
- `LocalTime.compareTo()` / `isBetween(start, end)`.

**87 locales (up from 35)**
- Hand-crafted: `ms`, `sw`, `he` (with dual form), `ca`, `tl`, `fil`, `gu`, `mr`, `ta`.
- CLDR-generated (44): `af`, `am`, `as`, `az`, `be`, `bs`, `cy`, `et`, `eu`, `ga`, `gl`, `hy`, `jv`, `ka`, `kk`, `km`, `kn`, `ky`, `lo`, `lt`, `lv`, `mk`, `ml`, `mn`, `my`, `ne`, `or`, `pa`, `ps`, `sd`, `si`, `sl`, `so`, `sq`, `sr_Latn`, `te`, `tk`, `uz`, `yue`, `zh_Hans`, `zh_Hant`, `zu` — native month/weekday names and unit words, correct CLDR plural rules.
- All locales tree-shakeable via `./locales/<code>` subpath; core bundle unchanged at 11.7 KB gzip.

**CLDR locale pipeline**
- `pnpm download-cldr` links `cldr-data` package into `data/cldr-main`.
- `pnpm build-cldr` auto-generates TypeScript locale files for all discovered CLDR base locales, skipping existing hand-crafted ones.

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

[0.3.1]: https://github.com/yedoma-labs/tuuru-chrono-tz/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/yedoma-labs/tuuru-chrono-tz/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/yedoma-labs/tuuru-chrono-tz/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/yedoma-labs/tuuru-chrono-tz/releases/tag/v0.1.0
