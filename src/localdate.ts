/**
 * LocalDate
 *
 * A calendar date — year, month, day — with no time and no timezone, like
 * java.time.LocalDate. Useful for birthdays, due dates, and anything where a
 * wall-clock instant would be misleading (luxon #1141).
 */

import { DateTime } from './datetime.js';
import { daysInMonth, weekdayOf, pad } from './internal.js';
import type { Locale } from './locale.js';
import type { DateObject } from './types.js';

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

export class LocalDate {
  readonly #year: number;
  readonly #month: number; // 1-12
  readonly #day: number;   // 1-31

  private constructor(year: number, month: number, day: number) {
    this.#year = year;
    this.#month = month;
    this.#day = day;
  }

  // ---- factories ----------------------------------------------------------

  /** Parse a strict ISO date (`YYYY-MM-DD`). Rejects impossible dates. */
  static fromISO(iso: string): LocalDate {
    if (typeof iso !== 'string') {
      throw new Error(`Invalid LocalDate: expected string, got ${typeof iso}`);
    }
    const m = ISO_DATE.exec(iso);
    if (!m) throw new Error(`Invalid ISO date: "${iso}"`);
    return LocalDate.of(parseInt(m[1]!, 10), parseInt(m[2]!, 10), parseInt(m[3]!, 10));
  }

