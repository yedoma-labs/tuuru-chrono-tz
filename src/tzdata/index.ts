/**
 * IANA Timezone Database
 * 
 * This module contains the IANA timezone data used by tuuru-chrono-tz.
 * 
 * @packageDocumentation
 */

export { TIMEZONE_NAMES, TIMEZONE_COUNT } from './timezones.js';
export type { TimezoneName } from './timezones.js';

export { TIMEZONE_LINKS } from './links.js';

export { 
  getTimezoneData,
  TZDATA_VERSION 
} from './data.js';

export type {
  TimezoneData,
  ZoneEntry,
  RuleEntry,
  TimezoneMetadata
} from './data.js';
