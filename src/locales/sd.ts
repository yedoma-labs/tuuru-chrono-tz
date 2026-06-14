/**
 * sd locale (auto-generated from CLDR)
 */

import type { Locale } from '../locale.js';

export const sd: Locale = {
  name: 'sd',
  months: [
    'جنوري', 'فيبروري', 'مارچ', 'اپريل', 'مئي', 'جون', 'جولاءِ', 'آگسٽ', 'سيپٽمبر', 'آڪٽوبر', 'نومبر', 'ڊسمبر'
  ],
  monthsShort: ['جنوري', 'فيبروري', 'مارچ', 'اپريل', 'مئي', 'جون', 'جولاءِ', 'آگسٽ', 'سيپٽمبر', 'آڪٽوبر', 'نومبر', 'ڊسمبر'],
  weekdays: ['سومر', 'اڱارو', 'اربع', 'خميس', 'جمعو', 'ڇنڇر', 'آچر'],
  weekdaysShort: ['سومر', 'اڱارو', 'اربع', 'خميس', 'جمعو', 'ڇنڇر', 'آچر'],
  meridiem: (hour) => hour < 12 ? 'صبح، منجهند' : 'منجهند، شام',
  plural: (n) => n === 1 ? 0 : 1,
  relativeTime: {
    future: '{0} منٽن ۾',
    past: '{0} منٽ پهرين',
    fewSeconds: 'a few seconds',
    now: 'هاڻي',
    units: {
      second: ['في سيڪنڊ', 'سيڪنڊ'],
      minute: ['منٽ', 'منٽ'],
      hour: ['ڪلاڪ', 'ڪلاڪ'],
      day: ['ڏينهن', 'ڏينهن'],
      month: ['مهينا', 'مهينا'],
      year: ['سال', 'سال']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' }
  },
  calendar: {
    today: 'اڄ',
    tomorrow: 'سڀاڻي',
    yesterday: 'ڪل',
    nextWeek: '{0}',
    lastWeek: '{0}'
  },
  duration: {
    units: {
      second: ['في سيڪنڊ', 'سيڪنڊ'],
      minute: ['منٽ', 'منٽ'],
      hour: ['ڪلاڪ', 'ڪلاڪ'],
      day: ['ڏينهن', 'ڏينهن'],
      month: ['مهينا', 'مهينا'],
      year: ['سال', 'سال']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' },
    listSeparator: ', ',
    zero: '0 سيڪنڊ',
    zeroShort: '0s'
  }
};
