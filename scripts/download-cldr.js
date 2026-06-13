/**
 * Setup CLDR data from npm package
 *
 * Uses the cldr-data package instead of downloading large ZIP files.
 * Install with: pnpm add --save-dev cldr-data
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '..', 'data');

function setupCLDRFromNodeModules() {
  const cldrDataPath = path.join(__dirname, '..', 'node_modules', 'cldr-data');
  const cldrMainPath = path.join(cldrDataPath, 'main');
  const targetMainPath = path.join(dataDir, 'cldr-main');

  if (!fs.existsSync(cldrDataPath)) {
    console.error('Error: cldr-data npm package not found');
    console.error('Install with: pnpm add --save-dev cldr-data');
    process.exit(1);
  }

  if (!fs.existsSync(cldrMainPath)) {
    console.error(`Error: ${cldrMainPath} not found in cldr-data package`);
    process.exit(1);
  }

  console.log(`Found cldr-data at ${cldrDataPath}`);

  // Create symlink or copy
  if (fs.existsSync(targetMainPath)) {
    fs.rmSync(targetMainPath, { recursive: true, force: true });
  }

  // Use symlink to avoid duplicating large files
  fs.symlinkSync(cldrMainPath, targetMainPath, 'dir');

  // Count available locales
  const locales = fs.readdirSync(cldrMainPath)
    .filter(f => !f.startsWith('.') && fs.statSync(path.join(cldrMainPath, f)).isDirectory())
    .sort();

  console.log(`✓ Linked ${locales.length} CLDR locales`);
  console.log(`Available at ${targetMainPath}`);
}

setupCLDRFromNodeModules();
