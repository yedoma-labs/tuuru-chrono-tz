/**
 * te locale (auto-generated from CLDR)
 */

import type { Locale } from '../locale.js';

export const te: Locale = {
  name: 'te',
  months: [
    'జనవరి', 'ఫిబ్రవరి', 'మార్చి', 'ఏప్రిల్', 'మే', 'జూన్', 'జులై', 'ఆగస్టు', 'సెప్టెంబర్', 'అక్టోబర్', 'నవంబర్', 'డిసెంబర్'
  ],
  monthsShort: ['జన', 'ఫిబ్ర', 'మార్చి', 'ఏప్రి', 'మే', 'జూన్', 'జులై', 'ఆగ', 'సెప్టెం', 'అక్టో', 'నవం', 'డిసెం'],
  weekdays: ['సోమవారం', 'మంగళవారం', 'బుధవారం', 'గురువారం', 'శుక్రవారం', 'శనివారం', 'ఆదివారం'],
  weekdaysShort: ['సోమ', 'మంగళ', 'బుధ', 'గురు', 'శుక్ర', 'శని', 'ఆది'],
  meridiem: (hour) => hour < 12 ? 'AM' : 'PM',
  plural: (n) => n === 1 ? 0 : 1,
  relativeTime: {
    future: '{0} నిమిషంలో',
    past: '{0} నిమిషం క్రితం',
    fewSeconds: 'a few seconds',
    now: 'ప్రస్తుతం',
    units: {
      second: ['సెకను', 'సెకన్లు'],
      minute: ['నిమిషం', 'నిమిషాలు'],
      hour: ['గంట', 'గంటలు'],
      day: ['రోజు', 'రోజులు'],
      month: ['నెల', 'నెలలు'],
      year: ['సంవత్సరం', 'సంవత్సరాలు']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' }
  },
  calendar: {
    today: 'ఈ రోజు',
    tomorrow: 'రేపు',
    yesterday: 'నిన్న',
    nextWeek: '{0}',
    lastWeek: '{0}'
  },
  duration: {
    units: {
      second: ['సెకను', 'సెకన్లు'],
      minute: ['నిమిషం', 'నిమిషాలు'],
      hour: ['గంట', 'గంటలు'],
      day: ['రోజు', 'రోజులు'],
      month: ['నెల', 'నెలలు'],
      year: ['సంవత్సరం', 'సంవత్సరాలు']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' },
    listSeparator: ', ',
    zero: '0 సెకన్లు',
    zeroShort: '0s'
  },
  dateFormats: {
    short:  'DD/MM/YYYY',
    medium: 'D MMM YYYY',
    long:   'D MMMM YYYY',
    full:   'dddd, D MMMM YYYY'
  }
};
