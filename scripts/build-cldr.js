/**
 * Build locale files from CLDR data.
 *
 * Auto-discovers all base CLDR locales, skips existing hand-crafted ones,
 * and generates TypeScript locale files with native translations.
 *
 * Prerequisites: pnpm run download-cldr
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const localesDir = path.join(__dirname, '..', 'src', 'locales');
const dataDir = path.join(__dirname, '..', 'data');
const cldrMainDir = path.join(dataDir, 'cldr-main');

// Locales with meaningfully distinct regional variants to include
const KEEP_REGIONAL = new Set(['zh-Hans', 'zh-Hant', 'pt-BR', 'sr-Latn', 'nn']);

// ─── PLURAL RULES ────────────────────────────────────────────────────────────

function loadPluralRules() {
  try {
    const p = path.join(__dirname, '..', 'node_modules', 'cldr-data', 'supplemental', 'plurals.json');
    return require(p).supplemental['plurals-type-cardinal'];
  } catch {
    return {};
  }
}

/**
 * Derive a TypeScript plural function from CLDR rule categories.
 * Returns a source string like `(n) => n === 1 ? 0 : 1`.
 */
function getPluralFn(locale, pluralRules) {
  const rule = pluralRules[locale] || pluralRules[locale.split('-')[0]];
  if (!rule) return '(n) => n === 1 ? 0 : 1';

  const cats = Object.keys(rule)
    .filter(k => k.startsWith('pluralRule-count-'))
    .map(k => k.replace('pluralRule-count-', ''))
    .filter(c => c !== 'other')
    .sort();

  if (cats.length === 0) return '() => 0';

  if (cats.join('+') === 'one') {
    return '(n) => n === 1 ? 0 : 1';
  }

  if (cats.join('+') === 'one+two') {
    return '(n) => n === 1 ? 0 : n === 2 ? 1 : 2';
  }

  if (cats.includes('few') && cats.includes('one') && !cats.includes('two')) {
    // Slavic-style: one / few / other
    return '(n) => (n % 10 === 1 && n % 100 !== 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2)';
  }

  if (cats.includes('few') && cats.includes('many') && cats.includes('one') && cats.includes('two') && cats.includes('zero')) {
    // Arabic 6-form — simplified to binary for auto-generated
    return '(n) => n === 1 ? 0 : 1';
  }

  if (cats.includes('few') && cats.includes('one') && cats.includes('two')) {
    // Welsh / Breton etc — use 4-form simplified
    return '(n) => n === 1 ? 0 : n === 2 ? 1 : n !== 8 && n !== 11 ? 2 : 3';
  }

  if (cats.includes('many') && cats.includes('one') && cats.includes('two')) {
    // French-style many (fr, pt with 0) — binary enough
    return '(n) => n === 0 || n === 1 ? 0 : 1';
  }

  if (cats.includes('one') && cats.includes('zero')) {
    // Latvian-style
    return '(n) => n % 10 === 1 && n % 100 !== 11 ? 0 : n % 10 === 0 || (n % 100 >= 11 && n % 100 <= 19) ? 2 : 1';
  }

  return '(n) => n === 1 ? 0 : 1';
}

// ─── CLDR EXTRACTION HELPERS ─────────────────────────────────────────────────

function readJSON(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return null; }
}

function resolveLocaleDir(code) {
  const direct = path.join(cldrMainDir, code);
  if (fs.existsSync(direct)) return direct;
  const base = code.split('-')[0];
  const baseDir = path.join(cldrMainDir, base);
  if (fs.existsSync(baseDir)) return baseDir;
  return null;
}

function extractMonths(greg) {
  const wide = greg.months?.format?.wide || {};
  const abbr = greg.months?.format?.abbreviated || {};
  const wide12 = [];
  const abbr12 = [];
  for (let i = 1; i <= 12; i++) {
    wide12.push(wide[i] || `Month${i}`);
    abbr12.push(abbr[i] || `M${i}`);
  }
  return { wide: wide12, abbr: abbr12 };
}

function extractWeekdays(greg) {
  const wide = greg.days?.format?.wide || {};
  const abbr = greg.days?.format?.abbreviated || {};
  const order = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  return {
    wide: order.map(d => wide[d] || d),
    abbr: order.map(d => abbr[d] || d.slice(0, 2)),
  };
}

