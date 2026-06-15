/**
 * Marathi locale
 *
 * Binary plural: singular for n === 1, plural otherwise.
 */

import type { Locale } from '../locale.js';

const units = {
  second: ['सेकंद', 'सेकंद'],
  minute: ['मिनिट', 'मिनिटे'],
  hour: ['तास', 'तास'],
  day: ['दिवस', 'दिवस'],
  month: ['महिना', 'महिने'],
  year: ['वर्ष', 'वर्षे']
} as const;

const shortUnits = {
  second: 'से.', minute: 'मि.', hour: 'ता.', day: 'दि.', month: 'म.', year: 'व.'
} as const;

export const mr: Locale = {
  name: 'mr',
  months: [
    'जानेवारी', 'फेब्रुवारी', 'मार्च', 'एप्रिल', 'मे', 'जून',
    'जुलै', 'ऑगस्ट', 'सप्टेंबर', 'ऑक्टोबर', 'नोव्हेंबर', 'डिसेंबर'
  ],
  monthsShort: ['जाने', 'फेब्रु', 'मार्च', 'एप्रि', 'मे', 'जून', 'जुलै', 'ऑग', 'सप्टे', 'ऑक्टो', 'नोव्हे', 'डिसे'],
  weekdays: ['सोमवार', 'मंगळवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार', 'रविवार'],
  weekdaysShort: ['सोम', 'मंगळ', 'बुध', 'गुरु', 'शुक्र', 'शनि', 'रवि'],
  meridiem: (hour) => (hour < 12 ? 'AM' : 'PM'),
  plural: (n) => (n === 1 ? 0 : 1),
  relativeTime: {
    future: '{0} मध्ये',
    past: '{0} पूर्वी',
    fewSeconds: 'काही सेकंद',
    now: 'आत्ता',
    units,
    shortUnits
  },
  calendar: {
    today: 'आज',
    tomorrow: 'उद्या',
    yesterday: 'काल',
    nextWeek: 'पुढील {0}',
    lastWeek: 'मागील {0}'
  },
  duration: {
    units,
    shortUnits,
    listSeparator: ', ',
    zero: '0 सेकंद',
    zeroShort: '0से.'
  },
  dateFormats: {
    short:  'DD/MM/YYYY',
    medium: 'D MMM YYYY',
    long:   'D MMMM YYYY',
    full:   'dddd, D MMMM YYYY'
  }
};
