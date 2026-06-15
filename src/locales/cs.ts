/**
 * Czech locale
 *
 * Czech inflects the counted noun by both number and case, and the case
 * depends on direction: the future "za" takes the accusative, the past "před"
 * the instrumental, and a bare duration the nominative. Number has three CLDR
 * categories — one (1), few (2-4), other (0, 5+) — selected per case table by
 * `formatCount`.
 */

import type { Locale, RelativeUnit } from '../locale.js';

type Forms = Record<RelativeUnit, readonly [string, string, string]>;

const NOMINATIVE: Forms = {
  second: ['sekunda', 'sekundy', 'sekund'],
  minute: ['minuta', 'minuty', 'minut'],
  hour: ['hodina', 'hodiny', 'hodin'],
  day: ['den', 'dny', 'dní'],
  month: ['měsíc', 'měsíce', 'měsíců'],
  year: ['rok', 'roky', 'let']
};
const ACCUSATIVE: Forms = {
  second: ['sekundu', 'sekundy', 'sekund'],
  minute: ['minutu', 'minuty', 'minut'],
  hour: ['hodinu', 'hodiny', 'hodin'],
  day: ['den', 'dny', 'dní'],
  month: ['měsíc', 'měsíce', 'měsíců'],
  year: ['rok', 'roky', 'let']
};
const INSTRUMENTAL: Forms = {
  second: ['sekundou', 'sekundami', 'sekundami'],
  minute: ['minutou', 'minutami', 'minutami'],
  hour: ['hodinou', 'hodinami', 'hodinami'],
  day: ['dnem', 'dny', 'dny'],
  month: ['měsícem', 'měsíci', 'měsíci'],
  year: ['rokem', 'lety', 'lety']
};

// Czech: one (1), few (exactly 2-4), other (else) → 0 / 1 / 2
const category = (n: number): number => (n === 1 ? 0 : n >= 2 && n <= 4 ? 1 : 2);

// Calendar: accusative weekday + adjective. "příští" is invariant; "minulý"
// agrees with weekday gender (N N F M M F F, Monday-first).
const CS_ACC_DAY = ['pondělí', 'úterý', 'středu', 'čtvrtek', 'pátek', 'sobotu', 'neděli'];
const CS_LAST = ['minulé', 'minulé', 'minulou', 'minulý', 'minulý', 'minulou', 'minulou'];

const units = NOMINATIVE;
const shortUnits = {
  second: 's', minute: 'min', hour: 'h', day: 'd', month: 'měs', year: 'r'
} as const;

export const cs: Locale = {
  name: 'cs',
  months: [
    'leden', 'únor', 'březen', 'duben', 'květen', 'červen',
    'červenec', 'srpen', 'září', 'říjen', 'listopad', 'prosinec'
  ],
  monthsShort: ['led', 'úno', 'bře', 'dub', 'kvě', 'čvn', 'čvc', 'srp', 'zář', 'říj', 'lis', 'pro'],
  weekdays: ['pondělí', 'úterý', 'středa', 'čtvrtek', 'pátek', 'sobota', 'neděle'],
  weekdaysShort: ['po', 'út', 'st', 'čt', 'pá', 'so', 'ne'],
  meridiem: (hour) => (hour < 12 ? 'dop.' : 'odp.'),
  formatCount: (n, _forms, unit, future) => {
    const table = future === true ? ACCUSATIVE : future === false ? INSTRUMENTAL : NOMINATIVE;
    return `${n} ${table[unit][category(n)]}`;
  },
  relativeTime: {
    future: 'za {0}',
    past: 'před {0}',
    fewSeconds: 'pár sekund',
    now: 'teď',
    units,
    shortUnits
  },
  calendar: {
    today: 'dnes',
    tomorrow: 'zítra',
    yesterday: 'včera',
    nextWeek: (_wd, i) => `příští ${CS_ACC_DAY[i - 1]}`,
    lastWeek: (_wd, i) => `${CS_LAST[i - 1]} ${CS_ACC_DAY[i - 1]}`
  },
  duration: {
    units,
    shortUnits,
    listSeparator: ', ',
    zero: '0 sekund',
    zeroShort: '0s'
  },
  dateFormats: {
    short:  'DD.MM.YYYY',
    medium: 'D. MMM YYYY',
    long:   'D. MMMM YYYY',
    full:   'dddd D. MMMM YYYY'
  }
};
