/**
 * yue locale (auto-generated from CLDR)
 */

import type { Locale } from '../locale.js';

export const yue: Locale = {
  name: 'yue',
  months: [
    '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'
  ],
  monthsShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  weekdays: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
  weekdaysShort: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
  meridiem: (hour) => hour < 12 ? '上午' : '下午',
  plural: () => 0,
  relativeTime: {
    future: 'in {0}',
    past: '{0} ago',
    fewSeconds: 'a few seconds',
    now: '宜家',
    units: {
      second: ['秒'],
      minute: ['分鐘'],
      hour: ['小時'],
      day: ['天'],
      month: ['個月'],
      year: ['年']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' }
  },
  calendar: {
    today: '今日',
    tomorrow: '聽日',
    yesterday: '尋日',
    nextWeek: '{0}',
    lastWeek: '{0}'
  },
  duration: {
    units: {
      second: ['秒'],
      minute: ['分鐘'],
      hour: ['小時'],
      day: ['天'],
      month: ['個月'],
      year: ['年']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' },
    listSeparator: ', ',
    zero: '0 秒',
    zeroShort: '0s'
  },
  dateFormats: {
    short:  'YYYY/MM/DD',
    medium: 'YYYY年M月D日',
    long:   'YYYY年M月D日',
    full:   'YYYY年M月D日 dddd'
  }
};
