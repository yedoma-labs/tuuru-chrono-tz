/**
 * Swedish locale
 */

import type { Locale } from '../locale.js';

const units = {
  second: ['sekund', 'sekunder'],
  minute: ['minut', 'minuter'],
  hour: ['timme', 'timmar'],
  day: ['dag', 'dagar'],
  month: ['månad', 'månader'],
  year: ['år', 'år']
} as const;

const shortUnits = {
  second: 's', minute: 'min', hour: 'tim', day: 'd', month: 'mån', year: 'år'
} as const;

export const sv: Locale = {
  name: 'sv',
  months: [
    'januari', 'februari', 'mars', 'april', 'maj', 'juni',
    'juli', 'augusti', 'september', 'oktober', 'november', 'december'
  ],
  monthsShort: ['jan.', 'feb.', 'mars', 'apr.', 'maj', 'juni', 'juli', 'aug.', 'sep.', 'okt.', 'nov.', 'dec.'],
  weekdays: ['måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag', 'söndag'],
  weekdaysShort: ['mån', 'tis', 'ons', 'tors', 'fre', 'lör', 'sön'],
  meridiem: (hour, lowercase) => {
    const m = hour < 12 ? 'fm' : 'em';
    return lowercase ? m : m.toUpperCase();
  },
  relativeTime: {
    future: 'om {0}',
    past: 'för {0} sedan',
    fewSeconds: 'några sekunder',
    now: 'nu',
    units,
    shortUnits
  },
  calendar: {
    today: 'i dag',
    tomorrow: 'i morgon',
    yesterday: 'i går',
    nextWeek: 'nästa {0}',
    lastWeek: 'förra {0}'
  },
  duration: {
    units,
    shortUnits,
    listSeparator: ', ',
    zero: '0 sekunder',
    zeroShort: '0s'
  }
};
