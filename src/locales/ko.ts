/**
 * Korean locale
 *
 * Korean does not inflect nouns for number; single-form units, and no space
 * between the number and its counter (5분 전).
 */

import type { Locale } from '../locale.js';

const units = {
  second: ['초'],
  minute: ['분'],
  hour: ['시간'],
  day: ['일'],
  month: ['개월'],
  year: ['년']
} as const;

const shortUnits = {
  second: '초', minute: '분', hour: '시간', day: '일', month: '개월', year: '년'
} as const;

export const ko: Locale = {
  name: 'ko',
  months: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  monthsShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  weekdays: ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'],
  weekdaysShort: ['월', '화', '수', '목', '금', '토', '일'],
  meridiem: (hour) => (hour < 12 ? '오전' : '오후'),
  plural: () => 0,
  numberSeparator: '',
  relativeTime: {
    future: '{0} 후',
    past: '{0} 전',
    fewSeconds: '몇 초',
    now: '지금',
    units,
    shortUnits
  },
  calendar: {
    today: '오늘',
    tomorrow: '내일',
    yesterday: '어제',
    nextWeek: '다음 {0}',
    lastWeek: '지난 {0}'
  },
  duration: {
    units,
    shortUnits,
    listSeparator: ' ',
    zero: '0초',
    zeroShort: '0초'
  }
};
