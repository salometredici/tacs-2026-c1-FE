// @vitest-environment happy-dom
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import AuctionsPage from './AuctionsPage';
import type { User } from '../../interfaces/auth/User';

afterEach(cleanup);

// ─── Mocks ───────────────────────────────────────────────────────────────

const mockNavigate = vi.fn();
const mockShowSuccess = vi.fn();
const mockShowError = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useOutletContext: () => ({ currentUser: USER }),
}));
vi.mock('../../context/useSnackbar', () => ({
  useSnackbar: () => ({ showSuccess: mockShowSuccess, showError: mockShowError }),
}));

vi.mock('../../api/AuctionsService', () => ({
  getActiveAuctions: vi.fn(),
  getAuctionsByUserId: vi.fn(),
  getAuctionBidsByUserId: vi.fn(),
  cancelOffer: vi.fn(),
}));

// AuctionCard como stub: muestra id + flag de hideBidButton para asserts
vi.mock('../../components/auctions/AuctionCard', () => ({
  default: ({ auction, onBid, hideBidButton }: {
    auction: { id: string }; onBid: () => void; hideBidButton?: boolean;
  }) => (
    <div data-testid={`auction-${auction.id}`}>
      auction:{auction.id} hideBid:{String(!!hideBidButton)}
      {!hideBidButton && <button onClick={onBid}>Ofertar</button>}
    </div>
  ),
}));
vi.mock('../../components/auctions/PlaceBidModal', () => ({
  default: ({ auctionId, onClose }: { auctionId: string; onClose: () => void }) => (
    <div data-testid="place-bid-modal">
      modal-bid:{auctionId}
      <button onClick={onClose}>cerrar-bid</button>
    </div>
  ),
}));
vi.mock('../../components/feedback/ConfirmDialog', () => ({
  default: ({ open, onConfirm, onCancel, title }: {
    open: boolean; title: string; onConfirm: () => void; onCancel: () => void;
  }) => open ? (
    <div data-testid="confirm-dialog">
      {title}
      <button onClick={onConfirm}>confirmar</button>
      <button onClick={onCancel}>volver</button>
    </div>
  ) : null,
}));

import { getActiveAuctions, getAuctionsByUserId, getAuctionBidsByUserId, cancelOffer } from '../../api/AuctionsService';

const mockGetActive = getActiveAuctions as ReturnType<typeof vi.fn>;
const mockGetMyAuctions = getAuctionsByUserId as ReturnType<typeof vi.fn>;
const mockGetMyBids = getAuctionBidsByUserId as ReturnType<typeof vi.fn>;
const mockCancelOffer = cancelOffer as ReturnType<typeof vi.fn>;

const USER: User = {
  id: 'u1', name: 'Pepe', email: 'pepe@test.com',
  role: 'USER', rating: null, exchangesAmount: 0,
  avatarId: 'avatar_1', creationDate: '2026-01-01',
};

const makeAuction = (id: string, publisherId: string) => ({
  id, status: 'ACTIVA' as const,
  card: { id: `card-${id}`, description: `Card ${id}` },
  publisherId: { id: publisherId, name: 'X' },
});

const makeBid = (bidId: string, auctionId: string, bidStatus = 'ACTIVA') => ({
  bidId, auctionId,
  bidStatus, auctionStatus: 'ACTIVA',
  card: { id: 'cX', description: 'd', country: null, team: null },
  publisher: { name: 'Ana' },
  offeredCards: [{}, {}],
  bidDate: '2026-06-01', closingDate: '2026-06-30',
});

beforeEach(() => {
  vi.clearAllMocks();
  mockGetActive.mockResolvedValue([]);
  mockGetMyAuctions.mockResolvedValue([]);
  mockGetMyBids.mockResolvedValue([]);
});

// ─── Render básico / tabs ────────────────────────────────────────────────

describe('AuctionsPage — tabs y contadores', () => {
  it('renderiza los 3 tabs con sus contadores', async () => {
    mockGetActive.mockResolvedValue([makeAuction('a1', 'other'), makeAuction('a2', 'other')]);
    mockGetMyAuctions.mockResolvedValue([makeAuction('a3', 'u1')]);
    mockGetMyBids.mockResolvedValue([makeBid('b1', 'a4'), makeBid('b2', 'a5')]);

    render(<AuctionsPage />);
    await waitFor(() => expect(screen.getByText(/Activas \(2\)/)).toBeTruthy());
    expect(screen.getByText(/Mis Subastas \(1\)/)).toBeTruthy();
    expect(screen.getByText(/Mis Ofertas \(2\)/)).toBeTruthy();
  });

  it('cambiar de tab cambia el contenido visible', async () => {
    mockGetActive.mockResolvedValue([makeAuction('a1', 'other')]);
    mockGetMyAuctions.mockResolvedValue([makeAuction('a3', 'u1')]);

    render(<AuctionsPage />);
    await waitFor(() => expect(screen.getByTestId('auction-a1')).toBeTruthy());
    expect(screen.queryByTestId('auction-a3')).toBeNull();

    fireEvent.click(screen.getByText(/Mis Subastas/));
    expect(screen.getByTestId('auction-a3')).toBeTruthy();
    expect(screen.queryByTestId('auction-a1')).toBeNull();
  });
});

