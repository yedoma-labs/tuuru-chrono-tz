#!/usr/bin/env node

/**
 * Parse IANA Timezone Database
 * 
 * Parses the downloaded IANA tzdata files and generates:
 * 1. TypeScript timezone data
 * 2. Timezone metadata (offsets, DST rules, etc.)
 * 3. Compact binary format for production
 * 
 * Usage: node scripts/parse-iana.js
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const DATA_DIR = join(process.cwd(), 'data');
const IANA_DIR = join(DATA_DIR, 'iana');
const OUTPUT_DIR = join(process.cwd(), 'src', 'tzdata');

// Files containing zone data
const ZONE_FILES = [
  'africa',
  'antarctica',
  'asia',
  'australasia',
  'europe',
  'northamerica',
  'southamerica'
];

/**
 * Parse IANA timezone data files
 */
function parseIANA() {
  console.log('🔍 Parsing IANA Timezone Database...\n');
  
  // Check if IANA data exists
  if (!existsSync(IANA_DIR)) {
    console.error('❌ IANA data not found. Run: pnpm download-iana');
    process.exit(1);
  }
  
  // Create output directory
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  // Read version
  const versionPath = join(IANA_DIR, 'VERSION');
  const version = existsSync(versionPath) 
    ? readFileSync(versionPath, 'utf-8').trim()
    : 'unknown';
  
  console.log(`📦 Parsing tzdata version: ${version}\n`);
  
  // Parse all zone files
  const zones = new Map();
  const rules = new Map();
  const links = new Map();
  
  for (const file of ZONE_FILES) {
    const filePath = join(IANA_DIR, file);
    
    if (!existsSync(filePath)) {
      console.warn(`⚠️  File not found: ${file}`);
      continue;
    }
    
    console.log(`📄 Parsing: ${file}`);
    
    const content = readFileSync(filePath, 'utf-8');
    const parsed = parseZoneFile(content, file);
    
    // Merge zones
    parsed.zones.forEach((zone, name) => {
      zones.set(name, zone);
    });
    
    // Merge rules
    parsed.rules.forEach((rule, name) => {
      if (!rules.has(name)) {
        rules.set(name, []);
      }
      rules.get(name).push(...rule);
    });
    
    // Merge links
    parsed.links.forEach((target, alias) => {
      links.set(alias, target);
    });
  }
  
  // Parse backward compatibility file
  const backwardPath = join(IANA_DIR, 'backward');
  if (existsSync(backwardPath)) {
    console.log('📄 Parsing: backward');
    const content = readFileSync(backwardPath, 'utf-8');
    const parsed = parseBackwardFile(content);
    
    parsed.links.forEach((target, alias) => {
      links.set(alias, target);
    });
  }
  
  // Parse zone.tab for metadata
  const zoneTabPath = join(IANA_DIR, 'zone1970.tab');
  const metadata = existsSync(zoneTabPath)
    ? parseZoneTab(readFileSync(zoneTabPath, 'utf-8'))
    : new Map();
  
  console.log(`\n📊 Parsing complete:`);
  console.log(`   - Zones: ${zones.size}`);
  console.log(`   - Rules: ${rules.size}`);
  console.log(`   - Links: ${links.size}`);
  console.log(`   - Metadata: ${metadata.size}\n`);
  
  // Generate TypeScript files
  console.log('🔨 Generating TypeScript files...\n');
  
  generateTimezoneList(zones, links, OUTPUT_DIR);
  generateTimezoneData(zones, rules, links, metadata, version, OUTPUT_DIR);
  generateLinks(links, version, OUTPUT_DIR);
  generateIndex(OUTPUT_DIR);
  
  console.log('✅ Generation complete!\n');
  console.log(`📁 Output: ${OUTPUT_DIR}/`);
  console.log('\n🎉 IANA parsing complete!');
}

/**
 * Parse a zone file
 */
