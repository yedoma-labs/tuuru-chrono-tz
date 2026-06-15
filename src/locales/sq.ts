/**
 * sq locale (auto-generated from CLDR)
 */

import type { Locale } from '../locale.js';

export const sq: Locale = {
  name: 'sq',
  months: [
    'janar', 'shkurt', 'mars', 'prill', 'maj', 'qershor', 'korrik', 'gusht', 'shtator', 'tetor', 'nëntor', 'dhjetor'
  ],
  monthsShort: ['jan', 'shk', 'mar', 'pri', 'maj', 'qer', 'korr', 'gush', 'sht', 'tet', 'nën', 'dhj'],
  weekdays: ['e hënë', 'e martë', 'e mërkurë', 'e enjte', 'e premte', 'e shtunë', 'e diel'],
  weekdaysShort: ['Hën', 'Mar', 'Mër', 'Enj', 'Pre', 'Sht', 'Die'],
  meridiem: (hour) => hour < 12 ? 'e paradites' : 'e pasdites',
  plural: (n) => n === 1 ? 0 : 1,
  relativeTime: {
    future: 'pas {0}',
    past: '{0} minutë më parë',
    fewSeconds: 'a few seconds',
    now: 'tani',
    units: {
      second: ['sekondë', 'sekonda'],
      minute: ['minutë', 'minuta'],
      hour: ['orë', 'orë'],
      day: ['ditë', 'ditë'],
      month: ['muaj', 'muaj'],
      year: ['vit', 'vjet']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' }
  },
  calendar: {
    today: 'sot',
    tomorrow: 'nesër',
    yesterday: 'dje',
    nextWeek: '{0}',
    lastWeek: '{0}'
  },
  duration: {
    units: {
      second: ['sekondë', 'sekonda'],
      minute: ['minutë', 'minuta'],
      hour: ['orë', 'orë'],
      day: ['ditë', 'ditë'],
      month: ['muaj', 'muaj'],
      year: ['vit', 'vjet']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' },
    listSeparator: ', ',
    zero: '0 sekonda',
    zeroShort: '0s'
  },
  dateFormats: {
    short:  'DD.MM.YYYY',
    medium: 'D MMM YYYY',
    long:   'D MMMM YYYY',
    full:   'dddd, D MMMM YYYY'
  }
};
