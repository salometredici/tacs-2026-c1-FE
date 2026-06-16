// @vitest-environment happy-dom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import AuctionBidsList from './AuctionBidsList';
import type { Bid } from '../../../interfaces/auctions/bid/Bid';

afterEach(cleanup);

const makeBid = (overrides: Partial<Bid> = {}): Bid => ({
  bidId: 'bid-1',
  bidder: { userId: 'user-99', name: 'Postor Test', rating: 4.0, avatarId: 'avatar_1' },
  offeredCards: [{ id: 'ARG10', number: 10, type: 'JUGADOR', description: 'Messi', country: null, team: null, category: 'LEGENDARIO' }],
  status: 'ACTIVA',
  bidDate: '2026-01-01T10:00:00Z',
  ...overrides,
});

const baseProps = {
  bids: [],
  currentUserId: 'user-1',
  isOwner: false,
  isActive: true,
  finalizing: false,
  rejectingBidId: null,
  cancellingOwnBid: false,
  finalizeError: null,
  onSelectBid: vi.fn(),
  onRejectBid: vi.fn(),
  onCancelOwnBid: vi.fn(),
};

describe('AuctionBidsList — empty state', () => {
  it('shows owner message when owner has no bids', () => {
    render(<AuctionBidsList {...baseProps} isOwner={true} />);
    expect(screen.getByText(/Todavía no recibiste ofertas/)).toBeTruthy();
  });

  it('shows non-owner message when there are no bids', () => {
    render(<AuctionBidsList {...baseProps} isOwner={false} />);
    expect(screen.getByText(/¡Sé el primero!/)).toBeTruthy();
  });
});

describe('AuctionBidsList — bids list', () => {
  it('shows bid count in title', () => {
    render(<AuctionBidsList {...baseProps} bids={[makeBid(), makeBid({ bidId: 'bid-2' })]} />);
    expect(screen.getByText('Ofertas (2)')).toBeTruthy();
  });

  it('renders bidder name', () => {
    render(<AuctionBidsList {...baseProps} bids={[makeBid()]} />);
    expect(screen.getByText('Postor Test')).toBeTruthy();
  });

  it('renders offered card description', () => {
    render(<AuctionBidsList {...baseProps} bids={[makeBid()]} />);
    expect(screen.getByText(/#10 Messi/)).toBeTruthy();
  });
});

describe('AuctionBidsList — action buttons for owner', () => {
  it('shows "Elegir ganadora" and "Rechazar" for active bid when isOwner=true', () => {
    render(<AuctionBidsList {...baseProps} bids={[makeBid()]} isOwner={true} />);
    expect(screen.getByText('Elegir ganadora')).toBeTruthy();
    expect(screen.getByText('Rechazar')).toBeTruthy();
  });

  it('does not show owner actions when isActive=false', () => {
    render(<AuctionBidsList {...baseProps} bids={[makeBid()]} isOwner={true} isActive={false} />);
    expect(screen.queryByText('Elegir ganadora')).toBeNull();
  });

  it('calls onSelectBid when "Elegir ganadora" clicked', () => {
    const onSelectBid = vi.fn();
    const bid = makeBid();
    render(<AuctionBidsList {...baseProps} bids={[bid]} isOwner={true} onSelectBid={onSelectBid} />);
    fireEvent.click(screen.getByText('Elegir ganadora'));
    expect(onSelectBid).toHaveBeenCalledWith(bid);
  });

  it('calls onRejectBid when "Rechazar" clicked', () => {
    const onRejectBid = vi.fn();
    render(<AuctionBidsList {...baseProps} bids={[makeBid()]} isOwner={true} onRejectBid={onRejectBid} />);
    fireEvent.click(screen.getByText('Rechazar'));
    expect(onRejectBid).toHaveBeenCalledWith('bid-1');
  });
});

describe('AuctionBidsList — action buttons for bidder', () => {
  it('shows "Cancelar oferta" when the current user is the bidder and auction is active', () => {
    const bid = makeBid({ bidder: { userId: 'current-user', name: 'Yo', rating: 3, avatarId: 'avatar_1' } });
    render(<AuctionBidsList {...baseProps} bids={[bid]} currentUserId="current-user" isOwner={false} />);
    expect(screen.getByText('Cancelar oferta')).toBeTruthy();
  });

  it('calls onCancelOwnBid with the bidId', () => {
    const onCancelOwnBid = vi.fn();
    const bid = makeBid({ bidder: { userId: 'current-user', name: 'Yo', rating: 3, avatarId: 'avatar_1' } });
    render(<AuctionBidsList {...baseProps} bids={[bid]} currentUserId="current-user" isOwner={false} onCancelOwnBid={onCancelOwnBid} />);
    fireEvent.click(screen.getByText('Cancelar oferta'));
    expect(onCancelOwnBid).toHaveBeenCalledWith('bid-1');
  });
});

describe('AuctionBidsList — finalizeError', () => {
  it('shows finalizeError text when present', () => {
    render(<AuctionBidsList {...baseProps} bids={[makeBid()]} isOwner={true} finalizeError="Error al finalizar" />);
    expect(screen.getByText('Error al finalizar')).toBeTruthy();
  });
});
