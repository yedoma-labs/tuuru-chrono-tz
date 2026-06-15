/**
 * Slovak locale
 *
 * Like Czech: case by direction (future "o" + accusative, past "pred" +
 * instrumental, bare duration nominative) and three CLDR number categories
 * — one (1), few (2-4), other (else) — selected by `formatCount`.
 */

import type { Locale, RelativeUnit } from '../locale.js';

type Forms = Record<RelativeUnit, readonly [string, string, string]>;

const NOMINATIVE: Forms = {
  second: ['sekunda', 'sekundy', 'sekúnd'],
  minute: ['minúta', 'minúty', 'minút'],
  hour: ['hodina', 'hodiny', 'hodín'],
  day: ['deň', 'dni', 'dní'],
  month: ['mesiac', 'mesiace', 'mesiacov'],
  year: ['rok', 'roky', 'rokov']
};
const ACCUSATIVE: Forms = {
  second: ['sekundu', 'sekundy', 'sekúnd'],
  minute: ['minútu', 'minúty', 'minút'],
  hour: ['hodinu', 'hodiny', 'hodín'],
  day: ['deň', 'dni', 'dní'],
  month: ['mesiac', 'mesiace', 'mesiacov'],
  year: ['rok', 'roky', 'rokov']
};
const INSTRUMENTAL: Forms = {
  second: ['sekundou', 'sekundami', 'sekundami'],
  minute: ['minútou', 'minútami', 'minútami'],
  hour: ['hodinou', 'hodinami', 'hodinami'],
  day: ['dňom', 'dňami', 'dňami'],
  month: ['mesiacom', 'mesiacmi', 'mesiacmi'],
  year: ['rokom', 'rokmi', 'rokmi']
};

const category = (n: number): number => (n === 1 ? 0 : n >= 2 && n <= 4 ? 1 : 2);

// Weekday gender (M M F M M F F, Monday-first); adjectives agree.
const SK_ACC_DAY = ['pondelok', 'utorok', 'stredu', 'štvrtok', 'piatok', 'sobotu', 'nedeľu'];
const SK_NEXT = ['budúci', 'budúci', 'budúcu', 'budúci', 'budúci', 'budúcu', 'budúcu'];
const SK_LAST = ['minulý', 'minulý', 'minulú', 'minulý', 'minulý', 'minulú', 'minulú'];

const units = NOMINATIVE;
const shortUnits = {
  second: 's', minute: 'min', hour: 'h', day: 'd', month: 'mes', year: 'r'
} as const;

export const sk: Locale = {
  name: 'sk',
  months: [
    'január', 'február', 'marec', 'apríl', 'máj', 'jún',
    'júl', 'august', 'september', 'október', 'november', 'december'
  ],
  monthsShort: ['jan', 'feb', 'mar', 'apr', 'máj', 'jún', 'júl', 'aug', 'sep', 'okt', 'nov', 'dec'],
  weekdays: ['pondelok', 'utorok', 'streda', 'štvrtok', 'piatok', 'sobota', 'nedeľa'],
  weekdaysShort: ['po', 'ut', 'st', 'št', 'pi', 'so', 'ne'],
  meridiem: (hour) => (hour < 12 ? 'dopol.' : 'popol.'),
  formatCount: (n, _forms, unit, future) => {
    const table = future === true ? ACCUSATIVE : future === false ? INSTRUMENTAL : NOMINATIVE;
    return `${n} ${table[unit][category(n)]}`;
  },
  relativeTime: {
    future: 'o {0}',
    past: 'pred {0}',
    fewSeconds: 'pár sekúnd',
    now: 'teraz',
    units,
    shortUnits
  },
  calendar: {
    today: 'dnes',
    tomorrow: 'zajtra',
    yesterday: 'včera',
    nextWeek: (_wd, i) => `${SK_NEXT[i - 1]} ${SK_ACC_DAY[i - 1]}`,
    lastWeek: (_wd, i) => `${SK_LAST[i - 1]} ${SK_ACC_DAY[i - 1]}`
  },
  duration: {
    units,
    shortUnits,
    listSeparator: ', ',
    zero: '0 sekúnd',
    zeroShort: '0s'
  },
  dateFormats: {
    short:  'DD.MM.YYYY',
    medium: 'D. MMM YYYY',
    long:   'D. MMMM YYYY',
    full:   'dddd D. MMMM YYYY'
  }
};
