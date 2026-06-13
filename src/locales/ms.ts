/**
 * Malay locale
 *
 * Malay does not inflect nouns for number (like Indonesian), so every unit
 * has a single form and `plural` always returns 0.
 */

import type { Locale } from '../locale.js';

const units = {
  second: ['saat'],
  minute: ['minit'],
  hour: ['jam'],
  day: ['hari'],
  month: ['bulan'],
  year: ['tahun']
} as const;

const shortUnits = {
  second: 's', minute: 'min', hour: 'j', day: 'h', month: 'bln', year: 'thn'
} as const;

export const ms: Locale = {
  name: 'ms',
  months: [
    'Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun',
    'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember'
  ],
  monthsShort: ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ogo', 'Sep', 'Okt', 'Nov', 'Dis'],
  weekdays: ['Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu', 'Ahad'],
  weekdaysShort: ['Isn', 'Sel', 'Rab', 'Kha', 'Jum', 'Sab', 'Aha'],
  meridiem: (hour) => (hour < 12 ? 'PG' : 'PTG'),
  plural: () => 0,
  relativeTime: {
    future: 'dalam {0}',
    past: '{0} yang lalu',
    fewSeconds: 'beberapa saat',
    now: 'sekarang',
    units,
    shortUnits
  },
  calendar: {
    today: 'hari ini',
    tomorrow: 'esok',
    yesterday: 'semalam',
    nextWeek: '{0} depan',
    lastWeek: '{0} lalu'
  },
  duration: {
    units,
    shortUnits,
    listSeparator: ', ',
    zero: '0 saat',
    zeroShort: '0s'
  }
};
