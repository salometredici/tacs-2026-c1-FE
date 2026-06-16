// @vitest-environment happy-dom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import AcceptOfferConfirmDialog from './AcceptOfferConfirmDialog';
import type { Auction } from '../../../interfaces/auctions/Auction';
import type { Bid } from '../../../interfaces/auctions/bid/Bid';

afterEach(cleanup);

const auction: Auction = {
  id: 'a1',
  card: { id: 'ARG10', number: 10, type: 'JUGADOR', description: 'Messi', country: null, team: null, category: 'LEGENDARIO' },
  publisherId: { id: 'u1', name: 'Carlos', email: '', rating: null, exchangesAmount: 0, avatarId: 'avatar_1', creationDate: '' },
  status: 'ACTIVA',
  creationDate: '',
  endDate: '2099-01-01T00:00:00Z',
  rules: [],
  bids: [],
};

const bid: Bid = {
  bidId: 'bid-1',
  bidder: { userId: 'u2', name: 'Postor', rating: 3.5, avatarId: 'avatar_2' },
  offeredCards: [{ id: 'BRA7', number: 7, type: 'JUGADOR', description: 'Neymar', country: null, team: null, category: 'EPICO' }],
  status: 'ACTIVA',
  bidDate: '2026-01-01T10:00:00Z',
};

describe('AcceptOfferConfirmDialog', () => {
  it('renders nothing when open=false', () => {
    render(<AcceptOfferConfirmDialog open={false} auction={auction} bid={bid} loading={false} onCancel={vi.fn()} onConfirm={vi.fn()} />);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('renders the dialog title when open=true', () => {
    render(<AcceptOfferConfirmDialog open={true} auction={auction} bid={bid} loading={false} onCancel={vi.fn()} onConfirm={vi.fn()} />);
    expect(screen.getByText('¿Confirmar oferta ganadora?')).toBeTruthy();
  });

  it('shows the auction card and bid cards in the summary', () => {
    render(<AcceptOfferConfirmDialog open={true} auction={auction} bid={bid} loading={false} onCancel={vi.fn()} onConfirm={vi.fn()} />);
    expect(screen.getByText(/#10 Messi/)).toBeTruthy();
    expect(screen.getByText(/#7 Neymar/)).toBeTruthy();
  });

  it('shows bidder name in the summary label', () => {
    render(<AcceptOfferConfirmDialog open={true} auction={auction} bid={bid} loading={false} onCancel={vi.fn()} onConfirm={vi.fn()} />);
    expect(screen.getByText(/Recibís de Postor/)).toBeTruthy();
  });

  it('does not render bid summary when bid is null', () => {
    render(<AcceptOfferConfirmDialog open={true} auction={auction} bid={null} loading={false} onCancel={vi.fn()} onConfirm={vi.fn()} />);
    expect(screen.queryByText(/Neymar/)).toBeNull();
  });
});
