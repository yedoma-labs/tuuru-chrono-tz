/**
 * LocalTime
 *
 * A time of day — hour, minute, second, millisecond — with no date and no
 * timezone, like java.time.LocalTime. Arithmetic wraps within a 24-hour day.
 */

import { DateTime } from './datetime.js';
import { pad } from './internal.js';
import type { Locale } from './locale.js';

const DAY_MS = 24 * 60 * 60 * 1000;
const ISO_TIME = /^(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?$/;

export class LocalTime {
  /** Milliseconds since midnight, 0 .. 86_399_999 */
  readonly #ms: number;

  private constructor(ms: number) {
    this.#ms = ms;
  }

  // ---- factories ----------------------------------------------------------

  /** Parse a strict ISO time (`HH:mm`, `HH:mm:ss`, `HH:mm:ss.SSS`). */
  static fromISO(iso: string): LocalTime {
    if (typeof iso !== 'string') {
      throw new Error(`Invalid LocalTime: expected string, got ${typeof iso}`);
    }
    const m = ISO_TIME.exec(iso);
    if (!m) throw new Error(`Invalid ISO time: "${iso}"`);
    return LocalTime.of(
      parseInt(m[1]!, 10),
      parseInt(m[2]!, 10),
      m[3] !== undefined ? parseInt(m[3], 10) : 0,
      m[4] !== undefined ? parseInt(m[4].padEnd(3, '0'), 10) : 0
    );
  }

  static of(hour: number, minute: number, second = 0, millisecond = 0): LocalTime {
    if (![hour, minute, second, millisecond].every(Number.isInteger)) {
      throw new Error('LocalTime.of requires integer components');
    }
    if (hour < 0 || hour > 23) throw new Error(`Invalid hour: ${hour}`);
    if (minute < 0 || minute > 59) throw new Error(`Invalid minute: ${minute}`);
    if (second < 0 || second > 59) throw new Error(`Invalid second: ${second}`);
    if (millisecond < 0 || millisecond > 999) throw new Error(`Invalid millisecond: ${millisecond}`);
    return new LocalTime(((hour * 60 + minute) * 60 + second) * 1000 + millisecond);
  }

  static fromObject(obj: { hour?: number; minute?: number; second?: number; millisecond?: number }): LocalTime {
    return LocalTime.of(obj.hour ?? 0, obj.minute ?? 0, obj.second ?? 0, obj.millisecond ?? 0);
  }

  /** Current time of day in the given timezone (default: system local). */
  static now(timezone: string = 'local'): LocalTime {
    const dt = DateTime.now(timezone);
    return LocalTime.of(dt.hour, dt.minute, dt.second, dt.millisecond);
  }

  static fromDateTime(dt: DateTime): LocalTime {
    return LocalTime.of(dt.hour, dt.minute, dt.second, dt.millisecond);
  }

  // ---- getters ------------------------------------------------------------

  get hour(): number { return Math.floor(this.#ms / 3600000); }
  get minute(): number { return Math.floor(this.#ms / 60000) % 60; }
  get second(): number { return Math.floor(this.#ms / 1000) % 60; }
  get millisecond(): number { return this.#ms % 1000; }

  /** Milliseconds since midnight. */
  get millisecondOfDay(): number { return this.#ms; }

  // ---- arithmetic (wraps within the day) ----------------------------------

  add(duration: { hours?: number; minutes?: number; seconds?: number; milliseconds?: number }): LocalTime {
    const delta =
      (duration.hours ?? 0) * 3600000 +
      (duration.minutes ?? 0) * 60000 +
      (duration.seconds ?? 0) * 1000 +
      (duration.milliseconds ?? 0);
    if (!Number.isFinite(delta)) throw new Error('LocalTime.add requires finite values');
    return new LocalTime(((this.#ms + delta) % DAY_MS + DAY_MS) % DAY_MS);
  }

  subtract(duration: { hours?: number; minutes?: number; seconds?: number; milliseconds?: number }): LocalTime {
    const neg: Record<string, number> = {};
    for (const [k, v] of Object.entries(duration)) if (v !== undefined) neg[k] = -v;
    return this.add(neg);
  }

  // ---- comparison ---------------------------------------------------------

  equals(other: LocalTime): boolean { return this.#ms === other.#ms; }
  isBefore(other: LocalTime): boolean { return this.#ms < other.#ms; }
  isAfter(other: LocalTime): boolean { return this.#ms > other.#ms; }
  isSameOrBefore(other: LocalTime): boolean { return this.#ms <= other.#ms; }
  isSameOrAfter(other: LocalTime): boolean { return this.#ms >= other.#ms; }

  // ---- conversion / formatting --------------------------------------------

  /** Format with time tokens (delegates to DateTime on an arbitrary date). */
  format(pattern: string, options?: { locale?: Locale }): string {
    return DateTime.fromObject({
      year: 2000, month: 1, day: 1,
      hour: this.hour, minute: this.minute, second: this.second, millisecond: this.millisecond
    }).format(pattern, options);
  }

  /** `HH:mm:ss` always; `.SSS` appended only when milliseconds are non-zero. */
  toISO(): string {
    const base = `${pad(this.hour, 2)}:${pad(this.minute, 2)}:${pad(this.second, 2)}`;
    return this.millisecond === 0 ? base : `${base}.${pad(this.millisecond, 3)}`;
  }

  toString(): string { return this.toISO(); }
  toJSON(): string { return this.toISO(); }
  valueOf(): number { return this.#ms; }
}
