/**
 * Swahili locale
 *
 * Swahili uses binary plurals. The singular and plural of time units come
 * from different noun classes (e.g. saa / masaa), so we list both forms.
 */

import type { Locale } from '../locale.js';

const units = {
  second: ['sekunde', 'sekunde'],
  minute: ['dakika', 'dakika'],
  hour: ['saa', 'masaa'],
  day: ['siku', 'siku'],
  month: ['mwezi', 'miezi'],
  year: ['mwaka', 'miaka']
} as const;

const shortUnits = {
  second: 'sek', minute: 'dak', hour: 'saa', day: 'siku', month: 'mwz', year: 'mwk'
} as const;

export const sw: Locale = {
  name: 'sw',
  months: [
    'Januari', 'Februari', 'Machi', 'Aprili', 'Mei', 'Juni',
    'Julai', 'Agosti', 'Septemba', 'Oktoba', 'Novemba', 'Desemba'
  ],
  monthsShort: ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ago', 'Sep', 'Okt', 'Nov', 'Des'],
  weekdays: ['Jumatatu', 'Jumanne', 'Jumatano', 'Alhamisi', 'Ijumaa', 'Jumamosi', 'Jumapili'],
  weekdaysShort: ['Jtt', 'Jwn', 'Jtn', 'Alh', 'Iju', 'Jms', 'Jpl'],
  meridiem: (hour) => (hour < 12 ? 'AM' : 'PM'),
  plural: (n) => (n === 1 ? 0 : 1),
  relativeTime: {
    future: 'baada ya {0}',
    past: '{0} iliyopita',
    fewSeconds: 'sekunde chache',
    now: 'sasa hivi',
    units,
    shortUnits
  },
  calendar: {
    today: 'leo',
    tomorrow: 'kesho',
    yesterday: 'jana',
    nextWeek: '{0} ijayo',
    lastWeek: '{0} iliyopita'
  },
  duration: {
    units,
    shortUnits,
    listSeparator: ', ',
    zero: '0 sekunde',
    zeroShort: '0sek'
  }
};
