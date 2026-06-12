/**
 * Romanian locale
 *
 * Three plural forms (one / few / other). Numbers from 20 take a "de" before
 * the noun (20 de minute), carried in the third form. Case does not change by
 * direction, so the same forms serve "peste {0}" and "acum {0}".
 */

import type { Locale } from '../locale.js';

const units = {
  second: ['secundă', 'secunde', 'de secunde'],
  minute: ['minut', 'minute', 'de minute'],
  hour: ['oră', 'ore', 'de ore'],
  day: ['zi', 'zile', 'de zile'],
  month: ['lună', 'luni', 'de luni'],
  year: ['an', 'ani', 'de ani']
} as const;

const shortUnits = {
  second: 'sec', minute: 'min', hour: 'h', day: 'zi', month: 'lună', year: 'an'
} as const;

export const ro: Locale = {
  name: 'ro',
  months: [
    'ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie',
    'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie'
  ],
  monthsShort: ['ian.', 'feb.', 'mar.', 'apr.', 'mai', 'iun.', 'iul.', 'aug.', 'sep.', 'oct.', 'nov.', 'dec.'],
  weekdays: ['luni', 'marți', 'miercuri', 'joi', 'vineri', 'sâmbătă', 'duminică'],
  weekdaysShort: ['lun', 'mar', 'mie', 'joi', 'vin', 'sâm', 'dum'],
  meridiem: (hour) => (hour < 12 ? 'a.m.' : 'p.m.'),
  // CLDR Romanian: one (n=1) / few (n=0 or n%100 in 1..19) / other → 0 / 1 / 2
  plural: (n) => {
    if (n === 1) return 0;
    const mod100 = n % 100;
    if (n === 0 || (mod100 >= 1 && mod100 <= 19)) return 1;
    return 2;
  },
  relativeTime: {
    future: 'peste {0}',
    past: 'acum {0}',
    fewSeconds: 'câteva secunde',
    now: 'acum',
    units,
    shortUnits
  },
  calendar: {
    today: 'azi',
    tomorrow: 'mâine',
    yesterday: 'ieri',
    nextWeek: '{0} viitoare',
    lastWeek: '{0} trecută'
  },
  duration: {
    units,
    shortUnits,
    listSeparator: ', ',
    zero: '0 secunde',
    zeroShort: '0sec'
  }
};
