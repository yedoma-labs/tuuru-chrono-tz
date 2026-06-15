/**
 * fil locale (auto-generated from CLDR)
 */

import type { Locale } from '../locale.js';

export const fil: Locale = {
  name: 'fil',
  months: [
    'Enero', 'Pebrero', 'Marso', 'Abril', 'Mayo', 'Hunyo', 'Hulyo', 'Agosto', 'Setyembre', 'Oktubre', 'Nobyembre', 'Disyembre'
  ],
  monthsShort: ['Ene', 'Peb', 'Mar', 'Abr', 'May', 'Hun', 'Hul', 'Ago', 'Set', 'Okt', 'Nob', 'Dis'],
  weekdays: ['Lunes', 'Martes', 'Miyerkules', 'Huwebes', 'Biyernes', 'Sabado', 'Linggo'],
  weekdaysShort: ['Lun', 'Mar', 'Miy', 'Huw', 'Biy', 'Sab', 'Lin'],
  meridiem: (hour) => hour < 12 ? 'AM' : 'PM',
  plural: (n) => n === 1 ? 0 : 1,
  relativeTime: {
    future: 'sa {0}',
    past: '{0} minuto ang nakalipas',
    fewSeconds: 'a few seconds',
    now: 'ngayon',
    units: {
      second: ['segundo', 'na segundo'],
      minute: ['minuto', 'na minuto'],
      hour: ['oras', 'na oras'],
      day: ['araw', 'na araw'],
      month: ['buwan', 'buwan'],
      year: ['taon', 'na taon']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' }
  },
  calendar: {
    today: 'ngayong araw',
    tomorrow: 'bukas',
    yesterday: 'kahapon',
    nextWeek: '{0}',
    lastWeek: '{0}'
  },
  duration: {
    units: {
      second: ['segundo', 'na segundo'],
      minute: ['minuto', 'na minuto'],
      hour: ['oras', 'na oras'],
      day: ['araw', 'na araw'],
      month: ['buwan', 'buwan'],
      year: ['taon', 'na taon']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' },
    listSeparator: ', ',
    zero: '0 na segundo',
    zeroShort: '0s'
  },
  dateFormats: {
    short:  'MM/DD/YYYY',
    medium: 'MMM D, YYYY',
    long:   'MMMM D, YYYY',
    full:   'dddd, MMMM D, YYYY'
  }
};
