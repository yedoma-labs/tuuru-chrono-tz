/**
 * ka locale (auto-generated from CLDR)
 */

import type { Locale } from '../locale.js';

export const ka: Locale = {
  name: 'ka',
  months: [
    'იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 'მაისი', 'ივნისი', 'ივლისი', 'აგვისტო', 'სექტემბერი', 'ოქტომბერი', 'ნოემბერი', 'დეკემბერი'
  ],
  monthsShort: ['იან', 'თებ', 'მარ', 'აპრ', 'მაი', 'ივნ', 'ივლ', 'აგვ', 'სექ', 'ოქტ', 'ნოე', 'დეკ'],
  weekdays: ['ორშაბათი', 'სამშაბათი', 'ოთხშაბათი', 'ხუთშაბათი', 'პარასკევი', 'შაბათი', 'კვირა'],
  weekdaysShort: ['ორშ', 'სამ', 'ოთხ', 'ხუთ', 'პარ', 'შაბ', 'კვი'],
  meridiem: (hour) => hour < 12 ? 'AM' : 'PM',
  plural: (n) => n === 1 ? 0 : 1,
  relativeTime: {
    future: '{0} წუთში',
    past: '{0} წუთის წინ',
    fewSeconds: 'a few seconds',
    now: 'ახლა',
    units: {
      second: ['წამი', 'წამი'],
      minute: ['წუთი', 'წუთი'],
      hour: ['საათი', 'საათი'],
      day: ['დღე', 'დღე'],
      month: ['თვე', 'თვე'],
      year: ['წელი', 'წელი']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' }
  },
  calendar: {
    today: 'დღეს',
    tomorrow: 'ხვალ',
    yesterday: 'გუშინ',
    nextWeek: '{0}',
    lastWeek: '{0}'
  },
  duration: {
    units: {
      second: ['წამი', 'წამი'],
      minute: ['წუთი', 'წუთი'],
      hour: ['საათი', 'საათი'],
      day: ['დღე', 'დღე'],
      month: ['თვე', 'თვე'],
      year: ['წელი', 'წელი']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' },
    listSeparator: ', ',
    zero: '0 წამი',
    zeroShort: '0s'
  },
  dateFormats: {
    short:  'DD.MM.YYYY',
    medium: 'D MMM, YYYY',
    long:   'D MMMM, YYYY',
    full:   'dddd, D MMMM, YYYY'
  }
};