function parseZoneFile(content, fileName) {
  const zones = new Map();
  const rules = new Map();
  const links = new Map();
  
  const lines = content.split('\n');
  let currentZone = null;
  let currentZoneName = null;
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // Remove comments
    const commentIndex = line.indexOf('#');
    if (commentIndex !== -1) {
      line = line.substring(0, commentIndex);
    }
    
    line = line.trim();
    
    if (!line) continue;
    
    const parts = line.split(/\s+/);
    const type = parts[0];
    
    if (type === 'Zone') {
      // New zone definition
      const zoneName = parts[1];
      currentZoneName = zoneName;
      
      const zoneEntry = parseZoneLine(parts.slice(2));
      currentZone = [zoneEntry];
      zones.set(zoneName, currentZone);
      
    } else if (type === 'Rule') {
      // Rule definition
      const ruleName = parts[1];
      const rule = parseRuleLine(parts.slice(2));
      
      if (!rules.has(ruleName)) {
        rules.set(ruleName, []);
      }
      rules.get(ruleName).push(rule);
      
    } else if (type === 'Link') {
      // Link (alias)
      const target = parts[1];
      const alias = parts[2];
      links.set(alias, target);
      
    } else if (currentZone && /^\d/.test(type)) {
      // Continuation of previous zone
      const zoneEntry = parseZoneLine(parts);
      currentZone.push(zoneEntry);
    }
  }
  
  return { zones, rules, links };
}

/**
 * Parse a Zone line
 */
function parseZoneLine(parts) {
  // Format: STDOFF RULES FORMAT [UNTIL]
  return {
    offset: parts[0],
    rules: parts[1] || '-',
    format: parts[2] || '',
    until: parts.slice(3).join(' ') || null
  };
}

/**
 * Parse a Rule line
 */
function parseRuleLine(parts) {
  // Format: FROM TO - IN ON AT SAVE LETTER
  return {
    from: parts[0],
    to: parts[1],
    type: parts[2],
    in: parts[3],
    on: parts[4],
    at: parts[5],
    save: parts[6],
    letter: parts[7] || ''
  };
}

/**
 * Parse backward compatibility file
 */
function parseBackwardFile(content) {
  const links = new Map();
  
  const lines = content.split('\n');
  
  for (const line of lines) {
    const trimmed = line.split('#')[0].trim();
    if (!trimmed) continue;
    
    const parts = trimmed.split(/\s+/);
    if (parts[0] === 'Link') {
      const target = parts[1];
      const alias = parts[2];
      links.set(alias, target);
    }
  }
  
  return { links };
}

/**
 * Parse zone.tab for metadata
 */
function parseZoneTab(content) {
  const metadata = new Map();
  
  const lines = content.split('\n');
  
  for (const line of lines) {
    if (line.startsWith('#') || !line.trim()) continue;
    
    const parts = line.split(/\s+/);
    if (parts.length < 3) continue;
    
    const countries = parts[0].split(',');
    const coordinates = parts[1];
    const timezone = parts[2];
    const comments = parts.slice(3).join(' ');
    
    metadata.set(timezone, {
      countries,
      coordinates,
      comments
    });
  }
  
  return metadata;
}

/**
 * Generate timezone list (all timezone names)
 */
function generateTimezoneList(zones, links, outputDir) {
  const allTimezones = new Set([
    ...zones.keys(),
    ...links.keys()
  ]);
  
  const sortedTimezones = Array.from(allTimezones).sort();
  
  const content = `/**
 * IANA Timezone Names
 * 
 * Complete list of all ${sortedTimezones.length} IANA timezone identifiers.
 * 
 * Generated from IANA tzdata.
 * DO NOT EDIT - This file is auto-generated.
 */

export const TIMEZONE_NAMES = [
${sortedTimezones.map(tz => `  '${tz}'`).join(',\n')}
] as const;

export type TimezoneName = typeof TIMEZONE_NAMES[number];

/**
 * Total number of timezones
 */
export const TIMEZONE_COUNT = ${sortedTimezones.length};
`;
  
  writeFileSync(join(outputDir, 'timezones.ts'), content);
  console.log(`   ✓ timezones.ts (${sortedTimezones.length} timezones)`);
}

/**
 * Generate timezone data
 */
