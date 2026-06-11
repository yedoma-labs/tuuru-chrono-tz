#!/usr/bin/env node

/**
 * Download IANA Timezone Database
 * 
 * Downloads the latest tzdata from https://data.iana.org/time-zones/releases/
 * 
 * Usage: node scripts/download-iana.js [version]
 * 
 * If no version specified, downloads the latest version.
 */

import { createWriteStream, mkdirSync, existsSync, readFileSync, readdirSync } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { execFileSync } from 'node:child_process';
import https from 'node:https';
import { join } from 'node:path';

const IANA_BASE_URL = 'https://data.iana.org/time-zones/releases/';
const IANA_VERSION_URL = 'https://data.iana.org/time-zones/tzdata-latest.tar.gz';
const DATA_DIR = join(process.cwd(), 'data');
const IANA_DIR = join(DATA_DIR, 'iana');

// IANA tzdata files we need to extract
const REQUIRED_FILES = [
  'africa',
  'antarctica', 
  'asia',
  'australasia',
  'europe',
  'northamerica',
  'southamerica',
  'backward',
  'zone.tab',
  'zone1970.tab',
  'iso3166.tab',
  'VERSION'
];

/**
 * Fetch data from URL
 */
function fetch(url, redirectsLeft = 3) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'tuuru-chrono-tz/0.1.0'
      }
    }, (res) => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        // Follow redirect (https only, bounded depth)
        if (redirectsLeft <= 0) {
          reject(new Error(`Too many redirects: ${url}`));
          return;
        }
        const target = new URL(res.headers.location, url);
        if (target.protocol !== 'https:') {
          reject(new Error(`Refusing non-https redirect: ${target}`));
          return;
        }
        return fetch(target.href, redirectsLeft - 1).then(resolve).catch(reject);
      }
      
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}: ${url}`));
        return;
      }
      
      resolve(res);
    }).on('error', reject);
  });
}

/**
 * Download and extract IANA timezone database
 */
async function downloadIANASimple(version = 'latest') {
  console.log('📥 Downloading IANA Timezone Database...\n');
  
  // Create data directory
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!existsSync(IANA_DIR)) {
    mkdirSync(IANA_DIR, { recursive: true });
  }
  
  // Determine download URL
  const url = version === 'latest' 
    ? IANA_VERSION_URL
    : `${IANA_BASE_URL}tzdata${version}.tar.gz`;
  
  const tarPath = join(DATA_DIR, 'tzdata.tar.gz');
  
  console.log(`📍 URL: ${url}`);
  console.log(`💾 Saving to: ${tarPath}\n`);
  
  try {
    // Download
    const response = await fetch(url);
    const fileStream = createWriteStream(tarPath);
    
    await pipeline(response, fileStream);
    
    console.log('✅ Downloaded successfully\n');
    
    // Extract using tar command
    console.log('📦 Extracting archive...\n');
    
    // Extract all files (simpler, and we might need others).
    // execFileSync with an argument array: no shell, paths can't inject.
    execFileSync('tar', ['-xzf', tarPath, '-C', IANA_DIR], {
      stdio: 'inherit'
    });
    
    console.log(`\n✅ Extracted to ${IANA_DIR}/`);
    
    // Read version
    const versionPath = join(IANA_DIR, 'version');
    if (existsSync(versionPath)) {
      const versionContent = readFileSync(versionPath, 'utf-8').trim();
      console.log(`📦 IANA tzdata version: ${versionContent}`);
    }
    
    // List extracted files
    console.log('\n📄 Extracted files:');
    const files = readdirSync(IANA_DIR);
    files.forEach(file => {
      console.log(`   - ${file}`);
    });
    
    console.log('\n🎉 Download complete!');
    
  } catch (error) {
    console.error('\n❌ Download failed:', error.message);
    process.exit(1);
  }
}

// Run
const version = process.argv[2] || 'latest';

// Versions look like "2026b" - reject anything else before it reaches a URL
if (version !== 'latest' && !/^\d{4}[a-z]$/.test(version)) {
  console.error(`❌ Invalid version "${version}". Expected e.g. "2026b" or "latest".`);
  process.exit(1);
}

// Use simple version (no dependencies, uses system tar)
downloadIANASimple(version);
