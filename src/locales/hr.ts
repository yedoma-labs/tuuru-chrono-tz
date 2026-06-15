/**
 * Croatian locale
 *
 * Case by direction: the future "za" takes the accusative, the past "prije"
 * the genitive, and a bare duration the nominative. Number follows the CLDR
 * one / few / other rule (like Russian), selected per case table by
 * `formatCount`.
 */

import type { Locale, RelativeUnit } from '../locale.js';

type Forms = Record<RelativeUnit, readonly [string, string, string]>;

const NOMINATIVE: Forms = {
  second: ['sekunda', 'sekunde', 'sekundi'],
  minute: ['minuta', 'minute', 'minuta'],
  hour: ['sat', 'sata', 'sati'],
  day: ['dan', 'dana', 'dana'],
  month: ['mjesec', 'mjeseca', 'mjeseci'],
  year: ['godina', 'godine', 'godina']
};
const ACCUSATIVE: Forms = {
  second: ['sekundu', 'sekunde', 'sekundi'],
  minute: ['minutu', 'minute', 'minuta'],
  hour: ['sat', 'sata', 'sati'],
  day: ['dan', 'dana', 'dana'],
  month: ['mjesec', 'mjeseca', 'mjeseci'],
  year: ['godinu', 'godine', 'godina']
};
const GENITIVE: Forms = {
  second: ['sekunde', 'sekunde', 'sekundi'],
  minute: ['minute', 'minute', 'minuta'],
  hour: ['sata', 'sata', 'sati'],
  day: ['dana', 'dana', 'dana'],
  month: ['mjeseca', 'mjeseca', 'mjeseci'],
  year: ['godine', 'godine', 'godina']
};

// CLDR Croatian: one / few / many → 0 / 1 / 2
const category = (n: number): number => {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 0;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 1;
  return 2;
};

// Weekday gender (M M F M M F F, Monday-first), accusative weekday + adjective.
const HR_ACC_DAY = ['ponedjeljak', 'utorak', 'srijedu', 'četvrtak', 'petak', 'subotu', 'nedjelju'];
const HR_NEXT = ['sljedeći', 'sljedeći', 'sljedeću', 'sljedeći', 'sljedeći', 'sljedeću', 'sljedeću'];
const HR_LAST = ['prošli', 'prošli', 'prošlu', 'prošli', 'prošli', 'prošlu', 'prošlu'];

const units = NOMINATIVE;
const shortUnits = {
  second: 's', minute: 'min', hour: 'h', day: 'd', month: 'mj', year: 'g'
} as const;

export const hr: Locale = {
  name: 'hr',
  months: [
    'siječanj', 'veljača', 'ožujak', 'travanj', 'svibanj', 'lipanj',
    'srpanj', 'kolovoz', 'rujan', 'listopad', 'studeni', 'prosinac'
  ],
  monthsShort: ['sij', 'velj', 'ožu', 'tra', 'svi', 'lip', 'srp', 'kol', 'ruj', 'lis', 'stu', 'pro'],
  weekdays: ['ponedjeljak', 'utorak', 'srijeda', 'četvrtak', 'petak', 'subota', 'nedjelja'],
  weekdaysShort: ['pon', 'uto', 'sri', 'čet', 'pet', 'sub', 'ned'],
  meridiem: (hour) => (hour < 12 ? 'AM' : 'PM'),
  formatCount: (n, _forms, unit, future) => {
    const table = future === true ? ACCUSATIVE : future === false ? GENITIVE : NOMINATIVE;
    return `${n} ${table[unit][category(n)]}`;
  },
  relativeTime: {
    future: 'za {0}',
    past: 'prije {0}',
    fewSeconds: 'nekoliko sekundi',
    now: 'sad',
    units,
    shortUnits
  },
  calendar: {
    today: 'danas',
    tomorrow: 'sutra',
    yesterday: 'jučer',
    nextWeek: (_wd, i) => `${HR_NEXT[i - 1]} ${HR_ACC_DAY[i - 1]}`,
    lastWeek: (_wd, i) => `${HR_LAST[i - 1]} ${HR_ACC_DAY[i - 1]}`
  },
  duration: {
    units,
    shortUnits,
    listSeparator: ', ',
    zero: '0 sekundi',
    zeroShort: '0s'
  },
  dateFormats: {
    short:  'DD.MM.YYYY',
    medium: 'D. MMM YYYY.',
    long:   'D. MMMM YYYY.',
    full:   'dddd, D. MMMM YYYY.'
  }
};
