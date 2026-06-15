/**
 * Urdu locale
 *
 * Binary singular/plural (some units inflect: گھنٹہ → گھنٹے). Gregorian month
 * names. Text is right-to-left.
 */

import type { Locale } from '../locale.js';

const units = {
  second: ['سیکنڈ', 'سیکنڈ'],
  minute: ['منٹ', 'منٹ'],
  hour: ['گھنٹہ', 'گھنٹے'],
  day: ['دن', 'دن'],
  month: ['مہینہ', 'مہینے'],
  year: ['سال', 'سال']
} as const;

const shortUnits = {
  second: 'سیکنڈ', minute: 'منٹ', hour: 'گھنٹہ', day: 'دن', month: 'مہینہ', year: 'سال'
} as const;

export const ur: Locale = {
  name: 'ur',
  months: [
    'جنوری', 'فروری', 'مارچ', 'اپریل', 'مئی', 'جون',
    'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نومبر', 'دسمبر'
  ],
  monthsShort: [
    'جنوری', 'فروری', 'مارچ', 'اپریل', 'مئی', 'جون',
    'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نومبر', 'دسمبر'
  ],
  weekdays: ['پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ', 'اتوار'],
  weekdaysShort: ['پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ', 'اتوار'],
  meridiem: (hour) => (hour < 12 ? 'قبل دوپہر' : 'بعد دوپہر'),
  relativeTime: {
    future: '{0} میں',
    past: '{0} پہلے',
    fewSeconds: 'چند سیکنڈ',
    now: 'اب',
    units,
    shortUnits
  },
  calendar: {
    today: 'آج',
    tomorrow: 'کل',
    yesterday: 'کل',
    nextWeek: 'اگلے {0}',
    lastWeek: 'پچھلے {0}'
  },
  duration: {
    units,
    shortUnits,
    listSeparator: '، ',
    zero: '0 سیکنڈ',
    zeroShort: '0 سیکنڈ'
  },
  dateFormats: {
    short:  'DD/MM/YYYY',
    medium: 'D MMM YYYY',
    long:   'D MMMM YYYY',
    full:   'dddd، D MMMM YYYY'
  }
};
