/**
 * tuuru-chrono-tz
 * 
 * TypeScript-first date/time library with built-in IANA timezone support.
 * 
 * @packageDocumentation
 */

export { DateTime } from './datetime.js';
export { Duration } from './duration.js';
export { Timezone } from './timezone.js';
export { LocalDate } from './localdate.js';
export { LocalTime } from './localtime.js';

// Locales (tree-shakeable: unused locales are dropped by bundlers)
// Ordered roughly by number of speakers.
export { en, setDefaultLocale, getDefaultLocale } from './locale.js';
export { zh } from './locales/zh.js';
export { hi } from './locales/hi.js';
export { es } from './locales/es.js';
export { bn } from './locales/bn.js';
export { pt } from './locales/pt.js';
export { ru } from './locales/ru.js';
export { id } from './locales/id.js';
export { ja } from './locales/ja.js';
export { de } from './locales/de.js';
export { fr } from './locales/fr.js';
export { ko } from './locales/ko.js';
export { tr } from './locales/tr.js';
export { vi } from './locales/vi.js';
export { pl } from './locales/pl.js';
export { nl } from './locales/nl.js';
export { th } from './locales/th.js';
export { it } from './locales/it.js';
export { ar } from './locales/ar.js';
export { fa } from './locales/fa.js';
export { ur } from './locales/ur.js';
export { uk } from './locales/uk.js';
export { da } from './locales/da.js';
export { sv } from './locales/sv.js';
export { nb } from './locales/nb.js';
export { fi } from './locales/fi.js';
export { is } from './locales/is.js';
export { hu } from './locales/hu.js';
export { ro } from './locales/ro.js';
export { bg } from './locales/bg.js';
export { el } from './locales/el.js';
export { cs } from './locales/cs.js';
export { sk } from './locales/sk.js';
export { hr } from './locales/hr.js';
export { sr } from './locales/sr.js';
export { ms } from './locales/ms.js';
export { sw } from './locales/sw.js';
export { he } from './locales/he.js';
export { ca } from './locales/ca.js';
export { tl } from './locales/tl.js';
export { gu } from './locales/gu.js';
export { mr } from './locales/mr.js';
export { ta } from './locales/ta.js';
// CLDR-generated locales
export { af } from './locales/af.js';
export { am } from './locales/am.js';
export { as } from './locales/as.js';
export { az } from './locales/az.js';
export { be } from './locales/be.js';
export { bs } from './locales/bs.js';
export { cy } from './locales/cy.js';
export { et } from './locales/et.js';
export { eu } from './locales/eu.js';
export { fil } from './locales/fil.js';
export { ga } from './locales/ga.js';
export { gl } from './locales/gl.js';
export { hy } from './locales/hy.js';
export { jv } from './locales/jv.js';
export { ka } from './locales/ka.js';
export { kk } from './locales/kk.js';
export { km } from './locales/km.js';
export { kn } from './locales/kn.js';
export { ky } from './locales/ky.js';
export { lo } from './locales/lo.js';
export { lt } from './locales/lt.js';
export { lv } from './locales/lv.js';
export { mk } from './locales/mk.js';
export { ml } from './locales/ml.js';
export { mn } from './locales/mn.js';
export { my } from './locales/my.js';
export { ne } from './locales/ne.js';
export { or } from './locales/or.js';
export { pa } from './locales/pa.js';
export { ps } from './locales/ps.js';
export { sd } from './locales/sd.js';
export { si } from './locales/si.js';
export { sl } from './locales/sl.js';
export { so } from './locales/so.js';
export { sq } from './locales/sq.js';
export { sr_Latn } from './locales/sr_Latn.js';
export { te } from './locales/te.js';
export { tk } from './locales/tk.js';
export { uz } from './locales/uz.js';
export { yue } from './locales/yue.js';
export { zh_Hans } from './locales/zh_Hans.js';
export { zh_Hant } from './locales/zh_Hant.js';
export { zu } from './locales/zu.js';
export type { Locale, RelativeUnit } from './locale.js';

export type {
  DateObject,
  TimeObject,
  DurationObject,
  DateTimeOptions,
  FormatOptions,
  ParseOptions,
  RelativeTimeOptions,
  HumanizeOptions,
  TimeUnit,
  Month,
  Day,
  Weekday
} from './types.js';

// Re-export timezone data (names/links only — the heavy zone/rule tables
// stay behind the './tzdata' subpath via getTimezoneData)
export {
  TIMEZONE_NAMES,
  TIMEZONE_COUNT,
  TIMEZONE_LINKS,
  TZDATA_VERSION
} from './tzdata/index.js';

export type { TimezoneName } from './tzdata/index.js';
