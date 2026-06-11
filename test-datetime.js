/**
 * Manual verification for DateTime + Duration implementation
 *
 * Run: node test-datetime.js (after pnpm build)
 */

import { DateTime } from './dist/esm/datetime.js';
import { Duration } from './dist/esm/duration.js';

let failures = 0;

function check(label, actual, expected) {
  const ok = actual === expected;
  if (!ok) failures++;
  console.log(`   ${ok ? '✓' : '✗'} ${label}: ${JSON.stringify(actual)}${ok ? '' : ` (expected ${JSON.stringify(expected)})`}`);
}

function checkThrows(label, fn) {
  try {
    fn();
    failures++;
    console.log(`   ✗ ${label}: did not throw`);
  } catch (e) {
    console.log(`   ✓ ${label}: threw "${e.message}"`);
  }
}

console.log('\n🕐 tuuru-chrono-tz: DateTime Test\n');

// --- fromISO ---
console.log('📥 fromISO (strict):');
const dt = DateTime.fromISO('2024-06-09T10:30:00.123Z');
check('UTC parse toISO', dt.toISO(), '2024-06-09T10:30:00.123Z');
check('year', dt.year, 2024);
check('month (1-12)', dt.month, 6);
check('day', dt.day, 9);
check('hour', dt.hour, 10);
check('minute', dt.minute, 30);
check('millisecond', dt.millisecond, 123);
check('weekday (Sun=7)', dt.weekday, 7);
check('toUnix', dt.toUnix(), 1717929000);

const offsetParse = DateTime.fromISO('2024-06-09T19:30:00+09:00');
check('offset suffix → same instant', offsetParse.toISO(), '2024-06-09T10:30:00.000Z');

const dateOnly = DateTime.fromISO('2024-06-09', { timezone: 'America/New_York' });
check('date-only in NY tz', dateOnly.toISO(), '2024-06-09T00:00:00.000-04:00');

checkThrows('rejects 2024-02-30', () => DateTime.fromISO('2024-02-30'));
checkThrows('rejects 2024-13-01', () => DateTime.fromISO('2024-13-01'));
checkThrows('rejects 24:00 hour', () => DateTime.fromISO('2024-06-09T24:00:00'));
checkThrows('rejects garbage', () => DateTime.fromISO('not a date'));
checkThrows('rejects partial', () => DateTime.fromISO('2024-06'));

// leap year accepted
check('accepts 2024-02-29 (leap)', DateTime.fromISO('2024-02-29').day, 29);
checkThrows('rejects 2023-02-29 (non-leap)', () => DateTime.fromISO('2023-02-29'));

// --- timezone-aware getters ---
console.log('\n🌍 Timezone-aware getters:');
const tokyo = dt.setTimezone('Asia/Tokyo');
check('Tokyo hour (10:30Z + 9h)', tokyo.hour, 19);
check('Tokyo offset', tokyo.offset, 540);
check('Tokyo same instant', tokyo.valueOf(), dt.valueOf());
check('Tokyo toISO', tokyo.toISO(), '2024-06-09T19:30:00.123+09:00');

const ny = dt.setTimezone('America/New_York');
check('NY hour (DST, UTC-4)', ny.hour, 6);
check('NY offset (DST)', ny.offset, -240);

const nyWinter = DateTime.fromISO('2024-01-15T12:00:00Z').setTimezone('America/New_York');
check('NY offset (winter, UTC-5)', nyWinter.offset, -300);

// --- fromObject ---
console.log('\n📦 fromObject:');
const obj = DateTime.fromObject(
  { year: 2024, month: 6, day: 9, hour: 19, minute: 30 },
  { timezone: 'Asia/Tokyo' }
);
check('Tokyo wall-clock → UTC instant', obj.toUTC().toISO(), '2024-06-09T10:30:00.000Z');
checkThrows('rejects month 13', () => DateTime.fromObject({ year: 2024, month: 13, day: 1 }));

// --- format ---
console.log('\n🎨 format:');
check('YYYY-MM-DD HH:mm:ss', dt.format('YYYY-MM-DD HH:mm:ss'), '2024-06-09 10:30:00');
check('weekday/month names', dt.format('dddd, MMMM D, YYYY'), 'Sunday, June 9, 2024');
check('12-hour + AM/PM', dt.format('h:mm A'), '10:30 AM');
check('escaped literal', dt.format('[Year:] YYYY'), 'Year: 2024');
check('offset token', tokyo.format('Z'), '+09:00');
check('PM check', DateTime.fromISO('2024-06-09T15:00:00Z').format('h A'), '3 PM');

// --- setters ---
console.log('\n🔧 Setters (immutable):');
const set1 = dt.set({ year: 2025, month: 1, day: 15 });
check('set year/month/day', set1.format('YYYY-MM-DD'), '2025-01-15');
check('original unchanged', dt.year, 2024);
check('setTime', dt.setTime(23, 45).format('HH:mm:ss'), '23:45:00');
checkThrows('set rejects Feb 30', () => dt.set({ month: 2, day: 30 }));

