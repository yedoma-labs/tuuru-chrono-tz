/**
 * Arabic locale
 *
 * Arabic counting changes with the number, which the default
 * `${n} ${unit}` model cannot express, so this locale supplies `formatCount`:
 *   1  → bare singular, no numeral         "دقيقة"
 *   2  → dual form, no numeral             "دقيقتين"
 *   3-10 → numeral + plural                "5 دقائق"
 *   11+  → numeral + singular (accusative) "11 دقيقة"
 *
 * Unit form arrays are [singular, dual, plural]. Text is right-to-left; the
 * library stores logical order and leaves rendering to the consumer.
 */

import type { Locale } from '../locale.js';

const units = {
  second: ['ثانية', 'ثانيتين', 'ثوانٍ'],
  minute: ['دقيقة', 'دقيقتين', 'دقائق'],
  hour: ['ساعة', 'ساعتين', 'ساعات'],
  day: ['يوم', 'يومين', 'أيام'],
  month: ['شهر', 'شهرين', 'أشهر'],
  year: ['سنة', 'سنتين', 'سنوات']
} as const;

const shortUnits = {
  second: 'ث', minute: 'د', hour: 'س', day: 'ي', month: 'شهر', year: 'سنة'
} as const;

export const ar: Locale = {
  name: 'ar',
  months: [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ],
  monthsShort: [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ],
  weekdays: ['الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد'],
  weekdaysShort: ['إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت', 'أحد'],
  meridiem: (hour) => (hour < 12 ? 'ص' : 'م'),
  // Standard Arabic count agreement; forms are [singular, dual, plural]
  formatCount: (n, forms) => {
    if (n === 1) return forms[0]!;
    if (n === 2) return forms[1]!;
    const mod100 = n % 100;
    if (mod100 >= 3 && mod100 <= 10) return `${n} ${forms[2]}`;
    return `${n} ${forms[0]}`;
  },
  relativeTime: {
    future: 'بعد {0}',
    past: 'منذ {0}',
    fewSeconds: 'بضع ثوانٍ',
    now: 'الآن',
    units,
    shortUnits
  },
  calendar: {
    today: 'اليوم',
    tomorrow: 'غدًا',
    yesterday: 'أمس',
    nextWeek: '{0} القادم',
    lastWeek: '{0} الماضي'
  },
  duration: {
    units,
    shortUnits,
    listSeparator: '، ',
    zero: '0 ثانية',
    zeroShort: '0ث'
  }
};
