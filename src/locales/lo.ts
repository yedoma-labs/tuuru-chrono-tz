/**
 * lo locale (auto-generated from CLDR)
 */

import type { Locale } from '../locale.js';

export const lo: Locale = {
  name: 'lo',
  months: [
    'ມັງກອນ', 'ກຸມພາ', 'ມີນາ', 'ເມສາ', 'ພຶດສະພາ', 'ມິຖຸນາ', 'ກໍລະກົດ', 'ສິງຫາ', 'ກັນຍາ', 'ຕຸລາ', 'ພະຈິກ', 'ທັນວາ'
  ],
  monthsShort: ['ມ.ກ.', 'ກ.ພ.', 'ມ.ນ.', 'ມ.ສ.', 'ພ.ພ.', 'ມິ.ຖ.', 'ກ.ລ.', 'ສ.ຫ.', 'ກ.ຍ.', 'ຕ.ລ.', 'ພ.ຈ.', 'ທ.ວ.'],
  weekdays: ['ວັນຈັນ', 'ວັນອັງຄານ', 'ວັນພຸດ', 'ວັນພະຫັດ', 'ວັນສຸກ', 'ວັນເສົາ', 'ວັນອາທິດ'],
  weekdaysShort: ['ຈັນ', 'ອັງຄານ', 'ພຸດ', 'ພະຫັດ', 'ສຸກ', 'ເສົາ', 'ອາທິດ'],
  meridiem: (hour) => hour < 12 ? 'ກ່ອນທ່ຽງ' : 'ຫຼັງທ່ຽງ',
  plural: () => 0,
  relativeTime: {
    future: 'in {0}',
    past: '{0} ago',
    fewSeconds: 'a few seconds',
    now: 'ຕອນນີ້',
    units: {
      second: ['ວິນາທີ'],
      minute: ['ນາທີ'],
      hour: ['ຊົ່ວໂມງ'],
      day: ['ມື້'],
      month: ['ເດືອນ'],
      year: ['ປີ']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' }
  },
  calendar: {
    today: 'ມື້ນີ້',
    tomorrow: 'ມື້ອື່ນ',
    yesterday: 'ມື້ວານ',
    nextWeek: '{0}',
    lastWeek: '{0}'
  },
  duration: {
    units: {
      second: ['ວິນາທີ'],
      minute: ['ນາທີ'],
      hour: ['ຊົ່ວໂມງ'],
      day: ['ມື້'],
      month: ['ເດືອນ'],
      year: ['ປີ']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' },
    listSeparator: ', ',
    zero: '0 ວິນາທີ',
    zeroShort: '0s'
  }
};
