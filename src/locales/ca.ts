/**
 * Catalan locale
 *
 * Binary plural: singular for n === 1, plural otherwise.
 */

import type { Locale } from '../locale.js';

export const ca: Locale = {
  name: 'ca',
  months: [
    'Gener', 'Febrer', 'Març', 'Abril', 'Maig', 'Juny',
    'Juliol', 'Agost', 'Setembre', 'Octubre', 'Novembre', 'Desembre'
  ],
  monthsShort: ['Gen', 'Feb', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Des'],
  weekdays: ['Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres', 'Dissabte', 'Diumenge'],
  weekdaysShort: ['Dl', 'Dt', 'Dc', 'Dj', 'Dv', 'Ds', 'Dg'],
  meridiem: (hour, lc) => {
    const m = hour < 12 ? 'a. m.' : 'p. m.';
    return lc ? m : m.toUpperCase();
  },
  plural: (n) => (n === 1 ? 0 : 1),
  relativeTime: {
    future: "d'aquí {0}",
    past: 'fa {0}',
    fewSeconds: 'uns segons',
    now: 'ara mateix',
    units: {
      second: ['segon', 'segons'],
      minute: ['minut', 'minuts'],
      hour: ['hora', 'hores'],
      day: ['dia', 'dies'],
      month: ['mes', 'mesos'],
      year: ['any', 'anys']
    },
    shortUnits: { second: 's', minute: 'min', hour: 'h', day: 'd', month: 'mes', year: 'any' }
  },
  calendar: {
    today: 'avui',
    tomorrow: 'demà',
    yesterday: 'ahir',
    nextWeek: 'el {0} que ve',
    lastWeek: 'el {0} passat'
  },
  duration: {
    units: {
      second: ['segon', 'segons'],
      minute: ['minut', 'minuts'],
      hour: ['hora', 'hores'],
      day: ['dia', 'dies'],
      month: ['mes', 'mesos'],
      year: ['any', 'anys']
    },
    shortUnits: { second: 's', minute: 'min', hour: 'h', day: 'd', month: 'mes', year: 'any' },
    listSeparator: ', ',
    zero: '0 segons',
    zeroShort: '0s'
  }
};
