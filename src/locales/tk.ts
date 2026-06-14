/**
 * tk locale (auto-generated from CLDR)
 */

import type { Locale } from '../locale.js';

export const tk: Locale = {
  name: 'tk',
  months: [
    'ýanwar', 'fewral', 'mart', 'aprel', 'maý', 'iýun', 'iýul', 'awgust', 'sentýabr', 'oktýabr', 'noýabr', 'dekabr'
  ],
  monthsShort: ['ýan', 'few', 'mart', 'apr', 'maý', 'iýun', 'iýul', 'awg', 'sen', 'okt', 'noý', 'dek'],
  weekdays: ['duşenbe', 'sişenbe', 'çarşenbe', 'penşenbe', 'anna', 'şenbe', 'ýekşenbe'],
  weekdaysShort: ['duş', 'siş', 'çar', 'pen', 'ann', 'şen', 'ýek'],
  meridiem: (hour) => hour < 12 ? 'günortadan öň' : 'günortadan soň',
  plural: (n) => n === 1 ? 0 : 1,
  relativeTime: {
    future: '{0} minutdan',
    past: '{0} minut öň',
    fewSeconds: 'a few seconds',
    now: 'häzir',
    units: {
      second: ['sekunt', 'sekunt'],
      minute: ['minut', 'minut'],
      hour: ['sagat', 'sagat'],
      day: ['gün', 'gün'],
      month: ['aý', 'aý'],
      year: ['ýyl', 'ýyl']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' }
  },
  calendar: {
    today: 'şu gün',
    tomorrow: 'ertir',
    yesterday: 'düýn',
    nextWeek: '{0}',
    lastWeek: '{0}'
  },
  duration: {
    units: {
      second: ['sekunt', 'sekunt'],
      minute: ['minut', 'minut'],
      hour: ['sagat', 'sagat'],
      day: ['gün', 'gün'],
      month: ['aý', 'aý'],
      year: ['ýyl', 'ýyl']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' },
    listSeparator: ', ',
    zero: '0 sekunt',
    zeroShort: '0s'
  }
};
