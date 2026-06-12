/**
 * Greek locale
 */

import type { Locale } from '../locale.js';

const units = {
  second: ['δευτερόλεπτο', 'δευτερόλεπτα'],
  minute: ['λεπτό', 'λεπτά'],
  hour: ['ώρα', 'ώρες'],
  day: ['μέρα', 'μέρες'],
  month: ['μήνας', 'μήνες'],
  year: ['χρόνος', 'χρόνια']
} as const;

const shortUnits = {
  second: 'δευτ', minute: 'λεπ', hour: 'ώ', day: 'μ', month: 'μήν', year: 'χρ'
} as const;

export const el: Locale = {
  name: 'el',
  months: [
    'Ιανουάριος', 'Φεβρουάριος', 'Μάρτιος', 'Απρίλιος', 'Μάιος', 'Ιούνιος',
    'Ιούλιος', 'Αύγουστος', 'Σεπτέμβριος', 'Οκτώβριος', 'Νοέμβριος', 'Δεκέμβριος'
  ],
  monthsShort: ['Ιαν', 'Φεβ', 'Μάρ', 'Απρ', 'Μάι', 'Ιούν', 'Ιούλ', 'Αύγ', 'Σεπ', 'Οκτ', 'Νοέ', 'Δεκ'],
  weekdays: ['Δευτέρα', 'Τρίτη', 'Τετάρτη', 'Πέμπτη', 'Παρασκευή', 'Σάββατο', 'Κυριακή'],
  weekdaysShort: ['Δευ', 'Τρί', 'Τετ', 'Πέμ', 'Παρ', 'Σάβ', 'Κυρ'],
  meridiem: (hour) => (hour < 12 ? 'π.μ.' : 'μ.μ.'),
  relativeTime: {
    future: 'σε {0}',
    past: 'πριν από {0}',
    fewSeconds: 'λίγα δευτερόλεπτα',
    now: 'τώρα',
    units,
    shortUnits
  },
  calendar: {
    today: 'σήμερα',
    tomorrow: 'αύριο',
    yesterday: 'χθες',
    nextWeek: 'επόμενη {0}',
    lastWeek: 'προηγούμενη {0}'
  },
  duration: {
    units,
    shortUnits,
    listSeparator: ', ',
    zero: '0 δευτερόλεπτα',
    zeroShort: '0δευτ'
  }
};
