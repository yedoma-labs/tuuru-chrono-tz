// Transpile the ESM build output to CommonJS.
// tsc no longer emits CJS (TypeScript 7 dropped moduleResolution "node10"),
// so the JS is transpiled per file and the declarations are copied over.
import { build } from 'esbuild';
import { cpSync, globSync, rmSync } from 'node:fs';

rmSync('dist/cjs', { recursive: true, force: true });

await build({
  entryPoints: globSync('dist/esm/**/*.js'),
  outdir: 'dist/cjs',
  outbase: 'dist/esm',
  format: 'cjs',
  platform: 'node',
  target: 'es2022',
  bundle: false,
});

cpSync('dist/esm', 'dist/cjs', {
  recursive: true,
  filter: (src) => !src.endsWith('.js') && !src.endsWith('.js.map'),
});
