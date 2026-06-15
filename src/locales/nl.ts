/**
 * Dutch locale
 */

import type { Locale } from '../locale.js';

const units = {
  second: ['seconde', 'seconden'],
  minute: ['minuut', 'minuten'],
  hour: ['uur', 'uur'],
  day: ['dag', 'dagen'],
  month: ['maand', 'maanden'],
  year: ['jaar', 'jaar']
} as const;

const shortUnits = {
  second: 's', minute: 'min', hour: 'u', day: 'd', month: 'mnd', year: 'j'
} as const;

export const nl: Locale = {
  name: 'nl',
  months: [
    'januari', 'februari', 'maart', 'april', 'mei', 'juni',
    'juli', 'augustus', 'september', 'oktober', 'november', 'december'
  ],
  monthsShort: ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'],
  weekdays: ['maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag', 'zondag'],
  weekdaysShort: ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'],
  meridiem: (hour, lowercase) => {
    const m = hour < 12 ? 'AM' : 'PM';
    return lowercase ? m.toLowerCase() : m;
  },
  relativeTime: {
    future: 'over {0}',
    past: '{0} geleden',
    fewSeconds: 'een paar seconden',
    now: 'nu',
    units,
    shortUnits
  },
  calendar: {
    today: 'vandaag',
    tomorrow: 'morgen',
    yesterday: 'gisteren',
    nextWeek: 'volgende {0}',
    lastWeek: 'afgelopen {0}'
  },
  duration: {
    units,
    shortUnits,
    listSeparator: ', ',
    zero: '0 seconden',
    zeroShort: '0s'
  },
  dateFormats: {
    short:  'DD-MM-YYYY',
    medium: 'D MMM YYYY',
    long:   'D MMMM YYYY',
    full:   'dddd D MMMM YYYY'
  }
};
