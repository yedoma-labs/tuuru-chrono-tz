import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

describe('package subpath exports', () => {
  it('./tzdata subpath exposes getTimezoneData (ESM)', async () => {
    const mod = await import('../dist/esm/tzdata/index.js');
    assert.equal(typeof mod.getTimezoneData, 'function');
    const data = mod.getTimezoneData();
    assert.equal(typeof data.version, 'string');
    assert.ok(Object.keys(data.zones).length > 300);
  });

  it('./tzdata subpath works under CJS', () => {
    const mod = require('../dist/cjs/tzdata/index.js');
    assert.equal(typeof mod.getTimezoneData, 'function');
    assert.equal(mod.getTimezoneData().links['US/Eastern'], 'America/New_York');
  });

  it('every locale subpath resolves and is self-named (ESM)', async () => {
    const names = ['de', 'fr', 'es', 'pt', 'it', 'ru', 'zh', 'ja', 'id', 'hi', 'bn',
      'ko', 'tr', 'vi', 'pl', 'nl', 'th', 'ar', 'fa', 'ur', 'uk',
      'da', 'sv', 'nb', 'fi', 'is', 'hu', 'ro', 'bg', 'el',
      'cs', 'sk', 'hr', 'sr',
      'ms', 'sw', 'he', 'ca', 'tl', 'gu', 'mr', 'ta'];
    for (const name of names) {
      const mod = await import(`../dist/esm/locales/${name}.js`);
      assert.equal(mod[name].name, name, `locales/${name}`);
    }
  });

  it('locale subpaths resolve under CJS', () => {
    const { ru } = require('../dist/cjs/locales/ru.js');
    const { zh } = require('../dist/cjs/locales/zh.js');
    assert.equal(ru.name, 'ru');
    assert.equal(zh.name, 'zh');
  });
});

describe('root barrel surface', () => {
  it('exports the documented public API and nothing data-heavy', async () => {
    const mod = await import('../dist/esm/index.js');
    const expected = [
      'DateTime', 'Duration', 'Timezone', 'LocalDate', 'LocalTime',
      'en', 'de', 'fr', 'setDefaultLocale', 'getDefaultLocale',
      'TIMEZONE_NAMES', 'TIMEZONE_COUNT', 'TZDATA_VERSION', 'TIMEZONE_LINKS'
    ];
    for (const name of expected) {
      assert.ok(name in mod, `missing export: ${name}`);
    }
    // getTimezoneData must NOT be in the root barrel: keeps the 322KB raw
    // IANA tables out of the default bundle. It lives behind ./tzdata.
    assert.ok(!('getTimezoneData' in mod), 'getTimezoneData leaked into root barrel');
    assert.ok(!('IANA_DATA' in mod), 'IANA_DATA leaked into root barrel');
  });
});

describe('CDN bundle', () => {
  it('exists and exposes the API as an IIFE global', () => {
    const { readFileSync } = require('node:fs');
    const code = readFileSync(new URL('../dist/tuuru.min.js', import.meta.url), 'utf8');
    // Evaluate the IIFE and capture the global it defines
    const tuuru = new Function(`${code}; return tuuru;`)();
    assert.equal(typeof tuuru.DateTime, 'function');
    assert.equal(typeof tuuru.LocalDate, 'function');
    assert.equal(tuuru.DateTime.fromISO('2024-06-09T10:30:00Z').toISO(), '2024-06-09T10:30:00.000Z');
    assert.equal(tuuru.LocalDate.fromISO('2024-06-09').format('MMMM D'), 'June 9');
    // The raw IANA rule tables must stay out of the CDN bundle
    assert.ok(code.length < 120 * 1024, `CDN bundle too large: ${(code.length / 1024).toFixed(0)}KB`);
  });
});