  /** Build from numeric parts (validated). */
  static of(year: number, month: number, day: number): LocalDate {
    if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
      throw new Error('LocalDate.of requires integer year, month, day');
    }
    if (month < 1 || month > 12) throw new Error(`Invalid month: ${month}`);
    if (day < 1 || day > daysInMonth(year, month)) {
      throw new Error(`Invalid day ${day} for ${year}-${month}`);
    }
    return new LocalDate(year, month, day);
  }

  static fromObject(obj: DateObject): LocalDate {
    return LocalDate.of(obj.year, obj.month, obj.day);
  }

  /** Today's date in the given timezone (default: system local). */
  static today(timezone: string = 'local'): LocalDate {
    const dt = DateTime.now(timezone);
    return new LocalDate(dt.year, dt.month, dt.day);
  }

  /** Project a DateTime's wall-clock date (drops time and zone). */
  static fromDateTime(dt: DateTime): LocalDate {
    return new LocalDate(dt.year, dt.month, dt.day);
  }

  static min(...dates: LocalDate[]): LocalDate {
    if (dates.length === 0) throw new Error('LocalDate.min requires at least one argument');
    return dates.reduce((a, b) => (b.#ordinal < a.#ordinal ? b : a));
  }

  static max(...dates: LocalDate[]): LocalDate {
    if (dates.length === 0) throw new Error('LocalDate.max requires at least one argument');
    return dates.reduce((a, b) => (b.#ordinal > a.#ordinal ? b : a));
  }

  // ---- getters ------------------------------------------------------------

  get year(): number { return this.#year; }
  get month(): number { return this.#month; }
  get day(): number { return this.#day; }

  /** ISO weekday, 1 = Monday .. 7 = Sunday */
  get weekday(): number {
    return weekdayOf({ year: this.#year, month: this.#month, day: this.#day, hour: 0, minute: 0, second: 0, millisecond: 0 });
  }

  get quarter(): number { return Math.floor((this.#month - 1) / 3) + 1; }

  get dayOfYear(): number {
    return Math.round(
      (Date.UTC(this.#year, this.#month - 1, this.#day) - Date.UTC(this.#year, 0, 1)) / 86400000
    ) + 1;
  }

  get daysInMonth(): number { return daysInMonth(this.#year, this.#month); }

  get isLeapYear(): boolean {
    const y = this.#year;
    return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
  }

  /** Days since the Unix epoch — a cheap total order for comparisons. */
  get #ordinal(): number {
    return Math.round(Date.UTC(this.#year, this.#month - 1, this.#day) / 86400000);
  }

  // ---- arithmetic (immutable) ---------------------------------------------

  add(duration: { years?: number; months?: number; weeks?: number; days?: number }): LocalDate {
    for (const v of Object.values(duration)) {
      if (v !== undefined && !Number.isFinite(v)) throw new Error('LocalDate.add requires finite values');
    }
    let year = this.#year;
    let month = this.#month;
    let day = this.#day;

    const months = (duration.years ?? 0) * 12 + (duration.months ?? 0);
    if (months !== 0) {
      const total = year * 12 + (month - 1) + months;
      year = Math.floor(total / 12);
      month = ((total % 12) + 12) % 12 + 1;
      day = Math.min(day, daysInMonth(year, month)); // clamp month-end overflow
    }

    const days = (duration.weeks ?? 0) * 7 + (duration.days ?? 0);
    if (days !== 0) {
      const rolled = new Date(Date.UTC(year, month - 1, day + days));
      year = rolled.getUTCFullYear();
      month = rolled.getUTCMonth() + 1;
      day = rolled.getUTCDate();
    }

    return new LocalDate(year, month, day);
  }

  subtract(duration: { years?: number; months?: number; weeks?: number; days?: number }): LocalDate {
    const neg: Record<string, number> = {};
    for (const [k, v] of Object.entries(duration)) if (v !== undefined) neg[k] = -v;
    return this.add(neg);
  }

  /** Whole days from `other` to `this` (positive if `this` is later). */
  until(other: LocalDate): number {
    return other.#ordinal - this.#ordinal;
  }

  // ---- comparison ---------------------------------------------------------

  equals(other: LocalDate): boolean { return this.#ordinal === other.#ordinal; }
  isBefore(other: LocalDate): boolean { return this.#ordinal < other.#ordinal; }
  isAfter(other: LocalDate): boolean { return this.#ordinal > other.#ordinal; }
  isSameOrBefore(other: LocalDate): boolean { return this.#ordinal <= other.#ordinal; }
  isSameOrAfter(other: LocalDate): boolean { return this.#ordinal >= other.#ordinal; }
  isBetween(start: LocalDate, end: LocalDate): boolean {
    return this.#ordinal >= start.#ordinal && this.#ordinal <= end.#ordinal;
  }

  /** -1 if this < other, 0 if equal, 1 if this > other. Safe for Array.sort. */
  compareTo(other: LocalDate): -1 | 0 | 1 {
    return this.#ordinal < other.#ordinal ? -1 : this.#ordinal > other.#ordinal ? 1 : 0;
  }

  /** True if this date is today in the given timezone (default: system local). */
  isToday(timezone: string = 'local'): boolean {
    return this.equals(LocalDate.today(timezone));
  }

  /** True if weekday is Saturday (6) or Sunday (7). */
  isWeekend(): boolean { return this.weekday >= 6; }

  /** True if weekday is Monday–Friday (1–5). */
  isWeekday(): boolean { return this.weekday <= 5; }

  // ---- conversion / formatting --------------------------------------------

  /**
   * Attach a time and timezone, producing a DateTime. Defaults to midnight
   * UTC.
   */
  toDateTime(
    timezone: string = 'UTC',
    time?: { hour?: number; minute?: number; second?: number; millisecond?: number }
  ): DateTime {
    return DateTime.fromObject(
      { year: this.#year, month: this.#month, day: this.#day, ...time },
      { timezone }
    );
  }

  /** Format with date tokens (delegates to DateTime; time tokens read as 0). */
  format(pattern: string, options?: { locale?: Locale }): string {
    return this.toDateTime('UTC').format(pattern, options);
  }

  toISO(): string {
    return `${pad(this.#year, 4)}-${pad(this.#month, 2)}-${pad(this.#day, 2)}`;
  }

  /**
   * Format using `Intl.DateTimeFormat` for structurally correct locale output.
   * Accepts an optional locale and `Intl.DateTimeFormatOptions`. Defaults to
   * `dateStyle: 'long'` when no options are provided.
   *
   * @example
   * ```typescript
   * LocalDate.fromISO('2026-06-15').toLocaleString({ dateStyle: 'full' }, de)
   * // "Montag, 15. Juni 2026"
   * ```
   */
  toLocaleString(options?: Intl.DateTimeFormatOptions, locale?: Locale): string {
    const tag = locale?.name.replace(/_/g, '-');
    const date = new Date(Date.UTC(this.#year, this.#month - 1, this.#day));
    return new Intl.DateTimeFormat(tag, { dateStyle: 'long', timeZone: 'UTC', ...options }).format(date);
  }

  toString(): string { return this.toISO(); }
  toJSON(): string { return this.toISO(); }
  valueOf(): number { return this.#ordinal; }
}
