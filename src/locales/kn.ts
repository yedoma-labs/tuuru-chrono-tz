/**
 * kn locale (auto-generated from CLDR)
 */

import type { Locale } from '../locale.js';

export const kn: Locale = {
  name: 'kn',
  months: [
    'ಜನವರಿ', 'ಫೆಬ್ರವರಿ', 'ಮಾರ್ಚ್', 'ಏಪ್ರಿಲ್', 'ಮೇ', 'ಜೂನ್', 'ಜುಲೈ', 'ಆಗಸ್ಟ್', 'ಸೆಪ್ಟೆಂಬರ್', 'ಅಕ್ಟೋಬರ್', 'ನವೆಂಬರ್', 'ಡಿಸೆಂಬರ್'
  ],
  monthsShort: ['ಜನವರಿ', 'ಫೆಬ್ರವರಿ', 'ಮಾರ್ಚ್', 'ಏಪ್ರಿ', 'ಮೇ', 'ಜೂನ್', 'ಜುಲೈ', 'ಆಗ', 'ಸೆಪ್ಟೆಂ', 'ಅಕ್ಟೋ', 'ನವೆಂ', 'ಡಿಸೆಂ'],
  weekdays: ['ಸೋಮವಾರ', 'ಮಂಗಳವಾರ', 'ಬುಧವಾರ', 'ಗುರುವಾರ', 'ಶುಕ್ರವಾರ', 'ಶನಿವಾರ', 'ಭಾನುವಾರ'],
  weekdaysShort: ['ಸೋಮ', 'ಮಂಗಳ', 'ಬುಧ', 'ಗುರು', 'ಶುಕ್ರ', 'ಶನಿ', 'ಭಾನು'],
  meridiem: (hour) => hour < 12 ? 'ಪೂರ್ವಾಹ್ನ' : 'ಅಪರಾಹ್ನ',
  plural: (n) => n === 1 ? 0 : 1,
  relativeTime: {
    future: '{0} ನಿಮಿಷದಲ್ಲಿ',
    past: '{0} ನಿಮಿಷದ ಹಿಂದೆ',
    fewSeconds: 'a few seconds',
    now: 'ಈಗ',
    units: {
      second: ['ಸೆಕೆಂಡ್', 'ಸೆಕೆಂಡುಗಳು'],
      minute: ['ನಿಮಿಷ', 'ನಿಮಿಷಗಳು'],
      hour: ['ಗಂಟೆ', 'ಗಂಟೆಗಳು'],
      day: ['ದಿನ', 'ದಿನಗಳು'],
      month: ['ತಿಂಗಳು', 'ತಿಂಗಳು'],
      year: ['ವರ್ಷ', 'ವರ್ಷಗಳು']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' }
  },
  calendar: {
    today: 'ಇಂದು',
    tomorrow: 'ನಾಳೆ',
    yesterday: 'ನಿನ್ನೆ',
    nextWeek: '{0}',
    lastWeek: '{0}'
  },
  duration: {
    units: {
      second: ['ಸೆಕೆಂಡ್', 'ಸೆಕೆಂಡುಗಳು'],
      minute: ['ನಿಮಿಷ', 'ನಿಮಿಷಗಳು'],
      hour: ['ಗಂಟೆ', 'ಗಂಟೆಗಳು'],
      day: ['ದಿನ', 'ದಿನಗಳು'],
      month: ['ತಿಂಗಳು', 'ತಿಂಗಳು'],
      year: ['ವರ್ಷ', 'ವರ್ಷಗಳು']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' },
    listSeparator: ', ',
    zero: '0 ಸೆಕೆಂಡುಗಳು',
    zeroShort: '0s'
  }
};
