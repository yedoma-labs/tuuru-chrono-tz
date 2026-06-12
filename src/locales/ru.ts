/**
 * Russian locale
 *
 * Russian has three plural forms (one / few / many). The unit arrays carry
 * the accusative-count forms, which read correctly with both the relative
 * templates ("через {0}", "{0} назад") and Duration.humanize:
 *   1 минуту · 2 минуты · 5 минут
 */

import type { Locale } from '../locale.js';

const units = {
  second: ['секунду', 'секунды', 'секунд'],
  minute: ['минуту', 'минуты', 'минут'],
  hour: ['час', 'часа', 'часов'],
  day: ['день', 'дня', 'дней'],
  month: ['месяц', 'месяца', 'месяцев'],
  year: ['год', 'года', 'лет']
} as const;

const shortUnits = {
  second: 'с', minute: 'мин', hour: 'ч', day: 'д', month: 'мес', year: 'г'
} as const;

// Weekday data for calendar phrases, Monday-first (index 0..6).
// Accusative case follows "в следующий/прошлый ...".
const RU_ACCUSATIVE = [
  'понедельник', 'вторник', 'среду', 'четверг', 'пятницу', 'субботу', 'воскресенье'
];
// Adjective agreeing with each weekday's gender (м / ж / с).
const RU_NEXT = [
  'в следующий', 'в следующий', 'в следующую', 'в следующий',
  'в следующую', 'в следующую', 'в следующее'
];
const RU_LAST = [
  'в прошлый', 'в прошлый', 'в прошлую', 'в прошлый',
  'в прошлую', 'в прошлую', 'в прошлое'
];

export const ru: Locale = {
  name: 'ru',
  months: [
    'январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
    'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'
  ],
  monthsShort: [
    'янв', 'фев', 'мар', 'апр', 'май', 'июн',
    'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'
  ],
  weekdays: ['понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'воскресенье'],
  weekdaysShort: ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'],
  meridiem: (hour, lowercase) => {
    const m = hour < 12 ? 'ДП' : 'ПП';
    return lowercase ? m.toLowerCase() : m;
  },
  // CLDR Russian plural: one / few / many → 0 / 1 / 2
  plural: (n) => {
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return 0;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 1;
    return 2;
  },
  relativeTime: {
    future: 'через {0}',
    past: '{0} назад',
    fewSeconds: 'несколько секунд',
    now: 'сейчас',
    units,
    shortUnits
  },
  calendar: {
    today: 'сегодня',
    tomorrow: 'завтра',
    yesterday: 'вчера',
    // "в следующий/прошлый <accusative weekday>" — the adjective agrees with
    // weekday gender (masc / fem / neuter) and the weekday takes the
    // accusative case (среда → среду, пятница → пятницу, суббота → субботу).
    nextWeek: (_wd, i) => `${RU_NEXT[i - 1]} ${RU_ACCUSATIVE[i - 1]}`,
    lastWeek: (_wd, i) => `${RU_LAST[i - 1]} ${RU_ACCUSATIVE[i - 1]}`
  },
  duration: {
    units,
    shortUnits,
    listSeparator: ', ',
    zero: '0 секунд',
    zeroShort: '0с'
  }
};
