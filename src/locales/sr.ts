/**
 * Serbian locale (Cyrillic)
 *
 * Like Croatian: case by direction (future "за" + accusative, past "пре" +
 * genitive, bare duration nominative) and the CLDR one / few / other number
 * rule, selected per case table by `formatCount`.
 */

import type { Locale, RelativeUnit } from '../locale.js';

type Forms = Record<RelativeUnit, readonly [string, string, string]>;

const NOMINATIVE: Forms = {
  second: ['секунда', 'секунде', 'секунди'],
  minute: ['минут', 'минута', 'минута'],
  hour: ['сат', 'сата', 'сати'],
  day: ['дан', 'дана', 'дана'],
  month: ['месец', 'месеца', 'месеци'],
  year: ['година', 'године', 'година']
};
const ACCUSATIVE: Forms = {
  second: ['секунду', 'секунде', 'секунди'],
  minute: ['минут', 'минута', 'минута'],
  hour: ['сат', 'сата', 'сати'],
  day: ['дан', 'дана', 'дана'],
  month: ['месец', 'месеца', 'месеци'],
  year: ['годину', 'године', 'година']
};
const GENITIVE: Forms = {
  second: ['секунде', 'секунде', 'секунди'],
  minute: ['минута', 'минута', 'минута'],
  hour: ['сата', 'сата', 'сати'],
  day: ['дана', 'дана', 'дана'],
  month: ['месеца', 'месеца', 'месеци'],
  year: ['године', 'године', 'година']
};

// CLDR Serbian: one / few / many → 0 / 1 / 2
const category = (n: number): number => {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 0;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 1;
  return 2;
};

// Weekday gender (M M F M M F F, Monday-first), accusative weekday + adjective.
const SR_ACC_DAY = ['понедељак', 'уторак', 'среду', 'четвртак', 'петак', 'суботу', 'недељу'];
const SR_NEXT = ['следећи', 'следећи', 'следећу', 'следећи', 'следећи', 'следећу', 'следећу'];
const SR_LAST = ['прошли', 'прошли', 'прошлу', 'прошли', 'прошли', 'прошлу', 'прошлу'];

const units = NOMINATIVE;
const shortUnits = {
  second: 'с', minute: 'мин', hour: 'ч', day: 'д', month: 'мес', year: 'г'
} as const;

export const sr: Locale = {
  name: 'sr',
  months: [
    'јануар', 'фебруар', 'март', 'април', 'мај', 'јун',
    'јул', 'август', 'септембар', 'октобар', 'новембар', 'децембар'
  ],
  monthsShort: ['јан', 'феб', 'мар', 'апр', 'мај', 'јун', 'јул', 'авг', 'сеп', 'окт', 'нов', 'дец'],
  weekdays: ['понедељак', 'уторак', 'среда', 'четвртак', 'петак', 'субота', 'недеља'],
  weekdaysShort: ['пон', 'уто', 'сре', 'чет', 'пет', 'суб', 'нед'],
  meridiem: (hour) => (hour < 12 ? 'пре подне' : 'по подне'),
  formatCount: (n, _forms, unit, future) => {
    const table = future === true ? ACCUSATIVE : future === false ? GENITIVE : NOMINATIVE;
    return `${n} ${table[unit][category(n)]}`;
  },
  relativeTime: {
    future: 'за {0}',
    past: 'пре {0}',
    fewSeconds: 'неколико секунди',
    now: 'сада',
    units,
    shortUnits
  },
  calendar: {
    today: 'данас',
    tomorrow: 'сутра',
    yesterday: 'јуче',
    nextWeek: (_wd, i) => `${SR_NEXT[i - 1]} ${SR_ACC_DAY[i - 1]}`,
    lastWeek: (_wd, i) => `${SR_LAST[i - 1]} ${SR_ACC_DAY[i - 1]}`
  },
  duration: {
    units,
    shortUnits,
    listSeparator: ', ',
    zero: '0 секунди',
    zeroShort: '0с'
  },
  dateFormats: {
    short:  'DD.MM.YYYY',
    medium: 'D. MMM YYYY.',
    long:   'D. MMMM YYYY.',
    full:   'dddd, D. MMMM YYYY.'
  }
};
