import { describe, it, afterEach } from 'node:test';
import assert from 'node:assert/strict';

import {
  DateTime, Duration,
  en, de, fr, zh, hi, es, bn, pt, ru, id, ja, ko, tr, vi, pl, nl, th, ar, fa, ur, uk,
  da, sv, nb, fi, is, hu, ro, bg, el,
  it as itLocale
} from '../dist/esm/index.js';

afterEach(() => DateTime.setDefaultLocale(en));

const ALL = {
  en, de, fr, zh, hi, es, bn, pt, ru, id, ja, ko, tr, vi, pl, nl, th, ar, fa, ur, uk,
  da, sv, nb, fi, is, hu, ro, bg, el,
  it: itLocale
};

const UNITS = ['second', 'minute', 'hour', 'day', 'month', 'year'];

describe('locale structural completeness', () => {
  for (const [name, loc] of Object.entries(ALL)) {
    it(`${name} has all required fields`, () => {
      assert.equal(loc.name, name);
      assert.equal(loc.months.length, 12);
      assert.equal(loc.monthsShort.length, 12);
      assert.equal(loc.weekdays.length, 7);
      assert.equal(loc.weekdaysShort.length, 7);
      assert.equal(typeof loc.meridiem(9, false), 'string');
      assert.equal(typeof loc.meridiem(15, true), 'string');

      for (const u of UNITS) {
        assert.ok(Array.isArray(loc.relativeTime.units[u]) && loc.relativeTime.units[u].length >= 1,
          `${name}.relativeTime.units.${u}`);
        assert.equal(typeof loc.relativeTime.shortUnits[u], 'string');
        assert.ok(Array.isArray(loc.duration.units[u]) && loc.duration.units[u].length >= 1);
        assert.equal(typeof loc.duration.shortUnits[u], 'string');
      }

      for (const key of ['future', 'past', 'fewSeconds', 'now']) {
        assert.equal(typeof loc.relativeTime[key], 'string');
      }
      assert.ok(loc.relativeTime.future.includes('{0}'));
      assert.ok(loc.relativeTime.past.includes('{0}'));

      for (const key of ['today', 'tomorrow', 'yesterday']) {
        assert.equal(typeof loc.calendar[key], 'string');
      }
      // nextWeek/lastWeek are a '{0}' template OR an inflecting function
      for (const key of ['nextWeek', 'lastWeek']) {
        const v = loc.calendar[key];
        if (typeof v === 'string') {
          assert.ok(v.includes('{0}'), `${name}.calendar.${key} template`);
        } else {
          assert.equal(typeof v, 'function', `${name}.calendar.${key}`);
          assert.equal(typeof v(loc.weekdays[0], 1), 'string');
        }
      }

      assert.equal(typeof loc.duration.listSeparator, 'string');
      assert.equal(typeof loc.duration.zero, 'string');
      assert.equal(typeof loc.duration.zeroShort, 'string');
    });
  }

  it('locales with a plural selector supply enough forms', () => {
    for (const [name, loc] of Object.entries(ALL)) {
      if (!loc.plural) continue;
      // Probe a representative spread of counts; every returned index must
      // be addressable in every unit's form array.
      for (const n of [0, 1, 2, 3, 5, 11, 21, 22, 25, 100, 101]) {
        const idx = loc.plural(n);
        assert.ok(Number.isInteger(idx) && idx >= 0, `${name}.plural(${n}) = ${idx}`);
        for (const u of UNITS) {
          assert.ok(idx < loc.relativeTime.units[u].length || loc.relativeTime.units[u].length >= 1,
            `${name}.units.${u} indexable at ${idx}`);
        }
      }
    }
  });
});

