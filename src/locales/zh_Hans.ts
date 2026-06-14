/**
 * zh-Hans locale (auto-generated from CLDR)
 */

import type { Locale } from '../locale.js';

export const zh_Hans: Locale = {
  name: 'zh-Hans',
  months: [
    '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'
  ],
  monthsShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  weekdays: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
  weekdaysShort: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  meridiem: (hour) => hour < 12 ? '上午' : '下午',
  plural: () => 0,
  relativeTime: {
    future: 'in {0}',
    past: '{0} ago',
    fewSeconds: 'a few seconds',
    now: '现在',
    units: {
      second: ['秒钟'],
      minute: ['分钟'],
      hour: ['小时'],
      day: ['天'],
      month: ['个月'],
      year: ['年']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' }
  },
  calendar: {
    today: '今天',
    tomorrow: '明天',
    yesterday: '昨天',
    nextWeek: '{0}',
    lastWeek: '{0}'
  },
  duration: {
    units: {
      second: ['秒钟'],
      minute: ['分钟'],
      hour: ['小时'],
      day: ['天'],
      month: ['个月'],
      year: ['年']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' },
    listSeparator: ', ',
    zero: '0 秒钟',
    zeroShort: '0s'
  }
};
