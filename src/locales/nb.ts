/**
 * Norwegian (Bokmål) locale
 */

import type { Locale } from '../locale.js';

const units = {
  second: ['sekund', 'sekunder'],
  minute: ['minutt', 'minutter'],
  hour: ['time', 'timer'],
  day: ['dag', 'dager'],
  month: ['måned', 'måneder'],
  year: ['år', 'år']
} as const;

const shortUnits = {
  second: 's', minute: 'min', hour: 't', day: 'd', month: 'md', year: 'år'
} as const;

export const nb: Locale = {
  name: 'nb',
  months: [
    'januar', 'februar', 'mars', 'april', 'mai', 'juni',
    'juli', 'august', 'september', 'oktober', 'november', 'desember'
  ],
  monthsShort: ['jan.', 'feb.', 'mars', 'apr.', 'mai', 'juni', 'juli', 'aug.', 'sep.', 'okt.', 'nov.', 'des.'],
  weekdays: ['mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag', 'søndag'],
  weekdaysShort: ['man.', 'tir.', 'ons.', 'tor.', 'fre.', 'lør.', 'søn.'],
  meridiem: (hour, lowercase) => {
    const m = hour < 12 ? 'AM' : 'PM';
    return lowercase ? m.toLowerCase() : m;
  },
  relativeTime: {
    future: 'om {0}',
    past: '{0} siden',
    fewSeconds: 'noen sekunder',
    now: 'nå',
    units,
    shortUnits
  },
  calendar: {
    today: 'i dag',
    tomorrow: 'i morgen',
    yesterday: 'i går',
    nextWeek: 'neste {0}',
    lastWeek: 'forrige {0}'
  },
  duration: {
    units,
    shortUnits,
    listSeparator: ', ',
    zero: '0 sekunder',
    zeroShort: '0s'
  }
};
