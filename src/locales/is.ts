/**
 * Icelandic locale
 *
 * Icelandic inflects the counted noun for both number and case. Number follows
 * the CLDR rule (singular when n mod 10 = 1 and n mod 100 ≠ 11). Case depends
 * on direction: the future preposition "eftir" takes the accusative, the past
 * "fyrir … síðan" takes the dative, and a bare duration uses the nominative.
 * `formatCount` selects the right case table; each entry is [singular, plural].
 */

import type { Locale, RelativeUnit } from '../locale.js';

type Pair = readonly [string, string];

const NOMINATIVE: Record<RelativeUnit, Pair> = {
  second: ['sekúnda', 'sekúndur'],
  minute: ['mínúta', 'mínútur'],
  hour: ['klukkustund', 'klukkustundir'],
  day: ['dagur', 'dagar'],
  month: ['mánuður', 'mánuðir'],
  year: ['ár', 'ár']
};
const ACCUSATIVE: Record<RelativeUnit, Pair> = {
  second: ['sekúndu', 'sekúndur'],
  minute: ['mínútu', 'mínútur'],
  hour: ['klukkustund', 'klukkustundir'],
  day: ['dag', 'daga'],
  month: ['mánuð', 'mánuði'],
  year: ['ár', 'ár']
};
const DATIVE: Record<RelativeUnit, Pair> = {
  second: ['sekúndu', 'sekúndum'],
  minute: ['mínútu', 'mínútum'],
  hour: ['klukkustund', 'klukkustundum'],
  day: ['degi', 'dögum'],
  month: ['mánuði', 'mánuðum'],
  year: ['ári', 'árum']
};

const isSingular = (n: number): boolean => n % 10 === 1 && n % 100 !== 11;

const units = {
  second: NOMINATIVE.second,
  minute: NOMINATIVE.minute,
  hour: NOMINATIVE.hour,
  day: NOMINATIVE.day,
  month: NOMINATIVE.month,
  year: NOMINATIVE.year
} as const;

const shortUnits = {
  second: 'sek', minute: 'mín', hour: 'klst', day: 'd', month: 'mán', year: 'ár'
} as const;

export const is: Locale = {
  name: 'is',
  months: [
    'janúar', 'febrúar', 'mars', 'apríl', 'maí', 'júní',
    'júlí', 'ágúst', 'september', 'október', 'nóvember', 'desember'
  ],
  monthsShort: ['jan.', 'feb.', 'mar.', 'apr.', 'maí', 'jún.', 'júl.', 'ágú.', 'sep.', 'okt.', 'nóv.', 'des.'],
  weekdays: ['mánudagur', 'þriðjudagur', 'miðvikudagur', 'fimmtudagur', 'föstudagur', 'laugardagur', 'sunnudagur'],
  weekdaysShort: ['mán', 'þri', 'mið', 'fim', 'fös', 'lau', 'sun'],
  meridiem: (hour) => (hour < 12 ? 'f.h.' : 'e.h.'),
  // future → accusative, past → dative, bare duration → nominative
  formatCount: (n, _forms, unit, future) => {
    const table = future === true ? ACCUSATIVE : future === false ? DATIVE : NOMINATIVE;
    return `${n} ${table[unit][isSingular(n) ? 0 : 1]}`;
  },
  relativeTime: {
    future: 'eftir {0}',
    past: 'fyrir {0} síðan',
    fewSeconds: 'nokkrar sekúndur',
    now: 'núna',
    units,
    shortUnits
  },
  calendar: {
    today: 'í dag',
    tomorrow: 'á morgun',
    yesterday: 'í gær',
    nextWeek: 'næsta {0}',
    lastWeek: 'síðasta {0}'
  },
  duration: {
    units,
    shortUnits,
    listSeparator: ', ',
    zero: '0 sekúndur',
    zeroShort: '0sek'
  },
  dateFormats: {
    short:  'DD.MM.YYYY',
    medium: 'D. MMM YYYY',
    long:   'D. MMMM YYYY',
    full:   'dddd, D. MMMM YYYY'
  }
};
