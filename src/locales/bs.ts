/**
 * bs locale (auto-generated from CLDR)
 */

import type { Locale } from '../locale.js';

export const bs: Locale = {
  name: 'bs',
  months: [
    'januar', 'februar', 'mart', 'april', 'maj', 'juni', 'juli', 'august', 'septembar', 'oktobar', 'novembar', 'decembar'
  ],
  monthsShort: ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'],
  weekdays: ['ponedjeljak', 'utorak', 'srijeda', 'četvrtak', 'petak', 'subota', 'nedjelja'],
  weekdaysShort: ['pon', 'uto', 'sri', 'čet', 'pet', 'sub', 'ned'],
  meridiem: (hour) => hour < 12 ? 'prijepodne' : 'popodne',
  plural: (n) => (n % 10 === 1 && n % 100 !== 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2),
  relativeTime: {
    future: 'za {0}',
    past: 'prije {0}',
    fewSeconds: 'a few seconds',
    now: 'sada',
    units: {
      second: ['sekunda', 'sekundi'],
      minute: ['minuta', 'minuta'],
      hour: ['sat', 'sati'],
      day: ['dan', 'dana'],
      month: ['mjesec', 'mjeseci'],
      year: ['godina', 'godina']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' }
  },
  calendar: {
    today: 'danas',
    tomorrow: 'sutra',
    yesterday: 'jučer',
    nextWeek: '{0}',
    lastWeek: '{0}'
  },
  duration: {
    units: {
      second: ['sekunda', 'sekundi'],
      minute: ['minuta', 'minuta'],
      hour: ['sat', 'sati'],
      day: ['dan', 'dana'],
      month: ['mjesec', 'mjeseci'],
      year: ['godina', 'godina']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' },
    listSeparator: ', ',
    zero: '0 sekundi',
    zeroShort: '0s'
  }
};
