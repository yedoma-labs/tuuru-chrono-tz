/**
 * lt locale (auto-generated from CLDR)
 */

import type { Locale } from '../locale.js';

export const lt: Locale = {
  name: 'lt',
  months: [
    'sausio', 'vasario', 'kovo', 'balandžio', 'gegužės', 'birželio', 'liepos', 'rugpjūčio', 'rugsėjo', 'spalio', 'lapkričio', 'gruodžio'
  ],
  monthsShort: ['saus.', 'vas.', 'kov.', 'bal.', 'geg.', 'birž.', 'liep.', 'rugp.', 'rugs.', 'spal.', 'lapkr.', 'gruod.'],
  weekdays: ['pirmadienis', 'antradienis', 'trečiadienis', 'ketvirtadienis', 'penktadienis', 'šeštadienis', 'sekmadienis'],
  weekdaysShort: ['pr', 'an', 'tr', 'kt', 'pn', 'št', 'sk'],
  meridiem: (hour) => hour < 12 ? 'priešpiet' : 'popiet',
  plural: (n) => (n % 10 === 1 && n % 100 !== 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2),
  relativeTime: {
    future: 'po {0}',
    past: 'prieš {0}',
    fewSeconds: 'a few seconds',
    now: 'dabar',
    units: {
      second: ['sekundė', 'sekundžių'],
      minute: ['minutė', 'minučių'],
      hour: ['valanda', 'valandų'],
      day: ['diena', 'dienų'],
      month: ['mėnuo', 'mėnesių'],
      year: ['metai', 'metų']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' }
  },
  calendar: {
    today: 'šiandien',
    tomorrow: 'rytoj',
    yesterday: 'vakar',
    nextWeek: '{0}',
    lastWeek: '{0}'
  },
  duration: {
    units: {
      second: ['sekundė', 'sekundžių'],
      minute: ['minutė', 'minučių'],
      hour: ['valanda', 'valandų'],
      day: ['diena', 'dienų'],
      month: ['mėnuo', 'mėnesių'],
      year: ['metai', 'metų']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' },
    listSeparator: ', ',
    zero: '0 sekundžių',
    zeroShort: '0s'
  }
};
