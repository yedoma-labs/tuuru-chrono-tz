/**
 * Gujarati locale
 *
 * Binary plural: singular for n === 1, plural otherwise.
 */

import type { Locale } from '../locale.js';

const units = {
  second: ['સેકન્ડ', 'સેકન્ડ'],
  minute: ['મિનિટ', 'મિનિટ'],
  hour: ['કલાક', 'કલાક'],
  day: ['દિવસ', 'દિવસ'],
  month: ['મહિનો', 'મહિના'],
  year: ['વર્ષ', 'વર્ષ']
} as const;

const shortUnits = {
  second: 'સે.', minute: 'મિ.', hour: 'ક.', day: 'દિ.', month: 'મ.', year: 'વ.'
} as const;

export const gu: Locale = {
  name: 'gu',
  months: [
    'જાન્યુઆરી', 'ફેબ્રુઆરી', 'માર્ચ', 'એપ્રિલ', 'મે', 'જૂન',
    'જુલાઈ', 'ઓગસ્ટ', 'સપ્ટેમ્બર', 'ઓક્ટોબર', 'નવેમ્બર', 'ડિસેમ્બર'
  ],
  monthsShort: ['જાન', 'ફેબ', 'માર', 'એપ', 'મે', 'જૂન', 'જુલ', 'ઓગ', 'સપ', 'ઓક', 'નવ', 'ડિસ'],
  weekdays: ['સોમવાર', 'મંગળવાર', 'બુધવાર', 'ગુરુવાર', 'શુક્રવાર', 'શનિવાર', 'રવિવાર'],
  weekdaysShort: ['સોમ', 'મંગ', 'બુધ', 'ગુરુ', 'શુક્ર', 'શનિ', 'રવિ'],
  meridiem: (hour) => (hour < 12 ? 'AM' : 'PM'),
  plural: (n) => (n === 1 ? 0 : 1),
  relativeTime: {
    future: '{0} માં',
    past: '{0} પહેલા',
    fewSeconds: 'થોડી સેકન્ડ',
    now: 'હમણાં',
    units,
    shortUnits
  },
  calendar: {
    today: 'આજે',
    tomorrow: 'આવતીકાલે',
    yesterday: 'ગઈ કાલ',
    nextWeek: 'આગામી {0}',
    lastWeek: 'છેલ્લો {0}'
  },
  duration: {
    units,
    shortUnits,
    listSeparator: ', ',
    zero: '0 સેકન્ડ',
    zeroShort: '0સે.'
  }
};
