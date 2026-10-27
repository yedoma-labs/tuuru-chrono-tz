/**
 * Internal shared helpers
 *
 * Timezone math shared by DateTime and Timezone. Not part of the public API.
 *
 * @internal
 */

import type { Locale, RelativeUnit } from './locale.js';
import { pickForm } from './locale.js';
import type { RelativeTimeOptions } from './types.js';

export interface WallClock {
  year: number;
  month: number; // 1-12
  day: number; // 1-31
  hour: number; // 0-23
  minute: number;
  second: number;
  millisecond: number;
}

/** Cached Intl formatters per timezone (creating them is expensive) */
const formatterCache = new Map<string, Intl.DateTimeFormat>();

export function getFormatter(tz: string): Intl.DateTimeFormat {
  let formatter = formatterCache.get(tz);
  if (!formatter) {
    try {
      formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hourCycle: 'h23',
      });
    } catch {
      throw new Error(`Invalid timezone: ${tz}`);
    }
    formatterCache.set(tz, formatter);
  }
  return formatter;
}

/** Resolve 'local' to the system timezone, validate everything else */
export function normalizeZone(tz: string): string {
  if (tz === 'local') {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return 'UTC';
    }
  }
  getFormatter(tz); // throws on invalid timezone
  return tz;
}

/**
 * Memoize wall-clock results, keyed by zone + whole-second timestamp.
 *
 * `Intl.DateTimeFormat.formatToParts` is the cost centre: a single
 * `format()` reads the wall clock and the offset (which derives from the wall
 * clock) for the same instant, and each getter re-derives it. Memoizing makes
 * those redundant calls free. Correctness is unaffected — this caches a pure
 * function of (zone, second). Bounded with simple FIFO eviction.
 */
const WALLCLOCK_CACHE_LIMIT = 4096;
const wallClockCache = new Map<string, WallClock>();

/** Get wall-clock parts for a timestamp in a timezone */
export function getWallClock(timestamp: number, tz: string): WallClock {
  const millisecond = ((timestamp % 1000) + 1000) % 1000;
  const seconds = (timestamp - millisecond) / 1000;
  const key = `${tz}|${seconds}`;

  const cached = wallClockCache.get(key);
  if (cached !== undefined) {
    // Share the cached second-resolution parts; only ms differs within a second
    return millisecond === cached.millisecond ? cached : { ...cached, millisecond };
  }

  const parts = getFormatter(tz).formatToParts(new Date(timestamp));
  const values: Record<string, number> = Object.create(null);
  for (const part of parts) {
    if (part.type !== 'literal') {
      values[part.type] = parseInt(part.value, 10);
    }
  }

  const wc: WallClock = {
    // biome-ignore lint/complexity/useLiteralKeys: bracket access is required for index signatures (noPropertyAccessFromIndexSignature)
    year: values['year'] ?? 0,
    // biome-ignore lint/complexity/useLiteralKeys: bracket access is required for index signatures (noPropertyAccessFromIndexSignature)
    month: values['month'] ?? 1,
    // biome-ignore lint/complexity/useLiteralKeys: bracket access is required for index signatures (noPropertyAccessFromIndexSignature)
    day: values['day'] ?? 1,
    // biome-ignore lint/complexity/useLiteralKeys: bracket access is required for index signatures (noPropertyAccessFromIndexSignature)
    hour: values['hour'] ?? 0,
    // biome-ignore lint/complexity/useLiteralKeys: bracket access is required for index signatures (noPropertyAccessFromIndexSignature)
    minute: values['minute'] ?? 0,
    // biome-ignore lint/complexity/useLiteralKeys: bracket access is required for index signatures (noPropertyAccessFromIndexSignature)
    second: values['second'] ?? 0,
    millisecond,
  };

  if (wallClockCache.size >= WALLCLOCK_CACHE_LIMIT) {
    // FIFO: drop the oldest entry
    const oldest = wallClockCache.keys().next().value;
    if (oldest !== undefined) wallClockCache.delete(oldest);
  }
  wallClockCache.set(key, wc);

  return wc;
}

/**
 * UTC offset in minutes (east-positive: Tokyo = +540, New York = -300/-240)
 */
