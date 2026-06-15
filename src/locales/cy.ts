/**
 * cy locale (auto-generated from CLDR)
 */

import type { Locale } from '../locale.js';

export const cy: Locale = {
  name: 'cy',
  months: [
    'Ionawr', 'Chwefror', 'Mawrth', 'Ebrill', 'Mai', 'Mehefin', 'Gorffennaf', 'Awst', 'Medi', 'Hydref', 'Tachwedd', 'Rhagfyr'
  ],
  monthsShort: ['Ion', 'Chwef', 'Maw', 'Ebr', 'Mai', 'Meh', 'Gorff', 'Awst', 'Medi', 'Hyd', 'Tach', 'Rhag'],
  weekdays: ['Dydd Llun', 'Dydd Mawrth', 'Dydd Mercher', 'Dydd Iau', 'Dydd Gwener', 'Dydd Sadwrn', 'Dydd Sul'],
  weekdaysShort: ['Llun', 'Maw', 'Mer', 'Iau', 'Gwen', 'Sad', 'Sul'],
  meridiem: (hour) => hour < 12 ? 'yb' : 'yh',
  plural: (n) => n === 1 ? 0 : 1,
  relativeTime: {
    future: 'ymhen {0}',
    past: '{0} munud yn ôl',
    fewSeconds: 'a few seconds',
    now: 'nawr',
    units: {
      second: ['eiliad', 'eiliad'],
      minute: ['munud', 'munud'],
      hour: ['awr', 'awr'],
      day: ['diwrnod', 'diwrnod'],
      month: ['mis', 'mis'],
      year: ['flwyddyn', 'mlynedd']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' }
  },
  calendar: {
    today: 'heddiw',
    tomorrow: 'yfory',
    yesterday: 'ddoe',
    nextWeek: '{0}',
    lastWeek: '{0}'
  },
  duration: {
    units: {
      second: ['eiliad', 'eiliad'],
      minute: ['munud', 'munud'],
      hour: ['awr', 'awr'],
      day: ['diwrnod', 'diwrnod'],
      month: ['mis', 'mis'],
      year: ['flwyddyn', 'mlynedd']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' },
    listSeparator: ', ',
    zero: '0 eiliad',
    zeroShort: '0s'
  },
  dateFormats: {
    short:  'DD/MM/YYYY',
    medium: 'D MMM YYYY',
    long:   'D MMMM YYYY',
    full:   'dddd, D MMMM YYYY'
  }
};
