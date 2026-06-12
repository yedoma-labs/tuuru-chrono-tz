/**
 * Turkish locale
 *
 * Turkish does not pluralise a noun that follows a number (5 dakika, not
 * 5 dakikalar), so units have a single form.
 */

import type { Locale } from '../locale.js';

const units = {
  second: ['saniye'],
  minute: ['dakika'],
  hour: ['saat'],
  day: ['gün'],
  month: ['ay'],
  year: ['yıl']
} as const;

const shortUnits = {
  second: 'sn', minute: 'dk', hour: 's', day: 'g', month: 'ay', year: 'y'
} as const;

export const tr: Locale = {
  name: 'tr',
  months: [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ],
  monthsShort: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
  weekdays: ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'],
  weekdaysShort: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
  meridiem: (hour) => (hour < 12 ? 'ÖÖ' : 'ÖS'),
  plural: () => 0,
  relativeTime: {
    future: '{0} sonra',
    past: '{0} önce',
    fewSeconds: 'birkaç saniye',
    now: 'şimdi',
    units,
    shortUnits
  },
  calendar: {
    today: 'bugün',
    tomorrow: 'yarın',
    yesterday: 'dün',
    nextWeek: 'gelecek {0}',
    lastWeek: 'geçen {0}'
  },
  duration: {
    units,
    shortUnits,
    listSeparator: ', ',
    zero: '0 saniye',
    zeroShort: '0sn'
  }
};
