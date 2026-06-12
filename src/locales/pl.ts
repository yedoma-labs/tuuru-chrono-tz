/**
 * Polish locale
 *
 * Polish has three plural forms (one / few / many), like Russian. The unit
 * arrays carry accusative-count forms, which read correctly with the
 * relative templates ("za {0}", "{0} temu"):
 *   1 minutę · 2 minuty · 5 minut
 */

import type { Locale } from '../locale.js';

const units = {
  second: ['sekundę', 'sekundy', 'sekund'],
  minute: ['minutę', 'minuty', 'minut'],
  hour: ['godzinę', 'godziny', 'godzin'],
  day: ['dzień', 'dni', 'dni'],
  month: ['miesiąc', 'miesiące', 'miesięcy'],
  year: ['rok', 'lata', 'lat']
} as const;

const shortUnits = {
  second: 's', minute: 'min', hour: 'godz', day: 'd', month: 'mies', year: 'r'
} as const;

// Calendar weekday data, Monday-first (index 0..6).
// "w przyszły/zeszły <accusative weekday>", adjective agreeing with gender.
const PL_ACCUSATIVE = ['poniedziałek', 'wtorek', 'środę', 'czwartek', 'piątek', 'sobotę', 'niedzielę'];
const PL_NEXT = ['w przyszły', 'w przyszły', 'w przyszłą', 'w przyszły', 'w przyszły', 'w przyszłą', 'w przyszłą'];
const PL_LAST = ['w zeszły', 'w zeszły', 'w zeszłą', 'w zeszły', 'w zeszły', 'w zeszłą', 'w zeszłą'];

export const pl: Locale = {
  name: 'pl',
  months: [
    'styczeń', 'luty', 'marzec', 'kwiecień', 'maj', 'czerwiec',
    'lipiec', 'sierpień', 'wrzesień', 'październik', 'listopad', 'grudzień'
  ],
  monthsShort: ['sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru'],
  weekdays: ['poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota', 'niedziela'],
  weekdaysShort: ['pon', 'wt', 'śr', 'czw', 'pt', 'sob', 'niedz'],
  meridiem: (hour, lowercase) => {
    const m = hour < 12 ? 'AM' : 'PM';
    return lowercase ? m.toLowerCase() : m;
  },
  // CLDR Polish plural: one / few / many → 0 / 1 / 2
  plural: (n) => {
    if (n === 1) return 0;
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 1;
    return 2;
  },
  relativeTime: {
    future: 'za {0}',
    past: '{0} temu',
    fewSeconds: 'kilka sekund',
    now: 'teraz',
    units,
    shortUnits
  },
  calendar: {
    today: 'dzisiaj',
    tomorrow: 'jutro',
    yesterday: 'wczoraj',
    nextWeek: (_wd, i) => `${PL_NEXT[i - 1]} ${PL_ACCUSATIVE[i - 1]}`,
    lastWeek: (_wd, i) => `${PL_LAST[i - 1]} ${PL_ACCUSATIVE[i - 1]}`
  },
  duration: {
    units,
    shortUnits,
    listSeparator: ', ',
    zero: '0 sekund',
    zeroShort: '0s'
  }
};
