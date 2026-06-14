/**
 * uz locale (auto-generated from CLDR)
 */

import type { Locale } from '../locale.js';

export const uz: Locale = {
  name: 'uz',
  months: [
    'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'
  ],
  monthsShort: ['yan', 'fev', 'mar', 'apr', 'may', 'iyn', 'iyl', 'avg', 'sen', 'okt', 'noy', 'dek'],
  weekdays: ['dushanba', 'seshanba', 'chorshanba', 'payshanba', 'juma', 'shanba', 'yakshanba'],
  weekdaysShort: ['Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan', 'Yak'],
  meridiem: (hour) => hour < 12 ? 'TO' : 'TK',
  plural: (n) => n === 1 ? 0 : 1,
  relativeTime: {
    future: '{0} daqiqadan keyin',
    past: '{0} daqiqa oldin',
    fewSeconds: 'a few seconds',
    now: 'hozir',
    units: {
      second: ['soniya', 'soniya'],
      minute: ['daqiqa', 'daqiqa'],
      hour: ['soat', 'soat'],
      day: ['kun', 'kun'],
      month: ['oy', 'oy'],
      year: ['yil', 'yil']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' }
  },
  calendar: {
    today: 'bugun',
    tomorrow: 'ertaga',
    yesterday: 'kecha',
    nextWeek: '{0}',
    lastWeek: '{0}'
  },
  duration: {
    units: {
      second: ['soniya', 'soniya'],
      minute: ['daqiqa', 'daqiqa'],
      hour: ['soat', 'soat'],
      day: ['kun', 'kun'],
      month: ['oy', 'oy'],
      year: ['yil', 'yil']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' },
    listSeparator: ', ',
    zero: '0 soniya',
    zeroShort: '0s'
  }
};
