/**
 * si locale (auto-generated from CLDR)
 */

import type { Locale } from '../locale.js';

export const si: Locale = {
  name: 'si',
  months: [
    'ජනවාරි', 'පෙබරවාරි', 'මාර්තු', 'අප්‍රේල්', 'මැයි', 'ජූනි', 'ජූලි', 'අගෝස්තු', 'සැප්තැම්බර්', 'ඔක්තෝබර්', 'නොවැම්බර්', 'දෙසැම්බර්'
  ],
  monthsShort: ['ජන', 'පෙබ', 'මාර්තු', 'අප්‍රේල්', 'මැයි', 'ජූනි', 'ජූලි', 'අගෝ', 'සැප්', 'ඔක්', 'නොවැ', 'දෙසැ'],
  weekdays: ['සඳුදා', 'අඟහරුවාදා', 'බදාදා', 'බ්‍රහස්පතින්දා', 'සිකුරාදා', 'සෙනසුරාදා', 'ඉරිදා'],
  weekdaysShort: ['සඳුදා', 'අඟහ', 'බදාදා', 'බ්‍රහස්', 'සිකු', 'සෙන', 'ඉරිදා'],
  meridiem: (hour) => hour < 12 ? 'පෙ.ව.' : 'ප.ව.',
  plural: (n) => n === 1 ? 0 : 1,
  relativeTime: {
    future: 'මිනිත්තු {0}',
    past: 'මිනිත්තු {0}',
    fewSeconds: 'a few seconds',
    now: 'දැන්',
    units: {
      second: ['තත්පර', 'තත්පර'],
      minute: ['මිනිත්තු', 'මිනිත්තු'],
      hour: ['පැය', 'පැය'],
      day: ['දින', 'දින'],
      month: ['මාස', 'මාස'],
      year: ['වසර', 'වසර']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' }
  },
  calendar: {
    today: 'අද',
    tomorrow: 'හෙට',
    yesterday: 'ඊයේ',
    nextWeek: '{0}',
    lastWeek: '{0}'
  },
  duration: {
    units: {
      second: ['තත්පර', 'තත්පර'],
      minute: ['මිනිත්තු', 'මිනිත්තු'],
      hour: ['පැය', 'පැය'],
      day: ['දින', 'දින'],
      month: ['මාස', 'මාස'],
      year: ['වසර', 'වසර']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' },
    listSeparator: ', ',
    zero: '0 තත්පර',
    zeroShort: '0s'
  }
};
