/**
 * az locale (auto-generated from CLDR)
 */

import type { Locale } from '../locale.js';

export const az: Locale = {
  name: 'az',
  months: [
    'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avqust', 'sentyabr', 'oktyabr', 'noyabr', 'dekabr'
  ],
  monthsShort: ['yan', 'fev', 'mar', 'apr', 'may', 'iyn', 'iyl', 'avq', 'sen', 'okt', 'noy', 'dek'],
  weekdays: ['bazar ertəsi', 'çərşənbə axşamı', 'çərşənbə', 'cümə axşamı', 'cümə', 'şənbə', 'bazar'],
  weekdaysShort: ['B.e.', 'Ç.a.', 'Ç.', 'C.a.', 'C.', 'Ş.', 'B.'],
  meridiem: (hour) => hour < 12 ? 'AM' : 'PM',
  plural: (n) => n === 1 ? 0 : 1,
  relativeTime: {
    future: '{0} dəqiqə ərzində',
    past: '{0} dəqiqə öncə',
    fewSeconds: 'a few seconds',
    now: 'indi',
    units: {
      second: ['saniyə', 'saniyə'],
      minute: ['dəqiqə', 'dəqiqə'],
      hour: ['saat', 'saat'],
      day: ['gün', 'gün'],
      month: ['ay', 'ay'],
      year: ['il', 'il']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' }
  },
  calendar: {
    today: 'bu gün',
    tomorrow: 'sabah',
    yesterday: 'dünən',
    nextWeek: '{0}',
    lastWeek: '{0}'
  },
  duration: {
    units: {
      second: ['saniyə', 'saniyə'],
      minute: ['dəqiqə', 'dəqiqə'],
      hour: ['saat', 'saat'],
      day: ['gün', 'gün'],
      month: ['ay', 'ay'],
      year: ['il', 'il']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' },
    listSeparator: ', ',
    zero: '0 saniyə',
    zeroShort: '0s'
  },
  dateFormats: {
    short:  'DD.MM.YYYY',
    medium: 'D MMM YYYY',
    long:   'D MMMM YYYY',
    full:   'D MMMM YYYY, dddd'
  }
};
