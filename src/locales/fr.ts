/**
 * French locale
 */

import type { Locale } from '../locale.js';

export const fr: Locale = {
  name: 'fr',
  months: [
    'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
  ],
  monthsShort: [
    'janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin',
    'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'
  ],
  weekdays: ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'],
  weekdaysShort: ['lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.', 'dim.'],
  meridiem: (hour, lowercase) => {
    const m = hour < 12 ? 'AM' : 'PM';
    return lowercase ? m.toLowerCase() : m;
  },
  relativeTime: {
    future: 'dans {0}',
    past: 'il y a {0}',
    fewSeconds: 'quelques secondes',
    now: 'maintenant',
    units: {
      second: ['seconde', 'secondes'],
      minute: ['minute', 'minutes'],
      hour: ['heure', 'heures'],
      day: ['jour', 'jours'],
      month: ['mois', 'mois'],
      year: ['an', 'ans']
    },
    shortUnits: { second: 's', minute: 'min', hour: 'h', day: 'j', month: 'mo', year: 'a' }
  },
  calendar: {
    today: "aujourd'hui",
    tomorrow: 'demain',
    yesterday: 'hier',
    nextWeek: '{0} prochain',
    lastWeek: '{0} dernier'
  },
  duration: {
    units: {
      second: ['seconde', 'secondes'],
      minute: ['minute', 'minutes'],
      hour: ['heure', 'heures'],
      day: ['jour', 'jours'],
      month: ['mois', 'mois'],
      year: ['an', 'ans']
    },
    shortUnits: { second: 's', minute: 'min', hour: 'h', day: 'j', month: 'mo', year: 'a' },
    listSeparator: ', ',
    zero: '0 seconde',
    zeroShort: '0s'
  }
};
