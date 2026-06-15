/**
 * km locale (auto-generated from CLDR)
 */

import type { Locale } from '../locale.js';

export const km: Locale = {
  name: 'km',
  months: [
    'មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'
  ],
  monthsShort: ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'],
  weekdays: ['ច័ន្ទ', 'អង្គារ', 'ពុធ', 'ព្រហស្បតិ៍', 'សុក្រ', 'សៅរ៍', 'អាទិត្យ'],
  weekdaysShort: ['ចន្ទ', 'អង្គារ', 'ពុធ', 'ព្រហ', 'សុក្រ', 'សៅរ៍', 'អាទិត្យ'],
  meridiem: (hour) => hour < 12 ? 'AM' : 'PM',
  plural: () => 0,
  relativeTime: {
    future: 'in {0}',
    past: '{0} ago',
    fewSeconds: 'a few seconds',
    now: 'ឥឡូវ',
    units: {
      second: ['វិនាទី'],
      minute: ['នាទី'],
      hour: ['ម៉ោង'],
      day: ['ថ្ងៃ'],
      month: ['ខែ'],
      year: ['ឆ្នាំ']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' }
  },
  calendar: {
    today: 'ថ្ងៃ​នេះ',
    tomorrow: 'ថ្ងៃ​ស្អែក',
    yesterday: 'ម្សិលមិញ',
    nextWeek: '{0}',
    lastWeek: '{0}'
  },
  duration: {
    units: {
      second: ['វិនាទី'],
      minute: ['នាទី'],
      hour: ['ម៉ោង'],
      day: ['ថ្ងៃ'],
      month: ['ខែ'],
      year: ['ឆ្នាំ']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' },
    listSeparator: ', ',
    zero: '0 វិនាទី',
    zeroShort: '0s'
  },
  dateFormats: {
    short:  'DD/MM/YYYY',
    medium: 'D MMM YYYY',
    long:   'D MMMM YYYY',
    full:   'dddd D MMMM YYYY'
  }
};
