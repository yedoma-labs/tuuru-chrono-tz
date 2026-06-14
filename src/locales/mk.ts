/**
 * mk locale (auto-generated from CLDR)
 */

import type { Locale } from '../locale.js';

export const mk: Locale = {
  name: 'mk',
  months: [
    'јануари', 'февруари', 'март', 'април', 'мај', 'јуни', 'јули', 'август', 'септември', 'октомври', 'ноември', 'декември'
  ],
  monthsShort: ['јан.', 'фев.', 'мар.', 'апр.', 'мај', 'јун.', 'јул.', 'авг.', 'септ.', 'окт.', 'ноем.', 'дек.'],
  weekdays: ['понеделник', 'вторник', 'среда', 'четврток', 'петок', 'сабота', 'недела'],
  weekdaysShort: ['пон.', 'вт.', 'сре.', 'чет.', 'пет.', 'саб.', 'нед.'],
  meridiem: (hour) => hour < 12 ? 'претпладне' : 'попладне',
  plural: (n) => n === 1 ? 0 : 1,
  relativeTime: {
    future: 'за {0}',
    past: 'пред {0}',
    fewSeconds: 'a few seconds',
    now: 'сега',
    units: {
      second: ['секунда', 'секунди'],
      minute: ['минута', 'минути'],
      hour: ['час', 'часа'],
      day: ['ден', 'дена'],
      month: ['месец', 'месеци'],
      year: ['година', 'години']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' }
  },
  calendar: {
    today: 'денес',
    tomorrow: 'утре',
    yesterday: 'вчера',
    nextWeek: '{0}',
    lastWeek: '{0}'
  },
  duration: {
    units: {
      second: ['секунда', 'секунди'],
      minute: ['минута', 'минути'],
      hour: ['час', 'часа'],
      day: ['ден', 'дена'],
      month: ['месец', 'месеци'],
      year: ['година', 'години']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' },
    listSeparator: ', ',
    zero: '0 секунди',
    zeroShort: '0s'
  }
};
