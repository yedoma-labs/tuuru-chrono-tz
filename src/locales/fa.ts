/**
 * Persian (Farsi) locale
 *
 * A noun following a number stays singular in Persian (5 دقیقه, not a plural
 * form), so units have a single form. Gregorian month names are used. Text is
 * right-to-left.
 */

import type { Locale } from '../locale.js';

const units = {
  second: ['ثانیه'],
  minute: ['دقیقه'],
  hour: ['ساعت'],
  day: ['روز'],
  month: ['ماه'],
  year: ['سال']
} as const;

const shortUnits = {
  second: 'ثانیه', minute: 'دقیقه', hour: 'ساعت', day: 'روز', month: 'ماه', year: 'سال'
} as const;

export const fa: Locale = {
  name: 'fa',
  months: [
    'ژانویه', 'فوریه', 'مارس', 'آوریل', 'مه', 'ژوئن',
    'ژوئیه', 'اوت', 'سپتامبر', 'اکتبر', 'نوامبر', 'دسامبر'
  ],
  monthsShort: [
    'ژانویه', 'فوریه', 'مارس', 'آوریل', 'مه', 'ژوئن',
    'ژوئیه', 'اوت', 'سپتامبر', 'اکتبر', 'نوامبر', 'دسامبر'
  ],
  weekdays: ['دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه', 'یکشنبه'],
  weekdaysShort: ['دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه', 'یکشنبه'],
  meridiem: (hour) => (hour < 12 ? 'ق.ظ' : 'ب.ظ'),
  plural: () => 0,
  relativeTime: {
    future: 'در {0}',
    past: '{0} پیش',
    fewSeconds: 'چند ثانیه',
    now: 'اکنون',
    units,
    shortUnits
  },
  calendar: {
    today: 'امروز',
    tomorrow: 'فردا',
    yesterday: 'دیروز',
    nextWeek: '{0} آینده',
    lastWeek: '{0} گذشته'
  },
  duration: {
    units,
    shortUnits,
    listSeparator: '، ',
    zero: '0 ثانیه',
    zeroShort: '0 ثانیه'
  }
};