function generateTimezoneData(zones, rules, links, metadata, version, outputDir) {
  // Generate compact timezone data
  const timezoneData = {
    version,
    zones: Object.fromEntries(zones),
    rules: Object.fromEntries(rules),
    links: Object.fromEntries(links),
    metadata: Object.fromEntries(metadata)
  };
  
  // Write as JSON (we'll compile to binary later)
  const jsonContent = JSON.stringify(timezoneData, null, 2);
  writeFileSync(join(outputDir, 'data.json'), jsonContent);
  console.log(`   ✓ data.json (${(jsonContent.length / 1024).toFixed(1)} KB)`);
  
  // Generate TypeScript interface
  const tsContent = `/**
 * IANA Timezone Data
 * 
 * Version: ${version}
 * Zones: ${zones.size}
 * Rules: ${rules.size}
 * Links: ${links.size}
 * 
 * Generated from IANA tzdata.
 * DO NOT EDIT - This file is auto-generated.
 */

import { IANA_DATA } from './iana-data.js';

export interface TimezoneData {
  version: string;
  zones: Record<string, ZoneEntry[]>;
  rules: Record<string, RuleEntry[]>;
  links: Record<string, string>;
  metadata: Record<string, TimezoneMetadata>;
}

export interface ZoneEntry {
  offset: string;
  rules: string;
  format: string;
  until: string | null;
}

export interface RuleEntry {
  from: string;
  to: string;
  type: string;
  in: string;
  on: string;
  at: string;
  save: string;
  letter: string;
}

export interface TimezoneMetadata {
  countries: string[];
  coordinates: string;
  comments: string;
}

/**
 * IANA timezone data
 *
 * Note: references the full generated data module (~330KB source).
 * The core DateTime and Timezone APIs do not depend on it; bundlers
 * tree-shake it away when getTimezoneData is unused.
 */
export function getTimezoneData(): TimezoneData {
  return IANA_DATA;
}

export const TZDATA_VERSION = '${version}';
`;

  writeFileSync(join(outputDir, 'data.ts'), tsContent);
  console.log(`   ✓ data.ts`);

  // Full data as a TypeScript module (works in ESM, CJS, and bundlers)
  const fullDataContent = `/**
 * IANA Timezone Raw Data
 *
 * Version: ${version}
 *
 * Full zone/rule/link/metadata tables from IANA tzdata.
 * Large module - import only via getTimezoneData() if you need raw rules.
 *
 * Generated from IANA tzdata.
 * DO NOT EDIT - This file is auto-generated.
 */

import type { TimezoneData } from './data.js';

export const IANA_DATA: TimezoneData = ${JSON.stringify(timezoneData)};
`;
  writeFileSync(join(outputDir, 'iana-data.ts'), fullDataContent);
  console.log(`   ✓ iana-data.ts (${(fullDataContent.length / 1024).toFixed(1)} KB)`);
}

/**
 * Generate timezone links (aliases) module
 */
function generateLinks(links, version, outputDir) {
  const sorted = Array.from(links.keys()).sort();

  const content = `/**
 * IANA Timezone Links (aliases)
 *
 * Maps alias names to canonical timezone names.
 * E.g. 'US/Eastern' -> 'America/New_York'
 *
 * Version: ${version}
 * Links: ${sorted.length}
 *
 * Generated from IANA tzdata.
 * DO NOT EDIT - This file is auto-generated.
 */

export const TIMEZONE_LINKS: Readonly<Record<string, string>> = Object.freeze({
${sorted.map(alias => `  '${alias}': '${links.get(alias)}'`).join(',\n')}
});
`;

  writeFileSync(join(outputDir, 'links.ts'), content);
  console.log(`   ✓ links.ts (${sorted.length} links)`);
}

/**
 * Generate index file
 */
function generateIndex(outputDir) {
  const content = `/**
 * IANA Timezone Database
 * 
 * This module contains the IANA timezone data used by tuuru-chrono-tz.
 * 
 * @packageDocumentation
 */

export { TIMEZONE_NAMES, TIMEZONE_COUNT } from './timezones.js';
export type { TimezoneName } from './timezones.js';

export { TIMEZONE_LINKS } from './links.js';

export {
  getTimezoneData,
  TZDATA_VERSION 
} from './data.js';

export type {
  TimezoneData,
  ZoneEntry,
  RuleEntry,
  TimezoneMetadata
} from './data.js';
`;
  
  writeFileSync(join(outputDir, 'index.ts'), content);
  console.log(`   ✓ index.ts`);
}

// Run
parseIANA();
