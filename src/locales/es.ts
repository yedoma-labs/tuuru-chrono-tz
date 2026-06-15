/**
 * Spanish locale
 */

import type { Locale } from '../locale.js';

export const es: Locale = {
  name: 'es',
  months: [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ],
  monthsShort: [
    'ene', 'feb', 'mar', 'abr', 'may', 'jun',
    'jul', 'ago', 'sep', 'oct', 'nov', 'dic'
  ],
  weekdays: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'],
  weekdaysShort: ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'],
  meridiem: (hour, lowercase) => {
    const m = hour < 12 ? 'a. m.' : 'p. m.';
    return lowercase ? m : m.toUpperCase();
  },
  relativeTime: {
    future: 'en {0}',
    past: 'hace {0}',
    fewSeconds: 'unos segundos',
    now: 'ahora',
    units: {
      second: ['segundo', 'segundos'],
      minute: ['minuto', 'minutos'],
      hour: ['hora', 'horas'],
      day: ['día', 'días'],
      month: ['mes', 'meses'],
      year: ['año', 'años']
    },
    shortUnits: { second: 's', minute: 'min', hour: 'h', day: 'd', month: 'mes', year: 'a' }
  },
  calendar: {
    today: 'hoy',
    tomorrow: 'mañana',
    yesterday: 'ayer',
    nextWeek: 'el próximo {0}',
    lastWeek: 'el {0} pasado'
  },
  duration: {
    units: {
      second: ['segundo', 'segundos'],
      minute: ['minuto', 'minutos'],
      hour: ['hora', 'horas'],
      day: ['día', 'días'],
      month: ['mes', 'meses'],
      year: ['año', 'años']
    },
    shortUnits: { second: 's', minute: 'min', hour: 'h', day: 'd', month: 'mes', year: 'a' },
    listSeparator: ', ',
    zero: '0 segundos',
    zeroShort: '0s'
  },
  dateFormats: {
    short:  'DD/MM/YYYY',
    medium: 'D MMM YYYY',
    long:   'D MMMM YYYY',
    full:   'dddd, D MMMM YYYY'
  }
};
