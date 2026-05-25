import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getRemainingTime } from './auctionUtils';
import { theme } from '../styles/theme';

// We freeze time so every test runs against the same "now"
const FIXED_NOW = new Date('2026-01-01T12:00:00Z');

describe('getRemainingTime', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns Finalizada when the auction has already ended', () => {
    const result = getRemainingTime('2026-01-01T10:00:00Z'); // 2 hours ago
    expect(result).toEqual({ text: 'Finalizada', color: theme.colors.error });
  });

  it('returns days and hours when more than 1 day remains', () => {
    const result = getRemainingTime('2026-01-03T15:00:00Z'); // 2d 3h from now
    expect(result).toEqual({ text: '2d 3h', color: theme.colors.success });
  });

  it('returns hours when between 1 and 24 hours remain', () => {
    const result = getRemainingTime('2026-01-01T17:00:00Z'); // 5h from now
    expect(result).toEqual({ text: '5h', color: theme.colors.success });
  });

  it('returns Termina pronto when less than 1 hour remains', () => {
    const result = getRemainingTime('2026-01-01T12:30:00Z'); // 30 min from now
    expect(result).toEqual({ text: 'Termina pronto', color: theme.colors.warning });
  });
});
