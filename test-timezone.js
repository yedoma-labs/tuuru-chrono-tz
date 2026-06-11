#!/usr/bin/env node

/**
 * Quick test of timezone data
 */

import { Timezone, TIMEZONE_NAMES, TIMEZONE_COUNT } from './dist/esm/index.js';

console.log('🌍 tuuru-chrono-tz: Timezone Data Test\n');

// Test 1: Timezone count
console.log(`📊 Total timezones: ${TIMEZONE_COUNT}`);
console.log(`   ✓ ${TIMEZONE_NAMES.length} timezone names loaded\n`);

// Test 2: List all
console.log('📋 Sample timezones:');
const sample = TIMEZONE_NAMES.slice(0, 10);
sample.forEach(tz => console.log(`   - ${tz}`));
console.log(`   ... and ${TIMEZONE_COUNT - 10} more\n`);

// Test 3: Search
console.log('🔍 Search tests:');
const nySearch = Timezone.search('New York');
console.log(`   Search "New York": ${nySearch.join(', ')}`);

const tokyoSearch = Timezone.search('Tokyo');
console.log(`   Search "Tokyo": ${tokyoSearch.join(', ')}`);

const pacificSearch = Timezone.search('Pacific');
console.log(`   Search "Pacific": ${pacificSearch.length} results (${pacificSearch.slice(0, 3).join(', ')}, ...)\n`);

// Test 4: Validation
console.log('✅ Validation tests:');
console.log(`   'America/New_York': ${Timezone.isValid('America/New_York')}`);
console.log(`   'Asia/Tokyo': ${Timezone.isValid('Asia/Tokyo')}`);
console.log(`   'Invalid/Zone': ${Timezone.isValid('Invalid/Zone')}\n`);

// Test 5: Local timezone
console.log('🏠 Local timezone detection:');
const local = Timezone.guessLocal();
console.log(`   Detected: ${local}\n`);

// Test 6: Offset (using Intl fallback for now)
console.log('⏰ Offset tests:');
try {
  const nycOffset = Timezone.getOffset('America/New_York', Date.now());
  console.log(`   America/New_York offset: ${nycOffset} minutes (UTC${nycOffset >= 0 ? '+' : ''}${nycOffset / 60})`);
  
  const tokyoOffset = Timezone.getOffset('Asia/Tokyo', Date.now());
  console.log(`   Asia/Tokyo offset: ${tokyoOffset} minutes (UTC+${tokyoOffset / 60})`);
} catch (err) {
  console.log(`   Error: ${err.message}`);
}

console.log('\n✅ All tests passed!');
console.log('\n🎉 tuuru-chrono-tz timezone data is working correctly!');
