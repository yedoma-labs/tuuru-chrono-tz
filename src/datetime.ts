/**
 * DateTime class
 *
 * Immutable date/time with timezone support.
 */

import type {
  DateObject,
  TimeObject,
  DurationObject,
  DateTimeOptions,
  ParseOptions,
  RelativeTimeOptions,
  TimeUnit
} from './types.js';
import { Duration } from './duration.js';
import { getDefaultLocale, setDefaultLocale } from './locale.js';
import type { Locale } from './locale.js';
import {
  getWallClock,
  getOffsetMinutes,
  wallClockToTimestamp,
  normalizeZone,
  daysInMonth,
  weekdayOf,
  pad,
  formatOffset,
  escapeRegExp,
  humanizeDelta
} from './internal.js';
import type { WallClock } from './internal.js';

/**
 * Strict ISO 8601 pattern (extended format):
 * - 2024-06-09
 * - 2024-06-09T10:30
 * - 2024-06-09T10:30:00
 * - 2024-06-09T10:30:00.123
 * - with optional suffix: Z, +09:00, -05:30, +0900
 */
const ISO_PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?(Z|[+-]\d{2}:?\d{2})?)?$/;

/**
 * Parse tokens supported by DateTime.fromFormat, ordered longest-first
 * so the tokenizer is greedy.
 */
const PARSE_TOKENS: Record<string, { pattern: string; field: string }> = {
  YYYY: { pattern: '(\\d{4})', field: 'year' },
  MM: { pattern: '(\\d{2})', field: 'month' },
  M: { pattern: '(\\d{1,2})', field: 'month' },
  DD: { pattern: '(\\d{2})', field: 'day' },
  D: { pattern: '(\\d{1,2})', field: 'day' },
  HH: { pattern: '(\\d{2})', field: 'hour' },
  H: { pattern: '(\\d{1,2})', field: 'hour' },
  hh: { pattern: '(\\d{2})', field: 'hour12' },
  h: { pattern: '(\\d{1,2})', field: 'hour12' },
  mm: { pattern: '(\\d{2})', field: 'minute' },
  m: { pattern: '(\\d{1,2})', field: 'minute' },
  ss: { pattern: '(\\d{2})', field: 'second' },
  s: { pattern: '(\\d{1,2})', field: 'second' },
  SSS: { pattern: '(\\d{3})', field: 'millisecond' },
  A: { pattern: '(AM|PM)', field: 'meridiem' },
  a: { pattern: '(am|pm)', field: 'meridiem' }
};

const PARSE_TOKEN_REGEX = /\[([^\]]*)\]|YYYY|MM|M|DD|D|HH|H|hh|h|mm|m|ss|s|SSS|A|a/g;

// ============================================================================
// DATETIME
// ============================================================================

/**
 * Immutable DateTime class with timezone support
 *
 * @example
 * ```typescript
 * const now = DateTime.now();
 * const tokyo = DateTime.now('Asia/Tokyo');
 * const custom = DateTime.fromISO('2024-06-09T10:30:00Z');
 * ```
 */
export class DateTime {
  // Private fields (immutable)
  readonly #timestamp: number;
  readonly #timezone: string;
  readonly #locale: Locale | undefined;

  /**
   * Private constructor - use factory methods
   */
  private constructor(timestamp: number, timezone: string, locale?: Locale) {
    this.#timestamp = timestamp;
    this.#timezone = timezone;
    this.#locale = locale;
  }

