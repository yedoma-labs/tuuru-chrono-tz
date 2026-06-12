/**
 * Portuguese locale
 */

import type { Locale } from '../locale.js';

export const pt: Locale = {
  name: 'pt',
  months: [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
  ],
  monthsShort: [
    'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
    'jul', 'ago', 'set', 'out', 'nov', 'dez'
  ],
  weekdays: [
    'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira',
    'sexta-feira', 'sábado', 'domingo'
  ],
  weekdaysShort: ['seg', 'ter', 'qua', 'qui', 'sex', 'sáb', 'dom'],
  meridiem: (hour, lowercase) => {
    const m = hour < 12 ? 'AM' : 'PM';
    return lowercase ? m.toLowerCase() : m;
  },
  relativeTime: {
    future: 'em {0}',
    past: 'há {0}',
    fewSeconds: 'alguns segundos',
    now: 'agora',
    units: {
      second: ['segundo', 'segundos'],
      minute: ['minuto', 'minutos'],
      hour: ['hora', 'horas'],
      day: ['dia', 'dias'],
      month: ['mês', 'meses'],
      year: ['ano', 'anos']
    },
    shortUnits: { second: 's', minute: 'min', hour: 'h', day: 'd', month: 'mês', year: 'a' }
  },
  calendar: {
    today: 'hoje',
    tomorrow: 'amanhã',
    yesterday: 'ontem',
    nextWeek: 'próxima {0}',
    lastWeek: '{0} passada'
  },
  duration: {
    units: {
      second: ['segundo', 'segundos'],
      minute: ['minuto', 'minutos'],
      hour: ['hora', 'horas'],
      day: ['dia', 'dias'],
      month: ['mês', 'meses'],
      year: ['ano', 'anos']
    },
    shortUnits: { second: 's', minute: 'min', hour: 'h', day: 'd', month: 'mês', year: 'a' },
    listSeparator: ', ',
    zero: '0 segundos',
    zeroShort: '0s'
  }
};
