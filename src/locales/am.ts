/**
 * am locale (auto-generated from CLDR)
 */

import type { Locale } from '../locale.js';

export const am: Locale = {
  name: 'am',
  months: [
    'ጃንዩወሪ', 'ፌብሩወሪ', 'ማርች', 'ኤፕሪል', 'ሜይ', 'ጁን', 'ጁላይ', 'ኦገስት', 'ሴፕቴምበር', 'ኦክቶበር', 'ኖቬምበር', 'ዲሴምበር'
  ],
  monthsShort: ['ጃንዩ', 'ፌብሩ', 'ማርች', 'ኤፕሪ', 'ሜይ', 'ጁን', 'ጁላይ', 'ኦገስ', 'ሴፕቴ', 'ኦክቶ', 'ኖቬም', 'ዲሴም'],
  weekdays: ['ሰኞ', 'ማክሰኞ', 'ረቡዕ', 'ሐሙስ', 'ዓርብ', 'ቅዳሜ', 'እሑድ'],
  weekdaysShort: ['ሰኞ', 'ማክሰ', 'ረቡዕ', 'ሐሙስ', 'ዓርብ', 'ቅዳሜ', 'እሑድ'],
  meridiem: (hour) => hour < 12 ? 'ጥዋት' : 'ከሰዓት',
  plural: (n) => n === 1 ? 0 : 1,
  relativeTime: {
    future: 'በ {0}',
    past: 'ከ {0}',
    fewSeconds: 'a few seconds',
    now: 'አሁን',
    units: {
      second: ['ሰከንድ', 'ሰከንዶች'],
      minute: ['ደቂቃ', 'ደቂቃዎች'],
      hour: ['ሰዓት', 'ሰዓቶች'],
      day: ['ቀናት', 'ቀናት'],
      month: ['ወር', 'ወራት'],
      year: ['ዓመት', 'ዓመታት']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' }
  },
  calendar: {
    today: 'ዛሬ',
    tomorrow: 'ነገ',
    yesterday: 'ትናንት',
    nextWeek: '{0}',
    lastWeek: '{0}'
  },
  duration: {
    units: {
      second: ['ሰከንድ', 'ሰከንዶች'],
      minute: ['ደቂቃ', 'ደቂቃዎች'],
      hour: ['ሰዓት', 'ሰዓቶች'],
      day: ['ቀናት', 'ቀናት'],
      month: ['ወር', 'ወራት'],
      year: ['ዓመት', 'ዓመታት']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' },
    listSeparator: ', ',
    zero: '0 ሰከንዶች',
    zeroShort: '0s'
  },
  dateFormats: {
    short:  'DD/MM/YYYY',
    medium: 'D MMM YYYY',
    long:   'D MMMM YYYY',
    full:   'dddd D MMMM YYYY'
  }
};