  /** Effective locale: per-instance override or the global default */
  get #effectiveLocale(): Locale {
    return this.#locale ?? getDefaultLocale();
  }

  /**
   * Set the global default locale for all DateTime and Duration output
   *
   * @example
   * ```typescript
   * import { DateTime, fr } from '@yedoma-labs/tuuru-chrono-tz';
   * DateTime.setDefaultLocale(fr);
   * DateTime.now().format('MMMM'); // "juin"
   * ```
   */
  static setDefaultLocale(locale: Locale): void {
    setDefaultLocale(locale);
  }

  /**
   * Per-instance locale (immutable; only affects this instance's output)
   *
   * @example
   * ```typescript
   * import { de } from '@yedoma-labs/tuuru-chrono-tz';
   * dt.setLocale(de).format('dddd'); // "Sonntag"
   * ```
   */
  setLocale(locale: Locale): DateTime {
    return new DateTime(this.#timestamp, this.#timezone, locale);
  }

  /** Name of the locale this instance renders with */
  get locale(): string {
    return this.#effectiveLocale.name;
  }

  // =========================================================================
  // FACTORY METHODS
  // =========================================================================

  /**
   * Create DateTime for current time
   *
   * @param timezone - IANA timezone (default: UTC)
   *
   * @example
   * ```typescript
   * DateTime.now(); // UTC
   * DateTime.now('America/New_York');
   * DateTime.now('local');
   * ```
   */
  static now(timezone: string = 'UTC'): DateTime {
    return new DateTime(Date.now(), normalizeZone(timezone));
  }

  /**
   * Create DateTime for current time in UTC
   */
  static nowUTC(): DateTime {
    return new DateTime(Date.now(), 'UTC');
  }

  /**
   * Earliest of the given DateTimes (by instant)
   *
   * @throws {Error} If called with no arguments
   *
   * @example
   * ```typescript
   * DateTime.min(a, b, c);
   * ```
   */
  static min(...dates: DateTime[]): DateTime {
    if (dates.length === 0) {
      throw new Error('DateTime.min requires at least one argument');
    }
    return dates.reduce((earliest, d) => d.#timestamp < earliest.#timestamp ? d : earliest);
  }

  /**
   * Latest of the given DateTimes (by instant)
   *
   * @throws {Error} If called with no arguments
   */
  static max(...dates: DateTime[]): DateTime {
    if (dates.length === 0) {
      throw new Error('DateTime.max requires at least one argument');
    }
    return dates.reduce((latest, d) => d.#timestamp > latest.#timestamp ? d : latest);
  }

  /**
   * Parse ISO 8601 string (strict)
   *
   * Accepts extended-format ISO 8601 only. Rejects impossible dates
   * (e.g. 2024-02-30) and out-of-range time components.
   *
   * Strings without a timezone suffix are interpreted in
   * `options.timezone` (default: UTC).
   *
   * @param iso - ISO 8601 string
   * @param options - Parse options
   * @throws {Error} If the string is not valid ISO 8601
   *
   * @example
   * ```typescript
   * DateTime.fromISO('2024-06-09T10:30:00Z');
   * DateTime.fromISO('2024-06-09T10:30:00+09:00');
   * DateTime.fromISO('2024-06-09', { timezone: 'America/New_York' });
   * ```
   */
  static fromISO(iso: string, options?: ParseOptions): DateTime {
    if (typeof iso !== 'string') {
      throw new Error(`Invalid ISO 8601 input: expected string, got ${typeof iso}`);
    }

    const match = ISO_PATTERN.exec(iso);
    if (!match) {
      throw new Error(`Invalid ISO 8601 format: "${iso}"`);
    }

    const year = parseInt(match[1]!, 10);
    const month = parseInt(match[2]!, 10);
    const day = parseInt(match[3]!, 10);
    const hour = match[4] !== undefined ? parseInt(match[4], 10) : 0;
    const minute = match[5] !== undefined ? parseInt(match[5], 10) : 0;
    const second = match[6] !== undefined ? parseInt(match[6], 10) : 0;
    const millisecond = match[7] !== undefined
      ? parseInt(match[7].padEnd(3, '0'), 10)
      : 0;
    const suffix = match[8];

    if (month < 1 || month > 12) {
      throw new Error(`Invalid ISO 8601 date: month out of range in "${iso}"`);
    }
    if (day < 1 || day > daysInMonth(year, month)) {
      throw new Error(`Invalid ISO 8601 date: day out of range in "${iso}"`);
    }
    if (hour > 23 || minute > 59 || second > 59) {
      throw new Error(`Invalid ISO 8601 time: component out of range in "${iso}"`);
    }

    const wc: WallClock = { year, month, day, hour, minute, second, millisecond };

    if (suffix === 'Z') {
      const ts = Date.UTC(year, month - 1, day, hour, minute, second, millisecond);
      return new DateTime(ts, 'UTC');
    }

    if (suffix) {
      // Fixed offset suffix like +09:00 / -0530
      const sign = suffix[0] === '-' ? -1 : 1;
      const digits = suffix.replace(':', '').slice(1);
      const offsetMinutes = sign * (parseInt(digits.slice(0, 2), 10) * 60 + parseInt(digits.slice(2), 10));

      if (Math.abs(offsetMinutes) > 14 * 60) {
        throw new Error(`Invalid ISO 8601 offset: out of range in "${iso}"`);
      }

      const ts = Date.UTC(year, month - 1, day, hour, minute, second, millisecond)
        - offsetMinutes * 60000;
      const tz = options?.timezone ? normalizeZone(options.timezone) : 'UTC';
      return new DateTime(ts, tz);
    }

    // No suffix: interpret as wall-clock time in the given timezone
    const tz = normalizeZone(options?.timezone ?? 'UTC');
    return new DateTime(wallClockToTimestamp(wc, tz), tz);
  }

  /**
   * Parse custom format (strict)
   *
   * The input must match the pattern exactly — no extra characters,
   * no impossible dates. Year, month and day tokens are required;
   * missing time components default to 0.
   *
   * Tokens: `YYYY`, `MM`/`M`, `DD`/`D`, `HH`/`H` (0-23), `hh`/`h` (1-12,
   * requires `A`/`a`), `mm`/`m`, `ss`/`s`, `SSS`, `A`/`a` (AM/PM),
   * `[text]` escaped literal. The string is interpreted as wall-clock
   * time in `options.timezone` (default: UTC).
   *
   * @param str - Date string
   * @param format - Format pattern
   * @param options - Parse options
   * @throws {Error} If the string does not match or the date is invalid
   *
   * @example
   * ```typescript
   * DateTime.fromFormat('2024-06-09 10:30', 'YYYY-MM-DD HH:mm');
   * DateTime.fromFormat('09/06/2024 7:05 PM', 'DD/MM/YYYY h:mm A');
   * ```
   */
  static fromFormat(str: string, format: string, options?: ParseOptions): DateTime {
    if (typeof str !== 'string' || typeof format !== 'string') {
      throw new Error('fromFormat expects string input and format');
    }

    // Compile the format pattern into a regex, recording field order
    const fields: string[] = [];
    let regexSource = '^';
    let lastIndex = 0;

    PARSE_TOKEN_REGEX.lastIndex = 0;
    let tokenMatch: RegExpExecArray | null;
    while ((tokenMatch = PARSE_TOKEN_REGEX.exec(format)) !== null) {
      // Literal text between tokens must match exactly
      regexSource += escapeRegExp(format.slice(lastIndex, tokenMatch.index));

      if (tokenMatch[1] !== undefined) {
        regexSource += escapeRegExp(tokenMatch[1]); // [escaped] literal
      } else {
        const token = PARSE_TOKENS[tokenMatch[0]]!;
        if (fields.includes(token.field)) {
          throw new Error(`Duplicate token for "${token.field}" in format "${format}"`);
        }
        fields.push(token.field);
        regexSource += token.pattern;
      }
      lastIndex = tokenMatch.index + tokenMatch[0].length;
    }
    regexSource += escapeRegExp(format.slice(lastIndex)) + '$';

    const match = new RegExp(regexSource).exec(str);
    if (!match) {
      throw new Error(`Input "${str}" does not match format "${format}"`);
    }

    const values: Record<string, string> = Object.create(null);
    fields.forEach((field, i) => {
      values[field] = match[i + 1]!;
    });

    if (values['hour'] !== undefined && values['hour12'] !== undefined) {
      throw new Error(`Format "${format}" mixes 24-hour and 12-hour tokens`);
    }
    if (values['hour12'] !== undefined && values['meridiem'] === undefined) {
      throw new Error(`Format "${format}" uses 12-hour token without AM/PM token`);
    }
    for (const required of ['year', 'month', 'day']) {
      if (values[required] === undefined) {
        throw new Error(`Format "${format}" is missing a ${required} token`);
      }
    }

    let hour = 0;
    if (values['hour'] !== undefined) {
      hour = parseInt(values['hour'], 10);
    } else if (values['hour12'] !== undefined) {
      const h12 = parseInt(values['hour12'], 10);
      if (h12 < 1 || h12 > 12) {
        throw new Error(`Invalid 12-hour value ${h12} in "${str}"`);
      }
      const isPM = values['meridiem']!.toUpperCase() === 'PM';
      hour = (h12 % 12) + (isPM ? 12 : 0);
    }

    return DateTime.fromObject(
      {
        year: parseInt(values['year']!, 10),
        month: parseInt(values['month']!, 10),
        day: parseInt(values['day']!, 10),
        hour,
        minute: values['minute'] !== undefined ? parseInt(values['minute'], 10) : 0,
        second: values['second'] !== undefined ? parseInt(values['second'], 10) : 0,
        millisecond: values['millisecond'] !== undefined ? parseInt(values['millisecond'], 10) : 0
      },
      options?.timezone !== undefined ? { timezone: options.timezone } : undefined
    );
  }

  /**
   * Create from Unix timestamp (seconds)
   */
  static fromUnix(seconds: number, timezone: string = 'UTC'): DateTime {
    return new DateTime(seconds * 1000, normalizeZone(timezone));
  }

  /**
   * Create from milliseconds timestamp
   */
  static fromMilliseconds(ms: number, timezone: string = 'UTC'): DateTime {
    return new DateTime(ms, normalizeZone(timezone));
  }

  /**
   * Create from JavaScript Date
   */
  static fromDate(date: Date, timezone: string = 'UTC'): DateTime {
    return new DateTime(date.getTime(), normalizeZone(timezone));
  }

  /**
   * Create from object (wall-clock time in `options.timezone`, default UTC)
   *
   * @example
   * ```typescript
   * DateTime.fromObject({ year: 2024, month: 6, day: 9, hour: 10 });
   * DateTime.fromObject({ year: 2024, month: 6, day: 9 }, { timezone: 'Asia/Tokyo' });
   * ```
   */
  static fromObject(obj: DateObject & TimeObject, options?: DateTimeOptions): DateTime {
    const wc: WallClock = {
      year: obj.year,
      month: obj.month,
      day: obj.day,
      hour: obj.hour ?? 0,
      minute: obj.minute ?? 0,
      second: obj.second ?? 0,
      millisecond: obj.millisecond ?? 0
    };

    if (!Number.isInteger(wc.year)) {
      throw new Error('Invalid date object: year must be an integer');
    }
    if (wc.month < 1 || wc.month > 12) {
      throw new Error(`Invalid date object: month must be 1-12, got ${wc.month}`);
    }
    if (wc.day < 1 || wc.day > daysInMonth(wc.year, wc.month)) {
      throw new Error(`Invalid date object: day out of range for ${wc.year}-${wc.month}`);
    }
    if (wc.hour < 0 || wc.hour > 23 || wc.minute < 0 || wc.minute > 59 ||
        wc.second < 0 || wc.second > 59 || wc.millisecond < 0 || wc.millisecond > 999) {
      throw new Error('Invalid date object: time component out of range');
    }

    const tz = normalizeZone(options?.timezone ?? 'UTC');
    return new DateTime(wallClockToTimestamp(wc, tz), tz);
  }

  // =========================================================================
  // GETTERS (timezone-aware)
  // =========================================================================

  get #wallClock(): WallClock {
    return getWallClock(this.#timestamp, this.#timezone);
  }

  get year(): number {
    return this.#wallClock.year;
  }

  /** Month 1-12 (NOT 0-11 like Date!) */
  get month(): number {
    return this.#wallClock.month;
  }

  get day(): number {
    return this.#wallClock.day;
  }

  get hour(): number {
    return this.#wallClock.hour;
  }

  get minute(): number {
    return this.#wallClock.minute;
  }

  get second(): number {
    return this.#wallClock.second;
  }

  get millisecond(): number {
    return this.#wallClock.millisecond;
  }

  /** Weekday 1-7 (1 = Monday, 7 = Sunday) */
  get weekday(): number {
    return weekdayOf(this.#wallClock);
  }

  /** Calendar quarter (1-4) */
  get quarter(): number {
    return Math.floor((this.#wallClock.month - 1) / 3) + 1;
  }

  /** Day of the year (1-366) */
  get dayOfYear(): number {
    const wc = this.#wallClock;
    const start = Date.UTC(wc.year, 0, 1);
    const current = Date.UTC(wc.year, wc.month - 1, wc.day);
    return Math.round((current - start) / 86400000) + 1;
  }

  /** Number of days in this instance's month (28-31) */
  get daysInMonth(): number {
    return daysInMonth(this.#wallClock.year, this.#wallClock.month);
  }

  /** Whether this instance's year is a leap year */
  get isLeapYear(): boolean {
    const y = this.#wallClock.year;
    return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
  }

  /**
   * ISO 8601 week number (1-53)
   *
   * Weeks start Monday; week 1 is the week containing the year's first
   * Thursday. Matches `format` semantics and ISO 8601 §8.1.4.
   */
  get weekOfYear(): number {
    const wc = this.#wallClock;
    // Shift to the Thursday of this week, then count weeks from Jan 1
    const date = new Date(Date.UTC(wc.year, wc.month - 1, wc.day));
    const dayNum = (date.getUTCDay() + 6) % 7; // Mon=0..Sun=6
    date.setUTCDate(date.getUTCDate() - dayNum + 3); // Thursday of this week
    const firstThursday = new Date(Date.UTC(date.getUTCFullYear(), 0, 4));
    const firstDayNum = (firstThursday.getUTCDay() + 6) % 7;
    firstThursday.setUTCDate(firstThursday.getUTCDate() - firstDayNum + 3);
    return Math.round((date.getTime() - firstThursday.getTime()) / (7 * 86400000)) + 1;
  }

  get timezone(): string {
    return this.#timezone;
  }

  /** UTC offset in minutes, east-positive (Tokyo = +540, New York = -300/-240) */
  get offset(): number {
    return getOffsetMinutes(this.#timestamp, this.#timezone);
  }

  // =========================================================================
  // TIMEZONE OPERATIONS
  // =========================================================================

  /**
   * Convert to different timezone
   *
   * Default: same instant, different wall-clock representation.
   * With `keepLocalTime: true`: same wall-clock time, different instant
   * (like moment's `tz(zone, true)`).
   *
   * @param tz - IANA timezone
   * @param options - `keepLocalTime` to preserve the wall clock
   * @returns New DateTime in target timezone
   *
   * @example
   * ```typescript
   * const nyc = DateTime.fromISO('2024-06-09T09:00:00', { timezone: 'America/New_York' });
   * nyc.setTimezone('Asia/Tokyo');                        // 22:00 in Tokyo (same instant)
   * nyc.setTimezone('Asia/Tokyo', { keepLocalTime: true }); // 09:00 in Tokyo (new instant)
   * ```
   */
  setTimezone(tz: string, options?: { keepLocalTime?: boolean }): DateTime {
    const normalized = normalizeZone(tz);
    if (normalized === this.#timezone) return this;

    if (options?.keepLocalTime) {
      const ts = wallClockToTimestamp(this.#wallClock, normalized);
      return new DateTime(ts, normalized, this.#locale);
    }

    return new DateTime(this.#timestamp, normalized, this.#locale);
  }

  /**
   * Convert to UTC
   */
  toUTC(): DateTime {
    return this.setTimezone('UTC');
  }

  /**
   * Convert to local timezone
   */
  toLocal(): DateTime {
    return this.setTimezone(normalizeZone('local'));
  }

  // =========================================================================
  // SETTERS (return new instance)
  // =========================================================================

  setYear(year: number): DateTime {
    return this.set({ year });
  }

  setMonth(month: number): DateTime {
    return this.set({ month });
  }

  setDay(day: number): DateTime {
    return this.set({ day });
  }

  setTime(hour: number, minute: number, second?: number): DateTime {
    return this.set({ hour, minute, second: second ?? 0, millisecond: 0 });
  }

  /**
   * Set any combination of date/time components (timezone-aware)
   *
   * @example
   * ```typescript
   * dt.set({ year: 2025, month: 1 });
   * dt.set({ hour: 0, minute: 0 });
   * ```
   */
  set(values: Partial<DateObject & TimeObject>): DateTime {
    const wc = this.#wallClock;
    const merged: WallClock = {
      year: values.year ?? wc.year,
      month: values.month ?? wc.month,
      day: values.day ?? wc.day,
      hour: values.hour ?? wc.hour,
      minute: values.minute ?? wc.minute,
      second: values.second ?? wc.second,
      millisecond: values.millisecond ?? wc.millisecond
    };

    if (merged.month < 1 || merged.month > 12) {
      throw new Error(`Invalid month: ${merged.month}`);
    }
    if (merged.day < 1 || merged.day > daysInMonth(merged.year, merged.month)) {
      throw new Error(`Invalid day ${merged.day} for ${merged.year}-${merged.month}`);
    }
    if (merged.hour < 0 || merged.hour > 23 || merged.minute < 0 || merged.minute > 59 ||
        merged.second < 0 || merged.second > 59 || merged.millisecond < 0 || merged.millisecond > 999) {
      throw new Error('Invalid time component');
    }

    return new DateTime(wallClockToTimestamp(merged, this.#timezone), this.#timezone, this.#locale);
  }

  // =========================================================================
  // ARITHMETIC
  // =========================================================================

  /**
   * Add a duration (calendar-aware, immutable)
   *
   * Years/months/weeks/days are applied to the wall-clock time (so adding
   * 1 day across a DST transition keeps the same local time). Hours and
   * smaller are applied to the absolute timestamp. Month-end overflow is
   * clamped: Jan 31 + 1 month = Feb 28/29.
   *
   * @example
   * ```typescript
   * dt.add({ days: 1 });
   * dt.add({ months: 1, hours: 6 });
   * ```
   */
  add(duration: DurationObject): DateTime {
    // Reject non-finite components up front: otherwise they propagate into
    // the timestamp and only surface later as a cryptic native
    // "Invalid time value" from toISO/toDate.
    for (const [unit, value] of Object.entries(duration)) {
      if (value !== undefined && !Number.isFinite(value)) {
        throw new Error(`Invalid duration: ${unit} must be a finite number, got ${value}`);
      }
    }

    const wc = this.#wallClock;

    const monthsToAdd = (duration.years ?? 0) * 12 + (duration.months ?? 0);
    const daysToAdd = (duration.weeks ?? 0) * 7 + (duration.days ?? 0);

    let result: DateTime = this;

    if (monthsToAdd !== 0 || daysToAdd !== 0) {
      let year = wc.year;
      let month = wc.month;
      let day = wc.day;

      if (monthsToAdd !== 0) {
        const totalMonths = (year * 12 + (month - 1)) + monthsToAdd;
        year = Math.floor(totalMonths / 12);
        month = (totalMonths % 12 + 12) % 12 + 1;
        day = Math.min(day, daysInMonth(year, month));
      }

      if (daysToAdd !== 0) {
        // Let Date.UTC handle day overflow across month/year boundaries
        const rolled = new Date(Date.UTC(year, month - 1, day + daysToAdd));
        year = rolled.getUTCFullYear();
        month = rolled.getUTCMonth() + 1;
        day = rolled.getUTCDate();
      }

      const ts = wallClockToTimestamp(
        { ...wc, year, month, day },
        this.#timezone
      );
      result = new DateTime(ts, this.#timezone, this.#locale);
    }

    const timeMs =
      (duration.hours ?? 0) * 3600000 +
      (duration.minutes ?? 0) * 60000 +
      (duration.seconds ?? 0) * 1000 +
      (duration.milliseconds ?? 0);

    if (timeMs !== 0) {
      result = new DateTime(result.#timestamp + timeMs, this.#timezone, this.#locale);
    }

    return result;
  }

  /**
   * Subtract a duration (calendar-aware, immutable)
   */
  subtract(duration: DurationObject): DateTime {
    const negated: DurationObject = {};
    for (const [key, value] of Object.entries(duration)) {
      negated[key as keyof DurationObject] = -value;
    }
    return this.add(negated);
  }

  /**
   * Difference between two DateTimes
   *
   * @returns Duration (positive if `this` is after `other`)
   */
  diff(other: DateTime): Duration {
    return Duration.fromMilliseconds(this.#timestamp - other.#timestamp);
  }

  // =========================================================================
  // COMPARISON
  // =========================================================================

  isBefore(other: DateTime): boolean {
    return this.#timestamp < other.#timestamp;
  }

  isAfter(other: DateTime): boolean {
    return this.#timestamp > other.#timestamp;
  }

  isSameOrBefore(other: DateTime): boolean {
    return this.#timestamp <= other.#timestamp;
  }

  isSameOrAfter(other: DateTime): boolean {
    return this.#timestamp >= other.#timestamp;
  }

  /**
   * Check if two DateTimes are the same instant, or fall within the same
   * unit (evaluated in this DateTime's timezone)
   *
   * @example
   * ```typescript
   * a.isSame(b);          // exact same instant
   * a.isSame(b, 'day');   // same calendar day in a's timezone
   * ```
   */
  isSame(other: DateTime, unit?: TimeUnit): boolean {
    if (!unit) {
      return this.#timestamp === other.#timestamp;
    }
    return this.startOf(unit).valueOf() ===
      other.setTimezone(this.#timezone).startOf(unit).valueOf();
  }

  isBetween(start: DateTime, end: DateTime): boolean {
    return this.#timestamp >= start.#timestamp && this.#timestamp <= end.#timestamp;
  }

  // =========================================================================
  // FORMATTING
  // =========================================================================

  /**
   * Format with custom pattern (timezone-aware)
   *
   * Tokens:
   * - `YYYY` / `YY` - year (4 / 2 digit)
   * - `MMMM` / `MMM` / `MM` / `M` - month (name / abbr / padded / plain)
   * - `DD` / `D` - day of month
   * - `dddd` / `ddd` - weekday (name / abbr)
   * - `HH` / `H` - hour 0-23
   * - `hh` / `h` - hour 1-12
   * - `mm` / `m` - minute
   * - `ss` / `s` - second
   * - `SSS` - millisecond
   * - `A` / `a` - AM/PM / am/pm
   * - `Z` / `ZZ` - UTC offset (+09:00 / +0900)
   * - `[text]` - escaped literal
   *
   * @example
   * ```typescript
   * dt.format('YYYY-MM-DD HH:mm:ss');   // "2024-06-09 10:30:00"
   * dt.format('ddd, MMM D [at] h:mm A'); // "Sun, Jun 9 at 10:30 AM"
   * ```
   */
  format(pattern: string, options?: { locale?: Locale }): string {
    const wc = this.#wallClock;
    const offset = this.offset;
    const hour12 = wc.hour % 12 === 0 ? 12 : wc.hour % 12;
    const weekday = weekdayOf(wc); // reuse wc instead of re-reading via getter
    const locale = options?.locale ?? this.#effectiveLocale;

    const tokens: Record<string, string> = {
      YYYY: pad(wc.year, 4),
      YY: pad(wc.year % 100, 2),
      MMMM: locale.months[wc.month - 1]!,
      MMM: locale.monthsShort[wc.month - 1]!,
      MM: pad(wc.month, 2),
      M: String(wc.month),
      DD: pad(wc.day, 2),
      D: String(wc.day),
      dddd: locale.weekdays[weekday - 1]!,
      ddd: locale.weekdaysShort[weekday - 1]!,
      HH: pad(wc.hour, 2),
      H: String(wc.hour),
      hh: pad(hour12, 2),
      h: String(hour12),
      mm: pad(wc.minute, 2),
      m: String(wc.minute),
      ss: pad(wc.second, 2),
      s: String(wc.second),
      SSS: pad(wc.millisecond, 3),
      A: locale.meridiem(wc.hour, false),
      a: locale.meridiem(wc.hour, true),
      ZZ: formatOffset(offset, ''),
      Z: formatOffset(offset, ':'),
      Q: String(Math.floor((wc.month - 1) / 3) + 1),
      DDDD: pad(this.dayOfYear, 3),
      DDD: String(this.dayOfYear),
      WW: pad(this.weekOfYear, 2),
      W: String(this.weekOfYear)
    };

    return pattern.replace(
      /\[([^\]]*)\]|YYYY|YY|MMMM|MMM|MM|M|DDDD|DDD|DD|D|dddd|ddd|HH|H|hh|h|mm|m|ss|s|SSS|A|a|ZZ|Z|Q|WW|W/g,
      (match, literal) => literal !== undefined ? literal : (tokens[match] ?? match)
    );
  }

  /**
   * Format as ISO 8601 with timezone offset
   *
   * @example
   * ```typescript
   * DateTime.now('Asia/Tokyo').toISO();
   * // "2024-06-09T19:30:00.000+09:00"
   *
   * DateTime.nowUTC().toISO();
   * // "2024-06-09T10:30:00.000Z"
   * ```
   */
  toISO(): string {
    const wc = this.#wallClock;
    const offset = this.offset;

    const base = `${pad(wc.year, 4)}-${pad(wc.month, 2)}-${pad(wc.day, 2)}` +
      `T${pad(wc.hour, 2)}:${pad(wc.minute, 2)}:${pad(wc.second, 2)}.${pad(wc.millisecond, 3)}`;

    return base + (this.#timezone === 'UTC' ? 'Z' : formatOffset(offset, ':'));
  }

  toUnix(): number {
    return Math.floor(this.#timestamp / 1000);
  }

  toDate(): Date {
    return new Date(this.#timestamp);
  }

  // =========================================================================
  // RELATIVE TIME
  // =========================================================================

  /**
   * Relative time from now
   *
   * @example
   * ```typescript
   * pastDt.fromNow();   // "5 minutes ago"
   * futureDt.fromNow(); // "in 2 hours"
   * pastDt.fromNow({ short: true }); // "5m ago"
   * ```
   */
  fromNow(options?: RelativeTimeOptions): string {
    return humanizeDelta(this.#timestamp - Date.now(), options, options?.locale ?? this.#effectiveLocale);
  }

  /**
   * Relative time to now (inverse of fromNow)
   *
   * @example
   * ```typescript
   * pastDt.toNow(); // "in 5 minutes"
   * ```
   */
  toNow(options?: RelativeTimeOptions): string {
    return humanizeDelta(Date.now() - this.#timestamp, options, options?.locale ?? this.#effectiveLocale);
  }

  /**
   * Relative time from this DateTime to another
   *
   * @example
   * ```typescript
   * a.to(b); // "in 3 days" (if b is 3 days after a)
   * ```
   */
  to(other: DateTime, options?: RelativeTimeOptions): string {
    return humanizeDelta(other.valueOf() - this.#timestamp, options, options?.locale ?? this.#effectiveLocale);
  }

  /**
   * Calendar-relative description (evaluated in this DateTime's timezone)
   *
   * @example
   * ```typescript
   * dt.toRelative(); // "today", "yesterday", "last Tuesday", "2024-03-15"
   * ```
   */
  toRelative(options?: { locale?: Locale }): string {
    const locale = options?.locale ?? this.#effectiveLocale;
    const today = new DateTime(Date.now(), this.#timezone).startOf('day');
    const thisDay = this.startOf('day');
    const dayDiff = Math.round((thisDay.valueOf() - today.valueOf()) / 86400000);

    if (dayDiff === 0) return locale.calendar.today;
    if (dayDiff === 1) return locale.calendar.tomorrow;
    if (dayDiff === -1) return locale.calendar.yesterday;

    const weekdayName = locale.weekdays[this.weekday - 1]!;
    if (dayDiff > 1 && dayDiff < 7) return locale.calendar.nextWeek.replace('{0}', weekdayName);
    if (dayDiff < -1 && dayDiff > -7) return locale.calendar.lastWeek.replace('{0}', weekdayName);

    return this.format('YYYY-MM-DD');
  }

  // =========================================================================
  // UTILITIES
  // =========================================================================

  /**
   * Round down to the start of a unit (timezone-aware)
   *
   * Weeks start on Monday.
   *
   * @example
   * ```typescript
   * dt.startOf('day');   // 00:00:00.000
   * dt.startOf('month'); // 1st of month, 00:00:00.000
   * dt.startOf('week');  // Monday, 00:00:00.000
   * ```
   */
  startOf(unit: TimeUnit): DateTime {
    const wc = this.#wallClock;
    let target: WallClock;

    switch (unit) {
      case 'year':
        target = { year: wc.year, month: 1, day: 1, hour: 0, minute: 0, second: 0, millisecond: 0 };
        break;
      case 'month':
        target = { ...wc, day: 1, hour: 0, minute: 0, second: 0, millisecond: 0 };
        break;
      case 'week': {
        const startOfDay = this.startOf('day');
        return startOfDay.subtract({ days: this.weekday - 1 });
      }
      case 'day':
        target = { ...wc, hour: 0, minute: 0, second: 0, millisecond: 0 };
        break;
      case 'hour':
        target = { ...wc, minute: 0, second: 0, millisecond: 0 };
        break;
      case 'minute':
        target = { ...wc, second: 0, millisecond: 0 };
        break;
      case 'second':
        target = { ...wc, millisecond: 0 };
        break;
      case 'millisecond':
        return this;
      default:
        throw new Error(`Invalid time unit: ${unit}`);
    }

    return new DateTime(wallClockToTimestamp(target, this.#timezone), this.#timezone, this.#locale);
  }

  /**
   * Round up to the end of a unit (last millisecond, timezone-aware)
   *
   * @example
   * ```typescript
   * dt.endOf('day'); // 23:59:59.999
   * ```
   */
  endOf(unit: TimeUnit): DateTime {
    if (unit === 'millisecond') return this;

    const nextUnit: DurationObject =
      unit === 'year' ? { years: 1 } :
      unit === 'month' ? { months: 1 } :
      unit === 'week' ? { weeks: 1 } :
      unit === 'day' ? { days: 1 } :
      unit === 'hour' ? { hours: 1 } :
      unit === 'minute' ? { minutes: 1 } :
      { seconds: 1 };

    const startOfNext = this.startOf(unit).add(nextUnit);
    return new DateTime(startOfNext.valueOf() - 1, this.#timezone, this.#locale);
  }

  isValid(): boolean {
    return !isNaN(this.#timestamp) && isFinite(this.#timestamp);
  }

  toString(): string {
    return this.toISO();
  }

  toJSON(): string {
    return this.toISO();
  }

  valueOf(): number {
    return this.#timestamp;
  }
}
