import { describe, it, afterEach } from 'node:test';
import assert from 'node:assert/strict';

import {
  DateTime,
  Duration,
  en,
  de,
  fr,
  setDefaultLocale,
  getDefaultLocale
} from '../dist/esm/index.js';

// Every test must leave the global default as English
afterEach(() => setDefaultLocale(en));

describe('locale objects', () => {
  it('en is the initial default', () => {
    assert.equal(getDefaultLocale().name, 'en');
  });

  for (const locale of [en, de, fr]) {
    it(`${locale.name} is structurally complete`, () => {
      assert.equal(locale.months.length, 12);
      assert.equal(locale.monthsShort.length, 12);
      assert.equal(locale.weekdays.length, 7);
      assert.equal(locale.weekdaysShort.length, 7);
      assert.equal(typeof locale.meridiem(9, false), 'string');
      for (const unit of ['second', 'minute', 'hour', 'day', 'month', 'year']) {
        assert.equal(locale.relativeTime.units[unit].length, 2);
        assert.equal(typeof locale.relativeTime.shortUnits[unit], 'string');
        assert.equal(locale.duration.units[unit].length, 2);
      }
    });
  }
});

describe('format with locales', () => {
  const dt = DateTime.fromISO('2024-06-09T10:30:00Z'); // Sunday, June

  it('per-call locale option', () => {
    assert.equal(dt.format('MMMM', { locale: de }), 'Juni');
    assert.equal(dt.format('MMMM', { locale: fr }), 'juin');
    assert.equal(dt.format('dddd', { locale: de }), 'Sonntag');
    assert.equal(dt.format('dddd', { locale: fr }), 'dimanche');
    assert.equal(dt.format('ddd MMM', { locale: de }), 'So Jun');
  });

  it('per-instance locale via setLocale (immutable)', () => {
    const german = dt.setLocale(de);
    assert.equal(german.format('dddd, MMMM D'), 'Sonntag, Juni 9');
    assert.equal(german.locale, 'de');
    assert.equal(dt.locale, 'en'); // original untouched
  });

  it('instance locale survives transformations', () => {
    const german = dt.setLocale(de);
    assert.equal(german.add({ days: 1 }).format('dddd'), 'Montag');
    assert.equal(german.setTimezone('Asia/Tokyo').locale, 'de');
    assert.equal(german.startOf('week').format('dddd'), 'Montag');
  });

  it('global default via DateTime.setDefaultLocale', () => {
    DateTime.setDefaultLocale(fr);
    assert.equal(dt.format('MMMM'), 'juin');
    assert.equal(DateTime.fromISO('2024-06-10').format('dddd'), 'lundi');
  });

  it('meridiem is locale-aware', () => {
    assert.equal(dt.format('h A', { locale: de }), '10 Vorm.');
    assert.equal(DateTime.fromISO('2024-06-09T15:00:00Z').format('h a', { locale: de }), '3 nachm.');
  });
});

describe('relative time with locales', () => {
  it('fromNow in German and French', () => {
    const past = DateTime.fromMilliseconds(Date.now() - 5 * 60000);
    assert.equal(past.fromNow({ locale: de }), 'vor 5 Minuten');
    assert.equal(past.fromNow({ locale: fr }), 'il y a 5 minutes');

    const future = DateTime.fromMilliseconds(Date.now() + 2 * 3600000);
    assert.equal(future.fromNow({ locale: de }), 'in 2 Stunden');
    assert.equal(future.fromNow({ locale: fr }), 'dans 2 heures');
  });

  it('singular forms', () => {
    const past = DateTime.fromMilliseconds(Date.now() - 60 * 1000);
    assert.equal(past.fromNow({ locale: de }), 'vor 1 Minute');
    assert.equal(past.fromNow({ locale: fr }), 'il y a 1 minute');
  });

  it('toRelative calendar words', () => {
    assert.equal(DateTime.now().toRelative({ locale: de }), 'heute');
    assert.equal(DateTime.now().subtract({ days: 1 }).toRelative({ locale: fr }), 'hier');
    assert.equal(DateTime.now().add({ days: 1 }).toRelative({ locale: de }), 'morgen');
    assert.match(DateTime.now().add({ days: 3 }).toRelative({ locale: de }), /^nächsten /);
    assert.match(DateTime.now().subtract({ days: 3 }).toRelative({ locale: fr }), / dernier$/);
  });

  it('instance locale applies to relative output', () => {
    const past = DateTime.fromMilliseconds(Date.now() - 5 * 60000).setLocale(de);
    assert.equal(past.fromNow(), 'vor 5 Minuten');
  });
});

describe('Duration.humanize with locales', () => {
  it('long form', () => {
    const d = Duration.fromObject({ hours: 2, minutes: 30 });
    assert.equal(d.humanize({ locale: de }), '2 Stunden, 30 Minuten');
    assert.equal(d.humanize({ locale: fr }), '2 heures, 30 minutes');
  });

  it('singular and zero forms', () => {
    assert.equal(Duration.fromObject({ hours: 1 }).humanize({ locale: de }), '1 Stunde');
    assert.equal(Duration.fromMilliseconds(0).humanize({ locale: de }), '0 Sekunden');
  });

  it('global default applies', () => {
    setDefaultLocale(fr);
    assert.equal(Duration.fromObject({ minutes: 5 }).humanize(), '5 minutes');
    assert.equal(Duration.fromObject({ hours: 1 }).humanize(), '1 heure');
  });
});
