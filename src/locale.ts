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

  /**
   * Plural-form selector: maps a count to an index into a unit's form array.
   *
   * Omit for languages with a simple singular/plural split (the default is
   * `n === 1 ? 0 : 1`). Provide it for languages with more forms — e.g.
   * Russian has three (one / few / many), so its unit arrays have three
   * entries and `plural` returns 0, 1, or 2. Languages with no inflection
   * (Chinese, Japanese) use single-entry arrays and `plural` returns 0.
   */
  plural?(n: number): number;

  /**
   * Separator placed between a number and its unit word in the long form,
   * e.g. "2 hours". Defaults to a space; set to '' for CJK languages that
   * write "2小时" with no gap.
   */
  numberSeparator?: string;

  /**
   * Render the complete "number + unit" phrase for one component, overriding
   * the default `${n}${numberSeparator}${pickForm(forms, n)}`.
   *
   * Needed for languages whose grammar changes or drops the numeral at small
   * counts. Arabic, for example, uses the bare singular for one ("دقيقة"), a
   * dual form with no numeral for two ("دقيقتين"), the plural with a numeral
   * for 3-10 ("5 دقائق"), and the singular with a numeral for 11+
   * ("11 دقيقة").
   *
   * `future` is `true` for "in X", `false` for "X ago", and `undefined` for a
   * direction-less duration (Duration.humanize). Languages that inflect the
   * unit's case by direction — Finnish ("5 minuutin päästä" vs "5 minuuttia
   * sitten"), Icelandic — use it.
   */
  formatCount?(n: number, forms: readonly string[], unit: RelativeUnit, future?: boolean): string;

  relativeTime: {
    /** Template for future deltas, '{0}' is the unit phrase, e.g. 'in {0}' */
    future: string;
    /** Template for past deltas, e.g. '{0} ago' */
    past: string;
    /** Phrase for sub-5-second deltas, e.g. 'a few seconds' */
    fewSeconds: string;
    /** Short-form phrase for sub-5-second deltas, e.g. 'now' */
    now: string;
    /** Plural forms per unit, ordered to match `plural` (1+ entries) */
    units: Readonly<Record<RelativeUnit, readonly string[]>>;
    /** Short suffix per unit, e.g. 'm' for minutes */
    shortUnits: Readonly<Record<RelativeUnit, string>>;
  };

  calendar: {
    today: string;
    tomorrow: string;
    yesterday: string;
    /**
     * Phrase for 2-6 days ahead. A string template uses '{0}' for the
     * weekday name; a function receives the nominative weekday name and its
     * ISO index (1 = Monday .. 7 = Sunday) so locales that inflect for
     * grammatical gender or case can agree (e.g. Russian, Italian).
     */
    nextWeek: string | ((weekday: string, weekdayIndex: number) => string);
    /** Phrase for 2-6 days back (same shape as nextWeek) */
    lastWeek: string | ((weekday: string, weekdayIndex: number) => string);
  };

  duration: {
    /** Plural forms per unit for Duration.humanize(), ordered to match `plural` */
    units: Readonly<Record<RelativeUnit, readonly string[]>>;
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
 * Pick the correct plural form for a count using the locale's selector
 * (default: English binary). Clamps to the available forms so a locale
 * that supplies fewer forms than its selector indexes never reads undefined.
 */
export function pickForm(forms: readonly string[], n: number, locale: Locale): string {
  const idx = locale.plural ? locale.plural(n) : (n === 1 ? 0 : 1);
  return forms[Math.min(idx, forms.length - 1)] ?? forms[0]!;
}

/**
 * Resolve a calendar week phrase (nextWeek/lastWeek), which may be either a
 * '{0}' template string or a function that inflects for the given weekday.
 */
export function weekPhrase(
  phrase: string | ((weekday: string, weekdayIndex: number) => string),
  weekday: string,
  weekdayIndex: number
): string {
  return typeof phrase === 'function'
    ? phrase(weekday, weekdayIndex)
    : phrase.replace('{0}', weekday);
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
