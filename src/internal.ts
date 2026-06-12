/**
 * Internal shared helpers
 *
 * Timezone math shared by DateTime and Timezone. Not part of the public API.
 *
 * @internal
 */

import type { RelativeTimeOptions } from './types.js';
import type { Locale, RelativeUnit } from './locale.js';
import { pickForm } from './locale.js';

export interface WallClock {
  year: number;
  month: number;       // 1-12
  day: number;         // 1-31
  hour: number;        // 0-23
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
        hourCycle: 'h23'
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
    year: values['year'] ?? 0,
    month: values['month'] ?? 1,
    day: values['day'] ?? 1,
    hour: values['hour'] ?? 0,
    minute: values['minute'] ?? 0,
    second: values['second'] ?? 0,
    millisecond
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

/**
 * Convert wall-clock time in a timezone to a UTC timestamp.
 *
 * Uses the standard two-pass offset guess. During DST gaps the time is
 * shifted forward; during overlaps the first (earlier) occurrence wins.
 */
export function wallClockToTimestamp(wc: WallClock, tz: string): number {
  const asUTC = Date.UTC(
    wc.year, wc.month - 1, wc.day,
    wc.hour, wc.minute, wc.second, wc.millisecond
  );

  if (tz === 'UTC') return asUTC;

  const offset1 = getOffsetMinutes(asUTC, tz);
  const guess = asUTC - offset1 * 60000;
  const offset2 = getOffsetMinutes(guess, tz);

  if (offset2 === offset1) return guess;

  // Offsets disagree: either an overlap (both candidates valid; the
  // earlier one was already produced by guess) or a gap. A candidate is
  // valid only if its offset reproduces the requested wall clock.
  const candidate = asUTC - offset2 * 60000;
  if (getOffsetMinutes(candidate, tz) === offset2) {
    return candidate;
  }

  // Gap (e.g. 02:30 during spring-forward): shift forward by the gap size
  return guess;
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
  locale: Locale
): string {
  const future = deltaMs >= 0;
  const abs = Math.abs(deltaMs);
  const short = options?.short ?? false;
  const rounding = options?.rounding ?? 'round';
  const rt = locale.relativeTime;

  const roundFn = rounding === 'floor' ? Math.floor
    : rounding === 'ceil' ? Math.ceil
    : Math.round;

  const units: Array<[threshold: number, divisor: number, unit: RelativeUnit]> = [
    [60 * 1000, 1000, 'second'],
    [60 * 60 * 1000, 60 * 1000, 'minute'],
    [24 * 60 * 60 * 1000, 60 * 60 * 1000, 'hour'],
    [30 * 24 * 60 * 60 * 1000, 24 * 60 * 60 * 1000, 'day'],
    [365 * 24 * 60 * 60 * 1000, 30 * 24 * 60 * 60 * 1000, 'month'],
    [Infinity, 365 * 24 * 60 * 60 * 1000, 'year']
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
          ? locale.formatCount(value, rt.units[unit], unit)
          : `${value}${sep}${pickForm(rt.units[unit], value, locale)}`;
      return template.replace('{0}', label);
    }
  }

  // Unreachable (last threshold is Infinity)
  return '';
}
