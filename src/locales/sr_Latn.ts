/**
 * sr-Latn locale (auto-generated from CLDR)
 */

import type { Locale } from '../locale.js';

export const sr_Latn: Locale = {
  name: 'sr-Latn',
  months: [
    'januar', 'februar', 'mart', 'april', 'maj', 'jun', 'jul', 'avgust', 'septembar', 'oktobar', 'novembar', 'decembar'
  ],
  monthsShort: ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'avg', 'sep', 'okt', 'nov', 'dec'],
  weekdays: ['ponedeljak', 'utorak', 'sreda', 'četvrtak', 'petak', 'subota', 'nedelja'],
  weekdaysShort: ['pon', 'uto', 'sre', 'čet', 'pet', 'sub', 'ned'],
  meridiem: (hour) => hour < 12 ? 'pre podne' : 'po podne',
  plural: (n) => (n % 10 === 1 && n % 100 !== 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2),
  relativeTime: {
    future: 'za {0}',
    past: 'pre {0}',
    fewSeconds: 'a few seconds',
    now: 'sada',
    units: {
      second: ['sekunda', 'sekundi'],
      minute: ['minut', 'minuta'],
      hour: ['sat', 'sati'],
      day: ['dan', 'dana'],
      month: ['mesec', 'meseci'],
      year: ['godina', 'godina']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' }
  },
  calendar: {
    today: 'danas',
    tomorrow: 'sutra',
    yesterday: 'juče',
    nextWeek: '{0}',
    lastWeek: '{0}'
  },
  duration: {
    units: {
      second: ['sekunda', 'sekundi'],
      minute: ['minut', 'minuta'],
      hour: ['sat', 'sati'],
      day: ['dan', 'dana'],
      month: ['mesec', 'meseci'],
      year: ['godina', 'godina']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' },
    listSeparator: ', ',
    zero: '0 sekundi',
    zeroShort: '0s'
  }
};
