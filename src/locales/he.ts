/**
 * Hebrew locale
 *
 * Hebrew has three grammatical number forms:
 *   0 → singular  (n === 1)
 *   1 → dual      (n === 2) — special inflection for most time units
 *   2 → plural    (n >= 3)
 */

import type { Locale } from '../locale.js';

const units = {
  second: ['שנייה', 'שתי שניות', 'שניות'],
  minute: ['דקה', 'שתי דקות', 'דקות'],
  hour: ['שעה', 'שתי שעות', 'שעות'],
  day: ['יום', 'יומיים', 'ימים'],
  month: ['חודש', 'חודשיים', 'חודשים'],
  year: ['שנה', 'שנתיים', 'שנים']
} as const;

const shortUnits = {
  second: 'שנ׳', minute: 'דק׳', hour: 'שע׳', day: 'י׳', month: 'חו׳', year: 'שנ׳'
} as const;

export const he: Locale = {
  name: 'he',
  months: [
    'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
    'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
  ],
  monthsShort: ['ינו׳', 'פבר׳', 'מרץ', 'אפר׳', 'מאי', 'יוני', 'יולי', 'אוג׳', 'ספט׳', 'אוק׳', 'נוב׳', 'דצמ׳'],
  weekdays: ['שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת', 'ראשון'],
  weekdaysShort: ['ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'שב׳', 'א׳'],
  meridiem: (hour) => (hour < 12 ? 'לפנה"צ' : 'אחה"צ'),
  plural: (n) => (n === 1 ? 0 : n === 2 ? 1 : 2),
  relativeTime: {
    future: 'בעוד {0}',
    past: 'לפני {0}',
    fewSeconds: 'כמה שניות',
    now: 'עכשיו',
    units,
    shortUnits
  },
  calendar: {
    today: 'היום',
    tomorrow: 'מחר',
    yesterday: 'אתמול',
    nextWeek: '{0} הבא',
    lastWeek: '{0} שעבר'
  },
  duration: {
    units,
    shortUnits,
    listSeparator: ', ',
    zero: '0 שניות',
    zeroShort: '0שנ׳'
  }
};
