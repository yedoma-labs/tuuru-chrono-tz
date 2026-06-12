#!/usr/bin/env node

/**
 * CDN build
 *
 * Bundles the public API into a single minified IIFE that exposes a global
 * `tuuru` object, for use via <script> without a bundler. The raw IANA rule
 * tables are not pulled in (getTimezoneData lives behind its own subpath), so
 * the CDN bundle stays small.
 *
 * Output: dist/tuuru.min.js
 *
 * Usage: node scripts/build-cdn.js   (requires pnpm build first)
 */

import { build } from 'esbuild';
import { existsSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { readFileSync } from 'node:fs';

if (!existsSync('dist/esm/index.js')) {
  console.error('❌ dist/esm not found. Run: pnpm build');
  process.exit(1);
}

await build({
  entryPoints: ['dist/esm/index.js'],
  bundle: true,
  minify: true,
  format: 'iife',
  globalName: 'tuuru',
  target: ['es2022'],
  outfile: 'dist/tuuru.min.js',
  // No sourcemap: the file ships standalone and the map would be stripped by
  // the package's files globs anyway, leaving a dangling sourceMappingURL.
  sourcemap: false,
  legalComments: 'none',
});

const size = readFileSync('dist/tuuru.min.js').length;
const gz = gzipSync(readFileSync('dist/tuuru.min.js'), { level: 9 }).length;
console.log(`✅ dist/tuuru.min.js — ${(size / 1024).toFixed(1)} KB (${(gz / 1024).toFixed(1)} KB gzipped)`);
console.log('   usage: <script src="tuuru.min.js"></script> then window.tuuru.DateTime');
