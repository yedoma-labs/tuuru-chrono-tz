/**
 * German locale
 */

import type { Locale } from '../locale.js';

export const de: Locale = {
  name: 'de',
  months: [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ],
  monthsShort: [
    'Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun',
    'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'
  ],
  weekdays: ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'],
  weekdaysShort: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
  meridiem: (hour, lowercase) => {
    const m = hour < 12 ? 'vorm.' : 'nachm.';
    return lowercase ? m : m.charAt(0).toUpperCase() + m.slice(1);
  },
  relativeTime: {
    future: 'in {0}',
    past: 'vor {0}',
    fewSeconds: 'ein paar Sekunden',
    now: 'jetzt',
    units: {
      second: ['Sekunde', 'Sekunden'],
      minute: ['Minute', 'Minuten'],
      hour: ['Stunde', 'Stunden'],
      day: ['Tag', 'Tagen'],
      month: ['Monat', 'Monaten'],
      year: ['Jahr', 'Jahren']
    },
    shortUnits: { second: 's', minute: 'Min.', hour: 'Std.', day: 'T', month: 'Mon.', year: 'J' }
  },
  calendar: {
    today: 'heute',
    tomorrow: 'morgen',
    yesterday: 'gestern',
    nextWeek: 'nächsten {0}',
    lastWeek: 'letzten {0}'
  },
  duration: {
    units: {
      second: ['Sekunde', 'Sekunden'],
      minute: ['Minute', 'Minuten'],
      hour: ['Stunde', 'Stunden'],
      day: ['Tag', 'Tage'],
      month: ['Monat', 'Monate'],
      year: ['Jahr', 'Jahre']
    },
    shortUnits: { second: 's', minute: 'Min.', hour: 'Std.', day: 'T', month: 'Mon.', year: 'J' },
    listSeparator: ', ',
    zero: '0 Sekunden',
    zeroShort: '0s'
  },
  dateFormats: {
    short:  'DD.MM.YYYY',
    medium: 'D. MMM YYYY',
    long:   'D. MMMM YYYY',
    full:   'dddd, D. MMMM YYYY'
  }
};
