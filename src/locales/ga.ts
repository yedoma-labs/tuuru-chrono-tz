/**
 * ga locale (auto-generated from CLDR)
 */

import type { Locale } from '../locale.js';

export const ga: Locale = {
  name: 'ga',
  months: [
    'Eanáir', 'Feabhra', 'Márta', 'Aibreán', 'Bealtaine', 'Meitheamh', 'Iúil', 'Lúnasa', 'Meán Fómhair', 'Deireadh Fómhair', 'Samhain', 'Nollaig'
  ],
  monthsShort: ['Ean', 'Feabh', 'Márta', 'Aib', 'Beal', 'Meith', 'Iúil', 'Lún', 'MFómh', 'DFómh', 'Samh', 'Noll'],
  weekdays: ['Dé Luain', 'Dé Máirt', 'Dé Céadaoin', 'Déardaoin', 'Dé hAoine', 'Dé Sathairn', 'Dé Domhnaigh'],
  weekdaysShort: ['Luan', 'Máirt', 'Céad', 'Déar', 'Aoine', 'Sath', 'Domh'],
  meridiem: (hour) => hour < 12 ? 'r.n.' : 'i.n.',
  plural: (n) => n === 1 ? 0 : n === 2 ? 1 : n !== 8 && n !== 11 ? 2 : 3,
  relativeTime: {
    future: 'i gceann {0}',
    past: '{0} nóiméad ó shin',
    fewSeconds: 'a few seconds',
    now: 'anois',
    units: {
      second: ['soicind', 'shoicind', 'soicind'],
      minute: ['nóiméad', 'nóiméad', 'nóiméad'],
      hour: ['uair', 'huaire', 'uair'],
      day: ['lá', 'lá', 'lá'],
      month: ['mhí', 'mhí', 'mí'],
      year: ['bhliain', 'bliana', 'bliain']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' }
  },
  calendar: {
    today: 'inniu',
    tomorrow: 'amárach',
    yesterday: 'inné',
    nextWeek: '{0}',
    lastWeek: '{0}'
  },
  duration: {
    units: {
      second: ['soicind', 'shoicind', 'soicind'],
      minute: ['nóiméad', 'nóiméad', 'nóiméad'],
      hour: ['uair', 'huaire', 'uair'],
      day: ['lá', 'lá', 'lá'],
      month: ['mhí', 'mhí', 'mí'],
      year: ['bhliain', 'bliana', 'bliain']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' },
    listSeparator: ', ',
    zero: '0 soicind',
    zeroShort: '0s'
  }
};
