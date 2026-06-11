#!/usr/bin/env node

/**
 * Performance benchmark
 *
 * Measures core operations against the built ESM output. Reports ops/sec
 * (median of several timed batches) so results are stable across runs.
 *
 * The Intl-backed timezone math is the expected hot spot: every wall-clock
 * read goes through Intl.DateTimeFormat.formatToParts. This benchmark exists
 * to quantify that and to catch regressions.
 *
 * Usage: node scripts/benchmark.js   (requires pnpm build first)
 */

import { existsSync } from 'node:fs';
import { DateTime, Duration, Timezone, setDefaultLocale, en } from '../dist/esm/index.js';

if (!existsSync('dist/esm/index.js')) {
  console.error('❌ dist/esm not found. Run: pnpm build');
  process.exit(1);
}

setDefaultLocale(en);

/** Run `fn` for ~minTimeMs, return ops/sec; take the median of `samples`. */
function bench(name, fn, { minTimeMs = 200, samples = 5 } = {}) {
  // Warm up (let the JIT settle and Intl formatters populate caches)
  for (let i = 0; i < 1000; i++) fn();

  const rates = [];
  for (let s = 0; s < samples; s++) {
    let ops = 0;
    const start = performance.now();
    let elapsed = 0;
    // Batch to amortize the performance.now() cost
    do {
      for (let i = 0; i < 1000; i++) fn();
      ops += 1000;
      elapsed = performance.now() - start;
    } while (elapsed < minTimeMs);
    rates.push(ops / (elapsed / 1000));
  }

  rates.sort((a, b) => a - b);
  const median = rates[Math.floor(rates.length / 2)];
  return { name, opsPerSec: median };
}

const utc = DateTime.fromISO('2024-06-09T10:30:00.123Z');
const tokyo = utc.setTimezone('Asia/Tokyo');
const ny = utc.setTimezone('America/New_York');
const other = DateTime.fromISO('2024-01-01T00:00:00Z');
const dur = Duration.fromObject({ hours: 2, minutes: 30 });

const cases = [
  // Parsing
  ['fromISO (UTC)', () => DateTime.fromISO('2024-06-09T10:30:00.123Z')],
  ['fromISO (offset suffix)', () => DateTime.fromISO('2024-06-09T19:30:00+09:00')],
  ['fromFormat', () => DateTime.fromFormat('2024-06-09 10:30', 'YYYY-MM-DD HH:mm')],
  ['fromObject (UTC)', () => DateTime.fromObject({ year: 2024, month: 6, day: 9, hour: 10 })],
  ['fromObject (zoned)', () => DateTime.fromObject({ year: 2024, month: 6, day: 9 }, { timezone: 'Asia/Tokyo' })],

  // Getters (the Intl hot path)
  ['get year (UTC)', () => utc.year],
  ['get year (zoned)', () => tokyo.year],
  ['get offset (zoned)', () => ny.offset],

  // Formatting
  ['format YYYY-MM-DD HH:mm:ss (UTC)', () => utc.format('YYYY-MM-DD HH:mm:ss')],
  ['format (zoned, names)', () => tokyo.format('dddd, MMMM D')],
  ['toISO (UTC)', () => utc.toISO()],
  ['toISO (zoned)', () => tokyo.toISO()],

  // Arithmetic
  ['add hours (UTC)', () => utc.add({ hours: 5 })],
  ['add days (zoned, DST-safe)', () => ny.add({ days: 1 })],
  ['add months', () => utc.add({ months: 3 })],
  ['diff', () => utc.diff(other)],
  ['startOf day (zoned)', () => tokyo.startOf('day')],

  // Relative / duration
  ['fromNow', () => utc.fromNow()],
  ['Duration.humanize', () => dur.humanize()],
  ['Duration.format', () => dur.format('HH:mm:ss')],

  // Timezone utils
  ['Timezone.isValid', () => Timezone.isValid('America/New_York')],
  ['Timezone.getOffset', () => Timezone.getOffset('Asia/Tokyo', 1717929000123)],
  ['Timezone.getCanonical', () => Timezone.getCanonical('US/Eastern')],
];

const fmt = (n) => n >= 1e6
  ? (n / 1e6).toFixed(1) + 'M'
  : n >= 1e3 ? (n / 1e3).toFixed(0) + 'K' : n.toFixed(0);

console.log(`\nNode ${process.version} · ${process.platform}/${process.arch}\n`);
console.log('operation'.padEnd(38) + 'ops/sec'.padStart(12) + 'ns/op'.padStart(12));
console.log('-'.repeat(62));

const results = [];
for (const [name, fn] of cases) {
  const r = bench(name, fn);
  results.push(r);
  const nsPerOp = 1e9 / r.opsPerSec;
  console.log(
    name.padEnd(38) +
    fmt(r.opsPerSec).padStart(12) +
    nsPerOp.toFixed(0).padStart(12)
  );
}

// Emit machine-readable JSON when asked (for CI artifacts / docs regen)
if (process.argv.includes('--json')) {
  console.log('\n' + JSON.stringify(results, null, 2));
}
