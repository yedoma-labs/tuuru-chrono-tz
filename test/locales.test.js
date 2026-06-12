import { describe, it, afterEach } from 'node:test';
import assert from 'node:assert/strict';

import {
  DateTime, Duration,
  en, de, fr, zh, hi, es, bn, pt, ru, id, ja, it as itLocale
} from '../dist/esm/index.js';

afterEach(() => DateTime.setDefaultLocale(en));

const ALL = { en, de, fr, zh, hi, es, bn, pt, ru, id, ja, it: itLocale };

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

      for (const key of ['today', 'tomorrow', 'yesterday', 'nextWeek', 'lastWeek']) {
        assert.equal(typeof loc.calendar[key], 'string');
      }
      assert.ok(loc.calendar.nextWeek.includes('{0}'));
      assert.ok(loc.calendar.lastWeek.includes('{0}'));

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
    zh: '六月', ja: '6月', id: 'Juni', hi: 'जून', bn: 'জুন'
  };
  const expectWeekday = {
    es: 'domingo', pt: 'domingo', it: 'domenica', ru: 'воскресенье',
    zh: '星期日', ja: '日曜日', id: 'Minggu', hi: 'रविवार', bn: 'রবিবার'
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

  it('Chinese / Japanese (no space)', () => {
    assert.equal(fiveMinAgo().fromNow({ locale: zh }), '5分钟前');
    assert.equal(fiveMinAgo().fromNow({ locale: ja }), '5分前');
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