function extractMeridiem(greg) {
  const periods = greg.dayPeriods?.format?.wide || {};
  return { am: periods.am || 'AM', pm: periods.pm || 'PM' };
}

/**
 * Extract unit words from CLDR units.json.
 * Returns { second: ['s1','s2'], minute: [...], ... }
 * where s1 = singular form, s2 = plural form.
 * Number of forms depends on the plural rule.
 */
function extractUnits(unitsData, locale, pluralCats) {
  const rootKey = Object.keys(unitsData?.main || {})[0];
  const long = unitsData?.main?.[rootKey]?.units?.long || {};
  const keys = ['second', 'minute', 'hour', 'day', 'month', 'year'];
  const result = {};
  const forms = pluralCats === 0 ? 1 : pluralCats; // number of form slots

  for (const k of keys) {
    const entry = long[`duration-${k}`] || {};
    const strip = (pat) => (pat || '').replace('{0}', '').replace(/^\s+|\s+$/g, '') || k;
    const one = strip(entry['unitPattern-count-one'] || entry['unitPattern-count-other']);
    const other = strip(entry['unitPattern-count-other'] || entry['unitPattern-count-one']);
    const few = strip(entry['unitPattern-count-few'] || entry['unitPattern-count-other']);

    if (forms === 1) result[k] = [one];
    else if (forms === 2) result[k] = [one, other];
    else result[k] = [one, few, other]; // 3-form (slavic etc)
  }
  return result;
}

/**
 * Extract future/past wrapper templates from CLDR dateFields.json.
 * CLDR pattern: "in {0} Sekunde" → our template: "in {0}"
 * (we discard the unit suffix since our {0} = "N unit")
 */
function extractRelativeWrapper(fields, unit = 'minute') {
  const f = fields[unit] || fields.second || {};
  const futureOne = f['relativeTime-type-future']?.['relativeTimePattern-count-one'] || 'in {0}';
  const pastOne = f['relativeTime-type-past']?.['relativeTimePattern-count-one'] || '{0} ago';

  const wrap = (pattern) => {
    const idx = pattern.indexOf('{0}');
    if (idx === -1) return pattern;
    const prefix = pattern.slice(0, idx);
    const suffix = pattern.slice(idx + 3).trim();
    // If prefix is empty, the number comes after the unit — keep suffix as wrapper
    if (!prefix.trim()) return `{0} ${suffix}`.trim();
    return `${prefix.trim()} {0}`.trim();
  };

  return { future: wrap(futureOne), past: wrap(pastOne) };
}

// ─── LOCALE DISCOVERY ────────────────────────────────────────────────────────

function discoverLocales() {
  const all = fs.readdirSync(cldrMainDir)
    .filter(f => fs.statSync(path.join(cldrMainDir, f)).isDirectory())
    .sort();

  // Keep base locales (no hyphen) + allowlisted regional variants
  return all.filter(code => !code.includes('-') || KEEP_REGIONAL.has(code));
}

// ─── CODE GENERATION ─────────────────────────────────────────────────────────

