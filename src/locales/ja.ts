/**
 * Japanese locale
 *
 * Japanese nouns are not inflected for number, so every unit has a single
 * form and `plural` always returns 0.
 */

import type { Locale } from '../locale.js';

const units = {
  second: ['秒'],
  minute: ['分'],
  hour: ['時間'],
  day: ['日'],
  month: ['ヶ月'],
  year: ['年']
} as const;

const shortUnits = {
  second: '秒', minute: '分', hour: '時間', day: '日', month: 'ヶ月', year: '年'
} as const;

export const ja: Locale = {
  name: 'ja',
  months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  monthsShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  weekdays: ['月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日', '日曜日'],
  weekdaysShort: ['月', '火', '水', '木', '金', '土', '日'],
  meridiem: (hour) => (hour < 12 ? '午前' : '午後'),
  plural: () => 0,
  numberSeparator: '',
  relativeTime: {
    future: '{0}後',
    past: '{0}前',
    fewSeconds: '数秒',
    now: '今',
    units,
    shortUnits
  },
  calendar: {
    today: '今日',
    tomorrow: '明日',
    yesterday: '昨日',
    nextWeek: '来週{0}',
    lastWeek: '先週{0}'
  },
  duration: {
    units,
    shortUnits,
    listSeparator: '',
    zero: '0秒',
    zeroShort: '0秒'
  },
  dateFormats: {
    short:  'YYYY/MM/DD',
    medium: 'YYYY年M月D日',
    long:   'YYYY年M月D日',
    full:   'YYYY年M月D日(ddd)'
  }
};
