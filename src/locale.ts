/**
 * Locale support
 *
 * Locales are plain objects passed by reference (like date-fns), so
 * bundlers tree-shake every locale you don't import. English is built in
 * and is the default.
 */

export type RelativeUnit = 'second' | 'minute' | 'hour' | 'day' | 'month' | 'year';

export interface Locale {
  /** BCP 47-ish identifier, e.g. 'en', 'de', 'fr' */
  name: string;

  /** Full month names, January-first (12 entries) */
  months: readonly string[];
  /** Abbreviated month names (12 entries) */
  monthsShort: readonly string[];
  /** Full weekday names, Monday-first (7 entries) */
  weekdays: readonly string[];
  /** Abbreviated weekday names, Monday-first (7 entries) */
  weekdaysShort: readonly string[];

  /** AM/PM rendering for the `A` (uppercase) and `a` (lowercase) tokens */
  meridiem(hour: number, lowercase: boolean): string;

  relativeTime: {
    /** Template for future deltas, '{0}' is the unit phrase, e.g. 'in {0}' */
    future: string;
    /** Template for past deltas, e.g. '{0} ago' */
    past: string;
    /** Phrase for sub-5-second deltas, e.g. 'a few seconds' */
    fewSeconds: string;
    /** Short-form phrase for sub-5-second deltas, e.g. 'now' */
    now: string;
    /** [singular, plural] per unit */
    units: Readonly<Record<RelativeUnit, readonly [string, string]>>;
    /** Short suffix per unit, e.g. 'm' for minutes */
    shortUnits: Readonly<Record<RelativeUnit, string>>;
  };

  calendar: {
    today: string;
    tomorrow: string;
    yesterday: string;
    /** Template for 2-6 days ahead, '{0}' is the weekday name */
    nextWeek: string;
    /** Template for 2-6 days back */
    lastWeek: string;
  };

  duration: {
    /** [singular, plural] per unit for Duration.humanize() */
    units: Readonly<Record<RelativeUnit, readonly [string, string]>>;
    /** Short suffix per unit for humanize({ short: true }) */
    shortUnits: Readonly<Record<RelativeUnit, string>>;
    /** Separator between parts in long form, e.g. ', ' */
    listSeparator: string;
    /** Phrase for a zero duration */
    zero: string;
    /** Short-form phrase for a zero duration */
    zeroShort: string;
  };
}

/**
 * English (built-in default)
 */
export const en: Locale = {
  name: 'en',
  months: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ],
  monthsShort: [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ],
  weekdays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  weekdaysShort: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  meridiem: (hour, lowercase) => {
    const m = hour < 12 ? 'AM' : 'PM';
    return lowercase ? m.toLowerCase() : m;
  },
  relativeTime: {
    future: 'in {0}',
    past: '{0} ago',
    fewSeconds: 'a few seconds',
    now: 'now',
    units: {
      second: ['second', 'seconds'],
      minute: ['minute', 'minutes'],
      hour: ['hour', 'hours'],
      day: ['day', 'days'],
      month: ['month', 'months'],
      year: ['year', 'years']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' }
  },
  calendar: {
    today: 'today',
    tomorrow: 'tomorrow',
    yesterday: 'yesterday',
    nextWeek: 'next {0}',
    lastWeek: 'last {0}'
  },
  duration: {
    units: {
      second: ['second', 'seconds'],
      minute: ['minute', 'minutes'],
      hour: ['hour', 'hours'],
      day: ['day', 'days'],
      month: ['month', 'months'],
      year: ['year', 'years']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' },
    listSeparator: ', ',
    zero: '0 seconds',
    zeroShort: '0s'
  }
};

let defaultLocale: Locale = en;

/**
 * Set the global default locale
 *
 * Affects format(), humanize(), fromNow() etc. everywhere a locale isn't
 * given explicitly.
 *
 * @example
 * ```typescript
 * import { setDefaultLocale, fr } from '@yedoma-labs/tuuru-chrono-tz';
 * setDefaultLocale(fr);
 * DateTime.now().format('MMMM'); // "juin"
 * ```
 */
export function setDefaultLocale(locale: Locale): void {
  defaultLocale = locale;
}

/**
 * Get the current global default locale
 */
export function getDefaultLocale(): Locale {
  return defaultLocale;
}
