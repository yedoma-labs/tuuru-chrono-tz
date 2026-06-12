/**
 * Finnish locale
 *
 * Finnish inflects the counted noun's case by direction: the future uses the
 * genitive ("5 minuutin päästä"), the past and a bare duration use the
 * partitive ("5 minuuttia sitten" / "5 minuuttia"). The count itself does not
 * add a plural ending, so each case has a single form, selected by `formatCount`.
 */

import type { Locale, RelativeUnit } from '../locale.js';

const GENITIVE: Record<RelativeUnit, string> = {
  second: 'sekunnin', minute: 'minuutin', hour: 'tunnin',
  day: 'päivän', month: 'kuukauden', year: 'vuoden'
};
const PARTITIVE: Record<RelativeUnit, string> = {
  second: 'sekuntia', minute: 'minuuttia', hour: 'tuntia',
  day: 'päivää', month: 'kuukautta', year: 'vuotta'
};

const units = {
  second: ['sekuntia'],
  minute: ['minuuttia'],
  hour: ['tuntia'],
  day: ['päivää'],
  month: ['kuukautta'],
  year: ['vuotta']
} as const;

const shortUnits = {
  second: 's', minute: 'min', hour: 't', day: 'pv', month: 'kk', year: 'v'
} as const;

export const fi: Locale = {
  name: 'fi',
  months: [
    'tammikuu', 'helmikuu', 'maaliskuu', 'huhtikuu', 'toukokuu', 'kesäkuu',
    'heinäkuu', 'elokuu', 'syyskuu', 'lokakuu', 'marraskuu', 'joulukuu'
  ],
  monthsShort: ['tammi', 'helmi', 'maalis', 'huhti', 'touko', 'kesä', 'heinä', 'elo', 'syys', 'loka', 'marras', 'joulu'],
  weekdays: ['maanantai', 'tiistai', 'keskiviikko', 'torstai', 'perjantai', 'lauantai', 'sunnuntai'],
  weekdaysShort: ['ma', 'ti', 'ke', 'to', 'pe', 'la', 'su'],
  meridiem: (hour) => (hour < 12 ? 'ap.' : 'ip.'),
  // future → genitive, past/humanize → partitive
  formatCount: (n, _forms, unit, future) =>
    `${n} ${future === true ? GENITIVE[unit] : PARTITIVE[unit]}`,
  relativeTime: {
    future: '{0} päästä',
    past: '{0} sitten',
    fewSeconds: 'muutama sekunti',
    now: 'nyt',
    units,
    shortUnits
  },
  calendar: {
    today: 'tänään',
    tomorrow: 'huomenna',
    yesterday: 'eilen',
    nextWeek: 'ensi {0}',
    lastWeek: 'viime {0}'
  },
  duration: {
    units,
    shortUnits,
    listSeparator: ', ',
    zero: '0 sekuntia',
    zeroShort: '0s'
  }
};
