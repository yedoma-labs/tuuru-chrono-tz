/**
 * Duration class
 * 
 * Immutable duration with formatting support.
 */

import type { DurationObject, HumanizeOptions } from './types.js';
import { getDefaultLocale, pickForm } from './locale.js';
import type { RelativeUnit } from './locale.js';

/**
 * Immutable Duration class
 * 
 * @example
 * ```typescript
 * const duration = Duration.fromObject({ hours: 2, minutes: 30 });
 * duration.humanize(); // "2 hours, 30 minutes"
 * duration.format('HH:mm:ss'); // "02:30:00"
 * ```
 */
export class Duration {
  readonly #milliseconds: number;
  
  private constructor(ms: number) {
    this.#milliseconds = ms;
  }
  
  // =========================================================================
  // FACTORY METHODS
  // =========================================================================
  
  /**
   * Create duration from milliseconds
   */
  static fromMilliseconds(ms: number): Duration {
    return new Duration(ms);
  }
  
  /**
   * Create duration from object
   * 
   * @example
   * ```typescript
   * Duration.fromObject({ hours: 2, minutes: 30 });
   * Duration.fromObject({ days: 1, hours: 12 });
   * ```
   */
  static fromObject(obj: DurationObject): Duration {
    let ms = 0;
    
    if (obj.milliseconds) ms += obj.milliseconds;
    if (obj.seconds) ms += obj.seconds * 1000;
    if (obj.minutes) ms += obj.minutes * 60 * 1000;
    if (obj.hours) ms += obj.hours * 60 * 60 * 1000;
    if (obj.days) ms += obj.days * 24 * 60 * 60 * 1000;
    if (obj.weeks) ms += obj.weeks * 7 * 24 * 60 * 60 * 1000;
    
    // Months/years use fixed approximations (30 days / 365 days).
    // For calendar-accurate month/year math use DateTime.add() instead.
    if (obj.months) ms += obj.months * 30 * 24 * 60 * 60 * 1000;
    if (obj.years) ms += obj.years * 365 * 24 * 60 * 60 * 1000;

    return new Duration(ms);
  }

  /**
   * Parse ISO 8601 duration string (strict)
   *
   * Supports weeks form (P2W) and date-time form (P1DT2H30M5.5S).
   * Years/months use the same fixed approximations as fromObject.
   *
   * @throws {Error} If the string is not a valid ISO 8601 duration
   *
   * @example
   * ```typescript
   * Duration.fromISO('PT2H30M');   // 2.5 hours
   * Duration.fromISO('P1DT12H');   // 1.5 days
   * Duration.fromISO('-PT30S');    // negative 30 seconds
   * ```
   */
  static fromISO(iso: string): Duration {
    if (typeof iso !== 'string') {
      throw new Error(`Invalid ISO 8601 duration: expected string, got ${typeof iso}`);
    }

    const match =
      /^(-)?P(?:(\d+(?:\.\d+)?)W|(?:(\d+(?:\.\d+)?)Y)?(?:(\d+(?:\.\d+)?)M)?(?:(\d+(?:\.\d+)?)D)?(?:T(?:(\d+(?:\.\d+)?)H)?(?:(\d+(?:\.\d+)?)M)?(?:(\d+(?:\.\d+)?)S)?)?)$/
        .exec(iso);

    if (!match) {
      throw new Error(`Invalid ISO 8601 duration: "${iso}"`);
    }

    const [, sign, weeks, years, months, days, hours, minutes, seconds] = match;

    // "P" or "PT" alone (no components) is not a valid duration
    if (weeks === undefined && years === undefined && months === undefined &&
        days === undefined && hours === undefined && minutes === undefined &&
        seconds === undefined) {
      throw new Error(`Invalid ISO 8601 duration: "${iso}" has no components`);
    }

    const num = (v: string | undefined): number => v === undefined ? 0 : parseFloat(v);

    const ms =
      num(weeks) * 7 * 86400000 +
      num(years) * 365 * 86400000 +
      num(months) * 30 * 86400000 +
      num(days) * 86400000 +
      num(hours) * 3600000 +
      num(minutes) * 60000 +
      Math.round(num(seconds) * 1000);

    return new Duration(sign === '-' ? -ms : ms);
  }

