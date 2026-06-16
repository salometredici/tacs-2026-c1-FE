// @vitest-environment happy-dom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import CancelAuctionConfirmDialog from './CancelAuctionConfirmDialog';
import type { Auction } from '../../../interfaces/auctions/Auction';
import type { Bid } from '../../../interfaces/auctions/bid/Bid';

afterEach(cleanup);

const makeBid = (status: Bid['status']): Bid => ({
  bidId: 'b1',
  bidder: { userId: 'u1', name: 'X', rating: 0, avatarId: 'avatar_1' },
  offeredCards: [],
  status,
  bidDate: '',
});

const auction: Auction = {
  id: 'a1',
  card: { id: 'ARG10', number: 10, type: 'JUGADOR', description: 'Messi', country: null, team: null, category: 'LEGENDARIO' },
  publisherId: { id: 'u1', name: 'Carlos', email: '', rating: null, exchangesAmount: 0, avatarId: 'avatar_1', creationDate: '' },
  status: 'ACTIVA',
  creationDate: '',
  endDate: '2099-01-01T00:00:00Z',
  rules: [],
  bids: [makeBid('ACTIVA'), makeBid('ACTIVA'), makeBid('RECHAZADA')],
};

describe('CancelAuctionConfirmDialog', () => {
  it('renders nothing when open=false', () => {
    render(<CancelAuctionConfirmDialog open={false} auction={auction} loading={false} onCancel={vi.fn()} onConfirm={vi.fn()} />);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('renders the dialog title when open=true', () => {
    render(<CancelAuctionConfirmDialog open={true} auction={auction} loading={false} onCancel={vi.fn()} onConfirm={vi.fn()} />);
    expect(screen.getByText('¿Cancelar la subasta?')).toBeTruthy();
  });

  it('shows card info in the summary', () => {
    render(<CancelAuctionConfirmDialog open={true} auction={auction} loading={false} onCancel={vi.fn()} onConfirm={vi.fn()} />);
    expect(screen.getByText(/#10 Messi/)).toBeTruthy();
  });

  it('counts only ACTIVA bids to discard', () => {
    render(<CancelAuctionConfirmDialog open={true} auction={auction} loading={false} onCancel={vi.fn()} onConfirm={vi.fn()} />);
    // 2 ACTIVA bids out of 3 total
    expect(screen.getByText('2')).toBeTruthy();
  });
});
