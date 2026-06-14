/**
 * lv locale (auto-generated from CLDR)
 */

import type { Locale } from '../locale.js';

export const lv: Locale = {
  name: 'lv',
  months: [
    'janvāris', 'februāris', 'marts', 'aprīlis', 'maijs', 'jūnijs', 'jūlijs', 'augusts', 'septembris', 'oktobris', 'novembris', 'decembris'
  ],
  monthsShort: ['janv.', 'febr.', 'marts', 'apr.', 'maijs', 'jūn.', 'jūl.', 'aug.', 'sept.', 'okt.', 'nov.', 'dec.'],
  weekdays: ['pirmdiena', 'otrdiena', 'trešdiena', 'ceturtdiena', 'piektdiena', 'sestdiena', 'svētdiena'],
  weekdaysShort: ['pirmd.', 'otrd.', 'trešd.', 'ceturtd.', 'piektd.', 'sestd.', 'svētd.'],
  meridiem: (hour) => hour < 12 ? 'priekšpusdienā' : 'pēcpusdienā',
  plural: (n) => n % 10 === 1 && n % 100 !== 11 ? 0 : n % 10 === 0 || (n % 100 >= 11 && n % 100 <= 19) ? 2 : 1,
  relativeTime: {
    future: 'pēc {0}',
    past: 'pirms {0}',
    fewSeconds: 'a few seconds',
    now: 'tagad',
    units: {
      second: ['sekunde', 'sekundes'],
      minute: ['minūte', 'minūtes'],
      hour: ['stunda', 'stundas'],
      day: ['diena', 'dienas'],
      month: ['mēnesis', 'mēneši'],
      year: ['gads', 'gadi']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' }
  },
  calendar: {
    today: 'šodien',
    tomorrow: 'rīt',
    yesterday: 'vakar',
    nextWeek: '{0}',
    lastWeek: '{0}'
  },
  duration: {
    units: {
      second: ['sekunde', 'sekundes'],
      minute: ['minūte', 'minūtes'],
      hour: ['stunda', 'stundas'],
      day: ['diena', 'dienas'],
      month: ['mēnesis', 'mēneši'],
      year: ['gads', 'gadi']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' },
    listSeparator: ', ',
    zero: '0 sekundes',
    zeroShort: '0s'
  }
};
