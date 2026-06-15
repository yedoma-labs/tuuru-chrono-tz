/**
 * pa locale (auto-generated from CLDR)
 */

import type { Locale } from '../locale.js';

export const pa: Locale = {
  name: 'pa',
  months: [
    'ਜਨਵਰੀ', 'ਫ਼ਰਵਰੀ', 'ਮਾਰਚ', 'ਅਪ੍ਰੈਲ', 'ਮਈ', 'ਜੂਨ', 'ਜੁਲਾਈ', 'ਅਗਸਤ', 'ਸਤੰਬਰ', 'ਅਕਤੂਬਰ', 'ਨਵੰਬਰ', 'ਦਸੰਬਰ'
  ],
  monthsShort: ['ਜਨ', 'ਫ਼ਰ', 'ਮਾਰਚ', 'ਅਪ੍ਰੈ', 'ਮਈ', 'ਜੂਨ', 'ਜੁਲਾ', 'ਅਗ', 'ਸਤੰ', 'ਅਕਤੂ', 'ਨਵੰ', 'ਦਸੰ'],
  weekdays: ['ਸੋਮਵਾਰ', 'ਮੰਗਲਵਾਰ', 'ਬੁੱਧਵਾਰ', 'ਵੀਰਵਾਰ', 'ਸ਼ੁੱਕਰਵਾਰ', 'ਸ਼ਨਿੱਚਰਵਾਰ', 'ਐਤਵਾਰ'],
  weekdaysShort: ['ਸੋਮ', 'ਮੰਗਲ', 'ਬੁੱਧ', 'ਵੀਰ', 'ਸ਼ੁੱਕਰ', 'ਸ਼ਨਿੱਚਰ', 'ਐਤ'],
  meridiem: (hour) => hour < 12 ? 'ਪੂ.ਦੁ.' : 'ਬਾ.ਦੁ.',
  plural: (n) => n === 1 ? 0 : 1,
  relativeTime: {
    future: '{0} ਮਿੰਟ ਵਿੱਚ',
    past: '{0} ਮਿੰਟ ਪਹਿਲਾਂ',
    fewSeconds: 'a few seconds',
    now: 'ਹੁਣ',
    units: {
      second: ['ਸਕਿੰਟ', 'ਸਕਿੰਟ'],
      minute: ['ਮਿੰਟ', 'ਮਿੰਟ'],
      hour: ['ਘੰਟਾ', 'ਘੰਟੇ'],
      day: ['ਦਿਨ', 'ਦਿਨ'],
      month: ['ਮਹੀਨਾ', 'ਮਹੀਨੇ'],
      year: ['ਸਾਲ', 'ਸਾਲ']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' }
  },
  calendar: {
    today: 'ਅੱਜ',
    tomorrow: 'ਭਲਕੇ',
    yesterday: 'ਬੀਤਿਆ ਕੱਲ੍ਹ',
    nextWeek: '{0}',
    lastWeek: '{0}'
  },
  duration: {
    units: {
      second: ['ਸਕਿੰਟ', 'ਸਕਿੰਟ'],
      minute: ['ਮਿੰਟ', 'ਮਿੰਟ'],
      hour: ['ਘੰਟਾ', 'ਘੰਟੇ'],
      day: ['ਦਿਨ', 'ਦਿਨ'],
      month: ['ਮਹੀਨਾ', 'ਮਹੀਨੇ'],
      year: ['ਸਾਲ', 'ਸਾਲ']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' },
    listSeparator: ', ',
    zero: '0 ਸਕਿੰਟ',
    zeroShort: '0s'
  },
  dateFormats: {
    short:  'DD/MM/YYYY',
    medium: 'D MMM YYYY',
    long:   'D MMMM YYYY',
    full:   'dddd, D MMMM YYYY'
  }
};
