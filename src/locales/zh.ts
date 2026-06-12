/**
 * Chinese (Simplified Mandarin) locale
 *
 * Chinese nouns are not inflected for number, so every unit has a single
 * form and `plural` always returns 0.
 */

import type { Locale } from '../locale.js';

const units = {
  second: ['秒'],
  minute: ['分钟'],
  hour: ['小时'],
  day: ['天'],
  month: ['个月'],
  year: ['年']
} as const;

const shortUnits = {
  second: '秒', minute: '分', hour: '小时', day: '天', month: '个月', year: '年'
} as const;

export const zh: Locale = {
  name: 'zh',
  months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
  monthsShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  weekdays: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
  weekdaysShort: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  meridiem: (hour) => (hour < 12 ? '上午' : '下午'),
  plural: () => 0,
  numberSeparator: '',
  relativeTime: {
    future: '{0}后',
    past: '{0}前',
    fewSeconds: '几秒',
    now: '现在',
    units,
    shortUnits
  },
  calendar: {
    today: '今天',
    tomorrow: '明天',
    yesterday: '昨天',
    nextWeek: '下{0}',
    lastWeek: '上{0}'
  },
  duration: {
    units,
    shortUnits,
    listSeparator: '',
    zero: '0秒',
    zeroShort: '0秒'
  }
};
