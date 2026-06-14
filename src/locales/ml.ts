/**
 * ml locale (auto-generated from CLDR)
 */

import type { Locale } from '../locale.js';

export const ml: Locale = {
  name: 'ml',
  months: [
    'ജനുവരി', 'ഫെബ്രുവരി', 'മാർച്ച്', 'ഏപ്രിൽ', 'മേയ്', 'ജൂൺ', 'ജൂലൈ', 'ഓഗസ്റ്റ്', 'സെപ്റ്റംബർ', 'ഒക്‌ടോബർ', 'നവംബർ', 'ഡിസംബർ'
  ],
  monthsShort: ['ജനു', 'ഫെബ്രു', 'മാർ', 'ഏപ്രി', 'മേയ്', 'ജൂൺ', 'ജൂലൈ', 'ഓഗ', 'സെപ്റ്റം', 'ഒക്ടോ', 'നവം', 'ഡിസം'],
  weekdays: ['തിങ്കളാഴ്‌ച', 'ചൊവ്വാഴ്ച', 'ബുധനാഴ്‌ച', 'വ്യാഴാഴ്‌ച', 'വെള്ളിയാഴ്‌ച', 'ശനിയാഴ്‌ച', 'ഞായറാഴ്‌ച'],
  weekdaysShort: ['തിങ്കൾ', 'ചൊവ്വ', 'ബുധൻ', 'വ്യാഴം', 'വെള്ളി', 'ശനി', 'ഞായർ'],
  meridiem: (hour) => hour < 12 ? 'AM' : 'PM',
  plural: (n) => n === 1 ? 0 : 1,
  relativeTime: {
    future: '{0} മിനിറ്റിൽ',
    past: '{0} മിനിറ്റ് മുമ്പ്',
    fewSeconds: 'a few seconds',
    now: 'ഇപ്പോൾ',
    units: {
      second: ['സെക്കൻഡ്', 'സെക്കൻഡ്'],
      minute: ['മിനിറ്റ്', 'മിനിറ്റ്'],
      hour: ['മണിക്കൂർ', 'മണിക്കൂർ'],
      day: ['ദിവസം', 'ദിവസം'],
      month: ['മാസം', 'മാസം'],
      year: ['വർഷം', 'വർഷം']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' }
  },
  calendar: {
    today: 'ഇന്ന്',
    tomorrow: 'നാളെ',
    yesterday: 'ഇന്നലെ',
    nextWeek: '{0}',
    lastWeek: '{0}'
  },
  duration: {
    units: {
      second: ['സെക്കൻഡ്', 'സെക്കൻഡ്'],
      minute: ['മിനിറ്റ്', 'മിനിറ്റ്'],
      hour: ['മണിക്കൂർ', 'മണിക്കൂർ'],
      day: ['ദിവസം', 'ദിവസം'],
      month: ['മാസം', 'മാസം'],
      year: ['വർഷം', 'വർഷം']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' },
    listSeparator: ', ',
    zero: '0 സെക്കൻഡ്',
    zeroShort: '0s'
  }
};
