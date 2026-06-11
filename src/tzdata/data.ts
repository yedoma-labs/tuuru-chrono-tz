/**
 * IANA Timezone Data
 * 
 * Version: 2026b
 * Zones: 312
 * Rules: 134
 * Links: 256
 * 
 * Generated from IANA tzdata.
 * DO NOT EDIT - This file is auto-generated.
 */

import { IANA_DATA } from './iana-data.js';

export interface TimezoneData {
  version: string;
  zones: Record<string, ZoneEntry[]>;
  rules: Record<string, RuleEntry[]>;
  links: Record<string, string>;
  metadata: Record<string, TimezoneMetadata>;
}

export interface ZoneEntry {
  offset: string;
  rules: string;
  format: string;
  until: string | null;
}

export interface RuleEntry {
  from: string;
  to: string;
  type: string;
  in: string;
  on: string;
  at: string;
  save: string;
  letter: string;
}

export interface TimezoneMetadata {
  countries: string[];
  coordinates: string;
  comments: string;
}

/**
 * IANA timezone data
 *
 * Note: references the full generated data module (~330KB source).
 * The core DateTime and Timezone APIs do not depend on it; bundlers
 * tree-shake it away when getTimezoneData is unused.
 */
export function getTimezoneData(): TimezoneData {
  return IANA_DATA;
}

export const TZDATA_VERSION = '2026b';
