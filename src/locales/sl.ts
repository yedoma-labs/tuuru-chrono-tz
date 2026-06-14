/**
 * sl locale (auto-generated from CLDR)
 */

import type { Locale } from '../locale.js';

export const sl: Locale = {
  name: 'sl',
  months: [
    'januar', 'februar', 'marec', 'april', 'maj', 'junij', 'julij', 'avgust', 'september', 'oktober', 'november', 'december'
  ],
  monthsShort: ['jan.', 'feb.', 'mar.', 'apr.', 'maj', 'jun.', 'jul.', 'avg.', 'sep.', 'okt.', 'nov.', 'dec.'],
  weekdays: ['ponedeljek', 'torek', 'sreda', 'četrtek', 'petek', 'sobota', 'nedelja'],
  weekdaysShort: ['pon.', 'tor.', 'sre.', 'čet.', 'pet.', 'sob.', 'ned.'],
  meridiem: (hour) => hour < 12 ? 'dop.' : 'pop.',
  plural: (n) => n === 1 ? 0 : n === 2 ? 1 : n !== 8 && n !== 11 ? 2 : 3,
  relativeTime: {
    future: 'čez {0}',
    past: 'pred {0}',
    fewSeconds: 'a few seconds',
    now: 'zdaj',
    units: {
      second: ['sekunda', 'sekunde', 'sekund'],
      minute: ['minuta', 'minute', 'minut'],
      hour: ['ura', 'ure', 'ur'],
      day: ['dan', 'dni', 'dni'],
      month: ['mesec', 'mesecev', 'mesecev'],
      year: ['leto', 'let', 'let']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' }
  },
  calendar: {
    today: 'danes',
    tomorrow: 'jutri',
    yesterday: 'včeraj',
    nextWeek: '{0}',
    lastWeek: '{0}'
  },
  duration: {
    units: {
      second: ['sekunda', 'sekunde', 'sekund'],
      minute: ['minuta', 'minute', 'minut'],
      hour: ['ura', 'ure', 'ur'],
      day: ['dan', 'dni', 'dni'],
      month: ['mesec', 'mesecev', 'mesecev'],
      year: ['leto', 'let', 'let']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' },
    listSeparator: ', ',
    zero: '0 sekund',
    zeroShort: '0s'
  }
};
