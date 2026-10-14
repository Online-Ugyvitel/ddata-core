import { formatDay, parseDeadline, relativeDay, relativeTime, toDayKey } from './relative-time';

describe('relative time', () => {
  const now = new Date('2026-01-15T12:00:00Z');
  const after = (seconds: number): Date => new Date(now.getTime() + seconds * 1000);
  const minute = 60;
  const hour = 60 * minute;
  const day = 24 * hour;

  describe('relativeTime()', () => {
    it('should describe the past and the future', () => {
      expect(relativeTime(after(5 * minute), now, 'hu')).toBe('5 perc múlva');
      expect(relativeTime(after(-5 * minute), now, 'hu')).toBe('5 perccel ezelőtt');
      expect(relativeTime(after(5 * minute), now, 'en')).toBe('in 5 minutes');
      expect(relativeTime(after(-5 * minute), now, 'en')).toBe('5 minutes ago');
    });

    it('should describe now, tomorrow and yesterday', () => {
      expect(relativeTime(now, now, 'hu')).toBe('most');
      expect(relativeTime(after(-0.4), now, 'en')).toBe('now');
      expect(relativeTime(after(day), now, 'hu')).toBe('holnap');
      expect(relativeTime(after(-day), now, 'hu')).toBe('tegnap');
      expect(relativeTime(after(day), now, 'en')).toBe('tomorrow');
    });

    it('should switch the units at their boundaries', () => {
      const cases: Array<[number, string]> = [
        [59, '59 másodperc múlva'],
        [minute, '1 perc múlva'],
        [hour - 1, '59 perc múlva'],
        [hour, '1 óra múlva'],
        [day - 1, '23 óra múlva'],
        [day, 'holnap'],
        [7 * day - 1, '6 nap múlva'],
        [7 * day, 'következő hét'],
        [30 * day - 1, '4 hét múlva'],
        [30 * day, 'következő hónap'],
        [365 * day - 1, '12 hónap múlva'],
        [365 * day, 'következő év'],
        [-2 * 365 * day, '2 évvel ezelőtt']
      ];

      cases.forEach(([seconds, text]) =>
        expect(relativeTime(after(seconds), now, 'hu')).toBe(text)
      );
    });
  });

  describe('relativeDay()', () => {
    it('should describe the calendar days relative to today', () => {
      const cases: Array<[string, string, string]> = [
        ['2026-01-15', 'ma', 'today'],
        ['2026-01-16', 'holnap', 'tomorrow'],
        ['2026-01-14', 'tegnap', 'yesterday'],
        ['2026-01-17', 'holnapután', 'in 2 days'],
        ['2026-01-12', '3 nappal ezelőtt', '3 days ago'],
        ['2026-01-21', '6 nap múlva', 'in 6 days'],
        ['2026-01-22', 'következő hét', 'next week'],
        ['2026-02-13', '4 hét múlva', 'in 4 weeks'],
        ['2026-02-14', 'következő hónap', 'next month'],
        ['2026-06-15', '5 hónap múlva', 'in 5 months'],
        ['2027-01-14', '12 hónap múlva', 'in 12 months'],
        ['2027-01-15', 'következő év', 'next year'],
        ['2024-01-15', '2 évvel ezelőtt', '2 years ago']
      ];

      cases.forEach(([dayKey, hu, en]) => {
        expect(relativeDay(dayKey, '2026-01-15', 'hu')).toBe(hu);
        expect(relativeDay(dayKey, '2026-01-15', 'en')).toBe(en);
      });
    });

    it('should not be shifted by the daylight saving time change', () => {
      expect(relativeDay('2026-03-30', '2026-03-29', 'hu')).toBe('holnap');
      expect(relativeDay('2026-10-26', '2026-10-24', 'hu')).toBe('holnapután');
    });
  });

  describe('toDayKey()', () => {
    it('should return the calendar day in the time zone', () => {
      expect(toDayKey(new Date('2026-01-15T22:59:00Z'), 'Europe/Budapest')).toBe('2026-01-15');
      expect(toDayKey(new Date('2026-01-15T23:00:00Z'), 'Europe/Budapest')).toBe('2026-01-16');
      expect(toDayKey(new Date('2026-01-16T04:59:00Z'), 'America/New_York')).toBe('2026-01-15');
      expect(toDayKey(new Date('2026-01-15T10:00:00Z'), 'Asia/Tokyo')).toBe('2026-01-15');
      expect(toDayKey(new Date('2026-01-15T15:00:00Z'), 'Asia/Tokyo')).toBe('2026-01-16');
    });

    it('should use the local time zone by default', () => {
      expect(toDayKey(new Date(2026, 4, 1, 0, 0))).toBe('2026-05-01');
      expect(toDayKey(new Date(2026, 4, 1, 23, 59))).toBe('2026-05-01');
    });
  });

  describe('parseDeadline()', () => {
    it('should parse a date-time in the time zone', () => {
      expect(parseDeadline('2026-01-15T23:30:00Z', 'Europe/Budapest')).toEqual({
        day: '2026-01-16',
        time: Date.parse('2026-01-15T23:30:00Z')
      });
    });

    it('should keep the day of a date without time in every time zone', () => {
      ['America/Los_Angeles', 'Pacific/Kiritimati', undefined].forEach((timeZone) =>
        expect(parseDeadline('2026-01-15', timeZone).day).toBe('2026-01-15')
      );
      expect(parseDeadline(' 2026-01-15 ').day).toBe('2026-01-15');
    });

    it('should return null for a missing or invalid deadline', () => {
      [undefined, null, '', '   ', 'not a date', '2026-02-30', '2026-13-01'].forEach((deadline) =>
        expect(parseDeadline(deadline)).toBeNull()
      );
    });
  });

  describe('formatDay()', () => {
    it('should format the calendar day in the locale', () => {
      expect(formatDay('2026-01-15', 'hu')).toBe('2026. jan. 15.');
      expect(formatDay('2026-01-15', 'en')).toBe('Jan 15, 2026');
    });
  });
});
