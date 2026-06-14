/**
 * ky locale (auto-generated from CLDR)
 */

import type { Locale } from '../locale.js';

export const ky: Locale = {
  name: 'ky',
  months: [
    'январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'
  ],
  monthsShort: ['янв.', 'фев.', 'мар.', 'апр.', 'май', 'июн.', 'июл.', 'авг.', 'сен.', 'окт.', 'ноя.', 'дек.'],
  weekdays: ['дүйшөмбү', 'шейшемби', 'шаршемби', 'бейшемби', 'жума', 'ишемби', 'жекшемби'],
  weekdaysShort: ['дүй.', 'шейш.', 'шарш.', 'бейш.', 'жума', 'ишм.', 'жек.'],
  meridiem: (hour) => hour < 12 ? 'таңкы' : 'түштөн кийинки',
  plural: (n) => n === 1 ? 0 : 1,
  relativeTime: {
    future: '{0} мүнөттөн кийин',
    past: '{0} мүнөт мурун',
    fewSeconds: 'a few seconds',
    now: 'азыр',
    units: {
      second: ['секунд', 'секунд'],
      minute: ['мүнөт', 'мүнөт'],
      hour: ['саат', 'саат'],
      day: ['күн', 'күн'],
      month: ['ай', 'ай'],
      year: ['жыл', 'жыл']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' }
  },
  calendar: {
    today: 'бүгүн',
    tomorrow: 'эртең',
    yesterday: 'кечээ',
    nextWeek: '{0}',
    lastWeek: '{0}'
  },
  duration: {
    units: {
      second: ['секунд', 'секунд'],
      minute: ['мүнөт', 'мүнөт'],
      hour: ['саат', 'саат'],
      day: ['күн', 'күн'],
      month: ['ай', 'ай'],
      year: ['жыл', 'жыл']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' },
    listSeparator: ', ',
    zero: '0 секунд',
    zeroShort: '0s'
  }
};
