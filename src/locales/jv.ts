/**
 * jv locale (auto-generated from CLDR)
 */

import type { Locale } from '../locale.js';

export const jv: Locale = {
  name: 'jv',
  months: [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ],
  monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'],
  weekdays: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Ahad'],
  weekdaysShort: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Ahad'],
  meridiem: (hour) => hour < 12 ? 'Isuk' : 'Wengi',
  plural: () => 0,
  relativeTime: {
    future: 'in {0}',
    past: '{0} ago',
    fewSeconds: 'a few seconds',
    now: 'saiki',
    units: {
      second: ['detik'],
      minute: ['menit'],
      hour: ['jam'],
      day: ['dina'],
      month: ['sasi'],
      year: ['taun']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' }
  },
  calendar: {
    today: 'dino iki',
    tomorrow: 'sesuk',
    yesterday: 'wingi',
    nextWeek: '{0}',
    lastWeek: '{0}'
  },
  duration: {
    units: {
      second: ['detik'],
      minute: ['menit'],
      hour: ['jam'],
      day: ['dina'],
      month: ['sasi'],
      year: ['taun']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' },
    listSeparator: ', ',
    zero: '0 detik',
    zeroShort: '0s'
  },
  dateFormats: {
    short:  'DD/MM/YYYY',
    medium: 'D MMM YYYY',
    long:   'D MMMM YYYY',
    full:   'dddd, D MMMM YYYY'
  }
};