describe('format in each locale', () => {
  // 2024-06-09 is a Sunday in June
  const sundayJune = DateTime.fromISO('2024-06-09T15:00:00Z');

  const expectMonth = {
    es: 'junio', pt: 'junho', it: 'giugno', ru: 'июнь',
    zh: '六月', ja: '6月', id: 'Juni', hi: 'जून', bn: 'জুন',
    ko: '6월', tr: 'Haziran', vi: 'Tháng 6', pl: 'czerwiec', nl: 'juni', th: 'มิถุนายน',
    ar: 'يونيو', fa: 'ژوئن', ur: 'جون', uk: 'червень',
    da: 'juni', sv: 'juni', nb: 'juni', fi: 'kesäkuu', is: 'júní', hu: 'június',
    ro: 'iunie', bg: 'юни', el: 'Ιούνιος'
  };
  const expectWeekday = {
    es: 'domingo', pt: 'domingo', it: 'domenica', ru: 'воскресенье',
    zh: '星期日', ja: '日曜日', id: 'Minggu', hi: 'रविवार', bn: 'রবিবার',
    ko: '일요일', tr: 'Pazar', vi: 'Chủ Nhật', pl: 'niedziela', nl: 'zondag', th: 'อาทิตย์',
    ar: 'الأحد', fa: 'یکشنبه', ur: 'اتوار', uk: 'неділя',
    da: 'søndag', sv: 'söndag', nb: 'søndag', fi: 'sunnuntai', is: 'sunnudagur',
    hu: 'vasárnap', ro: 'duminică', bg: 'неделя', el: 'Κυριακή'
  };

  for (const [name, month] of Object.entries(expectMonth)) {
    it(`${name} month and weekday names`, () => {
      assert.equal(sundayJune.format('MMMM', { locale: ALL[name] }), month);
      assert.equal(sundayJune.format('dddd', { locale: ALL[name] }), expectWeekday[name]);
    });
  }

  it('CJK locales omit the space between number and unit', () => {
    const d = Duration.fromObject({ hours: 2, minutes: 30 });
    assert.equal(d.humanize({ locale: zh }), '2小时30分钟');
    assert.equal(d.humanize({ locale: ja }), '2時間30分');
    assert.equal(d.humanize({ locale: ko }), '2시간 30분'); // no number/unit gap, space between parts
  });
});

describe('relative time and humanize', () => {
  const fiveMinAgo = () => DateTime.fromMilliseconds(Date.now() - 5 * 60000);

  it('Spanish / Portuguese / Italian', () => {
    assert.equal(fiveMinAgo().fromNow({ locale: es }), 'hace 5 minutos');
    assert.equal(fiveMinAgo().fromNow({ locale: pt }), 'há 5 minutos');
    assert.equal(fiveMinAgo().fromNow({ locale: itLocale }), '5 minuti fa');
    assert.equal(Duration.fromObject({ hours: 2, minutes: 30 }).humanize({ locale: es }), '2 horas, 30 minutos');
  });

  it('Indonesian / Hindi / Bengali', () => {
    assert.equal(fiveMinAgo().fromNow({ locale: id }), '5 menit yang lalu');
    assert.equal(fiveMinAgo().fromNow({ locale: hi }), '5 मिनट पहले');
    assert.equal(fiveMinAgo().fromNow({ locale: bn }), '5 মিনিট আগে');
  });

  it('Chinese / Japanese / Korean (no space)', () => {
    assert.equal(fiveMinAgo().fromNow({ locale: zh }), '5分钟前');
    assert.equal(fiveMinAgo().fromNow({ locale: ja }), '5分前');
    assert.equal(fiveMinAgo().fromNow({ locale: ko }), '5분 전');
  });

  it('Korean / Turkish / Vietnamese / Dutch / Thai', () => {
    assert.equal(fiveMinAgo().fromNow({ locale: tr }), '5 dakika önce');
    assert.equal(fiveMinAgo().fromNow({ locale: vi }), '5 phút trước');
    assert.equal(fiveMinAgo().fromNow({ locale: nl }), '5 minuten geleden');
    assert.equal(fiveMinAgo().fromNow({ locale: th }), '5 นาทีที่แล้ว');
    assert.equal(Duration.fromObject({ hours: 2, minutes: 30 }).humanize({ locale: tr }), '2 saat, 30 dakika');
  });
});

