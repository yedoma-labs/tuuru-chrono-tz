/**
 * kk locale (auto-generated from CLDR)
 */

import type { Locale } from '../locale.js';

export const kk: Locale = {
  name: 'kk',
  months: [
    'қаңтар', 'ақпан', 'наурыз', 'сәуір', 'мамыр', 'маусым', 'шілде', 'тамыз', 'қыркүйек', 'қазан', 'қараша', 'желтоқсан'
  ],
  monthsShort: ['қаң.', 'ақп.', 'нау.', 'сәу.', 'мам.', 'мау.', 'шіл.', 'там.', 'қыр.', 'қаз.', 'қар.', 'жел.'],
  weekdays: ['дүйсенбі', 'сейсенбі', 'сәрсенбі', 'бейсенбі', 'жұма', 'сенбі', 'жексенбі'],
  weekdaysShort: ['дс', 'сс', 'ср', 'бс', 'жм', 'сб', 'жс'],
  meridiem: (hour) => hour < 12 ? 'AM' : 'PM',
  plural: (n) => n === 1 ? 0 : 1,
  relativeTime: {
    future: '{0} минуттан кейін',
    past: '{0} минут бұрын',
    fewSeconds: 'a few seconds',
    now: 'қазір',
    units: {
      second: ['секунд', 'секунд'],
      minute: ['минут', 'минут'],
      hour: ['сағат', 'сағат'],
      day: ['тәулік', 'тәулік'],
      month: ['ай', 'ай'],
      year: ['жыл', 'жыл']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' }
  },
  calendar: {
    today: 'бүгін',
    tomorrow: 'ертең',
    yesterday: 'кеше',
    nextWeek: '{0}',
    lastWeek: '{0}'
  },
  duration: {
    units: {
      second: ['секунд', 'секунд'],
      minute: ['минут', 'минут'],
      hour: ['сағат', 'сағат'],
      day: ['тәулік', 'тәулік'],
      month: ['ай', 'ай'],
      year: ['жыл', 'жыл']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' },
    listSeparator: ', ',
    zero: '0 секунд',
    zeroShort: '0s'
  }
};
