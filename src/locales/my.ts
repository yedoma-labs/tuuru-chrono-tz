/**
 * my locale (auto-generated from CLDR)
 */

import type { Locale } from '../locale.js';

export const my: Locale = {
  name: 'my',
  months: [
    'ဇန်နဝါရီ', 'ဖေဖော်ဝါရီ', 'မတ်', 'ဧပြီ', 'မေ', 'ဇွန်', 'ဇူလိုင်', 'ဩဂုတ်', 'စက်တင်ဘာ', 'အောက်တိုဘာ', 'နိုဝင်ဘာ', 'ဒီဇင်ဘာ'
  ],
  monthsShort: ['ဇန်', 'ဖေ', 'မတ်', 'ဧ', 'မေ', 'ဇွန်', 'ဇူ', 'ဩ', 'စက်', 'အောက်', 'နို', 'ဒီ'],
  weekdays: ['တနင်္လာ', 'အင်္ဂါ', 'ဗုဒ္ဓဟူး', 'ကြာသပတေး', 'သောကြာ', 'စနေ', 'တနင်္ဂနွေ'],
  weekdaysShort: ['တနင်္လာ', 'အင်္ဂါ', 'ဗုဒ္ဓဟူး', 'ကြာသပတေး', 'သောကြာ', 'စနေ', 'တနင်္ဂနွေ'],
  meridiem: (hour) => hour < 12 ? 'နံနက်' : 'ညနေ',
  plural: () => 0,
  relativeTime: {
    future: 'in {0}',
    past: '{0} ago',
    fewSeconds: 'a few seconds',
    now: 'ယခု',
    units: {
      second: ['စက္ကန့်'],
      minute: ['မိနစ်'],
      hour: ['နာရီ'],
      day: ['ရက်'],
      month: ['လ'],
      year: ['နှစ်']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' }
  },
  calendar: {
    today: 'ယနေ့',
    tomorrow: 'မနက်ဖြန်',
    yesterday: 'မနေ့က',
    nextWeek: '{0}',
    lastWeek: '{0}'
  },
  duration: {
    units: {
      second: ['စက္ကန့်'],
      minute: ['မိနစ်'],
      hour: ['နာရီ'],
      day: ['ရက်'],
      month: ['လ'],
      year: ['နှစ်']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' },
    listSeparator: ', ',
    zero: '0 စက္ကန့်',
    zeroShort: '0s'
  }
};
