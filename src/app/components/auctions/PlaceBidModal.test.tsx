// @vitest-environment happy-dom
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import PlaceBidModal from './PlaceBidModal';
import type { Card } from '../../interfaces/cards/Card';
import type { CollectionCard } from '../../interfaces/cards/CollectionCard';

afterEach(cleanup);

vi.mock('../../api/UsersService', () => ({
  getUserCollection: vi.fn(),
}));
vi.mock('../../api/AuctionsService', () => ({
  placeBid: vi.fn(),
  mapAuction: vi.fn(),
}));
vi.mock('../../context/useSnackbar', () => ({
  useSnackbar: () => ({ showSuccess: vi.fn(), showError: vi.fn() }),
}));

import { getUserCollection } from '../../api/UsersService';
import { placeBid } from '../../api/AuctionsService';

const mockGetUserCollection = getUserCollection as ReturnType<typeof vi.fn>;
const mockPlaceBid = placeBid as ReturnType<typeof vi.fn>;

const card: Card = {
  id: 'ARG10', number: 10, type: 'JUGADOR',
  description: 'Messi', country: 'Argentina', team: null, category: 'LEGENDARIO',
};

const makeCollectionCard = (id: string, qty = 3, compromised = 0): CollectionCard => ({
  cardId: id, number: 1, description: `Card ${id}`,
  country: null, team: null, category: 'COMUN',
  quantity: qty, compromisedCount: compromised,
});

const baseProps = {
  userId: 'user-1',
  card,
  auctionId: 'auction-1',
  onClose: vi.fn(),
  onSuccess: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();
  baseProps.onClose = vi.fn();
  baseProps.onSuccess = vi.fn();
});

describe('PlaceBidModal — loading', () => {
  it('shows loading text while collection loads', () => {
    mockGetUserCollection.mockReturnValue(new Promise(() => {}));
    render(<PlaceBidModal {...baseProps} />);
    expect(screen.getByText('Cargando tu colección...')).toBeTruthy();
  });
});

describe('PlaceBidModal — empty collection', () => {
  it('shows empty message when collection is empty', async () => {
    mockGetUserCollection.mockResolvedValue([]);
    render(<PlaceBidModal {...baseProps} />);
    await waitFor(() => expect(screen.getByText('No tenés figuritas para ofertar.')).toBeTruthy());
  });
});

describe('PlaceBidModal — with collection', () => {
  beforeEach(() => {
    mockGetUserCollection.mockResolvedValue([
      makeCollectionCard('BRA7'),
      makeCollectionCard('FRA9'),
    ]);
  });

  it('renders the card being auctioned', async () => {
    render(<PlaceBidModal {...baseProps} />);
    await waitFor(() => screen.getByText('Card BRA7'));
    expect(screen.getByText(/ARG10 Messi/)).toBeTruthy();
    expect(screen.getByText(/Argentina/)).toBeTruthy();
  });

  it('renders available collection cards after load', async () => {
    render(<PlaceBidModal {...baseProps} />);
    await waitFor(() => expect(screen.getByText('Card BRA7')).toBeTruthy());
    expect(screen.getByText('Card FRA9')).toBeTruthy();
  });

  it('confirm button is disabled until a card is selected', async () => {
    render(<PlaceBidModal {...baseProps} />);
    await waitFor(() => screen.getByText('Card BRA7'));
    const btn = screen.getByText('Confirmar oferta').closest('button')!;
    expect((btn as HTMLButtonElement).disabled).toBe(true);
  });

  it('enables confirm button after selecting a card', async () => {
    render(<PlaceBidModal {...baseProps} />);
    await waitFor(() => screen.getByText('Card BRA7'));
    fireEvent.click(screen.getAllByText('Agregar')[0]);
    await waitFor(() => {
      const btn = screen.getByText(/Confirmar oferta/).closest('button')!;
      expect((btn as HTMLButtonElement).disabled).toBe(false);
    });
  });

  it('calls placeBid and triggers onSuccess on submit', async () => {
    mockPlaceBid.mockResolvedValue({});
    render(<PlaceBidModal {...baseProps} />);
    await waitFor(() => screen.getByText('Card BRA7'));
    fireEvent.click(screen.getAllByText('Agregar')[0]);
    await waitFor(() => screen.getByText('Quitar'));
    fireEvent.click(screen.getByText(/Confirmar oferta/));
    await waitFor(() => expect(mockPlaceBid).toHaveBeenCalledOnce());
    expect(baseProps.onSuccess).toHaveBeenCalled();
    expect(baseProps.onClose).toHaveBeenCalled();
  });

  it('shows backend error message on failure', async () => {
    mockPlaceBid.mockRejectedValue({ response: { data: { message: 'No cumplés los requisitos' } } });
    render(<PlaceBidModal {...baseProps} />);
    await waitFor(() => screen.getByText('Card BRA7'));
    fireEvent.click(screen.getAllByText('Agregar')[0]);
    await waitFor(() => screen.getByText('Quitar'));
    fireEvent.click(screen.getByText(/Confirmar oferta/));
    await waitFor(() => expect(screen.getByText('No cumplés los requisitos')).toBeTruthy());
  });

  it('search filters available cards', async () => {
    render(<PlaceBidModal {...baseProps} />);
    await waitFor(() => screen.getByText('Card BRA7'));
    fireEvent.change(screen.getByPlaceholderText(/Buscar/), { target: { value: 'BRA7' } });
    expect(screen.getByText('Card BRA7')).toBeTruthy();
    expect(screen.queryByText('Card FRA9')).toBeNull();
  });
});
