/**
 * Internal shared helpers
 *
 * Timezone math shared by DateTime and Timezone. Not part of the public API.
 *
 * @internal
 */

import type { RelativeTimeOptions } from './types.js';

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
] as const;

export const WEEKDAY_NAMES = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
] as const;

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

/** Get wall-clock parts for a timestamp in a timezone */
export function getWallClock(timestamp: number, tz: string): WallClock {
  const parts = getFormatter(tz).formatToParts(new Date(timestamp));
  const values: Record<string, number> = Object.create(null);

  for (const part of parts) {
    if (part.type !== 'literal') {
      values[part.type] = parseInt(part.value, 10);
    }
  }

  return {
    year: values['year'] ?? 0,
    month: values['month'] ?? 1,
    day: values['day'] ?? 1,
    hour: values['hour'] ?? 0,
    minute: values['minute'] ?? 0,
    second: values['second'] ?? 0,
    millisecond: ((timestamp % 1000) + 1000) % 1000
  };
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

  return offset2 === offset1 ? guess : asUTC - offset2 * 60000;
}

export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
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
export function humanizeDelta(deltaMs: number, options?: RelativeTimeOptions): string {
  const future = deltaMs >= 0;
  const abs = Math.abs(deltaMs);
  const short = options?.short ?? false;
  const rounding = options?.rounding ?? 'round';

  const roundFn = rounding === 'floor' ? Math.floor
    : rounding === 'ceil' ? Math.ceil
    : Math.round;

  const units: Array<[threshold: number, divisor: number, long: string, abbr: string]> = [
    [60 * 1000, 1000, 'second', 's'],
    [60 * 60 * 1000, 60 * 1000, 'minute', 'm'],
    [24 * 60 * 60 * 1000, 60 * 60 * 1000, 'hour', 'h'],
    [30 * 24 * 60 * 60 * 1000, 24 * 60 * 60 * 1000, 'day', 'd'],
    [365 * 24 * 60 * 60 * 1000, 30 * 24 * 60 * 60 * 1000, 'month', 'mo'],
    [Infinity, 365 * 24 * 60 * 60 * 1000, 'year', 'y']
  ];

  for (const [threshold, divisor, long, abbr] of units) {
    if (abs < threshold) {
      const value = Math.max(roundFn(abs / divisor), abs < divisor ? 0 : 1);

      if (long === 'second' && value < 5) {
        return future
          ? (short ? 'now' : 'in a few seconds')
          : (short ? 'now' : 'a few seconds ago');
      }

      const label = short ? `${value}${abbr}` : `${value} ${long}${value === 1 ? '' : 's'}`;
      return future ? `in ${label}` : `${label} ago`;
    }
  }

  // Unreachable (last threshold is Infinity)
  return '';
}
