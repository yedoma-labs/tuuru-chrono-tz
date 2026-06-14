/**
 * zu locale (auto-generated from CLDR)
 */

import type { Locale } from '../locale.js';

export const zu: Locale = {
  name: 'zu',
  months: [
    'Januwari', 'Februwari', 'Mashi', 'Ephreli', 'Meyi', 'Juni', 'Julayi', 'Agasti', 'Septhemba', 'Okthoba', 'Novemba', 'Disemba'
  ],
  monthsShort: ['Jan', 'Feb', 'Mas', 'Eph', 'Mey', 'Jun', 'Jul', 'Aga', 'Sep', 'Okt', 'Nov', 'Dis'],
  weekdays: ['UMsombuluko', 'ULwesibili', 'ULwesithathu', 'ULwesine', 'ULwesihlanu', 'UMgqibelo', 'ISonto'],
  weekdaysShort: ['Mso', 'Bil', 'Tha', 'Sin', 'Hla', 'Mgq', 'Son'],
  meridiem: (hour) => hour < 12 ? 'AM' : 'PM',
  plural: (n) => n === 1 ? 0 : 1,
  relativeTime: {
    future: 'kuminithi elingu- {0}',
    past: '{0} iminithi eledlule',
    fewSeconds: 'a few seconds',
    now: 'manje',
    units: {
      second: ['isekhondi', 'amasekhondi'],
      minute: ['iminithi', 'amaminithi'],
      hour: ['ihora', 'amahora'],
      day: ['usuku', 'izinsuku'],
      month: ['inyanga', 'izinyanga'],
      year: ['y', 'y']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' }
  },
  calendar: {
    today: 'namhlanje',
    tomorrow: 'kusasa',
    yesterday: 'izolo',
    nextWeek: '{0}',
    lastWeek: '{0}'
  },
  duration: {
    units: {
      second: ['isekhondi', 'amasekhondi'],
      minute: ['iminithi', 'amaminithi'],
      hour: ['ihora', 'amahora'],
      day: ['usuku', 'izinsuku'],
      month: ['inyanga', 'izinyanga'],
      year: ['y', 'y']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' },
    listSeparator: ', ',
    zero: '0 amasekhondi',
    zeroShort: '0s'
  }
};