  // =========================================================================
  // GETTERS
  // =========================================================================
  
  /**
   * Cascading component breakdown (years 365d, months 30d approximations).
   * Each component is the remainder after larger units are consumed, so
   * years*365d + months*30d + days*1d + ... always equals the total.
   */
  #components(): { years: number; months: number; days: number; hours: number; minutes: number; seconds: number; milliseconds: number } {
    const sign = this.#milliseconds < 0 ? -1 : 1;
    let rest = Math.abs(this.#milliseconds);

    const years = Math.floor(rest / (365 * 86400000));
    rest -= years * 365 * 86400000;
    const months = Math.floor(rest / (30 * 86400000));
    rest -= months * 30 * 86400000;
    const days = Math.floor(rest / 86400000);
    rest -= days * 86400000;
    const hours = Math.floor(rest / 3600000);
    rest -= hours * 3600000;
    const minutes = Math.floor(rest / 60000);
    rest -= minutes * 60000;
    const seconds = Math.floor(rest / 1000);
    rest -= seconds * 1000;

    return {
      years: sign * years,
      months: sign * months,
      days: sign * days,
      hours: sign * hours,
      minutes: sign * minutes,
      seconds: sign * seconds,
      milliseconds: sign * rest
    };
  }

  get years(): number {
    return this.#components().years;
  }

  get months(): number {
    return this.#components().months;
  }

  get days(): number {
    return this.#components().days;
  }

  get hours(): number {
    return this.#components().hours;
  }

  get minutes(): number {
    return this.#components().minutes;
  }

  get seconds(): number {
    return this.#components().seconds;
  }

  get milliseconds(): number {
    return this.#components().milliseconds;
  }
  
  get totalMilliseconds(): number {
    return this.#milliseconds;
  }

  get totalSeconds(): number {
    return this.#milliseconds / 1000;
  }

  get totalMinutes(): number {
    return this.#milliseconds / 60000;
  }

  get totalHours(): number {
    return this.#milliseconds / 3600000;
  }

  get totalDays(): number {
    return this.#milliseconds / 86400000;
  }

  // =========================================================================
  // FORMATTING
  // =========================================================================
  
  /**
   * Format as human-readable string
   * 
   * @example
   * ```typescript
   * duration.humanize(); 
   * // "2 hours, 30 minutes"
   * 
   * duration.humanize({ short: true }); 
   * // "2h 30m"
   * 
   * duration.humanize({ largest: 1 }); 
   * // "2 hours"
   * ```
   */
  humanize(options?: HumanizeOptions): string {
    // Humanizes the magnitude; sign is ignored (like moment.js)
    const d = this.isNegative() ? this.abs() : this;

    const parts: string[] = [];
    const short = options?.short ?? false;
    const largest = options?.largest ?? Infinity;
    const locale = options?.locale ?? getDefaultLocale();
    const loc = locale.duration;
    const sep = locale.numberSeparator ?? ' ';

    const components: Array<[RelativeUnit, number]> = [
      ['year', d.years],
      ['month', d.months],
      ['day', d.days],
      ['hour', d.hours],
      ['minute', d.minutes],
      ['second', d.seconds]
    ];

    for (const [unit, value] of components) {
      if (value > 0 && parts.length < largest) {
        parts.push(short
          ? `${value}${loc.shortUnits[unit]}`
          : locale.formatCount
            ? locale.formatCount(value, loc.units[unit], unit)
            : `${value}${sep}${pickForm(loc.units[unit], value, locale)}`);
      }
    }

    if (parts.length === 0) {
      return short ? loc.zeroShort : loc.zero;
    }

    return short ? parts.join(' ') : parts.join(loc.listSeparator);
  }
  
