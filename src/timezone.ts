/**
 * Timezone utilities
 *
 * Helper functions for working with IANA timezones.
 */

import { TIMEZONE_NAMES } from './tzdata/index.js';
import { TIMEZONE_LINKS } from './tzdata/links.js';
import type { TimezoneName } from './tzdata/index.js';
import { getOffsetMinutes } from './internal.js';

/** Lazy Set for O(1) validation (TIMEZONE_NAMES is a 500+ entry array) */
let nameSet: Set<string> | null = null;

function getNameSet(): Set<string> {
  if (!nameSet) {
    nameSet = new Set(TIMEZONE_NAMES);
  }
  return nameSet;
}

/**
 * Timezone utilities
 *
 * @example
 * ```typescript
 * Timezone.listAll(); // All 500+ timezones
 * Timezone.search('New York'); // ['America/New_York', ...]
 * Timezone.isValid('America/New_York'); // true
 * ```
 */
export class Timezone {
  /**
   * List all IANA timezone names
   *
   * @returns Array of all timezone identifiers (including aliases)
   *
   * @example
   * ```typescript
   * const zones = Timezone.listAll();
   * // ['Africa/Abidjan', 'Africa/Accra', ..., 'Pacific/Wake']
   * ```
   */
  static listAll(): readonly TimezoneName[] {
    return TIMEZONE_NAMES;
  }

  /**
   * Search for timezones by query
   *
   * Fuzzy search across timezone names.
   *
   * @param query - Search query
   * @returns Array of matching timezone names
   *
   * @example
   * ```typescript
   * Timezone.search('New York');
   * // ['America/New_York']
   *
   * Timezone.search('Pacific');
   * // ['Pacific/Auckland', 'Pacific/Fiji', ...]
   * ```
   */
  static search(query: string): TimezoneName[] {
    const lowerQuery = query.toLowerCase().replace(/\s+/g, '_');

    return TIMEZONE_NAMES.filter(tz => {
      const lowerTz = tz.toLowerCase();

      // Exact match
      if (lowerTz === lowerQuery) return true;

      // Contains match
      if (lowerTz.includes(lowerQuery)) return true;

      // Match parts (e.g., "New York" matches "America/New_York")
      const queryParts = lowerQuery.split(/[/_]/);
      const tzParts = lowerTz.split(/[/_]/);

      return queryParts.every(qPart =>
        tzParts.some(tzPart => tzPart.includes(qPart))
      );
    }) as TimezoneName[];
  }

  /**
   * Check if timezone is valid
   *
   * @param tz - Timezone identifier
   * @returns True if valid IANA timezone (canonical name or alias)
   *
   * @example
   * ```typescript
   * Timezone.isValid('America/New_York'); // true
   * Timezone.isValid('Invalid/Zone'); // false
   * ```
   */
  static isValid(tz: string): tz is TimezoneName {
    return getNameSet().has(tz);
  }

  /**
   * Get UTC offset for timezone at given timestamp
   *
   * East-positive convention (matches `DateTime.offset` and ISO 8601):
   * Tokyo = +540, New York = -300 (winter) / -240 (DST).
   *
   * @param tz - IANA timezone
   * @param timestamp - Unix timestamp in milliseconds (default: now)
   * @returns Offset in minutes, east-positive
   *
   * @example
   * ```typescript
   * Timezone.getOffset('Asia/Tokyo');
   * // 540 (UTC+9)
   * ```
   */
  static getOffset(tz: string, timestamp: number = Date.now()): number {
    if (!this.isValid(tz)) {
      throw new Error(`Invalid timezone: ${tz}`);
    }
    return getOffsetMinutes(timestamp, tz);
  }

  /**
   * Get canonical timezone name
   *
   * Resolves aliases (IANA links) to canonical names.
   *
   * @param tz - Timezone identifier (may be alias)
   * @returns Canonical timezone name
   *
   * @example
   * ```typescript
   * Timezone.getCanonical('US/Eastern');
   * // 'America/New_York'
   * ```
   */
  static getCanonical(tz: string): string {
    if (!this.isValid(tz)) {
      throw new Error(`Invalid timezone: ${tz}`);
    }

    // Follow link chain (guard against cycles in malformed data)
    let current: string = tz;
    for (let i = 0; i < 8; i++) {
      if (!Object.hasOwn(TIMEZONE_LINKS, current)) {
        return current;
      }
      current = TIMEZONE_LINKS[current]!;
    }
    return current;
  }

  /**
   * Guess the user's local timezone
   *
   * @returns IANA timezone identifier
   *
   * @example
   * ```typescript
   * Timezone.guessLocal();
   * // 'America/New_York' (based on system settings)
   * ```
   */
  static guessLocal(): string {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return 'UTC';
    }
  }

  /**
   * Get timezone abbreviation (e.g., EST, PST)
   *
   * @param tz - IANA timezone
   * @param timestamp - Unix timestamp in milliseconds (default: now)
   * @returns Timezone abbreviation
   *
   * @example
   * ```typescript
   * Timezone.getAbbreviation('America/New_York');
   * // 'EDT' or 'EST' depending on DST
   * ```
   */
  static getAbbreviation(tz: string, timestamp: number = Date.now()): string {
    if (!this.isValid(tz)) {
      throw new Error(`Invalid timezone: ${tz}`);
    }

    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        timeZoneName: 'short'
      });

      const parts = formatter.formatToParts(new Date(timestamp));
      const timeZonePart = parts.find(part => part.type === 'timeZoneName');

      return timeZonePart?.value ?? '';
    } catch {
      return '';
    }
  }

  /**
   * Check if timezone observes DST at given time
   *
   * @param tz - IANA timezone
   * @param timestamp - Unix timestamp in milliseconds (default: now)
   * @returns True if in DST
   *
   * @example
   * ```typescript
   * Timezone.isDST('America/New_York', Date.now());
   * // true during summer, false during winter
   * ```
   */
  static isDST(tz: string, timestamp: number = Date.now()): boolean {
    if (!this.isValid(tz)) {
      throw new Error(`Invalid timezone: ${tz}`);
    }

    const year = new Date(timestamp).getUTCFullYear();
    const jan = Date.UTC(year, 0, 1);
    const jul = Date.UTC(year, 6, 1);

    // Standard offset is the smaller one (east-positive convention:
    // DST pushes the offset up, e.g. NY -300 -> -240)
    const stdOffset = Math.min(
      getOffsetMinutes(jan, tz),
      getOffsetMinutes(jul, tz)
    );

    return getOffsetMinutes(timestamp, tz) > stdOffset;
  }
}
