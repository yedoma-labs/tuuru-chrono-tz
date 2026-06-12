/**
 * Danish locale
 */

import type { Locale } from '../locale.js';

const units = {
  second: ['sekund', 'sekunder'],
  minute: ['minut', 'minutter'],
  hour: ['time', 'timer'],
  day: ['dag', 'dage'],
  month: ['måned', 'måneder'],
  year: ['år', 'år']
} as const;

const shortUnits = {
  second: 's', minute: 'min', hour: 't', day: 'd', month: 'md', year: 'år'
} as const;

export const da: Locale = {
  name: 'da',
  months: [
    'januar', 'februar', 'marts', 'april', 'maj', 'juni',
    'juli', 'august', 'september', 'oktober', 'november', 'december'
  ],
  monthsShort: ['jan.', 'feb.', 'mar.', 'apr.', 'maj', 'jun.', 'jul.', 'aug.', 'sep.', 'okt.', 'nov.', 'dec.'],
  weekdays: ['mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag', 'søndag'],
  weekdaysShort: ['man.', 'tir.', 'ons.', 'tor.', 'fre.', 'lør.', 'søn.'],
  meridiem: (hour, lowercase) => {
    const m = hour < 12 ? 'AM' : 'PM';
    return lowercase ? m.toLowerCase() : m;
  },
  relativeTime: {
    future: 'om {0}',
    past: '{0} siden',
    fewSeconds: 'få sekunder',
    now: 'nu',
    units,
    shortUnits
  },
  calendar: {
    today: 'i dag',
    tomorrow: 'i morgen',
    yesterday: 'i går',
    nextWeek: 'næste {0}',
    lastWeek: 'sidste {0}'
  },
  duration: {
    units,
    shortUnits,
    listSeparator: ', ',
    zero: '0 sekunder',
    zeroShort: '0s'
  }
};