// --- arithmetic ---
console.log('\n➕ Arithmetic:');
check('add 1 day', dt.add({ days: 1 }).format('YYYY-MM-DD'), '2024-06-10');
check('add 1 month', dt.add({ months: 1 }).format('YYYY-MM-DD'), '2024-07-09');
check('Jan 31 + 1 month clamps', DateTime.fromISO('2024-01-31').add({ months: 1 }).format('YYYY-MM-DD'), '2024-02-29');
check('add 2 hours', dt.add({ hours: 2 }).hour, 12);
check('subtract 1 week', dt.subtract({ weeks: 1 }).format('YYYY-MM-DD'), '2024-06-02');
check('year rollover', DateTime.fromISO('2024-12-31').add({ days: 1 }).format('YYYY-MM-DD'), '2025-01-01');

// DST: adding 1 day across spring-forward keeps wall-clock time
const beforeDST = DateTime.fromObject(
  { year: 2024, month: 3, day: 9, hour: 12 },
  { timezone: 'America/New_York' }
);
const afterDST = beforeDST.add({ days: 1 });
check('DST: +1 day keeps local noon', afterDST.hour, 12);
check('DST: only 23 real hours passed', (afterDST.valueOf() - beforeDST.valueOf()) / 3600000, 23);

// --- diff ---
console.log('\n📏 diff:');
const a = DateTime.fromISO('2024-06-09T10:00:00Z');
const b = DateTime.fromISO('2024-06-09T12:30:00Z');
check('diff humanize', b.diff(a).humanize(), '2 hours, 30 minutes');
check('diff negative', a.diff(b).isNegative(), true);

// --- comparison ---
console.log('\n⚖️  Comparison:');
check('isSame instant', a.isSame(DateTime.fromUnix(a.toUnix())), true);
check('isSame day', a.isSame(b, 'day'), true);
check('not same hour', a.isSame(b, 'hour'), false);
const tokyoMidnightUTC = DateTime.fromISO('2024-06-09T16:00:00Z').setTimezone('Asia/Tokyo'); // June 10, 01:00 Tokyo
check('isSame day tz-aware', tokyoMidnightUTC.isSame(DateTime.fromISO('2024-06-09T20:00:00Z'), 'day'), true);

// --- startOf / endOf ---
console.log('\n🎯 startOf / endOf:');
check('startOf day', dt.startOf('day').format('HH:mm:ss.SSS'), '00:00:00.000');
check('startOf month', dt.startOf('month').format('YYYY-MM-DD'), '2024-06-01');
check('startOf week (Monday)', dt.startOf('week').format('YYYY-MM-DD dddd'), '2024-06-03 Monday');
check('startOf year', dt.startOf('year').format('YYYY-MM-DD'), '2024-01-01');
check('endOf day', dt.endOf('day').format('HH:mm:ss.SSS'), '23:59:59.999');
check('endOf month (June=30)', dt.endOf('month').format('YYYY-MM-DD'), '2024-06-30');
check('endOf Feb leap', DateTime.fromISO('2024-02-10').endOf('month').day, 29);

// --- relative time ---
console.log('\n⏳ Relative time:');
const fiveMinAgo = DateTime.fromMilliseconds(Date.now() - 5 * 60 * 1000);
check('fromNow past', fiveMinAgo.fromNow(), '5 minutes ago');
check('fromNow short', fiveMinAgo.fromNow({ short: true }), '5m ago');
const inTwoHours = DateTime.fromMilliseconds(Date.now() + 2 * 60 * 60 * 1000);
check('fromNow future', inTwoHours.fromNow(), 'in 2 hours');
check('a.to(b)', a.to(b), 'in 3 hours'); // 2.5h rounds to 3
check('a.to(b) floor', a.to(b, { rounding: 'floor' }), 'in 2 hours');
check('toRelative today', DateTime.now().toRelative(), 'today');
check('toRelative yesterday', DateTime.now().subtract({ days: 1 }).toRelative(), 'yesterday');
check('toRelative tomorrow', DateTime.now().add({ days: 1 }).toRelative(), 'tomorrow');

// --- Duration.format ---
console.log('\n⏱️  Duration.format:');
const dur = Duration.fromObject({ hours: 2, minutes: 30 });
check('HH:mm:ss', dur.format('HH:mm:ss'), '02:30:00');
check('h[h] m[m]', dur.format('h[h] m[m]'), '2h 30m');
const longDur = Duration.fromObject({ hours: 26 });
check('26h as HH:mm (no truncation!)', longDur.format('HH:mm'), '26:00');
check('26h as d[d] HH:mm', longDur.format('d[d] HH:mm'), '1d 02:00');
check('mm:ss total minutes', Duration.fromObject({ hours: 1, minutes: 5, seconds: 7 }).format('mm:ss'), '65:07');
check('negative duration', Duration.fromObject({ minutes: -90 }).format('H:mm'), '-1:30');

// --- misc ---
console.log('\n🔍 Misc:');
check('toLocal valid tz', typeof DateTime.now().toLocal().timezone, 'string');
check('toJSON', JSON.stringify(dt), '"2024-06-09T10:30:00.123Z"');
checkThrows('invalid timezone rejected', () => DateTime.now('Invalid/Zone'));

console.log(failures === 0 ? '\n✅ All tests passed!\n' : `\n❌ ${failures} test(s) failed\n`);
process.exit(failures === 0 ? 0 : 1);
