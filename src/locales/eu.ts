/**
 * eu locale (auto-generated from CLDR)
 */

import type { Locale } from '../locale.js';

export const eu: Locale = {
  name: 'eu',
  months: [
    'urtarrila', 'otsaila', 'martxoa', 'apirila', 'maiatza', 'ekaina', 'uztaila', 'abuztua', 'iraila', 'urria', 'azaroa', 'abendua'
  ],
  monthsShort: ['urt.', 'ots.', 'mar.', 'api.', 'mai.', 'eka.', 'uzt.', 'abu.', 'ira.', 'urr.', 'aza.', 'abe.'],
  weekdays: ['astelehena', 'asteartea', 'asteazkena', 'osteguna', 'ostirala', 'larunbata', 'igandea'],
  weekdaysShort: ['al.', 'ar.', 'az.', 'og.', 'or.', 'lr.', 'ig.'],
  meridiem: (hour) => hour < 12 ? 'AM' : 'PM',
  plural: (n) => n === 1 ? 0 : 1,
  relativeTime: {
    future: '{0} minutu barru',
    past: 'Duela {0}',
    fewSeconds: 'a few seconds',
    now: 'orain',
    units: {
      second: ['segundo', 'segundo'],
      minute: ['minutu', 'minutu'],
      hour: ['ordu', 'ordu'],
      day: ['egun', 'egun'],
      month: ['hilabete', 'hilabete'],
      year: ['urte', 'urte']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' }
  },
  calendar: {
    today: 'gaur',
    tomorrow: 'bihar',
    yesterday: 'atzo',
    nextWeek: '{0}',
    lastWeek: '{0}'
  },
  duration: {
    units: {
      second: ['segundo', 'segundo'],
      minute: ['minutu', 'minutu'],
      hour: ['ordu', 'ordu'],
      day: ['egun', 'egun'],
      month: ['hilabete', 'hilabete'],
      year: ['urte', 'urte']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' },
    listSeparator: ', ',
    zero: '0 segundo',
    zeroShort: '0s'
  },
  dateFormats: {
    short:  'YYYY/MM/DD',
    medium: 'YYYY[e]ko MMM D',
    long:   'YYYY[e]ko MMMM D',
    full:   'dddd, YYYY[e]ko MMMM D'
  }
};