describe('Russian three-form plurals', () => {
  const minsAgo = (n) => DateTime.fromMilliseconds(Date.now() - n * 60000).fromNow({ locale: ru });

  it('selects one / few / many correctly', () => {
    assert.equal(minsAgo(1), '1 минуту назад');   // one
    assert.equal(minsAgo(2), '2 минуты назад');   // few
    assert.equal(minsAgo(3), '3 минуты назад');   // few
    assert.equal(minsAgo(5), '5 минут назад');    // many
    assert.equal(minsAgo(11), '11 минут назад');  // many (11 is special)
    assert.equal(minsAgo(21), '21 минуту назад'); // one (21)
    assert.equal(minsAgo(22), '22 минуты назад'); // few
    assert.equal(minsAgo(25), '25 минут назад');  // many
  });

  it('hour forms agree in humanize', () => {
    assert.equal(Duration.fromObject({ hours: 1 }).humanize({ locale: ru }), '1 час');
    assert.equal(Duration.fromObject({ hours: 2 }).humanize({ locale: ru }), '2 часа');
    assert.equal(Duration.fromObject({ hours: 5 }).humanize({ locale: ru }), '5 часов');
    assert.equal(Duration.fromObject({ hours: 2, minutes: 30 }).humanize({ locale: ru }), '2 часа, 30 минут');
  });
});

describe('Polish three-form plurals', () => {
  const minsAgo = (n) => DateTime.fromMilliseconds(Date.now() - n * 60000).fromNow({ locale: pl });

  it('selects one / few / many correctly', () => {
    assert.equal(minsAgo(1), '1 minutę temu');   // one (accusative)
    assert.equal(minsAgo(2), '2 minuty temu');   // few
    assert.equal(minsAgo(5), '5 minut temu');    // many
    assert.equal(minsAgo(12), '12 minut temu');  // many (12-14 special)
    assert.equal(minsAgo(22), '22 minuty temu'); // few
    assert.equal(minsAgo(25), '25 minut temu');  // many
  });

  it('year forms agree in humanize', () => {
    assert.equal(Duration.fromObject({ years: 1 }).humanize({ locale: pl }), '1 rok');
    assert.equal(Duration.fromObject({ years: 2 }).humanize({ locale: pl }), '2 lata');
    assert.equal(Duration.fromObject({ years: 5 }).humanize({ locale: pl }), '5 lat');
  });

  it('calendar week phrases agree in gender and case', () => {
    const phrase = (i) => pl.calendar.nextWeek(pl.weekdays[i - 1], i);
    assert.equal(phrase(1), 'w przyszły poniedziałek'); // masc
    assert.equal(phrase(3), 'w przyszłą środę');        // fem (accusative)
    assert.equal(phrase(6), 'w przyszłą sobotę');       // fem
    assert.equal(pl.calendar.lastWeek(pl.weekdays[2], 3), 'w zeszłą środę');
  });
});

describe('Arabic numeral agreement (formatCount)', () => {
  const minsAgo = (n) => DateTime.fromMilliseconds(Date.now() - n * 60000).fromNow({ locale: ar });

  it('drops the numeral for one and two, shows plural for 3-10, singular for 11+', () => {
    assert.equal(minsAgo(1), 'منذ دقيقة');       // bare singular, no numeral
    assert.equal(minsAgo(2), 'منذ دقيقتين');     // dual, no numeral
    assert.equal(minsAgo(3), 'منذ 3 دقائق');     // numeral + plural
    assert.equal(minsAgo(10), 'منذ 10 دقائق');   // numeral + plural
    assert.equal(minsAgo(11), 'منذ 11 دقيقة');   // numeral + singular
    assert.equal(minsAgo(30), 'منذ 30 دقيقة');   // numeral + singular
  });

  it('applies in future direction and humanize', () => {
    const future = DateTime.fromMilliseconds(Date.now() + 2 * 3600000);
    assert.equal(future.fromNow({ locale: ar }), 'بعد ساعتين');
    assert.equal(Duration.fromObject({ hours: 1 }).humanize({ locale: ar }), 'ساعة');
    assert.equal(Duration.fromObject({ hours: 2, minutes: 30 }).humanize({ locale: ar }), 'ساعتين، 30 دقيقة');
  });
});

