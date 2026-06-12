/**
 * Bulgarian locale
 *
 * Bulgarian is analytic (no noun case), so a simple singular/plural split is
 * correct in both directions.
 */

import type { Locale } from '../locale.js';

const units = {
  second: ['секунда', 'секунди'],
  minute: ['минута', 'минути'],
  hour: ['час', 'часа'],
  day: ['ден', 'дни'],
  month: ['месец', 'месеца'],
  year: ['година', 'години']
} as const;

const shortUnits = {
  second: 'сек', minute: 'мин', hour: 'ч', day: 'д', month: 'мес', year: 'г'
} as const;

export const bg: Locale = {
  name: 'bg',
  months: [
    'януари', 'февруари', 'март', 'април', 'май', 'юни',
    'юли', 'август', 'септември', 'октомври', 'ноември', 'декември'
  ],
  monthsShort: ['яну', 'фев', 'мар', 'апр', 'май', 'юни', 'юли', 'авг', 'сеп', 'окт', 'ное', 'дек'],
  weekdays: ['понеделник', 'вторник', 'сряда', 'четвъртък', 'петък', 'събота', 'неделя'],
  weekdaysShort: ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'нд'],
  meridiem: (hour) => (hour < 12 ? 'преди обед' : 'след обед'),
  relativeTime: {
    future: 'след {0}',
    past: 'преди {0}',
    fewSeconds: 'няколко секунди',
    now: 'сега',
    units,
    shortUnits
  },
  calendar: {
    today: 'днес',
    tomorrow: 'утре',
    yesterday: 'вчера',
    nextWeek: 'следващия {0}',
    lastWeek: 'миналия {0}'
  },
  duration: {
    units,
    shortUnits,
    listSeparator: ', ',
    zero: '0 секунди',
    zeroShort: '0сек'
  }
};
