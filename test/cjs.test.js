import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

describe('CommonJS build', () => {
  it('loads via require() and works', () => {
    const { DateTime, Duration, Timezone } = require('../dist/cjs/index.js');

    assert.equal(typeof DateTime, 'function');
    assert.equal(DateTime.fromISO('2024-06-09T10:30:00Z').toISO(), '2024-06-09T10:30:00.000Z');
    assert.equal(Duration.fromISO('PT2H30M').totalMinutes, 150);
    assert.ok(Timezone.isValid('Asia/Tokyo'));
  });

  it('CJS and ESM builds agree', async () => {
    const cjs = require('../dist/cjs/index.js');
    const esm = await import('../dist/esm/index.js');
    assert.equal(cjs.TZDATA_VERSION, esm.TZDATA_VERSION);
    assert.equal(cjs.TIMEZONE_COUNT, esm.TIMEZONE_COUNT);
  });
});
