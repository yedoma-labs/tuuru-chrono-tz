/**
 * Ukrainian locale
 *
 * Three plural forms (one / few / many), like Russian. Unit arrays carry the
 * accusative-count forms that read correctly with the relative templates
 * ("через {0}", "{0} тому"):  1 хвилину · 2 хвилини · 5 хвилин
 */

import type { Locale } from '../locale.js';

const units = {
  second: ['секунду', 'секунди', 'секунд'],
  minute: ['хвилину', 'хвилини', 'хвилин'],
  hour: ['годину', 'години', 'годин'],
  day: ['день', 'дні', 'днів'],
  month: ['місяць', 'місяці', 'місяців'],
  year: ['рік', 'роки', 'років']
} as const;

const shortUnits = {
  second: 'с', minute: 'хв', hour: 'год', day: 'д', month: 'міс', year: 'р'
} as const;

// Calendar weekday data, Monday-first (index 0..6).
// "у наступний/минулий <accusative weekday>", adjective agreeing with gender.
const UK_ACCUSATIVE = ['понеділок', 'вівторок', 'середу', 'четвер', "п'ятницю", 'суботу', 'неділю'];
const UK_NEXT = [
  'у наступний', 'у наступний', 'у наступну', 'у наступний',
  'у наступну', 'у наступну', 'у наступну'
];
const UK_LAST = [
  'у минулий', 'у минулий', 'у минулу', 'у минулий',
  'у минулу', 'у минулу', 'у минулу'
];

export const uk: Locale = {
  name: 'uk',
  months: [
    'січень', 'лютий', 'березень', 'квітень', 'травень', 'червень',
    'липень', 'серпень', 'вересень', 'жовтень', 'листопад', 'грудень'
  ],
  monthsShort: ['січ', 'лют', 'бер', 'кві', 'тра', 'чер', 'лип', 'сер', 'вер', 'жов', 'лис', 'гру'],
  weekdays: ['понеділок', 'вівторок', 'середа', 'четвер', "п'ятниця", 'субота', 'неділя'],
  weekdaysShort: ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'нд'],
  meridiem: (hour, lowercase) => {
    const m = hour < 12 ? 'ДП' : 'ПП';
    return lowercase ? m.toLowerCase() : m;
  },
  // CLDR Ukrainian plural: one / few / many → 0 / 1 / 2 (same rule as Russian)
  plural: (n) => {
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return 0;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 1;
    return 2;
  },
  relativeTime: {
    future: 'через {0}',
    past: '{0} тому',
    fewSeconds: 'кілька секунд',
    now: 'зараз',
    units,
    shortUnits
  },
  calendar: {
    today: 'сьогодні',
    tomorrow: 'завтра',
    yesterday: 'вчора',
    nextWeek: (_wd, i) => `${UK_NEXT[i - 1]} ${UK_ACCUSATIVE[i - 1]}`,
    lastWeek: (_wd, i) => `${UK_LAST[i - 1]} ${UK_ACCUSATIVE[i - 1]}`
  },
  duration: {
    units,
    shortUnits,
    listSeparator: ', ',
    zero: '0 секунд',
    zeroShort: '0с'
  },
  dateFormats: {
    short:  'DD.MM.YYYY',
    medium: 'D MMM YYYY р.',
    long:   'D MMMM YYYY р.',
    full:   'dddd, D MMMM YYYY р.'
  }
};