function escape(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function formsList(forms) {
  return `[${forms.map(f => `'${escape(f)}'`).join(', ')}]`;
}

function generateFile(code, months, weekdays, meridiem, units, future, past, today, tomorrow, yesterday, now, pluralFn) {
  const identifier = code.replace(/-/g, '_');
  const numForms = Object.values(units)[0]?.length || 2;

  return `/**
 * ${code} locale (auto-generated from CLDR)
 */

import type { Locale } from '../locale.js';

export const ${identifier}: Locale = {
  name: '${code}',
  months: [
    ${months.wide.map(m => `'${escape(m)}'`).join(', ')}
  ],
  monthsShort: [${months.abbr.map(m => `'${escape(m)}'`).join(', ')}],
  weekdays: [${weekdays.wide.map(w => `'${escape(w)}'`).join(', ')}],
  weekdaysShort: [${weekdays.abbr.map(w => `'${escape(w)}'`).join(', ')}],
  meridiem: (hour) => hour < 12 ? '${escape(meridiem.am)}' : '${escape(meridiem.pm)}',
  plural: ${pluralFn},
  relativeTime: {
    future: '${escape(future)}',
    past: '${escape(past)}',
    fewSeconds: 'a few seconds',
    now: '${escape(now || 'now')}',
    units: {
      second: ${formsList(units.second)},
      minute: ${formsList(units.minute)},
      hour: ${formsList(units.hour)},
      day: ${formsList(units.day)},
      month: ${formsList(units.month)},
      year: ${formsList(units.year)}
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' }
  },
  calendar: {
    today: '${escape(today || 'today')}',
    tomorrow: '${escape(tomorrow || 'tomorrow')}',
    yesterday: '${escape(yesterday || 'yesterday')}',
    nextWeek: '{0}',
    lastWeek: '{0}'
  },
  duration: {
    units: {
      second: ${formsList(units.second)},
      minute: ${formsList(units.minute)},
      hour: ${formsList(units.hour)},
      day: ${formsList(units.day)},
      month: ${formsList(units.month)},
      year: ${formsList(units.year)}
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' },
    listSeparator: ', ',
    zero: '0 ${escape((units.second[units.second.length - 1]) || 'seconds')}',
    zeroShort: '0s'
  }
};
`;
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

function buildLocales() {
  if (!fs.existsSync(cldrMainDir)) {
    console.error(`CLDR data not found at ${cldrMainDir}`);
    console.error('Run: pnpm run download-cldr');
    process.exit(1);
  }

  const existing = new Set(
    fs.readdirSync(localesDir)
      .filter(f => f.endsWith('.ts'))
      .map(f => f.replace('.ts', ''))
  );

  const pluralRules = loadPluralRules();
  const locales = discoverLocales();

  let generated = 0;
  let skipped = 0;
  let failed = 0;

  console.log(`Found ${locales.length} base CLDR locales, ${existing.size} already exist`);

  for (const code of locales) {
    const identifier = code.replace(/-/g, '_');
    if (existing.has(identifier) || existing.has(code)) { skipped++; continue; }
    // en is built into locale.ts; skip to avoid conflict
    if (code === 'root' || code === 'en') { skipped++; continue; }

    const locDir = resolveLocaleDir(code);
    if (!locDir) { failed++; continue; }

    const gregFile = path.join(locDir, 'ca-gregorian.json');
    const unitsFile = path.join(locDir, 'units.json');
    const dateFieldsFile = path.join(locDir, 'dateFields.json');

    const gregData = readJSON(gregFile);
    const unitsData = readJSON(unitsFile);
    const dateFieldsData = readJSON(dateFieldsFile);

    if (!gregData) { failed++; continue; }

    try {
      const rootKey = Object.keys(gregData.main)[0];
      const greg = gregData.main[rootKey]?.dates?.calendars?.gregorian;
      if (!greg) { failed++; continue; }

      const months = extractMonths(greg);
      const weekdays = extractWeekdays(greg);
      const meridiem = extractMeridiem(greg);

      const pluralFn = getPluralFn(code, pluralRules);
      const cats = pluralFn.includes('2 ?') ? 3 : pluralFn === '() => 0' ? 1 : 2;
      const units = extractUnits(unitsData, code, cats);

      const fields = dateFieldsData?.main?.[rootKey]?.dates?.fields || {};
      const { future, past } = extractRelativeWrapper(fields, 'minute');
      const now = fields.second?.['relative-type-0'] || 'now';
      const today = fields.day?.['relative-type-0'] || 'today';
      const tomorrow = fields.day?.['relative-type-1'] || 'tomorrow';
      const yesterday = fields.day?.['relative-type--1'] || 'yesterday';

      const ts = generateFile(code, months, weekdays, meridiem, units, future, past, today, tomorrow, yesterday, now, pluralFn);
      fs.writeFileSync(path.join(localesDir, `${identifier}.ts`), ts);
      generated++;
    } catch (e) {
      console.warn(`  ✗ ${code}: ${e.message}`);
      failed++;
    }
  }

  console.log(`\n✓ Generated: ${generated}  Skipped (existing): ${skipped}  Failed: ${failed}`);
  console.log(`Total locale files now: ${existing.size + generated}`);
}

buildLocales();
