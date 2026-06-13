/**
 * Tamil locale
 *
 * Tamil time units do not inflect for number in casual usage, so `plural`
 * always returns 0.
 */

import type { Locale } from '../locale.js';

const units = {
  second: ['நொடி'],
  minute: ['நிமிடம்'],
  hour: ['மணி நேரம்'],
  day: ['நாள்'],
  month: ['மாதம்'],
  year: ['ஆண்டு']
} as const;

const shortUnits = {
  second: 'நொ.', minute: 'நி.', hour: 'ம.நே.', day: 'நாள்', month: 'மா.', year: 'ஆ.'
} as const;

export const ta: Locale = {
  name: 'ta',
  months: [
    'ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்',
    'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்'
  ],
  monthsShort: ['ஜன.', 'பிப்.', 'மார்.', 'ஏப்.', 'மே', 'ஜூன்', 'ஜூலை', 'ஆக.', 'செப்.', 'அக்.', 'நவ.', 'டிச.'],
  weekdays: ['திங்கள்', 'செவ்வாய்', 'புதன்', 'வியாழன்', 'வெள்ளி', 'சனி', 'ஞாயிறு'],
  weekdaysShort: ['திங்.', 'செவ்.', 'புத.', 'வியா.', 'வெள்.', 'சனி', 'ஞாயி.'],
  meridiem: (hour) => (hour < 12 ? 'AM' : 'PM'),
  plural: () => 0,
  relativeTime: {
    future: '{0} இல்',
    past: '{0} முன்பு',
    fewSeconds: 'சில நொடிகள்',
    now: 'இப்போது',
    units,
    shortUnits
  },
  calendar: {
    today: 'இன்று',
    tomorrow: 'நாளை',
    yesterday: 'நேற்று',
    nextWeek: 'அடுத்த {0}',
    lastWeek: 'கடந்த {0}'
  },
  duration: {
    units,
    shortUnits,
    listSeparator: ', ',
    zero: '0 நொடி',
    zeroShort: '0நொ.'
  }
};