  /**
   * Format with custom pattern
   * 
   * @example
   * ```typescript
   * duration.format('HH:mm:ss'); // "02:30:00"
   * duration.format('H[h] m[m]'); // "2h 30m"
   * ```
   */
  format(pattern: string): string {
    const negative = this.#milliseconds < 0;
    const total = Math.abs(this.#milliseconds);

    // Cascade: each unit absorbs overflow unless a larger unit is present
    const stripped = pattern.replace(/\[[^\]]*\]/g, '');
    const hasDays = /d/.test(stripped);
    const hasHours = /[Hh]/.test(stripped);
    const hasMinutes = /m/.test(stripped);
    const hasSeconds = /s/.test(stripped);

    const days = hasDays ? Math.floor(total / 86400000) : 0;
    const hourBase = total - days * 86400000;
    const hours = hasHours ? Math.floor(hourBase / 3600000) : 0;
    const minuteBase = hasHours ? hourBase - hours * 3600000 : hourBase;
    const minutes = hasMinutes ? Math.floor(minuteBase / 60000) : 0;
    const secondBase = hasMinutes ? minuteBase - minutes * 60000 : minuteBase;
    const seconds = hasSeconds ? Math.floor(secondBase / 1000) : 0;
    const milliseconds = hasSeconds ? secondBase - seconds * 1000 : secondBase;

    const result = pattern.replace(
      /\[([^\]]*)\]|d+|H+|h+|m+|s+|S+/g,
      (match, literal) => {
        if (literal !== undefined) return literal;
        const width = match.length;
        switch (match[0]) {
          case 'd': return String(days).padStart(width, '0');
          case 'H':
          case 'h': return String(hours).padStart(width, '0');
          case 'm': return String(minutes).padStart(width, '0');
          case 's': return String(seconds).padStart(width, '0');
          case 'S': return String(milliseconds).padStart(width, '0');
          default: return match;
        }
      }
    );

    return negative ? `-${result}` : result;
  }
  
  /**
   * Format as ISO 8601 duration
   * 
   * @example
   * ```typescript
   * duration.toISO(); // "PT2H30M"
   * ```
   */
  toISO(): string {
    const negative = this.#milliseconds < 0;
    let rest = Math.abs(this.#milliseconds);

    const days = Math.floor(rest / 86400000);
    rest -= days * 86400000;
    const hours = Math.floor(rest / 3600000);
    rest -= hours * 3600000;
    const minutes = Math.floor(rest / 60000);
    rest -= minutes * 60000;
    const seconds = rest / 1000; // may be fractional (milliseconds)

    let result = 'P';
    if (days > 0) result += `${days}D`;

    let time = '';
    if (hours > 0) time += `${hours}H`;
    if (minutes > 0) time += `${minutes}M`;
    if (seconds > 0 || (days === 0 && time === '')) time += `${seconds}S`;
    if (time) result += `T${time}`;

    return (negative ? '-' : '') + result;
  }
  
  // =========================================================================
  // ARITHMETIC
  // =========================================================================
  
  add(other: Duration | DurationObject): Duration {
    const otherMs = other instanceof Duration 
      ? other.#milliseconds
      : Duration.fromObject(other).#milliseconds;
    
    return new Duration(this.#milliseconds + otherMs);
  }
  
  subtract(other: Duration | DurationObject): Duration {
    const otherMs = other instanceof Duration 
      ? other.#milliseconds
      : Duration.fromObject(other).#milliseconds;
    
    return new Duration(this.#milliseconds - otherMs);
  }
  
  negate(): Duration {
    return new Duration(-this.#milliseconds);
  }
  
  abs(): Duration {
    return new Duration(Math.abs(this.#milliseconds));
  }
  
  // =========================================================================
  // UTILITIES
  // =========================================================================
  
  isZero(): boolean {
    return this.#milliseconds === 0;
  }
  
  isNegative(): boolean {
    return this.#milliseconds < 0;
  }
  
  valueOf(): number {
    return this.#milliseconds;
  }
  
  toString(): string {
    return this.humanize();
  }
  
  toJSON(): string {
    return this.toISO();
  }
}
