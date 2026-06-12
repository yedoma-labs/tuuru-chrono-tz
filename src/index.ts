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
// Ordered roughly by number of speakers.
export { en, setDefaultLocale, getDefaultLocale } from './locale.js';
export { zh } from './locales/zh.js';
export { hi } from './locales/hi.js';
export { es } from './locales/es.js';
export { bn } from './locales/bn.js';
export { pt } from './locales/pt.js';
export { ru } from './locales/ru.js';
export { id } from './locales/id.js';
export { ja } from './locales/ja.js';
export { de } from './locales/de.js';
export { fr } from './locales/fr.js';
export { ko } from './locales/ko.js';
export { tr } from './locales/tr.js';
export { vi } from './locales/vi.js';
export { pl } from './locales/pl.js';
export { nl } from './locales/nl.js';
export { th } from './locales/th.js';
export { it } from './locales/it.js';
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