export function getOffsetMinutes(timestamp: number, tz: string): number {
  if (tz === 'UTC') return 0;

  const wc = getWallClock(timestamp, tz);
  const asUTC = Date.UTC(wc.year, wc.month - 1, wc.day, wc.hour, wc.minute, wc.second);
  const msPart = ((timestamp % 1000) + 1000) % 1000;

  return Math.round((asUTC - (timestamp - msPart)) / 60000);
}

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Convert wall-clock time in a timezone to a UTC timestamp.
 *
 * The offsets in force one day before and one day after the wall clock
 * (read as if it were UTC) bound the real offset, since no zone changes its
 * offset twice within two days. Each offset yields a candidate instant, and
 * a candidate is kept only if its own offset reproduces the wall clock.
 *
 * - One valid candidate: returned.
 * - Two valid candidates (fall-back overlap): the earlier instant wins.
 * - None (spring-forward gap): shifted forward by the gap size, using the
 *   offset in force before the transition (02:30 CET gap in Berlin -> 03:30 CEST).
 *
 * The direction of the jump does not matter: forward jumps (London, Berlin,
 * Lord Howe's 30-minute shift) resolve like backward ones (New York).
 */
export function wallClockToTimestamp(wc: WallClock, tz: string): number {
  const asUTC = Date.UTC(
    wc.year,
    wc.month - 1,
    wc.day,
    wc.hour,
    wc.minute,
    wc.second,
    wc.millisecond,
  );

  if (tz === 'UTC') return asUTC;

  const offsetBefore = getOffsetMinutes(asUTC - DAY_MS, tz);
  const offsetAfter = getOffsetMinutes(asUTC + DAY_MS, tz);

  if (offsetBefore === offsetAfter) {
    // Common case: no transition near this wall clock
    return asUTC - offsetBefore * 60000;
  }

  // A candidate is valid only if its own offset reproduces the wall clock.
  const valid: number[] = [];
  for (const offset of [offsetBefore, offsetAfter]) {
    const candidate = asUTC - offset * 60000;
    if (getOffsetMinutes(candidate, tz) === offset) valid.push(candidate);
  }

  if (valid.length > 0) {
    // Overlap (two valid candidates): earliest instant. Otherwise the one valid candidate.
    return Math.min(...valid);
  }

  // Gap (e.g. 02:30 during spring-forward): shift forward by the gap size,
  // i.e. interpret the wall clock with the offset in force before the transition.
  return asUTC - offsetBefore * 60000;
}

export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/** ISO weekday (1 = Monday, 7 = Sunday) from a wall clock's date parts */
export function weekdayOf(wc: WallClock): number {
  const utcDay = new Date(Date.UTC(wc.year, wc.month - 1, wc.day)).getUTCDay();
  return ((utcDay + 6) % 7) + 1;
}

export function pad(n: number, width: number): string {
  return String(Math.abs(n)).padStart(width, '0');
}

export function formatOffset(minutes: number, separator: string): string {
  const sign = minutes < 0 ? '-' : '+';
  const abs = Math.abs(minutes);
  return `${sign}${pad(Math.floor(abs / 60), 2)}${separator}${pad(abs % 60, 2)}`;
}

/** Escape a string for literal use inside a RegExp */
export function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Humanize a signed delta. Positive = future ("in X"), negative = past ("X ago").
 */
export function humanizeDelta(
  deltaMs: number,
  options: RelativeTimeOptions | undefined,
  locale: Locale,
): string {
  const future = deltaMs >= 0;
  const abs = Math.abs(deltaMs);
  const short = options?.short ?? false;
  const rounding = options?.rounding ?? 'round';
  const rt = locale.relativeTime;

  const roundFn = rounding === 'floor' ? Math.floor : rounding === 'ceil' ? Math.ceil : Math.round;

  const units: Array<[threshold: number, divisor: number, unit: RelativeUnit]> = [
    [60 * 1000, 1000, 'second'],
    [60 * 60 * 1000, 60 * 1000, 'minute'],
    [24 * 60 * 60 * 1000, 60 * 60 * 1000, 'hour'],
    [30 * 24 * 60 * 60 * 1000, 24 * 60 * 60 * 1000, 'day'],
    [365 * 24 * 60 * 60 * 1000, 30 * 24 * 60 * 60 * 1000, 'month'],
    [Infinity, 365 * 24 * 60 * 60 * 1000, 'year'],
  ];

  const template = future ? rt.future : rt.past;

  for (const [threshold, divisor, unit] of units) {
    if (abs < threshold) {
      const value = Math.max(roundFn(abs / divisor), abs < divisor ? 0 : 1);

      if (unit === 'second' && value < 5) {
        return short ? rt.now : template.replace('{0}', rt.fewSeconds);
      }

      const sep = locale.numberSeparator ?? ' ';
      const label = short
        ? `${value}${rt.shortUnits[unit]}`
        : locale.formatCount
          ? locale.formatCount(value, rt.units[unit], unit, future)
          : `${value}${sep}${pickForm(rt.units[unit], value, locale)}`;
      return template.replace('{0}', label);
    }
  }

  // Unreachable (last threshold is Infinity)
  return '';
}
