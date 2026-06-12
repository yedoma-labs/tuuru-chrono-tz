/**
 * Thai locale
 *
 * Thai has no grammatical number; units have a single form.
 */

import type { Locale } from '../locale.js';

const units = {
  second: ['วินาที'],
  minute: ['นาที'],
  hour: ['ชั่วโมง'],
  day: ['วัน'],
  month: ['เดือน'],
  year: ['ปี']
} as const;

const shortUnits = {
  second: 'วิ', minute: 'นาที', hour: 'ชม.', day: 'วัน', month: 'เดือน', year: 'ปี'
} as const;

export const th: Locale = {
  name: 'th',
  months: [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ],
  monthsShort: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'],
  weekdays: ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์'],
  weekdaysShort: ['จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.', 'อา.'],
  meridiem: (hour) => (hour < 12 ? 'ก่อนเที่ยง' : 'หลังเที่ยง'),
  plural: () => 0,
  relativeTime: {
    future: 'อีก {0}',
    past: '{0}ที่แล้ว',
    fewSeconds: 'ไม่กี่วินาที',
    now: 'ขณะนี้',
    units,
    shortUnits
  },
  calendar: {
    today: 'วันนี้',
    tomorrow: 'พรุ่งนี้',
    yesterday: 'เมื่อวาน',
    nextWeek: '{0}หน้า',
    lastWeek: '{0}ที่แล้ว'
  },
  duration: {
    units,
    shortUnits,
    listSeparator: ' ',
    zero: '0 วินาที',
    zeroShort: '0 วิ'
  }
};
