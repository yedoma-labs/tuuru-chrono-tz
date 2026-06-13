/**
 * Filipino / Tagalog locale
 *
 * Filipino has complex plural rules in general, but time unit nouns do not
 * inflect for number in practice, so `plural` always returns 0.
 */

import type { Locale } from '../locale.js';

const units = {
  second: ['segundo'],
  minute: ['minuto'],
  hour: ['oras'],
  day: ['araw'],
  month: ['buwan'],
  year: ['taon']
} as const;

const shortUnits = {
  second: 'seg', minute: 'min', hour: 'oras', day: 'araw', month: 'buwan', year: 'taon'
} as const;

export const tl: Locale = {
  name: 'tl',
  months: [
    'Enero', 'Pebrero', 'Marso', 'Abril', 'Mayo', 'Hunyo',
    'Hulyo', 'Agosto', 'Setyembre', 'Oktubre', 'Nobyembre', 'Disyembre'
  ],
  monthsShort: ['Ene', 'Peb', 'Mar', 'Abr', 'Mayo', 'Hun', 'Hul', 'Ago', 'Set', 'Okt', 'Nob', 'Dis'],
  weekdays: ['Lunes', 'Martes', 'Miyerkules', 'Huwebes', 'Biyernes', 'Sabado', 'Linggo'],
  weekdaysShort: ['Lun', 'Mar', 'Miy', 'Huw', 'Biy', 'Sab', 'Lin'],
  meridiem: (hour) => (hour < 12 ? 'AM' : 'PM'),
  plural: () => 0,
  relativeTime: {
    future: 'sa {0}',
    past: '{0} na ang nakalipas',
    fewSeconds: 'ilang segundo',
    now: 'ngayon',
    units,
    shortUnits
  },
  calendar: {
    today: 'ngayon',
    tomorrow: 'bukas',
    yesterday: 'kahapon',
    nextWeek: '{0} ng susunod',
    lastWeek: '{0} ng nakaraang'
  },
  duration: {
    units,
    shortUnits,
    listSeparator: ', ',
    zero: '0 segundo',
    zeroShort: '0seg'
  }
};
