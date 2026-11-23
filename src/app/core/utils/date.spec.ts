import { formatShortDate, toDateKey } from './date';

describe('date utils', () => {
  it('toDateKey uses the local calendar date', () => {
    expect(toDateKey(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05');
    expect(toDateKey(new Date(2026, 11, 31, 0, 1))).toBe('2026-12-31');
  });

  it('formatShortDate renders a short label', () => {
    expect(formatShortDate('2026-11-23')).toBe('Nov 23');
  });
});
