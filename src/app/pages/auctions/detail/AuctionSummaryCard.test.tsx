// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import AuctionSummaryCard from './AuctionSummaryCard';
import type { Auction } from '../../../interfaces/auctions/Auction';

afterEach(cleanup);

const FIXED_NOW = new Date('2026-06-01T12:00:00Z');

const baseAuction: Auction = {
  id: 'auction-1',
  card: {
    id: 'ARG10',
    number: 10,
    type: 'JUGADOR',
    description: 'Lionel Messi',
    country: 'Argentina',
    team: 'Inter Miami',
    category: 'LEGENDARIO',
  },
  publisherId: {
    id: 'user-1',
    name: 'Carlos García',
    email: '',
    rating: 4.5,
    exchangesAmount: 12,
    avatarId: 'avatar_3',
    creationDate: '',
  },
  status: 'ACTIVA',
  creationDate: '',
  endDate: '2026-06-03T12:00:00Z',
  rules: [],
  bids: [],
};

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(FIXED_NOW);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('AuctionSummaryCard', () => {
  it('renders card id and description', () => {
    render(<AuctionSummaryCard auction={baseAuction} />);
    expect(screen.getByText('ARG10')).toBeTruthy();
    expect(screen.getByText('Lionel Messi')).toBeTruthy();
  });

  it('renders card country and team', () => {
    render(<AuctionSummaryCard auction={baseAuction} />);
    expect(screen.getByText(/Argentina/)).toBeTruthy();
    expect(screen.getByText(/Inter Miami/)).toBeTruthy();
  });

  it('renders category badge', () => {
    render(<AuctionSummaryCard auction={baseAuction} />);
    expect(screen.getAllByText('LEGENDARIO').length).toBeGreaterThan(0);
  });

  it('renders publisher name', () => {
    render(<AuctionSummaryCard auction={baseAuction} />);
    expect(screen.getByText(/Carlos García/)).toBeTruthy();
  });

  it('renders the bid count', () => {
    const auction = { ...baseAuction, bids: [{ bidId: 'b1', bidder: { userId: 'u1', name: 'X', rating: 0, avatarId: 'avatar_1' }, offeredCards: [], status: 'ACTIVA' as const, bidDate: '' }] };
    render(<AuctionSummaryCard auction={auction} />);
    expect(screen.getByText('1')).toBeTruthy();
  });

  it('shows countdown with days when endDate is 2 days away', () => {
    render(<AuctionSummaryCard auction={baseAuction} />);
    expect(screen.getByText(/2d/)).toBeTruthy();
  });

  it('shows "Finalizada" countdown when endDate is in the past', () => {
    const ended = { ...baseAuction, endDate: '2026-05-01T12:00:00Z' };
    render(<AuctionSummaryCard auction={ended} />);
    expect(screen.getByText('Finalizada')).toBeTruthy();
  });
});
