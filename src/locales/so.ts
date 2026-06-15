/**
 * so locale (auto-generated from CLDR)
 */

import type { Locale } from '../locale.js';

export const so: Locale = {
  name: 'so',
  months: [
    'Bisha Koobaad', 'Bisha Labaad', 'Bisha Saddexaad', 'Bisha Afraad', 'Bisha Shanaad', 'Bisha Lixaad', 'Bisha Todobaad', 'Bisha Sideedaad', 'Bisha Sagaalaad', 'Bisha Tobnaad', 'Bisha Kow iyo Tobnaad', 'Bisha Laba iyo Tobnaad'
  ],
  monthsShort: ['Jan', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Lul', 'Ogs', 'Seb', 'Okt', 'Nof', 'Dis'],
  weekdays: ['Isniin', 'Talaado', 'Arbaco', 'Khamiis', 'Jimco', 'Sabti', 'Axad'],
  weekdaysShort: ['Isn', 'Tldo', 'Arbc', 'Khms', 'Jmc', 'Sbti', 'Axd'],
  meridiem: (hour) => hour < 12 ? 'GH' : 'GD',
  plural: (n) => n === 1 ? 0 : 1,
  relativeTime: {
    future: '{0} daqiiqad',
    past: '{0} daqiiqad kahor',
    fewSeconds: 'a few seconds',
    now: 'Imika',
    units: {
      second: ['ilbiriqsi', 'ilbiriqsi'],
      minute: ['daqiiqad', 'daqiiqo'],
      hour: ['saacad', 'saacadood'],
      day: ['maalin', 'maalmood'],
      month: ['bil', 'bilood'],
      year: ['Sannad', 'Sannado']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' }
  },
  calendar: {
    today: 'Maanta',
    tomorrow: 'Berri',
    yesterday: 'Shalay',
    nextWeek: '{0}',
    lastWeek: '{0}'
  },
  duration: {
    units: {
      second: ['ilbiriqsi', 'ilbiriqsi'],
      minute: ['daqiiqad', 'daqiiqo'],
      hour: ['saacad', 'saacadood'],
      day: ['maalin', 'maalmood'],
      month: ['bil', 'bilood'],
      year: ['Sannad', 'Sannado']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' },
    listSeparator: ', ',
    zero: '0 ilbiriqsi',
    zeroShort: '0s'
  },
  dateFormats: {
    short:  'DD/MM/YYYY',
    medium: 'D MMM YYYY',
    long:   'D MMMM YYYY',
    full:   'dddd, D MMMM YYYY'
  }
};
