/**
 * mn locale (auto-generated from CLDR)
 */

import type { Locale } from '../locale.js';

export const mn: Locale = {
  name: 'mn',
  months: [
    'нэгдүгээр сар', 'хоёрдугаар сар', 'гуравдугаар сар', 'дөрөвдүгээр сар', 'тавдугаар сар', 'зургаадугаар сар', 'долоодугаар сар', 'наймдугаар сар', 'есдүгээр сар', 'аравдугаар сар', 'арван нэгдүгээр сар', 'арван хоёрдугаар сар'
  ],
  monthsShort: ['1-р сар', '2-р сар', '3-р сар', '4-р сар', '5-р сар', '6-р сар', '7-р сар', '8-р сар', '9-р сар', '10-р сар', '11-р сар', '12-р сар'],
  weekdays: ['даваа', 'мягмар', 'лхагва', 'пүрэв', 'баасан', 'бямба', 'ням'],
  weekdaysShort: ['Да', 'Мя', 'Лх', 'Пү', 'Ба', 'Бя', 'Ня'],
  meridiem: (hour) => hour < 12 ? 'ү.ө.' : 'ү.х.',
  plural: (n) => n === 1 ? 0 : 1,
  relativeTime: {
    future: '{0} минутын дараа',
    past: '{0} минутын өмнө',
    fewSeconds: 'a few seconds',
    now: 'одоо',
    units: {
      second: ['секунд', 'секунд'],
      minute: ['минут', 'минут'],
      hour: ['цаг', 'цаг'],
      day: ['хоног', 'хоног'],
      month: ['сар', 'сар'],
      year: ['жил', 'жил']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' }
  },
  calendar: {
    today: 'өнөөдөр',
    tomorrow: 'маргааш',
    yesterday: 'өчигдөр',
    nextWeek: '{0}',
    lastWeek: '{0}'
  },
  duration: {
    units: {
      second: ['секунд', 'секунд'],
      minute: ['минут', 'минут'],
      hour: ['цаг', 'цаг'],
      day: ['хоног', 'хоног'],
      month: ['сар', 'сар'],
      year: ['жил', 'жил']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' },
    listSeparator: ', ',
    zero: '0 секунд',
    zeroShort: '0s'
  },
  dateFormats: {
    short:  'YYYY.MM.DD',
    medium: 'YYYY оны MMM',
    long:   'YYYY оны MM сарын D',
    full:   'dddd, YYYY оны MM сарын D'
  }
};
