/**
 * et locale (auto-generated from CLDR)
 */

import type { Locale } from '../locale.js';

export const et: Locale = {
  name: 'et',
  months: [
    'jaanuar', 'veebruar', 'märts', 'aprill', 'mai', 'juuni', 'juuli', 'august', 'september', 'oktoober', 'november', 'detsember'
  ],
  monthsShort: ['jaan', 'veebr', 'märts', 'apr', 'mai', 'juuni', 'juuli', 'aug', 'sept', 'okt', 'nov', 'dets'],
  weekdays: ['esmaspäev', 'teisipäev', 'kolmapäev', 'neljapäev', 'reede', 'laupäev', 'pühapäev'],
  weekdaysShort: ['E', 'T', 'K', 'N', 'R', 'L', 'P'],
  meridiem: (hour) => hour < 12 ? 'AM' : 'PM',
  plural: (n) => n === 1 ? 0 : 1,
  relativeTime: {
    future: '{0} minuti pärast',
    past: '{0} minuti eest',
    fewSeconds: 'a few seconds',
    now: 'nüüd',
    units: {
      second: ['sekund', 'sekundit'],
      minute: ['minut', 'minutit'],
      hour: ['tund', 'tundi'],
      day: ['ööpäev', 'ööpäeva'],
      month: ['kuu', 'kuud'],
      year: ['aasta', 'aastat']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' }
  },
  calendar: {
    today: 'täna',
    tomorrow: 'homme',
    yesterday: 'eile',
    nextWeek: '{0}',
    lastWeek: '{0}'
  },
  duration: {
    units: {
      second: ['sekund', 'sekundit'],
      minute: ['minut', 'minutit'],
      hour: ['tund', 'tundi'],
      day: ['ööpäev', 'ööpäeva'],
      month: ['kuu', 'kuud'],
      year: ['aasta', 'aastat']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' },
    listSeparator: ', ',
    zero: '0 sekundit',
    zeroShort: '0s'
  },
  dateFormats: {
    short:  'DD.MM.YYYY',
    medium: 'D. MMM YYYY',
    long:   'D. MMMM YYYY',
    full:   'dddd, D. MMMM YYYY'
  }
};
