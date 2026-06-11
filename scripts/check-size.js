#!/usr/bin/env node

/**
 * Bundle size check
 *
 * Verifies the "< 20KB gzipped" claim with a real bundler pass:
 * bundles the typical import surface (DateTime, Duration, Timezone)
 * from the built ESM output, minified, and measures gzip size.
 * The full IANA rule table (iana-data) must be tree-shaken away
 * because getTimezoneData is unused in this entry.
 *
 * Exits 1 if the core bundle exceeds the limit.
 *
 * Usage: node scripts/check-size.js   (requires pnpm build first)
 */

import { build } from 'esbuild';
import { gzipSync } from 'node:zlib';
import { existsSync } from 'node:fs';

const LIMIT_BYTES = 20 * 1024;

if (!existsSync('dist/esm/index.js')) {
  console.error('❌ dist/esm not found. Run: pnpm build');
  process.exit(1);
}

async function bundleSize(entryContents, label) {
  const result = await build({
    stdin: {
      contents: entryContents,
      resolveDir: process.cwd(),
      sourcefile: `${label}.js`,
    },
    bundle: true,
    minify: true,
    format: 'esm',
    write: false,
    treeShaking: true,
  });

  const code = result.outputFiles[0].contents;
  const gzipped = gzipSync(code, { level: 9 }).length;
  return { raw: code.length, gzipped };
}

const core = await bundleSize(
  `export { DateTime, Duration, Timezone } from './dist/esm/index.js';`,
  'core'
);

const full = await bundleSize(
  `export * from './dist/esm/index.js';
   export { getTimezoneData } from './dist/esm/tzdata/index.js';`,
  'full'
);

const kb = (n) => (n / 1024).toFixed(1);

console.log('📦 Bundle size (minified + gzip):');
console.log(`   core (DateTime, Duration, Timezone): ${kb(core.gzipped)} KB gzipped (${kb(core.raw)} KB raw)`);
console.log(`   full (incl. raw IANA rule tables):   ${kb(full.gzipped)} KB gzipped (${kb(full.raw)} KB raw)`);

if (full.gzipped <= core.gzipped) {
  console.error('❌ Tree-shaking check failed: iana-data was not excluded from the core bundle');
  process.exit(1);
}

if (core.gzipped > LIMIT_BYTES) {
  console.error(`❌ Core bundle ${kb(core.gzipped)} KB exceeds the ${kb(LIMIT_BYTES)} KB limit`);
  process.exit(1);
}

console.log(`✅ Core bundle is under the ${kb(LIMIT_BYTES)} KB limit`);
