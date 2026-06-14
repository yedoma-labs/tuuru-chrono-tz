/**
 * as locale (auto-generated from CLDR)
 */

import type { Locale } from '../locale.js';

export const as: Locale = {
  name: 'as',
  months: [
    'জানুৱাৰী', 'ফেব্ৰুৱাৰী', 'মাৰ্চ', 'এপ্ৰিল', 'মে’', 'জুন', 'জুলাই', 'আগষ্ট', 'ছেপ্তেম্বৰ', 'অক্টোবৰ', 'নৱেম্বৰ', 'ডিচেম্বৰ'
  ],
  monthsShort: ['জানু', 'ফেব্ৰু', 'মাৰ্চ', 'এপ্ৰিল', 'মে’', 'জুন', 'জুলাই', 'আগ', 'ছেপ্তে', 'অক্টো', 'নৱে', 'ডিচে'],
  weekdays: ['সোমবাৰ', 'মঙ্গলবাৰ', 'বুধবাৰ', 'বৃহস্পতিবাৰ', 'শুক্ৰবাৰ', 'শনিবাৰ', 'দেওবাৰ'],
  weekdaysShort: ['সোম', 'মঙ্গল', 'বুধ', 'বৃহ', 'শুক্ৰ', 'শনি', 'দেও'],
  meridiem: (hour) => hour < 12 ? 'পূৰ্বাহ্ন' : 'অপৰাহ্ন',
  plural: (n) => n === 1 ? 0 : 1,
  relativeTime: {
    future: '{0} মিনিটত',
    past: '{0} মিনিট পূৰ্বে',
    fewSeconds: 'a few seconds',
    now: 'এতিয়া',
    units: {
      second: ['ছেকেণ্ড', 'ছেকেণ্ড'],
      minute: ['মিনিট', 'মিনিট'],
      hour: ['ঘণ্টা', 'ঘণ্টা'],
      day: ['দিন', 'দিন'],
      month: ['মাহ', 'মাহ'],
      year: ['বছৰ', 'বছৰ']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' }
  },
  calendar: {
    today: 'আজি',
    tomorrow: 'কাইলৈ',
    yesterday: 'কালি',
    nextWeek: '{0}',
    lastWeek: '{0}'
  },
  duration: {
    units: {
      second: ['ছেকেণ্ড', 'ছেকেণ্ড'],
      minute: ['মিনিট', 'মিনিট'],
      hour: ['ঘণ্টা', 'ঘণ্টা'],
      day: ['দিন', 'দিন'],
      month: ['মাহ', 'মাহ'],
      year: ['বছৰ', 'বছৰ']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' },
    listSeparator: ', ',
    zero: '0 ছেকেণ্ড',
    zeroShort: '0s'
  }
};
