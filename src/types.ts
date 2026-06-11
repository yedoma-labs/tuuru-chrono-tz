/**
 * Core type definitions for tuuru-chrono-tz
 */

/**
 * Month literal type (1-12, not 0-11!)
 */
export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

/**
 * Day of month (1-31)
 */
export type Day = 
  | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20
  | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30
  | 31;

/**
 * Hour (0-23)
 */
export type Hour = 
  | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11
  | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23;

/**
 * Minute/Second (0-59)
 */
export type MinuteOrSecond = 
  | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20
  | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30
  | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40
  | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 | 50
  | 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59;

/**
 * Weekday (1 = Monday, 7 = Sunday)
 */
export type Weekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;

/**
 * Date object (year, month, day)
 */
export interface DateObject {
  year: number;
  month: Month | number;
  day: Day | number;
}

/**
 * Time object (hour, minute, second, millisecond)
 */
export interface TimeObject {
  hour?: Hour | number;
  minute?: MinuteOrSecond | number;
  second?: MinuteOrSecond | number;
  millisecond?: number;
}

/**
 * Duration object
 */
export interface DurationObject {
  years?: number;
  months?: number;
  weeks?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
}

/**
 * DateTime creation options
 */
export interface DateTimeOptions {
  timezone?: string;
  locale?: string;
  strict?: boolean;
}

/**
 * Format options
 */
export interface FormatOptions {
  locale?: string;
}

/**
 * Parse options
 */
export interface ParseOptions {
  timezone?: string;
  locale?: string;
  strict?: boolean;
}

/**
 * Relative time options
 */
export interface RelativeTimeOptions {
  short?: boolean;
  rounding?: 'floor' | 'ceil' | 'round';
}

/**
 * Humanize options
 */
export interface HumanizeOptions {
  short?: boolean;
  largest?: number;
  round?: boolean;
}

/**
 * Time unit for comparison/manipulation
 */
export type TimeUnit = 
  | 'year'
  | 'month'
  | 'week'
  | 'day'
  | 'hour'
  | 'minute'
  | 'second'
  | 'millisecond';
