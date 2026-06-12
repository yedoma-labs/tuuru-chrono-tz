/**
 * Vietnamese locale
 *
 * Vietnamese has no grammatical number, so units have a single form.
 */

import type { Locale } from '../locale.js';

const units = {
  second: ['giây'],
  minute: ['phút'],
  hour: ['giờ'],
  day: ['ngày'],
  month: ['tháng'],
  year: ['năm']
} as const;

const shortUnits = {
  second: 'giây', minute: 'phút', hour: 'giờ', day: 'ngày', month: 'tháng', year: 'năm'
} as const;

export const vi: Locale = {
  name: 'vi',
  months: [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ],
  monthsShort: ['Thg 1', 'Thg 2', 'Thg 3', 'Thg 4', 'Thg 5', 'Thg 6', 'Thg 7', 'Thg 8', 'Thg 9', 'Thg 10', 'Thg 11', 'Thg 12'],
  weekdays: ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'],
  weekdaysShort: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
  meridiem: (hour) => (hour < 12 ? 'SA' : 'CH'),
  plural: () => 0,
  relativeTime: {
    future: '{0} tới',
    past: '{0} trước',
    fewSeconds: 'vài giây',
    now: 'bây giờ',
    units,
    shortUnits
  },
  calendar: {
    today: 'hôm nay',
    tomorrow: 'ngày mai',
    yesterday: 'hôm qua',
    nextWeek: '{0} tuần tới',
    lastWeek: '{0} tuần trước'
  },
  duration: {
    units,
    shortUnits,
    listSeparator: ', ',
    zero: '0 giây',
    zeroShort: '0 giây'
  }
};
