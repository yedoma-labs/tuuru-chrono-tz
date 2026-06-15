/**
 * Hindi locale
 */

import type { Locale } from '../locale.js';

const units = {
  second: ['सेकंड', 'सेकंड'],
  minute: ['मिनट', 'मिनट'],
  hour: ['घंटा', 'घंटे'],
  day: ['दिन', 'दिन'],
  month: ['महीना', 'महीने'],
  year: ['साल', 'साल']
} as const;

const shortUnits = {
  second: 'से', minute: 'मि', hour: 'घं', day: 'दि', month: 'मा', year: 'सा'
} as const;

export const hi: Locale = {
  name: 'hi',
  months: [
    'जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
    'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'
  ],
  monthsShort: ['जन', 'फ़र', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुल', 'अग', 'सित', 'अक्टू', 'नव', 'दिस'],
  weekdays: ['सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार', 'रविवार'],
  weekdaysShort: ['सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि', 'रवि'],
  meridiem: (hour) => (hour < 12 ? 'पूर्वाह्न' : 'अपराह्न'),
  relativeTime: {
    future: '{0} में',
    past: '{0} पहले',
    fewSeconds: 'कुछ ही क्षण',
    now: 'अभी',
    units,
    shortUnits
  },
  calendar: {
    today: 'आज',
    tomorrow: 'कल',
    yesterday: 'कल',
    nextWeek: 'अगले {0}',
    lastWeek: 'पिछले {0}'
  },
  duration: {
    units,
    shortUnits,
    listSeparator: ', ',
    zero: '0 सेकंड',
    zeroShort: '0से'
  },
  dateFormats: {
    short:  'DD/MM/YYYY',
    medium: 'D MMM YYYY',
    long:   'D MMMM YYYY',
    full:   'dddd, D MMMM YYYY'
  }
};