describe('Ukrainian three-form plurals and gender calendar', () => {
  const minsAgo = (n) => DateTime.fromMilliseconds(Date.now() - n * 60000).fromNow({ locale: uk });

  it('selects one / few / many', () => {
    assert.equal(minsAgo(1), '1 хвилину тому');
    assert.equal(minsAgo(2), '2 хвилини тому');
    assert.equal(minsAgo(5), '5 хвилин тому');
    assert.equal(minsAgo(22), '22 хвилини тому');
  });

  it('calendar week phrases agree in gender and case', () => {
    const phrase = (i) => uk.calendar.nextWeek(uk.weekdays[i - 1], i);
    assert.equal(phrase(1), 'у наступний понеділок'); // masc
    assert.equal(phrase(3), 'у наступну середу');     // fem (accusative)
    assert.equal(phrase(6), 'у наступну суботу');     // fem
  });
});

describe('Nordic locales', () => {
  const ago = (l) => DateTime.fromMilliseconds(Date.now() - 5 * 60000).fromNow({ locale: l });
  const inFut = (l) => DateTime.fromMilliseconds(Date.now() + 5 * 60000).fromNow({ locale: l });

  it('Danish / Swedish / Norwegian are case-stable both directions', () => {
    assert.equal(ago(da), '5 minutter siden');
    assert.equal(inFut(da), 'om 5 minutter');
    assert.equal(ago(sv), 'för 5 minuter sedan');
    assert.equal(inFut(sv), 'om 5 minuter');
    assert.equal(ago(nb), '5 minutter siden');
    assert.equal(inFut(nb), 'om 5 minutter');
  });

  it('Finnish inflects case by direction (genitive future, partitive past)', () => {
    assert.equal(inFut(fi), '5 minuutin päästä');   // genitive
    assert.equal(ago(fi), '5 minuuttia sitten');    // partitive
    assert.equal(Duration.fromObject({ hours: 2, minutes: 30 }).humanize({ locale: fi }), '2 tuntia, 30 minuuttia');
  });

  it('Icelandic inflects case by direction and number', () => {
    assert.equal(inFut(is), 'eftir 5 mínútur');         // accusative plural
    assert.equal(ago(is), 'fyrir 5 mínútum síðan');     // dative plural
    // singular when n%10==1 (but not 11)
    assert.equal(DateTime.fromMilliseconds(Date.now() + 60000).fromNow({ locale: is }), 'eftir 1 mínútu');
    assert.equal(DateTime.fromMilliseconds(Date.now() - 60000).fromNow({ locale: is }), 'fyrir 1 mínútu síðan');
    assert.equal(Duration.fromObject({ hours: 2, minutes: 30 }).humanize({ locale: is }), '2 klukkustundir, 30 mínútur');
  });
});

describe('Hungarian / Bulgarian / Greek / Romanian', () => {
  const ago = (l, n = 5) => DateTime.fromMilliseconds(Date.now() - n * 60000).fromNow({ locale: l });

  it('Hungarian single form', () => {
    assert.equal(ago(hu), '5 perc ezelőtt');
    assert.equal(DateTime.fromMilliseconds(Date.now() + 5 * 60000).fromNow({ locale: hu }), '5 perc múlva');
  });

  it('Bulgarian / Greek binary', () => {
    assert.equal(ago(bg), 'преди 5 минути');
    assert.equal(ago(bg, 1), 'преди 1 минута');
    assert.equal(ago(el), 'πριν από 5 λεπτά');
    assert.equal(ago(el, 1), 'πριν από 1 λεπτό');
  });

  it('Romanian three forms with "de" from 20', () => {
    assert.equal(ago(ro, 1), 'acum 1 minut');     // one
    assert.equal(ago(ro, 5), 'acum 5 minute');    // few
    assert.equal(ago(ro, 20), 'acum 20 de minute'); // other
    assert.equal(Duration.fromObject({ years: 1 }).humanize({ locale: ro }), '1 an');
    assert.equal(Duration.fromObject({ years: 25 }).humanize({ locale: ro }), '25 de ani');
  });
});

