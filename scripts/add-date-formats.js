#!/usr/bin/env node
/**
 * One-shot script: inject dateFormats into every locale object.
 * Run once from repo root: node scripts/add-date-formats.js
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

// short  = numeric-only
// medium = abbreviated month
// long   = full month
// full   = weekday + full month
//
// Escape Latin words that contain format tokens (m, a, d, s, h, A, H, Y, M, D, W, Q, Z)
// using the [text] bracket syntax that format() already supports.
const FORMATS = {
  // ---- English (handled separately in locale.ts) ---
  en:       { short: 'MM/DD/YYYY', medium: 'MMM D, YYYY',      long: 'MMMM D, YYYY',        full: 'dddd, MMMM D, YYYY' },

  // ---- German cluster ---
  de:       { short: 'DD.MM.YYYY', medium: 'D. MMM YYYY',      long: 'D. MMMM YYYY',         full: 'dddd, D. MMMM YYYY' },
  nl:       { short: 'DD-MM-YYYY', medium: 'D MMM YYYY',       long: 'D MMMM YYYY',          full: 'dddd D MMMM YYYY' },

  // ---- Romance ---
  fr:       { short: 'DD/MM/YYYY', medium: 'D MMM YYYY',       long: 'D MMMM YYYY',          full: 'dddd D MMMM YYYY' },
  es:       { short: 'DD/MM/YYYY', medium: 'D MMM YYYY',       long: 'D MMMM YYYY',          full: 'dddd, D MMMM YYYY' },
  pt:       { short: 'DD/MM/YYYY', medium: 'D MMM YYYY',       long: 'D MMMM YYYY',          full: 'dddd, D MMMM YYYY' },
  it:       { short: 'DD/MM/YYYY', medium: 'D MMM YYYY',       long: 'D MMMM YYYY',          full: 'dddd D MMMM YYYY' },
  ro:       { short: 'DD.MM.YYYY', medium: 'D MMM YYYY',       long: 'D MMMM YYYY',          full: 'dddd, D MMMM YYYY' },
  ca:       { short: 'DD/MM/YYYY', medium: 'D MMM YYYY',       long: 'D MMMM YYYY',          full: 'dddd, D MMMM YYYY' },
  gl:       { short: 'DD/MM/YYYY', medium: 'D MMM YYYY',       long: 'D MMMM YYYY',          full: 'dddd, D MMMM YYYY' },

  // ---- CJK ---
  zh:       { short: 'YYYY/MM/DD', medium: 'YYYY年M月D日',     long: 'YYYY年M月D日',         full: 'YYYY年M月D日 dddd' },
  zh_Hans:  { short: 'YYYY/MM/DD', medium: 'YYYY年M月D日',     long: 'YYYY年M月D日',         full: 'YYYY年M月D日 dddd' },
  zh_Hant:  { short: 'YYYY/MM/DD', medium: 'YYYY年M月D日',     long: 'YYYY年M月D日',         full: 'YYYY年M月D日 dddd' },
  yue:      { short: 'YYYY/MM/DD', medium: 'YYYY年M月D日',     long: 'YYYY年M月D日',         full: 'YYYY年M月D日 dddd' },
  ja:       { short: 'YYYY/MM/DD', medium: 'YYYY年M月D日',     long: 'YYYY年M月D日',         full: 'YYYY年M月D日(ddd)' },
  ko:       { short: 'YYYY/MM/DD', medium: 'YYYY년 M월 D일',   long: 'YYYY년 M월 D일',       full: 'YYYY년 M월 D일 dddd' },

  // ---- Indic ---
  hi:       { short: 'DD/MM/YYYY', medium: 'D MMM YYYY',       long: 'D MMMM YYYY',          full: 'dddd, D MMMM YYYY' },
  mr:       { short: 'DD/MM/YYYY', medium: 'D MMM YYYY',       long: 'D MMMM YYYY',          full: 'dddd, D MMMM YYYY' },
  ne:       { short: 'DD/MM/YYYY', medium: 'D MMM YYYY',       long: 'D MMMM YYYY',          full: 'dddd, D MMMM YYYY' },
  bn:       { short: 'DD/MM/YYYY', medium: 'D MMM YYYY',       long: 'D MMMM YYYY',          full: 'dddd, D MMMM YYYY' },
  pa:       { short: 'DD/MM/YYYY', medium: 'D MMM YYYY',       long: 'D MMMM YYYY',          full: 'dddd, D MMMM YYYY' },
  gu:       { short: 'DD/MM/YYYY', medium: 'D MMM YYYY',       long: 'D MMMM YYYY',          full: 'dddd, D MMMM YYYY' },
  ta:       { short: 'DD/MM/YYYY', medium: 'D MMM YYYY',       long: 'D MMMM YYYY',          full: 'dddd, D MMMM YYYY' },
  te:       { short: 'DD/MM/YYYY', medium: 'D MMM YYYY',       long: 'D MMMM YYYY',          full: 'dddd, D MMMM YYYY' },
  kn:       { short: 'DD/MM/YYYY', medium: 'D MMM YYYY',       long: 'D MMMM YYYY',          full: 'dddd, D MMMM YYYY' },
  ml:       { short: 'DD/MM/YYYY', medium: 'D MMM YYYY',       long: 'D MMMM YYYY',          full: 'dddd, D MMMM YYYY' },
  or:       { short: 'DD/MM/YYYY', medium: 'D MMM YYYY',       long: 'D MMMM YYYY',          full: 'dddd, D MMMM YYYY' },
  as:       { short: 'DD/MM/YYYY', medium: 'D MMM YYYY',       long: 'D MMMM YYYY',          full: 'dddd, D MMMM YYYY' },
  si:       { short: 'YYYY/MM/DD', medium: 'YYYY MMM D',       long: 'YYYY MMMM D',          full: 'YYYY MMMM D, dddd' },
  sd:       { short: 'DD/MM/YYYY', medium: 'D MMM YYYY',       long: 'D MMMM YYYY',          full: 'dddd D MMMM YYYY' },

  // ---- Cyrillic / Russian cluster ---
  // 'г.' (Russian for 'year') and 'р.' (Ukrainian) are Cyrillic — safe, not token chars
  ru:       { short: 'DD.MM.YYYY', medium: 'D MMM YYYY г.',    long: 'D MMMM YYYY г.',       full: 'dddd, D MMMM YYYY г.' },
  uk:       { short: 'DD.MM.YYYY', medium: 'D MMM YYYY р.',    long: 'D MMMM YYYY р.',       full: 'dddd, D MMMM YYYY р.' },
  bg:       { short: 'DD.MM.YYYY', medium: 'D MMM YYYY г.',    long: 'D MMMM YYYY г.',       full: 'dddd, D MMMM YYYY г.' },
  be:       { short: 'DD.MM.YYYY', medium: 'D MMM YYYY г.',    long: 'D MMMM YYYY г.',       full: 'dddd, D MMMM YYYY г.' },
  mk:       { short: 'DD.MM.YYYY', medium: 'D MMM YYYY г.',    long: 'D MMMM YYYY г.',       full: 'dddd, D MMMM YYYY г.' },
  sr:       { short: 'DD.MM.YYYY', medium: 'D. MMM YYYY.',     long: 'D. MMMM YYYY.',        full: 'dddd, D. MMMM YYYY.' },

  // ---- Slavic ---
  pl:       { short: 'DD.MM.YYYY', medium: 'D MMM YYYY',       long: 'D MMMM YYYY',          full: 'dddd, D MMMM YYYY' },
  cs:       { short: 'DD.MM.YYYY', medium: 'D. MMM YYYY',      long: 'D. MMMM YYYY',         full: 'dddd D. MMMM YYYY' },
  sk:       { short: 'DD.MM.YYYY', medium: 'D. MMM YYYY',      long: 'D. MMMM YYYY',         full: 'dddd D. MMMM YYYY' },
  sl:       { short: 'DD.MM.YYYY', medium: 'D. MMM YYYY',      long: 'D. MMMM YYYY',         full: 'dddd, D. MMMM YYYY' },
  hr:       { short: 'DD.MM.YYYY', medium: 'D. MMM YYYY.',     long: 'D. MMMM YYYY.',        full: 'dddd, D. MMMM YYYY.' },
  bs:       { short: 'DD.MM.YYYY', medium: 'D. MMM YYYY.',     long: 'D. MMMM YYYY.',        full: 'dddd, D. MMMM YYYY.' },
  sr_Latn:  { short: 'DD.MM.YYYY', medium: 'D. MMM YYYY.',     long: 'D. MMMM YYYY.',        full: 'dddd, D. MMMM YYYY.' },

  // ---- Nordic ---
  da:       { short: 'DD.MM.YYYY', medium: 'D. MMM YYYY',      long: 'D. MMMM YYYY',         full: 'dddd D. MMMM YYYY' },
  // Swedish: ISO numeric short, space-separated long
  sv:       { short: 'YYYY-MM-DD', medium: 'D MMM YYYY',       long: 'D MMMM YYYY',          full: 'dddd D MMMM YYYY' },
  nb:       { short: 'DD.MM.YYYY', medium: 'D. MMM YYYY',      long: 'D. MMMM YYYY',         full: 'dddd D. MMMM YYYY' },

  // ---- Baltic ---
  // 'm.' and 'd.' are Lithuanian abbreviations for year/day — bracket-escape to avoid 'm' (minute) token
  lt:       { short: 'YYYY-MM-DD', medium: 'YYYY [m.] MMM D [d.]',  long: 'YYYY [m.] MMMM D [d.]',   full: 'dddd, YYYY [m.] MMMM D [d.]' },
  // Latvian 'gada' has 'a' (AM/PM token) — bracket-escape
  lv:       { short: 'DD.MM.YYYY', medium: 'D. MMM, YYYY. [g.]',    long: 'YYYY. [gada] D. MMMM',    full: 'dddd, YYYY. [gada] D. MMMM' },

  // ---- Finnic / Ugric ---
  fi:       { short: 'DD.MM.YYYY', medium: 'D. MMM YYYY',      long: 'D. MMMM YYYY',         full: 'dddd D. MMMM YYYY' },
  et:       { short: 'DD.MM.YYYY', medium: 'D. MMM YYYY',      long: 'D. MMMM YYYY',         full: 'dddd, D. MMMM YYYY' },
  hu:       { short: 'YYYY.MM.DD.', medium: 'YYYY. MMM D.',    long: 'YYYY. MMMM D.',        full: 'YYYY. MMMM D., dddd' },

  // ---- Other European ---
  el:       { short: 'DD/MM/YYYY', medium: 'D MMM YYYY',       long: 'D MMMM YYYY',          full: 'dddd, D MMMM YYYY' },
  is:       { short: 'DD.MM.YYYY', medium: 'D. MMM YYYY',      long: 'D. MMMM YYYY',         full: 'dddd, D. MMMM YYYY' },
  sq:       { short: 'DD.MM.YYYY', medium: 'D MMM YYYY',       long: 'D MMMM YYYY',          full: 'dddd, D MMMM YYYY' },
  // Basque uses 'eko' suffix but it's safe since 'e','k','o' aren't token chars
  eu:       { short: 'YYYY/MM/DD', medium: 'YYYY[e]ko MMM D',  long: 'YYYY[e]ko MMMM D',     full: 'dddd, YYYY[e]ko MMMM D' },

  // ---- Celtic ---
  ga:       { short: 'DD/MM/YYYY', medium: 'D MMM YYYY',       long: 'D MMMM YYYY',          full: 'dddd D MMMM YYYY' },
  cy:       { short: 'DD/MM/YYYY', medium: 'D MMM YYYY',       long: 'D MMMM YYYY',          full: 'dddd, D MMMM YYYY' },

  // ---- Turkic ---
  tr:       { short: 'DD.MM.YYYY', medium: 'D MMM YYYY',       long: 'D MMMM YYYY',          full: 'D MMMM YYYY dddd' },
  az:       { short: 'DD.MM.YYYY', medium: 'D MMM YYYY',       long: 'D MMMM YYYY',          full: 'D MMMM YYYY, dddd' },
  tk:       { short: 'DD.MM.YYYY', medium: 'D MMM YYYY',       long: 'D MMMM YYYY',          full: 'D MMMM YYYY, dddd' },
  uz:       { short: 'DD.MM.YYYY', medium: 'D MMM YYYY',       long: 'D MMMM YYYY',          full: 'D MMMM YYYY, dddd' },
  ky:       { short: 'DD.MM.YYYY', medium: 'D MMM YYYY',       long: 'D MMMM YYYY',          full: 'D MMMM YYYY, dddd' },
  kk:       { short: 'DD.MM.YYYY', medium: 'D MMM YYYY',       long: 'D MMMM YYYY',          full: 'D MMMM YYYY, dddd' },

  // ---- Persian / Semitic ---
  fa:       { short: 'YYYY/MM/DD', medium: 'D MMM YYYY',       long: 'D MMMM YYYY',          full: 'dddd D MMMM YYYY' },
  ur:       { short: 'DD/MM/YYYY', medium: 'D MMM YYYY',       long: 'D MMMM YYYY',          full: 'dddd، D MMMM YYYY' },
  ps:       { short: 'DD/MM/YYYY', medium: 'D MMM YYYY',       long: 'D MMMM YYYY',          full: 'dddd D MMMM YYYY' },
  ar:       { short: 'DD/MM/YYYY', medium: 'D MMM YYYY',       long: 'D MMMM YYYY',          full: 'dddd، D MMMM YYYY' },
  he:       { short: 'DD/MM/YYYY', medium: 'D MMM YYYY',       long: 'D MMMM YYYY',          full: 'dddd, D MMMM YYYY' },

  // ---- Caucasian ---
  // 'թ.' is Armenian, 'г.' here belongs to Georgian sub-entry
  hy:       { short: 'DD.MM.YYYY', medium: 'D MMM YYYY թ.',    long: 'D MMMM YYYY թ.',       full: 'dddd, D MMMM YYYY թ.' },
  ka:       { short: 'DD.MM.YYYY', medium: 'D MMM, YYYY',      long: 'D MMMM, YYYY',         full: 'dddd, D MMMM, YYYY' },

  // ---- Southeast / Central Asian ---
  th:       { short: 'DD/MM/YYYY', medium: 'D MMM YYYY',       long: 'D MMMM YYYY',          full: 'dddd D MMMM YYYY' },
  vi:       { short: 'DD/MM/YYYY', medium: 'D MMM YYYY',       long: 'D MMMM YYYY',          full: 'dddd, D MMMM YYYY' },
  id:       { short: 'DD/MM/YYYY', medium: 'D MMM YYYY',       long: 'D MMMM YYYY',          full: 'dddd, D MMMM YYYY' },
  ms:       { short: 'DD/MM/YYYY', medium: 'D MMM YYYY',       long: 'D MMMM YYYY',          full: 'dddd, D MMMM YYYY' },
  jv:       { short: 'DD/MM/YYYY', medium: 'D MMM YYYY',       long: 'D MMMM YYYY',          full: 'dddd, D MMMM YYYY' },
  km:       { short: 'DD/MM/YYYY', medium: 'D MMM YYYY',       long: 'D MMMM YYYY',          full: 'dddd D MMMM YYYY' },
  lo:       { short: 'DD/MM/YYYY', medium: 'D MMM YYYY',       long: 'D MMMM YYYY',          full: 'dddd D MMMM YYYY' },
  my:       { short: 'DD/MM/YYYY', medium: 'D MMM YYYY',       long: 'D MMMM YYYY',          full: 'dddd D MMMM YYYY' },
  // Mongolian: Cyrillic 'оны' (year's) and 'сарын' (month's) are safe
  mn:       { short: 'YYYY.MM.DD', medium: 'YYYY оны MMM',     long: 'YYYY оны MM сарын D',  full: 'dddd, YYYY оны MM сарын D' },

  // ---- Filipino ---
  tl:       { short: 'MM/DD/YYYY', medium: 'MMM D, YYYY',      long: 'MMMM D, YYYY',         full: 'dddd, MMMM D, YYYY' },
  fil:      { short: 'MM/DD/YYYY', medium: 'MMM D, YYYY',      long: 'MMMM D, YYYY',         full: 'dddd, MMMM D, YYYY' },

  // ---- African ---
  sw:       { short: 'DD/MM/YYYY', medium: 'D MMM YYYY',       long: 'D MMMM YYYY',          full: 'dddd, D MMMM YYYY' },
  so:       { short: 'DD/MM/YYYY', medium: 'D MMM YYYY',       long: 'D MMMM YYYY',          full: 'dddd, D MMMM YYYY' },
  zu:       { short: 'DD/MM/YYYY', medium: 'D MMM YYYY',       long: 'D MMMM YYYY',          full: 'dddd, D MMMM YYYY' },
  af:       { short: 'DD/MM/YYYY', medium: 'D MMM YYYY',       long: 'D MMMM YYYY',          full: 'dddd D MMMM YYYY' },
  am:       { short: 'DD/MM/YYYY', medium: 'D MMM YYYY',       long: 'D MMMM YYYY',          full: 'dddd D MMMM YYYY' },
};

function buildBlock(fmt) {
  return (
    `  dateFormats: {\n` +
    `    short:  '${fmt.short}',\n` +
    `    medium: '${fmt.medium}',\n` +
    `    long:   '${fmt.long}',\n` +
    `    full:   '${fmt.full}'\n` +
    `  }`
  );
}

const LOCALES_DIR = new URL('../src/locales', import.meta.url).pathname;
const files = readdirSync(LOCALES_DIR).filter(f => f.endsWith('.ts'));

let updated = 0;
let skipped = 0;

for (const file of files) {
  const code = file.replace('.ts', '');
  const fmt = FORMATS[code];
  if (!fmt) { console.warn(`⚠  No dateFormats entry for ${code} — skipped`); skipped++; continue; }

  const path = join(LOCALES_DIR, file);
  const src = readFileSync(path, 'utf8');

  if (src.includes('dateFormats')) { console.log(`✓  ${code} already has dateFormats`); skipped++; continue; }

  // Insert dateFormats before the final `};`
  const modified = src.replace(/(\n};)\s*$/, `,\n${buildBlock(fmt)}\n};\n`);
  if (modified === src) { console.warn(`⚠  Could not inject into ${file}`); skipped++; continue; }

  writeFileSync(path, modified, 'utf8');
  console.log(`✅ ${code}`);
  updated++;
}

// Handle en in src/locale.ts
const EN_PATH = new URL('../src/locale.ts', import.meta.url).pathname;
const enSrc = readFileSync(EN_PATH, 'utf8');
if (!enSrc.includes('dateFormats')) {
  const enFmt = FORMATS.en;
  const modified = enSrc.replace(
    /(\s+duration: \{[\s\S]+?zeroShort:[^\n]+\n\s+\})\n\};/,
    `$1,\n${buildBlock(enFmt)}\n};\n`
  );
  if (modified === enSrc) {
    console.warn('⚠  Could not inject into src/locale.ts');
  } else {
    writeFileSync(EN_PATH, modified, 'utf8');
    console.log('✅ en (locale.ts)');
    updated++;
  }
} else {
  console.log('✓  en already has dateFormats');
}

console.log(`\nDone. ${updated} updated, ${skipped} skipped.`);
