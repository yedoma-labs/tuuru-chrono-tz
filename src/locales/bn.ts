/**
 * Bengali locale
 *
 * Bengali does not inflect these time nouns for number, so each unit has a
 * single form and `plural` always returns 0.
 */

import type { Locale } from '../locale.js';

const units = {
  second: ['সেকেন্ড'],
  minute: ['মিনিট'],
  hour: ['ঘণ্টা'],
  day: ['দিন'],
  month: ['মাস'],
  year: ['বছর']
} as const;

const shortUnits = {
  second: 'সেকেন্ড', minute: 'মিনিট', hour: 'ঘণ্টা', day: 'দিন', month: 'মাস', year: 'বছর'
} as const;

export const bn: Locale = {
  name: 'bn',
  months: [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ],
  monthsShort: ['জানু', 'ফেব', 'মার্চ', 'এপ্রি', 'মে', 'জুন', 'জুল', 'আগ', 'সেপ্ট', 'অক্টো', 'নভে', 'ডিসে'],
  weekdays: ['সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার', 'রবিবার'],
  weekdaysShort: ['সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি', 'রবি'],
  meridiem: (hour) => (hour < 12 ? 'পূর্বাহ্ণ' : 'অপরাহ্ণ'),
  plural: () => 0,
  relativeTime: {
    future: '{0} পরে',
    past: '{0} আগে',
    fewSeconds: 'কয়েক সেকেন্ড',
    now: 'এখন',
    units,
    shortUnits
  },
  calendar: {
    today: 'আজ',
    tomorrow: 'আগামীকাল',
    yesterday: 'গতকাল',
    nextWeek: 'আগামী {0}',
    lastWeek: 'গত {0}'
  },
  duration: {
    units,
    shortUnits,
    listSeparator: ', ',
    zero: '0 সেকেন্ড',
    zeroShort: '0সেকেন্ড'
  }
};
