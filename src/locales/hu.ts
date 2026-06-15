/**
 * Hungarian locale
 *
 * A noun following a number stays singular in Hungarian (5 perc, not 5 percek),
 * so units have a single form.
 */

import type { Locale } from '../locale.js';

const units = {
  second: ['másodperc'],
  minute: ['perc'],
  hour: ['óra'],
  day: ['nap'],
  month: ['hónap'],
  year: ['év']
} as const;

const shortUnits = {
  second: 'mp', minute: 'p', hour: 'ó', day: 'nap', month: 'hó', year: 'év'
} as const;

export const hu: Locale = {
  name: 'hu',
  months: [
    'január', 'február', 'március', 'április', 'május', 'június',
    'július', 'augusztus', 'szeptember', 'október', 'november', 'december'
  ],
  monthsShort: ['jan.', 'feb.', 'márc.', 'ápr.', 'máj.', 'jún.', 'júl.', 'aug.', 'szept.', 'okt.', 'nov.', 'dec.'],
  weekdays: ['hétfő', 'kedd', 'szerda', 'csütörtök', 'péntek', 'szombat', 'vasárnap'],
  weekdaysShort: ['hét', 'kedd', 'sze', 'csüt', 'pén', 'szo', 'vas'],
  meridiem: (hour, lowercase) => {
    const m = hour < 12 ? 'DE' : 'DU';
    return lowercase ? m.toLowerCase() : m;
  },
  plural: () => 0,
  relativeTime: {
    future: '{0} múlva',
    past: '{0} ezelőtt',
    fewSeconds: 'néhány másodperc',
    now: 'most',
    units,
    shortUnits
  },
  calendar: {
    today: 'ma',
    tomorrow: 'holnap',
    yesterday: 'tegnap',
    nextWeek: 'jövő {0}',
    lastWeek: 'múlt {0}'
  },
  duration: {
    units,
    shortUnits,
    listSeparator: ', ',
    zero: '0 másodperc',
    zeroShort: '0mp'
  },
  dateFormats: {
    short:  'YYYY.MM.DD.',
    medium: 'YYYY. MMM D.',
    long:   'YYYY. MMMM D.',
    full:   'YYYY. MMMM D., dddd'
  }
};
