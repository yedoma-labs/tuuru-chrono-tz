/**
 * Build locale files from CLDR data
 *
 * Converts CLDR JSON to tuuru locale TypeScript files with proper translations.
 * Usage: pnpm run download-cldr && pnpm run build-cldr
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, '..', 'src', 'locales');
const dataDir = path.join(__dirname, '..', 'data');
const cldrMainDir = path.join(dataDir, 'cldr-main');

// Standard locale code mapping (BCP47)
const LOCALE_CODES = [
  'ar', 'bg', 'bn', 'ca', 'cs', 'da', 'de', 'el', 'es', 'fa', 'fi', 'fr',
  'gu', 'he', 'hi', 'hr', 'hu', 'id', 'is', 'it', 'ja', 'ko', 'mr', 'ms',
  'nb', 'nl', 'pl', 'pt', 'ro', 'ru', 'sk', 'sr', 'sv', 'sw', 'ta', 'th',
  'tl', 'tr', 'uk', 'ur', 'vi', 'zh'
];

// Plural form rules per language
const PLURAL_RULES = {
  'ar': { type: 'slavic', forms: 3 },
  'bg': { type: 'simple', forms: 2 },
  'bn': { type: 'simple', forms: 2 },
  'ca': { type: 'simple', forms: 2 },
  'cs': { type: 'slavic', forms: 3 },
  'da': { type: 'simple', forms: 2 },
  'de': { type: 'simple', forms: 2 },
  'el': { type: 'simple', forms: 2 },
  'es': { type: 'simple', forms: 2 },
  'fa': { type: 'simple', forms: 2 },
  'fi': { type: 'simple', forms: 2 },
  'fr': { type: 'simple', forms: 2 },
  'gu': { type: 'simple', forms: 2 },
  'he': { type: 'simple', forms: 2 },
  'hi': { type: 'simple', forms: 2 },
  'hr': { type: 'slavic', forms: 3 },
  'hu': { type: 'simple', forms: 2 },
  'id': { type: 'simple', forms: 2 },
  'is': { type: 'simple', forms: 2 },
  'it': { type: 'simple', forms: 2 },
  'ja': { type: 'simple', forms: 1 },
  'ko': { type: 'simple', forms: 1 },
  'mr': { type: 'simple', forms: 2 },
  'ms': { type: 'simple', forms: 1 },
  'nb': { type: 'simple', forms: 2 },
  'nl': { type: 'simple', forms: 2 },
  'pl': { type: 'slavic', forms: 3 },
  'pt': { type: 'simple', forms: 2 },
  'ro': { type: 'slavic', forms: 3 },
  'ru': { type: 'slavic', forms: 3 },
  'sk': { type: 'slavic', forms: 3 },
  'sr': { type: 'slavic', forms: 3 },
  'sv': { type: 'simple', forms: 2 },
  'sw': { type: 'simple', forms: 2 },
  'ta': { type: 'simple', forms: 2 },
  'th': { type: 'simple', forms: 1 },
  'tl': { type: 'simple', forms: 2 },
  'tr': { type: 'simple', forms: 1 },
  'uk': { type: 'slavic', forms: 3 },
  'ur': { type: 'simple', forms: 2 },
  'vi': { type: 'simple', forms: 1 },
  'zh': { type: 'simple', forms: 1 }
};

function loadLocaleData(localeCode) {
  const variants = [localeCode, localeCode.split('-')[0]];
  for (const variant of variants) {
    const localeFile = path.join(cldrMainDir, variant, 'ca-gregorian.json');
    if (fs.existsSync(localeFile)) {
      const content = fs.readFileSync(localeFile, 'utf-8');
      return JSON.parse(content);
    }
  }
  return null;
}

function loadUnitsData(localeCode) {
  const variants = [localeCode, localeCode.split('-')[0]];
  for (const variant of variants) {
    const unitsFile = path.join(cldrMainDir, variant, 'units.json');
    if (fs.existsSync(unitsFile)) {
      const content = fs.readFileSync(unitsFile, 'utf-8');
      return JSON.parse(content);
    }
  }
  return null;
}

function extractMonths(data) {
  const root = data.main[Object.keys(data.main)[0]];
  const greg = root.dates.calendars.gregorian;
  const months = greg.months || {};
  const format = months.format || {};
  const wide = format.wide || {};
  const abbreviated = format.abbreviated || {};

  const monthsWide = [];
  const monthsShort = [];
  for (let i = 1; i <= 12; i++) {
    monthsWide.push(wide[i] || `Month${i}`);
    monthsShort.push(abbreviated[i] || `M${i}`);
  }

  return { monthsWide, monthsShort };
}

function extractWeekdays(data) {
  const root = data.main[Object.keys(data.main)[0]];
  const greg = root.dates.calendars.gregorian;
  const days = greg.days || {};
  const format = days.format || {};
  const wide = format.wide || {};
  const abbreviated = format.abbreviated || {};

  // CLDR uses: sun, mon, tue, wed, thu, fri, sat
  // We want Monday-first: mon, tue, wed, thu, fri, sat, sun
  const dayNames = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  const weekdaysWide = dayNames.map(day => wide[day] || `Day${day}`);
  const weekdaysShort = dayNames.map(day => abbreviated[day] || `D${day.substring(0, 1)}`);

  return { weekdaysWide, weekdaysShort };
}

function extractMeridiem(data) {
  const root = data.main[Object.keys(data.main)[0]];
  const periods = root.dates.calendars.gregorian.dayPeriods?.format?.wide || {};

  const am = periods.am || 'AM';
  const pm = periods.pm || 'PM';

  return { am, pm };
}

function extractUnits(unitsData, unitType) {
  if (!unitsData) return null;
  const root = unitsData.main[Object.keys(unitsData.main)[0]];
  const units = root.units?.long || {};

  const results = {};
  ['duration-second', 'duration-minute', 'duration-hour', 'duration-day', 'duration-month', 'duration-year'].forEach(key => {
    if (units[key]) {
      const unit = units[key];
      // Try count-one first, fall back to count-other for languages without singular/plural distinction
      const singular = unit['unitPattern-count-one'] || unit['unitPattern-count-other'] || `{0} ${key}`;
      const plural = unit['unitPattern-count-other'] || `{0} ${key}s`;
      // Remove the {0} placeholder (handles both "{0} word" and "word {0}")
      const cleanSingular = singular.replace('{0}', '').replace(/^\s+|\s+$/g, '');
      const cleanPlural = plural.replace('{0}', '').replace(/^\s+|\s+$/g, '');
      results[key.replace('duration-', '')] = {
        singular: cleanSingular || key,
        plural: cleanPlural || (key + 's')
      };
    }
  });

  return Object.keys(results).length > 0 ? results : null;
}

function generatePluralFunction(localeCode) {
  const rule = PLURAL_RULES[localeCode];
  if (!rule) return null;

  if (rule.forms === 1) return null;

  let fn = 'function plural(n: number): number {\n';

  if (rule.type === 'slavic') {
    fn += '  if (n % 10 === 1 && n % 100 !== 11) return 0;\n';
    fn += '  if (n % 10 >= 2 && n % 10 <= 4 && !(n % 100 >= 12 && n % 100 <= 14)) return 1;\n';
    fn += '  return 2;\n';
  } else {
    fn += '  return n === 1 ? 0 : 1;\n';
  }

  fn += '}';
  return fn;
}

function escape(str) {
  return str.replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r');
}

function generateLocaleFile(localeCode, data, unitsData) {
  const { monthsWide, monthsShort } = extractMonths(data);
  const { weekdaysWide, weekdaysShort } = extractWeekdays(data);
  const { am, pm } = extractMeridiem(data);
  const rule = PLURAL_RULES[localeCode];
  const numForms = rule?.forms || 2;
  const pluralFn = generatePluralFunction(localeCode);
  const units = extractUnits(unitsData);

  let ts = `/**\n * ${localeCode.toUpperCase()} locale\n */\n\n`;
  ts += `import type { Locale } from '../locale.js';\n\n`;

  if (pluralFn) {
    ts += pluralFn + '\n\n';
  }

  ts += `export const ${localeCode}: Locale = {\n`;
  ts += `  name: '${localeCode}',\n`;

  // Months
  ts += `  months: [\n`;
  monthsWide.forEach(m => ts += `    '${escape(m)}',\n`);
  ts += `  ],\n`;

  ts += `  monthsShort: [\n`;
  monthsShort.forEach(m => ts += `    '${escape(m)}',\n`);
  ts += `  ],\n`;

  // Weekdays
  ts += `  weekdays: [\n`;
  weekdaysWide.forEach(w => ts += `    '${escape(w)}',\n`);
  ts += `  ],\n`;

  ts += `  weekdaysShort: [\n`;
  weekdaysShort.forEach(w => ts += `    '${escape(w)}',\n`);
  ts += `  ],\n`;

  // Meridiem
  ts += `  meridiem: (hour, lowercase) => {\n`;
  ts += `    const m = hour < 12 ? '${escape(am)}' : '${escape(pm)}';\n`;
  ts += `    return lowercase ? m.toLowerCase() : m;\n`;
  ts += `  },\n`;

  // Plural function
  if (pluralFn) {
    ts += `  plural,\n`;
  }

  // Relative time
  ts += `  relativeTime: {\n`;
  ts += `    future: 'in {0}',\n`;
  ts += `    past: '{0} ago',\n`;
  ts += `    fewSeconds: 'a few seconds',\n`;
  ts += `    now: 'now',\n`;
  ts += `    units: {\n`;

  const unitNames = ['second', 'minute', 'hour', 'day', 'month', 'year'];
  unitNames.forEach(u => {
    const forms = [];
    if (units && units[u]) {
      forms.push(units[u].singular);
      for (let i = 1; i < numForms; i++) {
        forms.push(units[u].plural);
      }
    } else {
      forms.push(u);
      for (let i = 1; i < numForms; i++) {
        forms.push(u + 's');
      }
    }
    ts += `      ${u}: [${forms.map(f => `'${f}'`).join(', ')}],\n`;
  });

  ts += `    },\n`;
  ts += `    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' }\n`;
  ts += `  },\n`;

  ts += `  calendar: {\n`;
  ts += `    today: 'today',\n`;
  ts += `    tomorrow: 'tomorrow',\n`;
  ts += `    yesterday: 'yesterday',\n`;
  ts += `    nextWeek: 'next {0}',\n`;
  ts += `    lastWeek: 'last {0}'\n`;
  ts += `  },\n`;

  ts += `  duration: {\n`;
  ts += `    units: {\n`;
  unitNames.forEach(u => {
    const forms = [];
    if (units && units[u]) {
      forms.push(units[u].singular);
      for (let i = 1; i < numForms; i++) {
        forms.push(units[u].plural);
      }
    } else {
      forms.push(u);
      for (let i = 1; i < numForms; i++) {
        forms.push(u + 's');
      }
    }
    ts += `      ${u}: [${forms.map(f => `'${f}'`).join(', ')}],\n`;
  });
  ts += `    },\n`;
  ts += `    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' },\n`;
  ts += `    listSeparator: ', ',\n`;
  ts += `    zero: '0 seconds',\n`;
  ts += `    zeroShort: '0s'\n`;
  ts += `  }\n`;
  ts += `};\n`;

  return ts;
}

async function buildLocales() {
  if (!fs.existsSync(cldrMainDir)) {
    console.error(`CLDR data not found at ${cldrMainDir}`);
    console.error('Run: pnpm run download-cldr');
    process.exit(1);
  }

  if (!fs.existsSync(localesDir)) {
    fs.mkdirSync(localesDir, { recursive: true });
  }

  let generated = 0;
  let failed = 0;

  console.log(`Building locale files from CLDR...`);

  for (const code of LOCALE_CODES) {
    try {
      const data = loadLocaleData(code);
      if (!data) {
        console.warn(`⚠ ${code} - no CLDR data`);
        failed++;
        continue;
      }

      const unitsData = loadUnitsData(code);
      const ts = generateLocaleFile(code, data, unitsData);
      const outFile = path.join(localesDir, `${code}.ts`);
      fs.writeFileSync(outFile, ts);
      console.log(`✓ ${code}`);
      generated++;
    } catch (error) {
      console.error(`✗ ${code}: ${error.message}`);
      failed++;
    }
  }

  console.log(`\nGenerated: ${generated}/${LOCALE_CODES.length}, Failed: ${failed}`);
}

buildLocales().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
