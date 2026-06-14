/**
 * or locale (auto-generated from CLDR)
 */

import type { Locale } from '../locale.js';

export const or: Locale = {
  name: 'or',
  months: [
    'ଜାନୁଆରୀ', 'ଫେବୃଆରୀ', 'ମାର୍ଚ୍ଚ', 'ଅପ୍ରେଲ', 'ମଇ', 'ଜୁନ', 'ଜୁଲାଇ', 'ଅଗଷ୍ଟ', 'ସେପ୍ଟେମ୍ବର', 'ଅକ୍ଟୋବର', 'ନଭେମ୍ବର', 'ଡିସେମ୍ବର'
  ],
  monthsShort: ['ଜାନୁଆରୀ', 'ଫେବୃଆରୀ', 'ମାର୍ଚ୍ଚ', 'ଅପ୍ରେଲ', 'ମଇ', 'ଜୁନ', 'ଜୁଲାଇ', 'ଅଗଷ୍ଟ', 'ସେପ୍ଟେମ୍ବର', 'ଅକ୍ଟୋବର', 'ନଭେମ୍ବର', 'ଡିସେମ୍ବର'],
  weekdays: ['ସୋମବାର', 'ମଙ୍ଗଳବାର', 'ବୁଧବାର', 'ଗୁରୁବାର', 'ଶୁକ୍ରବାର', 'ଶନିବାର', 'ରବିବାର'],
  weekdaysShort: ['ସୋମ', 'ମଙ୍ଗଳ', 'ବୁଧ', 'ଗୁରୁ', 'ଶୁକ୍ର', 'ଶନି', 'ରବି'],
  meridiem: (hour) => hour < 12 ? 'AM' : 'PM',
  plural: (n) => n === 1 ? 0 : 1,
  relativeTime: {
    future: '{0} ମିନିଟ୍‌‌ରେ',
    past: '{0} ମିନିଟ୍ ପୂର୍ବେ',
    fewSeconds: 'a few seconds',
    now: 'ବର୍ତ୍ତମାନ',
    units: {
      second: ['ସେକେଣ୍ଡ', 'ସେକେଣ୍ଡ'],
      minute: ['ମିନିଟ୍‌', 'ମିନିଟ୍'],
      hour: ['ଘଣ୍ଟା', 'ଘଣ୍ଟା'],
      day: ['ଦିନ', 'ଦିନ'],
      month: ['ମାସ', 'ମାସ'],
      year: ['ବର୍ଷ', 'ବର୍ଷ']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' }
  },
  calendar: {
    today: 'ଆଜି',
    tomorrow: 'ଆସନ୍ତାକାଲି',
    yesterday: 'ଗତକାଲି',
    nextWeek: '{0}',
    lastWeek: '{0}'
  },
  duration: {
    units: {
      second: ['ସେକେଣ୍ଡ', 'ସେକେଣ୍ଡ'],
      minute: ['ମିନିଟ୍‌', 'ମିନିଟ୍'],
      hour: ['ଘଣ୍ଟା', 'ଘଣ୍ଟା'],
      day: ['ଦିନ', 'ଦିନ'],
      month: ['ମାସ', 'ମାସ'],
      year: ['ବର୍ଷ', 'ବର୍ଷ']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' },
    listSeparator: ', ',
    zero: '0 ସେକେଣ୍ଡ',
    zeroShort: '0s'
  }
};
