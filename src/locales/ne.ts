/**
 * ne locale (auto-generated from CLDR)
 */

import type { Locale } from '../locale.js';

export const ne: Locale = {
  name: 'ne',
  months: [
    'जनवरी', 'फेब्रुअरी', 'मार्च', 'अप्रिल', 'मे', 'जुन', 'जुलाई', 'अगस्ट', 'सेप्टेम्बर', 'अक्टोबर', 'नोभेम्बर', 'डिसेम्बर'
  ],
  monthsShort: ['जनवरी', 'फेब्रुअरी', 'मार्च', 'अप्रिल', 'मे', 'जुन', 'जुलाई', 'अगस्ट', 'सेप्टेम्बर', 'अक्टोबर', 'नोभेम्बर', 'डिसेम्बर'],
  weekdays: ['सोमबार', 'मङ्गलबार', 'बुधबार', 'बिहिबार', 'शुक्रबार', 'शनिबार', 'आइतबार'],
  weekdaysShort: ['सोम', 'मङ्गल', 'बुध', 'बिहि', 'शुक्र', 'शनि', 'आइत'],
  meridiem: (hour) => hour < 12 ? 'पूर्वाह्न' : 'अपराह्न',
  plural: (n) => n === 1 ? 0 : 1,
  relativeTime: {
    future: '{0} मिनेटमा',
    past: '{0} मिनेट पहिले',
    fewSeconds: 'a few seconds',
    now: 'अहिले',
    units: {
      second: ['सेकेन्ड', 'सेकेन्ड'],
      minute: ['मिनेट', 'मिनेट'],
      hour: ['घण्टा', 'घण्टा'],
      day: ['दिन', 'दिन'],
      month: ['महिना', 'महिना'],
      year: ['वर्ष', 'वर्ष']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' }
  },
  calendar: {
    today: 'आज',
    tomorrow: 'भोलि',
    yesterday: 'हिजो',
    nextWeek: '{0}',
    lastWeek: '{0}'
  },
  duration: {
    units: {
      second: ['सेकेन्ड', 'सेकेन्ड'],
      minute: ['मिनेट', 'मिनेट'],
      hour: ['घण्टा', 'घण्टा'],
      day: ['दिन', 'दिन'],
      month: ['महिना', 'महिना'],
      year: ['वर्ष', 'वर्ष']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' },
    listSeparator: ', ',
    zero: '0 सेकेन्ड',
    zeroShort: '0s'
  }
};
