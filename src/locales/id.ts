/**
 * Indonesian locale
 *
 * Indonesian does not inflect nouns for number, so every unit has a single
 * form and `plural` always returns 0.
 */

import type { Locale } from '../locale.js';

const units = {
  second: ['detik'],
  minute: ['menit'],
  hour: ['jam'],
  day: ['hari'],
  month: ['bulan'],
  year: ['tahun']
} as const;

const shortUnits = {
  second: 'dtk', minute: 'mnt', hour: 'j', day: 'h', month: 'bln', year: 'thn'
} as const;

export const id: Locale = {
  name: 'id',
  months: [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ],
  monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
  weekdays: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'],
  weekdaysShort: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
  meridiem: (hour) => (hour < 12 ? 'pagi' : 'malam'),
  plural: () => 0,
  relativeTime: {
    future: 'dalam {0}',
    past: '{0} yang lalu',
    fewSeconds: 'beberapa detik',
    now: 'sekarang',
    units,
    shortUnits
  },
  calendar: {
    today: 'hari ini',
    tomorrow: 'besok',
    yesterday: 'kemarin',
    nextWeek: '{0} depan',
    lastWeek: '{0} lalu'
  },
  duration: {
    units,
    shortUnits,
    listSeparator: ', ',
    zero: '0 detik',
    zeroShort: '0dtk'
  }
};
