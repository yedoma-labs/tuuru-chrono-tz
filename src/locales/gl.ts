/**
 * gl locale (auto-generated from CLDR)
 */

import type { Locale } from '../locale.js';

export const gl: Locale = {
  name: 'gl',
  months: [
    'xaneiro', 'febreiro', 'marzo', 'abril', 'maio', 'xuño', 'xullo', 'agosto', 'setembro', 'outubro', 'novembro', 'decembro'
  ],
  monthsShort: ['xan.', 'feb.', 'mar.', 'abr.', 'maio', 'xuño', 'xul.', 'ago.', 'set.', 'out.', 'nov.', 'dec.'],
  weekdays: ['luns', 'martes', 'mércores', 'xoves', 'venres', 'sábado', 'domingo'],
  weekdaysShort: ['luns', 'mar.', 'mér.', 'xov.', 'ven.', 'sáb.', 'dom.'],
  meridiem: (hour) => hour < 12 ? 'a.m.' : 'p.m.',
  plural: (n) => n === 1 ? 0 : 1,
  relativeTime: {
    future: 'en {0}',
    past: 'hai {0}',
    fewSeconds: 'a few seconds',
    now: 'agora',
    units: {
      second: ['segundo', 'segundos'],
      minute: ['minuto', 'minutos'],
      hour: ['hora', 'horas'],
      day: ['día', 'días'],
      month: ['mes', 'meses'],
      year: ['ano', 'anos']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' }
  },
  calendar: {
    today: 'hoxe',
    tomorrow: 'mañá',
    yesterday: 'onte',
    nextWeek: '{0}',
    lastWeek: '{0}'
  },
  duration: {
    units: {
      second: ['segundo', 'segundos'],
      minute: ['minuto', 'minutos'],
      hour: ['hora', 'horas'],
      day: ['día', 'días'],
      month: ['mes', 'meses'],
      year: ['ano', 'anos']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' },
    listSeparator: ', ',
    zero: '0 segundos',
    zeroShort: '0s'
  }
};
