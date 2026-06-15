/**
 * be locale (auto-generated from CLDR)
 */

import type { Locale } from '../locale.js';

export const be: Locale = {
  name: 'be',
  months: [
    'студзеня', 'лютага', 'сакавіка', 'красавіка', 'мая', 'чэрвеня', 'ліпеня', 'жніўня', 'верасня', 'кастрычніка', 'лістапада', 'снежня'
  ],
  monthsShort: ['сту', 'лют', 'сак', 'кра', 'мая', 'чэр', 'ліп', 'жні', 'вер', 'кас', 'ліс', 'сне'],
  weekdays: ['панядзелак', 'аўторак', 'серада', 'чацвер', 'пятніца', 'субота', 'нядзеля'],
  weekdaysShort: ['пн', 'аў', 'ср', 'чц', 'пт', 'сб', 'нд'],
  meridiem: (hour) => hour < 12 ? 'AM' : 'PM',
  plural: (n) => (n % 10 === 1 && n % 100 !== 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2),
  relativeTime: {
    future: 'праз {0}',
    past: '{0} хвіліну таму',
    fewSeconds: 'a few seconds',
    now: 'цяпер',
    units: {
      second: ['секунда', 'секунды'],
      minute: ['хвіліна', 'хвіліны'],
      hour: ['гадзіна', 'гадзіны'],
      day: ['суткі', 'сутак'],
      month: ['месяц', 'месяца'],
      year: ['год', 'года']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' }
  },
  calendar: {
    today: 'сёння',
    tomorrow: 'заўтра',
    yesterday: 'учора',
    nextWeek: '{0}',
    lastWeek: '{0}'
  },
  duration: {
    units: {
      second: ['секунда', 'секунды'],
      minute: ['хвіліна', 'хвіліны'],
      hour: ['гадзіна', 'гадзіны'],
      day: ['суткі', 'сутак'],
      month: ['месяц', 'месяца'],
      year: ['год', 'года']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' },
    listSeparator: ', ',
    zero: '0 секунды',
    zeroShort: '0s'
  },
  dateFormats: {
    short:  'DD.MM.YYYY',
    medium: 'D MMM YYYY г.',
    long:   'D MMMM YYYY г.',
    full:   'dddd, D MMMM YYYY г.'
  }
};