// ─── Activas: hideBidButton si la subasta es propia ──────────────────────

describe('AuctionsPage — tab Activas', () => {
  it('hideBidButton=true cuando la subasta es del current user', async () => {
    mockGetActive.mockResolvedValue([
      makeAuction('a1', 'u1'),     // propia
      makeAuction('a2', 'other'),  // ajena
    ]);
    render(<AuctionsPage />);
    await waitFor(() => expect(screen.getByTestId('auction-a1')).toBeTruthy());
    expect(screen.getByTestId('auction-a1').textContent).toContain('hideBid:true');
    expect(screen.getByTestId('auction-a2').textContent).toContain('hideBid:false');
  });

  it('click en "Ofertar" abre el PlaceBidModal con el auction seleccionado', async () => {
    mockGetActive.mockResolvedValue([makeAuction('a1', 'other')]);
    render(<AuctionsPage />);
    await waitFor(() => screen.getByTestId('auction-a1'));
    fireEvent.click(screen.getByText('Ofertar'));
    expect(screen.getByText('modal-bid:a1')).toBeTruthy();
  });

  it('mensaje vacío cuando no hay subastas activas', async () => {
    render(<AuctionsPage />);
    await waitFor(() => expect(screen.getByText(/No hay subastas activas/)).toBeTruthy());
  });
});

// ─── Mis Ofertas: cancelar oferta ────────────────────────────────────────

describe('AuctionsPage — tab Mis Ofertas: cancelar', () => {
  beforeEach(() => {
    mockGetMyBids.mockResolvedValue([makeBid('b1', 'a1')]);
  });

  it('click en "Cancelar oferta" abre ConfirmDialog', async () => {
    render(<AuctionsPage />);
    await waitFor(() => screen.getByText(/Mis Ofertas \(1\)/));
    fireEvent.click(screen.getByText(/Mis Ofertas/));
    fireEvent.click(screen.getByText('Cancelar oferta'));
    expect(screen.getByTestId('confirm-dialog')).toBeTruthy();
  });

  it('confirmar llama cancelOffer + remueve la oferta de la lista + snackbar éxito', async () => {
    mockCancelOffer.mockResolvedValue(undefined);
    render(<AuctionsPage />);
    await waitFor(() => screen.getByText(/Mis Ofertas \(1\)/));
    fireEvent.click(screen.getByText(/Mis Ofertas/));
    fireEvent.click(screen.getByText('Cancelar oferta'));
    fireEvent.click(screen.getByText('confirmar'));

    await waitFor(() => expect(mockCancelOffer).toHaveBeenCalledWith('a1', 'b1'));
    await waitFor(() => expect(mockShowSuccess).toHaveBeenCalledWith('Oferta cancelada'));
    // Contador baja a 0 (filter local)
    await waitFor(() => expect(screen.getByText(/Mis Ofertas \(0\)/)).toBeTruthy());
  });

  it('falla de cancel muestra snackbar error y NO filtra de la lista', async () => {
    mockCancelOffer.mockRejectedValue(new Error('boom'));
    render(<AuctionsPage />);
    await waitFor(() => screen.getByText(/Mis Ofertas \(1\)/));
    fireEvent.click(screen.getByText(/Mis Ofertas/));
    fireEvent.click(screen.getByText('Cancelar oferta'));
    fireEvent.click(screen.getByText('confirmar'));

    await waitFor(() => expect(mockShowError).toHaveBeenCalledWith(expect.stringMatching(/cancelar/)));
    expect(screen.getByText(/Mis Ofertas \(1\)/)).toBeTruthy();
  });

  it('NO muestra botón cancelar si la oferta o la subasta no están activas', async () => {
    mockGetMyBids.mockResolvedValue([makeBid('b1', 'a1', 'RECHAZADA')]);
    render(<AuctionsPage />);
    await waitFor(() => screen.getByText(/Mis Ofertas \(1\)/));
    fireEvent.click(screen.getByText(/Mis Ofertas/));
    expect(screen.queryByText('Cancelar oferta')).toBeNull();
  });
});

// ─── Error global / navigation ───────────────────────────────────────────

describe('AuctionsPage — error global y nav', () => {
  it('si CUALQUIER fetch falla, muestra el error global', async () => {
    mockGetActive.mockRejectedValue(new Error('boom'));
    render(<AuctionsPage />);
    await waitFor(() => expect(screen.getByText(/Ocurrió un error al cargar las subastas/)).toBeTruthy());
  });

  it('click en "Crear Subasta" navega a /auctions/create', async () => {
    render(<AuctionsPage />);
    await waitFor(() => screen.getByText(/Crear Subasta/));
    fireEvent.click(screen.getByText(/Crear Subasta/));
    expect(mockNavigate).toHaveBeenCalledWith('/auctions/create');
  });
});
