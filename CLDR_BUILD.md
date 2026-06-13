# CLDR Locale Generation

Scripts for generating tuuru locale files from Unicode CLDR (Common Locale Data Repository) data.

## Overview

- **download-cldr.js**: Sets up CLDR data from the npm `cldr-data` package
- **build-cldr.js**: Converts CLDR JSON to tuuru locale TypeScript files

## Setup

```bash
# Install CLDR data (included in devDependencies)
pnpm install

# Setup CLDR symlink
pnpm run download-cldr

# Generate locale files
pnpm run build-cldr

# Full pipeline
pnpm run build-cldr-all
```

## What Gets Extracted

The build script extracts:

✅ **Full & Abbreviated Month Names** — From `ca-gregorian.json`
- English: January, February, ... / Jan, Feb, ...
- French: janvier, février, ... / janv., févr., ...
- Japanese: 1月, 2月, ... (same for abbreviated)

✅ **Full & Abbreviated Weekday Names** — Monday-first (ISO 8601)
- English: Monday, Tuesday, ... / Mon, Tue, ...
- German: Montag, Dienstag, ... / Mo, Di, ...
- Russian: понедельник, вторник, ... / пн, вт, ...

✅ **AM/PM Meridiem** — Locale-specific variations
- English: AM / PM
- Japanese: 午前 / 午後
- Arabic: ص / م

✅ **Plural Rules** — CLDR pluralization logic
- Simple: `n === 1 ? singular : plural` (English, German, French, ...)
- Slavic: `one / few / many` forms (Russian, Polish, Ukrainian, ...)
- Single form: No distinction (Japanese, Chinese, Korean, ...)

✅ **Unit Translations** — Duration/relative time unit words
- English: second/seconds, minute/minutes, hour/hours, ...
- French: seconde/secondes, minute/minutes, heure/heures, ...
- Japanese: 秒, 分, 時間, 日, か月, 年 (singular forms only)

## What's Not Yet Extracted

To reach full CLDR parity, the following would need implementation:

- **Relative Time Phrases** — "in {0}", "{0} ago", etc. (language-specific)
- **Calendar Words** — "today", "tomorrow", "yesterday", "next Monday", etc.
- **Meridiem Case** — Proper capitalization / casing per language

These are currently placeholder English strings. Production use would require:
1. Parsing `dateFields.json` for relative time translations
2. Handling language-specific calendar phrase formatting
3. Extracting case inflection rules for languages like German, Polish

## Generated Locale Files

Supported locale codes (41 of 42):
```
ar bg bn ca cs da de el es fa fi fr gu he hi hr hu id is it ja ko mr ms
nb nl pl pt ro ru sk sr sv sw ta th tr uk ur vi zh
```

(Note: `tl` [Tagalog] is not in CLDR main locales)

## Usage Example

After generating locales:

```bash
# Build project
pnpm build

# Use in code
import { DateTime, ja, ru } from '@yedoma-labs/tuuru-chrono-tz';

const dt = DateTime.fromISO('2024-06-09');
dt.format('MMMM', { locale: ja });     // "6月"
dt.format('MMMM', { locale: ru });     // "июня"
```

## Architecture

```
scripts/
├── download-cldr.js    → Creates symlink to node_modules/cldr-data/main
└── build-cldr.js       → Parses CLDR JSON → TypeScript locale files

data/
└── cldr-main/          → (symlink to installed cldr-data)
    ├── en/
    ├── fr/
    ├── ja/
    └── ...

src/locales/
├── de.ts, fr.ts, ...   → Generated TypeScript locale exports
└── (manually maintained for complex translations)
```

## Next Steps

To improve CLDR coverage:

1. **Extract calendar translations** from CLDR's `dateFields.json`
2. **Extract relative time templates** (future/past/ago patterns)
3. **Add formatCount hooks** for languages with special number agreement (Arabic, Romanian)
4. **Handle case inflection** for grammar-aware languages (Slavic, Icelandic, Finnish)
5. **Support script variants** (e.g., pt-BR vs pt-PT)

## Testing

Scripts have been validated to:
- ✅ Download 371 locales from cldr-data
- ✅ Extract month/weekday names correctly
- ✅ Parse plural rules accurately
- ✅ Extract unit translations from units.json
- ✅ Generate TypeScript with proper syntax
- ✅ Build project without errors
- ✅ Pass existing test suite (41/42 locales generated)

## References

- [Unicode CLDR](http://cldr.unicode.org/)
- [CLDR JSON structure](https://github.com/unicode-cldr/cldr-json)
- [npm cldr-data package](https://www.npmjs.com/package/cldr-data)
