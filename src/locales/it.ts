/**
 * Italian locale
 */

import type { Locale } from '../locale.js';

export const it: Locale = {
  name: 'it',
  months: [
    'gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno',
    'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'
  ],
  monthsShort: [
    'gen', 'feb', 'mar', 'apr', 'mag', 'giu',
    'lug', 'ago', 'set', 'ott', 'nov', 'dic'
  ],
  weekdays: ['lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato', 'domenica'],
  weekdaysShort: ['lun', 'mar', 'mer', 'gio', 'ven', 'sab', 'dom'],
  meridiem: (hour, lowercase) => {
    const m = hour < 12 ? 'AM' : 'PM';
    return lowercase ? m.toLowerCase() : m;
  },
  relativeTime: {
    future: 'tra {0}',
    past: '{0} fa',
    fewSeconds: 'alcuni secondi',
    now: 'ora',
    units: {
      second: ['secondo', 'secondi'],
      minute: ['minuto', 'minuti'],
      hour: ['ora', 'ore'],
      day: ['giorno', 'giorni'],
      month: ['mese', 'mesi'],
      year: ['anno', 'anni']
    },
    shortUnits: { second: 's', minute: 'min', hour: 'h', day: 'g', month: 'mese', year: 'a' }
  },
  calendar: {
    today: 'oggi',
    tomorrow: 'domani',
    yesterday: 'ieri',
    // domenica (index 7) is feminine; weekdays 1-6 are masculine
    nextWeek: (wd, i) => `${wd} ${i === 7 ? 'prossima' : 'prossimo'}`,
    lastWeek: (wd, i) => `${wd} ${i === 7 ? 'scorsa' : 'scorso'}`
  },
  duration: {
    units: {
      second: ['secondo', 'secondi'],
      minute: ['minuto', 'minuti'],
      hour: ['ora', 'ore'],
      day: ['giorno', 'giorni'],
      month: ['mese', 'mesi'],
      year: ['anno', 'anni']
    },
    shortUnits: { second: 's', minute: 'min', hour: 'h', day: 'g', month: 'mese', year: 'a' },
    listSeparator: ', ',
    zero: '0 secondi',
    zeroShort: '0s'
  }
};
