/**
 * tuuru-chrono-tz
 * 
 * TypeScript-first date/time library with built-in IANA timezone support.
 * 
 * @packageDocumentation
 */

export { DateTime } from './datetime.js';
export { Duration } from './duration.js';
export { Timezone } from './timezone.js';

// Locales (tree-shakeable: unused locales are dropped by bundlers)
export { en, setDefaultLocale, getDefaultLocale } from './locale.js';
export { de } from './locales/de.js';
export { fr } from './locales/fr.js';
export type { Locale, RelativeUnit } from './locale.js';

export type {
  DateObject,
  TimeObject,
  DurationObject,
  DateTimeOptions,
  FormatOptions,
  ParseOptions,
  RelativeTimeOptions,
  HumanizeOptions,
  TimeUnit,
  Month,
  Day,
  Weekday
} from './types.js';

// Re-export timezone data (names/links only — the heavy zone/rule tables
// stay behind the './tzdata' subpath via getTimezoneData)
export {
  TIMEZONE_NAMES,
  TIMEZONE_COUNT,
  TIMEZONE_LINKS,
  TZDATA_VERSION
} from './tzdata/index.js';

export type { TimezoneName } from './tzdata/index.js';
