/**
 * af locale (auto-generated from CLDR)
 */

import type { Locale } from '../locale.js';

export const af: Locale = {
  name: 'af',
  months: [
    'Januarie', 'Februarie', 'Maart', 'April', 'Mei', 'Junie', 'Julie', 'Augustus', 'September', 'Oktober', 'November', 'Desember'
  ],
  monthsShort: ['Jan.', 'Feb.', 'Mrt.', 'Apr.', 'Mei', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Okt.', 'Nov.', 'Des.'],
  weekdays: ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrydag', 'Saterdag', 'Sondag'],
  weekdaysShort: ['Ma.', 'Di.', 'Wo.', 'Do.', 'Vr.', 'Sa.', 'So.'],
  meridiem: (hour) => hour < 12 ? 'vm.' : 'nm.',
  plural: (n) => n === 1 ? 0 : 1,
  relativeTime: {
    future: 'oor {0}',
    past: '{0} minuut gelede',
    fewSeconds: 'a few seconds',
    now: 'nou',
    units: {
      second: ['sekonde', 'sekondes'],
      minute: ['minuut', 'minute'],
      hour: ['uur', 'uur'],
      day: ['dag', 'dae'],
      month: ['maand', 'maande'],
      year: ['jaar', 'jaar']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' }
  },
  calendar: {
    today: 'vandag',
    tomorrow: 'môre',
    yesterday: 'gister',
    nextWeek: '{0}',
    lastWeek: '{0}'
  },
  duration: {
    units: {
      second: ['sekonde', 'sekondes'],
      minute: ['minuut', 'minute'],
      hour: ['uur', 'uur'],
      day: ['dag', 'dae'],
      month: ['maand', 'maande'],
      year: ['jaar', 'jaar']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' },
    listSeparator: ', ',
    zero: '0 sekondes',
    zeroShort: '0s'
  }
};
