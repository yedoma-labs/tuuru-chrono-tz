/**
 * hy locale (auto-generated from CLDR)
 */

import type { Locale } from '../locale.js';

export const hy: Locale = {
  name: 'hy',
  months: [
    'հունվարի', 'փետրվարի', 'մարտի', 'ապրիլի', 'մայիսի', 'հունիսի', 'հուլիսի', 'օգոստոսի', 'սեպտեմբերի', 'հոկտեմբերի', 'նոյեմբերի', 'դեկտեմբերի'
  ],
  monthsShort: ['հնվ', 'փտվ', 'մրտ', 'ապր', 'մյս', 'հնս', 'հլս', 'օգս', 'սեպ', 'հոկ', 'նոյ', 'դեկ'],
  weekdays: ['երկուշաբթի', 'երեքշաբթի', 'չորեքշաբթի', 'հինգշաբթի', 'ուրբաթ', 'շաբաթ', 'կիրակի'],
  weekdaysShort: ['երկ', 'երք', 'չրք', 'հնգ', 'ուր', 'շբթ', 'կիր'],
  meridiem: (hour) => hour < 12 ? 'AM' : 'PM',
  plural: (n) => n === 1 ? 0 : 1,
  relativeTime: {
    future: '{0} րոպեից',
    past: '{0} րոպե առաջ',
    fewSeconds: 'a few seconds',
    now: 'հիմա',
    units: {
      second: ['վայրկյան', 'վայրկյան'],
      minute: ['րոպե', 'րոպե'],
      hour: ['ժամ', 'ժամ'],
      day: ['օր', 'օր'],
      month: ['ամիս', 'ամիս'],
      year: ['տարի', 'տարի']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' }
  },
  calendar: {
    today: 'այսօր',
    tomorrow: 'վաղը',
    yesterday: 'երեկ',
    nextWeek: '{0}',
    lastWeek: '{0}'
  },
  duration: {
    units: {
      second: ['վայրկյան', 'վայրկյան'],
      minute: ['րոպե', 'րոպե'],
      hour: ['ժամ', 'ժամ'],
      day: ['օր', 'օր'],
      month: ['ամիս', 'ամիս'],
      year: ['տարի', 'տարի']
    },
    shortUnits: { second: 's', minute: 'm', hour: 'h', day: 'd', month: 'mo', year: 'y' },
    listSeparator: ', ',
    zero: '0 վայրկյան',
    zeroShort: '0s'
  }
};
