/**
 * ps locale (auto-generated from CLDR)
 */

import type { Locale } from '../locale.js';

export const ps: Locale = {
  name: 'ps',
  months: [
    'جنوري', 'فبروري', 'مارچ', 'اپریل', 'مۍ', 'جون', 'جولای', 'اګست', 'سېپتمبر', 'اکتوبر', 'نومبر', 'دسمبر'
  ],
  monthsShort: ['جنوري', 'فبروري', 'مارچ', 'اپریل', 'مۍ', 'جون', 'جولای', 'اګست', 'سېپتمبر', 'اکتوبر', 'نومبر', 'دسمبر'],
  weekdays: ['دونۍ', 'درېنۍ', 'څلرنۍ', 'پينځنۍ', 'جمعه', 'اونۍ', 'يونۍ'],
  weekdaysShort: ['دونۍ', 'درېنۍ', 'څلرنۍ', 'پينځنۍ', 'جمعه', 'اونۍ', 'يونۍ'],
  meridiem: (hour) => hour < 12 ? 'غ.م.' : 'غ.و.',
  plural: (n) => n === 1 ? 0 : 1,
  relativeTime: {
    future: 'په {0}',
    past: '{0} دقيقه مخکې',
    fewSeconds: 'a few seconds',
    now: 'اوس',
    units: {
      second: ['s', 's'],
      minute: ['min', 'min'],
      hour: ['h', 'h'],
      day: ['ورځ', 'ورځې'],
      month: ['مياشت', 'مياشتې'],
      year: ['کال', 'کالونه']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' }
  },
  calendar: {
    today: 'نن',
    tomorrow: 'سبا',
    yesterday: 'پرون',
    nextWeek: '{0}',
    lastWeek: '{0}'
  },
  duration: {
    units: {
      second: ['s', 's'],
      minute: ['min', 'min'],
      hour: ['h', 'h'],
      day: ['ورځ', 'ورځې'],
      month: ['مياشت', 'مياشتې'],
      year: ['کال', 'کالونه']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' },
    listSeparator: ', ',
    zero: '0 s',
    zeroShort: '0s'
  }
};
