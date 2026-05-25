import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatDuration, formatCountdown, formatTimeAgo } from './utils';

describe('formatDuration', () => {
  it('returns hours only when less than 24 hours', () => {
    expect(formatDuration(5)).toBe('5h');
  });

  it('returns days only when hours divide evenly', () => {
    expect(formatDuration(48)).toBe('2d');
  });

  it('returns days and remaining hours when they do not divide evenly', () => {
    expect(formatDuration(50)).toBe('2d 2h');
  });
});

const FIXED_NOW = new Date('2026-01-01T12:00:00Z');

describe('formatCountdown', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns Finalizada and urgent=true when the date has passed', () => {
    expect(formatCountdown('2026-01-01T10:00:00Z')).toEqual({ text: 'Finalizada', urgent: true });
  });

  it('returns hours+minutes and urgent=true when less than 2 hours remain', () => {
    expect(formatCountdown('2026-01-01T13:00:00Z')).toEqual({ text: '1h 0m', urgent: true });
  });

  it('returns hours+minutes and urgent=false when between 2 and 24 hours remain', () => {
    expect(formatCountdown('2026-01-01T17:00:00Z')).toEqual({ text: '5h 0m', urgent: false });
  });

  it('returns days+hours and urgent=false when more than 24 hours remain', () => {
    expect(formatCountdown('2026-01-03T15:00:00Z')).toEqual({ text: '2d 3h', urgent: false });
  });
});

describe('formatTimeAgo', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns hoy when the date is today', () => {
    expect(formatTimeAgo('2026-01-01T08:00:00Z')).toBe('hoy');
  });

  it('returns ayer when the date was yesterday', () => {
    expect(formatTimeAgo('2025-12-31T12:00:00Z')).toBe('ayer');
  });

  it('returns hace N días when less than a week ago', () => {
    expect(formatTimeAgo('2025-12-26T12:00:00Z')).toBe('hace 6 días');
  });

  it('returns hace 1 semana at exactly 7 days', () => {
    expect(formatTimeAgo('2025-12-25T12:00:00Z')).toBe('hace 1 semana');
  });

  it('returns hace N semanas when less than a month ago', () => {
    expect(formatTimeAgo('2025-12-11T12:00:00Z')).toBe('hace 3 semanas');
  });

  it('returns hace 1 mes at exactly 30 days', () => {
    expect(formatTimeAgo('2025-12-02T12:00:00Z')).toBe('hace 1 mes');
  });

  it('returns hace N meses when more than a month ago', () => {
    expect(formatTimeAgo('2025-10-01T12:00:00Z')).toBe('hace 3 meses');
  });
});