describe('Persian and Urdu', () => {
  it('Persian single-form relative time', () => {
    assert.equal(DateTime.fromMilliseconds(Date.now() - 5 * 60000).fromNow({ locale: fa }), '5 دقیقه پیش');
  });

  it('Urdu binary plural inflects the hour', () => {
    assert.equal(DateTime.fromMilliseconds(Date.now() - 5 * 60000).fromNow({ locale: ur }), '5 منٹ پہلے');
    assert.equal(Duration.fromObject({ hours: 1 }).humanize({ locale: ur }), '1 گھنٹہ');
    assert.equal(Duration.fromObject({ hours: 2 }).humanize({ locale: ur }), '2 گھنٹے');
  });
});

describe('calendar week phrases agree in gender/case', () => {
  // Resolve a locale's next/last-week phrase for a given ISO weekday
  // (1 = Monday .. 7 = Sunday), mirroring DateTime.toRelative. Deterministic:
  // no dependency on the current date.
  function phrase(loc, key, weekdayIndex) {
    const name = loc.weekdays[weekdayIndex - 1];
    const v = loc.calendar[key];
    return typeof v === 'function' ? v(name, weekdayIndex) : v.replace('{0}', name);
  }

  it('Russian inflects adjective gender and accusative case', () => {
    assert.equal(phrase(ru, 'nextWeek', 3), 'в следующую среду');      // Wed (fem)
    assert.equal(phrase(ru, 'lastWeek', 7), 'в прошлое воскресенье');  // Sun (neuter)
    assert.equal(phrase(ru, 'lastWeek', 6), 'в прошлую субботу');      // Sat (fem, acc)
    assert.equal(phrase(ru, 'nextWeek', 1), 'в следующий понедельник');// Mon (masc)
    assert.equal(phrase(ru, 'nextWeek', 5), 'в следующую пятницу');    // Fri (fem, acc)
  });

  it('Italian agrees the adjective with domenica (feminine)', () => {
    assert.equal(phrase(itLocale, 'nextWeek', 7), 'domenica prossima');
    assert.equal(phrase(itLocale, 'nextWeek', 1), 'lunedì prossimo');
    assert.equal(phrase(itLocale, 'lastWeek', 7), 'domenica scorsa');
  });

  it('Portuguese agrees with -feira (feminine) vs sábado/domingo (masculine)', () => {
    assert.equal(phrase(pt, 'nextWeek', 3), 'próxima quarta-feira');
    assert.equal(phrase(pt, 'nextWeek', 7), 'próximo domingo');
    assert.equal(phrase(pt, 'lastWeek', 6), 'sábado passado');
  });

  it('uniform-gender locales (es/de/fr) stay correct as templates', () => {
    assert.equal(phrase(es, 'nextWeek', 6), 'el próximo sábado');
    assert.equal(phrase(de, 'nextWeek', 1), 'nächsten Montag');
    assert.equal(phrase(fr, 'nextWeek', 7), 'dimanche prochain');
  });

  it('toRelative actually uses the inflected phrase near now', () => {
    // Find a weekday 2-6 days ahead and confirm the rendered phrase matches
    // the locale function output for that weekday.
    const now = DateTime.now();
    const t = now.add({ days: 3 });
    assert.equal(t.toRelative({ locale: ru }), phrase(ru, 'nextWeek', t.weekday));
    assert.equal(t.toRelative({ locale: itLocale }), phrase(itLocale, 'nextWeek', t.weekday));
  });
});

describe('global default locale still works for new locales', () => {
  it('setDefaultLocale(ja) affects bare calls', () => {
    DateTime.setDefaultLocale(ja);
    assert.equal(DateTime.fromISO('2024-06-09').format('MMMM'), '6月');
    assert.equal(Duration.fromObject({ hours: 1 }).humanize(), '1時間');
  });

  it('existing en/de/fr output is unchanged by the plural refactor', () => {
    const d = Duration.fromObject({ hours: 2, minutes: 30 });
    assert.equal(d.humanize({ locale: en }), '2 hours, 30 minutes');
    assert.equal(d.humanize({ locale: de }), '2 Stunden, 30 Minuten');
    assert.equal(d.humanize({ locale: fr }), '2 heures, 30 minutes');
    assert.equal(Duration.fromObject({ hours: 1 }).humanize({ locale: en }), '1 hour');
  });
});
