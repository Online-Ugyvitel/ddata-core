const second = 1;
const minute = 60 * second;
const hour = 60 * minute;
const day = 24 * hour;
const dayInMilliseconds = day * 1000;
const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;
// the largest unit what fits into the time difference is displayed, in seconds
const timeUnits: Array<[Intl.RelativeTimeFormatUnit, number]> = [
  ['year', 365 * day],
  ['month', 30 * day],
  ['week', 7 * day],
  ['day', day],
  ['hour', hour],
  ['minute', minute],
  ['second', second]
];
// the same for calendar days, in days
const dayUnits: Array<[Intl.RelativeTimeFormatUnit, number]> = [
  ['year', 365],
  ['month', 30],
  ['week', 7],
  ['day', 1]
];

function format(locale: string, difference: number, units: typeof timeUnits): string {
  const [unit, size] = units.find(([, unitSize]) => Math.abs(difference) >= unitSize) ?? [
    units[units.length - 1][0],
    1
  ];

  // `|| 0` turns the negative zero into zero, otherwise it is formatted as "0 ... ago"
  return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(
    Math.trunc(difference / size) || 0,
    unit
  );
}

/**
 * Describes a moment relative to `now` with the largest unit what fits, e.g. "5 perc múlva", "in 2 hours".
 */
export function relativeTime(date: Date, now: Date, locale: string): string {
  return format(locale, (date.getTime() - now.getTime()) / 1000, timeUnits);
}

/**
 * Describes a calendar day relative to today, e.g. "ma", "holnap", "3 nappal ezelőtt", "next month".
 * Both days are in `YYYY-MM-DD` format, so daylight saving time changes do not shift the difference.
 */
export function relativeDay(dayKey: string, todayKey: string, locale: string): string {
  return format(
    locale,
    Math.round((Date.parse(dayKey) - Date.parse(todayKey)) / dayInMilliseconds),
    dayUnits
  );
}

/**
 * The calendar day (`YYYY-MM-DD`) of a moment in the given time zone, by default in the user's local one.
 */
export function toDayKey(date: Date, timeZone?: string): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes): string =>
    parts.find((item) => item.type === type).value;

  return `${part('year')}-${part('month')}-${part('day')}`;
}

export interface DeadlineInterface {
  /**
   * The calendar day in `YYYY-MM-DD` format.
   */
  day: string;
  /**
   * The moment of the deadline in milliseconds, for ordering.
   */
  time: number;
}

/**
 * Parses a deadline. A date without time (`2026-01-15`) is a calendar day in itself: it is not converted
 * from UTC midnight, what would be the previous day in the time zones west of UTC.
 * Returns `null` for a missing or invalid deadline.
 */
export function parseDeadline(
  deadline: string | null | undefined,
  timeZone?: string
): DeadlineInterface | null {
  const value = (deadline ?? '').trim();
  const time = Date.parse(value);

  if (!value || isNaN(time)) {
    return null;
  }

  if (!dateOnlyPattern.test(value)) {
    return { day: toDayKey(new Date(time), timeZone), time };
  }
  // `Date.parse` rolls over an impossible day (`2026-02-30` is March 2), so it is checked back
  const isoDate = new Date(time).toISOString();

  return isoDate.slice(0, 10) === value ? { day: value, time } : null;
}

/**
 * Formats a calendar day (`YYYY-MM-DD`) for display, e.g. "2026. jan. 15.".
 */
export function formatDay(dayKey: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: 'UTC' }).format(
    Date.parse(dayKey)
  );
}
