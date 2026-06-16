// @vitest-environment happy-dom
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import ProfilePage from './ProfilePage';
import type { User } from '../../interfaces/auth/User';

afterEach(cleanup);

// ─── Mocks ───────────────────────────────────────────────────────────────

const mockRefreshCurrentUser = vi.fn();
const mockShowSuccess = vi.fn();
const mockShowError = vi.fn();
const mockNavigateCalls = vi.fn();

// `Navigate` se renderiza pero queremos saber a dónde redirigió sin armar router real
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    Navigate: ({ to }: { to: string }) => {
      mockNavigateCalls(to);
      return <div data-testid="navigate">redirect:{to}</div>;
    },
    useOutletContext: () => ({ currentUser: USER }),
    useParams: () => mockUseParams(),
  };
});

const mockUseParams = vi.fn(() => ({ id: undefined as string | undefined }));

vi.mock('../../context/useUserContext', () => ({
  useUserContext: () => ({ refreshCurrentUser: mockRefreshCurrentUser }),
}));
vi.mock('../../context/useSnackbar', () => ({
  useSnackbar: () => ({ showSuccess: mockShowSuccess, showError: mockShowError }),
}));

vi.mock('../../api/UsersService', () => ({
  getById: vi.fn(),
  getUserMissingCards: vi.fn(),
}));
vi.mock('../../api/AuctionsService', () => ({
  getAuctionsByUserId: vi.fn(),
  getAuctionBidsByUserId: vi.fn(),
}));
vi.mock('../../api/ProposalsService', () => ({
  getProposals: vi.fn(),
  acceptProposal: vi.fn(),
  rejectProposal: vi.fn(),
}));
vi.mock('../../api/PublicationsService', () => ({
  getMyPublications: vi.fn(),
}));
vi.mock('../../api/ExchangesService', () => ({
  getExchangesByUserId: vi.fn(),
}));

// Sub-componentes pesados → stubs livianos para aislar la lógica de la page
vi.mock('../../components/collection/Collection', () => ({
  default: ({ userId }: { userId: string }) => <div data-testid="collection">collection:{userId}</div>,
}));
vi.mock('../../components/cards/AddMissingCardsModal', () => ({
  default: () => <div data-testid="add-missing-modal" />,
}));
vi.mock('../../components/exchanges/PublishCardModal', () => ({
  default: () => <div data-testid="publish-modal" />,
}));
vi.mock('../../components/exchanges/ExchangeDetailModal', () => ({
  default: () => <div data-testid="exchange-modal" />,
}));
vi.mock('../../components/proposals/ProposalDetailModal', () => ({
  default: ({ onAccept, onReject }: { onAccept?: () => void; onReject?: () => void }) => (
    <div data-testid="proposal-modal">
      {onAccept && <button onClick={onAccept}>Aceptar (mock)</button>}
      {onReject && <button onClick={onReject}>Rechazar (mock)</button>}
    </div>
  ),
}));
vi.mock('./tabs/MissingTab', () => ({
  default: ({ missing }: { missing: unknown[] }) => <div data-testid="missing-tab">faltantes:{missing.length}</div>,
}));
vi.mock('./tabs/PublicationsTab', () => ({
  default: ({ publications }: { publications: unknown[] }) => <div data-testid="publications-tab">pubs:{publications.length}</div>,
}));
vi.mock('./tabs/ProposalsTab', () => ({
  default: ({ received, sent, onSelect }: {
    received: { id: string }[]; sent: unknown[]; onSelect: (p: unknown) => void;
  }) => (
    <div data-testid="proposals-tab">
      recibidas:{received.length} enviadas:{sent.length}
      {received[0] && (
        <button onClick={() => onSelect(received[0])}>seleccionar primera</button>
      )}
    </div>
  ),
}));
vi.mock('./tabs/AuctionsTab', () => ({
  default: () => <div data-testid="auctions-tab" />,
}));
vi.mock('./tabs/ExchangesTab', () => ({
  default: () => <div data-testid="exchanges-tab" />,
}));

import { getById, getUserMissingCards } from '../../api/UsersService';
import { getAuctionsByUserId, getAuctionBidsByUserId } from '../../api/AuctionsService';
import { getProposals, acceptProposal, rejectProposal } from '../../api/ProposalsService';
import { getMyPublications } from '../../api/PublicationsService';
import { getExchangesByUserId } from '../../api/ExchangesService';

const mockGetById = getById as ReturnType<typeof vi.fn>;
const mockGetMissing = getUserMissingCards as ReturnType<typeof vi.fn>;
const mockGetAuctions = getAuctionsByUserId as ReturnType<typeof vi.fn>;
const mockGetBids = getAuctionBidsByUserId as ReturnType<typeof vi.fn>;
const mockGetProposals = getProposals as ReturnType<typeof vi.fn>;
const mockGetMyPublications = getMyPublications as ReturnType<typeof vi.fn>;
const mockGetExchanges = getExchangesByUserId as ReturnType<typeof vi.fn>;
const mockAccept = acceptProposal as ReturnType<typeof vi.fn>;
const mockReject = rejectProposal as ReturnType<typeof vi.fn>;

const USER: User = {
  id: 'u1', name: 'Pepe Test', email: 'pepe@test.com',
  role: 'USER', rating: 4.5, exchangesAmount: 3,
  avatarId: 'avatar_1', creationDate: '2026-01-01',
};

const FRESH_USER: User = { ...USER, rating: 4.8, exchangesAmount: 7 };

// Setup default: todas las queries devuelven array vacío (no se queda en loading)
beforeEach(() => {
  vi.clearAllMocks();
  mockUseParams.mockReturnValue({ id: undefined });
  mockGetById.mockResolvedValue(FRESH_USER);
  mockGetMissing.mockResolvedValue([]);
  mockGetAuctions.mockResolvedValue([]);
  mockGetBids.mockResolvedValue([]);
  mockGetProposals.mockResolvedValue([]);
  mockGetMyPublications.mockResolvedValue([]);
  mockGetExchanges.mockResolvedValue([]);
});

// ─── Render básico ───────────────────────────────────────────────────────

describe('ProfilePage — render básico', () => {
  it('muestra los datos del freshUser (no del currentUser stale del context)', async () => {
    render(<ProfilePage />);
    await waitFor(() => expect(screen.getByText('Pepe Test')).toBeTruthy());
    expect(screen.getByText('pepe@test.com')).toBeTruthy();
    // Rating del freshUser: 4.8 (no 4.5 del currentUser)
    expect(screen.getByText(/4\.8/)).toBeTruthy();
    expect(screen.getByText(/7 intercambios/)).toBeTruthy();
  });

  it('"Sin calificaciones aún" cuando rating es null', async () => {
    mockGetById.mockResolvedValue({ ...FRESH_USER, rating: null });
    render(<ProfilePage />);
    await waitFor(() => expect(screen.getByText(/Sin calificaciones a[uú]n/)).toBeTruthy());
  });

  it('singular "1 intercambio" vs "Sin intercambios todavía"', async () => {
    mockGetById.mockResolvedValueOnce({ ...FRESH_USER, exchangesAmount: 1 });
    const { unmount } = render(<ProfilePage />);
    await waitFor(() => expect(screen.getByText(/1 intercambio$/)).toBeTruthy());
    unmount();

    mockGetById.mockResolvedValueOnce({ ...FRESH_USER, exchangesAmount: 0 });
    render(<ProfilePage />);
    await waitFor(() => expect(screen.getByText(/Sin intercambios todav[ií]a/)).toBeTruthy());
  });
});

// ─── Tabs y contadores ───────────────────────────────────────────────────

describe('ProfilePage — tabs y contadores', () => {
  it('contadores: faltantes total, publicaciones/propuestas/subastas solo activas con cap 5+', async () => {
    mockGetMissing.mockResolvedValue([{}, {}, {}, {}, {}, {}, {}]); // 7 faltantes
    mockGetMyPublications.mockResolvedValue([
      { status: 'ACTIVA' }, { status: 'ACTIVA' }, { status: 'ACTIVA' },
      { status: 'CANCELADA' }, { status: 'FINALIZADA' },
    ]);
    mockGetProposals.mockImplementation((userId: string) => {
      if (userId === 'u1') {
        // recibidas: 6 PENDIENTES → cap a "5+"
        return Promise.resolve(Array.from({ length: 6 }, () => ({ status: 'PENDIENTE' })));
      }
      return Promise.resolve([]); // enviadas
    });
    mockGetAuctions.mockResolvedValue([{ status: 'ACTIVA' }, { status: 'AWARDED' }]);

    render(<ProfilePage />);

    // No capeado: faltantes muestra total
    await waitFor(() => expect(screen.getByText(/Faltantes \(7\)/)).toBeTruthy());
    // Capeado a 5+ cuando supera el límite
    expect(screen.getByText(/Propuestas \(5\+\)/)).toBeTruthy();
    // Bajo el cap muestra el número
    expect(screen.getByText(/Publicaciones \(3\)/)).toBeTruthy();
    expect(screen.getByText(/Subastas \(1\)/)).toBeTruthy();
  });

  it('cambiar de tab cambia el contenido visible', async () => {
    render(<ProfilePage />);
    await waitFor(() => expect(screen.getByTestId('collection')).toBeTruthy());

    fireEvent.click(screen.getByText(/^Faltantes/));
    expect(screen.getByTestId('missing-tab')).toBeTruthy();

    fireEvent.click(screen.getByText(/^Propuestas/));
    expect(screen.getByTestId('proposals-tab')).toBeTruthy();
  });
});

// ─── Redirect si path !== current ────────────────────────────────────────

describe('ProfilePage — guard de URL', () => {
  it('redirige a /profile/{ownId} si el pathUserId no coincide con el current', async () => {
    mockUseParams.mockReturnValue({ id: 'other-user-id' });
    render(<ProfilePage />);
    await waitFor(() => expect(mockNavigateCalls).toHaveBeenCalledWith('/profile/u1'));
  });

  it('NO redirige si el pathUserId coincide con el current', async () => {
    mockUseParams.mockReturnValue({ id: 'u1' });
    render(<ProfilePage />);
    await waitFor(() => expect(screen.getByText('Pepe Test')).toBeTruthy());
    expect(mockNavigateCalls).not.toHaveBeenCalled();
  });
});

// ─── Loading / error global ──────────────────────────────────────────────

describe('ProfilePage — loading / error', () => {
  it('si TODAS las secciones fallan, muestra error global', async () => {
    const reject = (msg: string) => Promise.reject(new Error(msg));
    mockGetMissing.mockImplementation(() => reject('1'));
    mockGetAuctions.mockImplementation(() => reject('2'));
    mockGetBids.mockImplementation(() => reject('3'));
    mockGetProposals.mockImplementation(() => reject('4'));
    mockGetMyPublications.mockImplementation(() => reject('5'));
    mockGetExchanges.mockImplementation(() => reject('6'));

    render(<ProfilePage />);
    await waitFor(() => expect(screen.getByText('Error al cargar los datos.')).toBeTruthy());
  });

  it('si UNA sola sección falla, el resto se muestra (allSettled)', async () => {
    mockGetMissing.mockRejectedValue(new Error('boom'));
    mockGetMyPublications.mockResolvedValue([{ status: 'ACTIVA' }]);
    render(<ProfilePage />);
    // El header y los tabs renderizan; el error global NO se muestra
    await waitFor(() => expect(screen.getByText(/Publicaciones \(1\)/)).toBeTruthy());
    expect(screen.queryByText('Error al cargar los datos.')).toBeNull();
  });
});

// ─── Handlers de propuestas ──────────────────────────────────────────────

describe('ProfilePage — handlers de propuestas', () => {
  it('aceptar propuesta llama service + snackbar éxito + refreshCurrentUser', async () => {
    const proposal = {
      id: 'p1', status: 'PENDIENTE',
      publication: { publisher: { id: 'u1' } }, // current user es el publisher → onAccept habilitado
    };
    mockGetProposals.mockImplementation((userId: string) =>
      Promise.resolve(userId === 'u1' ? [proposal] : []));
    mockAccept.mockResolvedValue(undefined);

    render(<ProfilePage />);
    // Voy al tab de propuestas y selecciono la primera (abre modal)
    await waitFor(() => screen.getByText(/^Propuestas/));
    fireEvent.click(screen.getByText(/^Propuestas/));
    fireEvent.click(screen.getByText('seleccionar primera'));
    fireEvent.click(screen.getByText('Aceptar (mock)'));

    await waitFor(() => expect(mockAccept).toHaveBeenCalledWith('p1', 'u1'));
    expect(mockShowSuccess).toHaveBeenCalledWith('Propuesta aceptada');
    expect(mockRefreshCurrentUser).toHaveBeenCalled();
  });

  it('aceptar propuesta que falla muestra snackbar error y NO refresca currentUser', async () => {
    const proposal = {
      id: 'p1', status: 'PENDIENTE',
      publication: { publisher: { id: 'u1' } },
    };
    mockGetProposals.mockImplementation((userId: string) =>
      Promise.resolve(userId === 'u1' ? [proposal] : []));
    mockAccept.mockRejectedValue(new Error('400'));

    render(<ProfilePage />);
    await waitFor(() => screen.getByText(/^Propuestas/));
    fireEvent.click(screen.getByText(/^Propuestas/));
    fireEvent.click(screen.getByText('seleccionar primera'));
    fireEvent.click(screen.getByText('Aceptar (mock)'));

    await waitFor(() => expect(mockShowError).toHaveBeenCalledWith(expect.stringMatching(/Error/)));
    expect(mockRefreshCurrentUser).not.toHaveBeenCalled();
  });

  it('rechazar propuesta llama reject + snackbar éxito', async () => {
    const proposal = {
      id: 'p2', status: 'PENDIENTE',
      publication: { publisher: { id: 'u1' } },
    };
    mockGetProposals.mockImplementation((userId: string) =>
      Promise.resolve(userId === 'u1' ? [proposal] : []));
    mockReject.mockResolvedValue(undefined);

    render(<ProfilePage />);
    await waitFor(() => screen.getByText(/^Propuestas/));
    fireEvent.click(screen.getByText(/^Propuestas/));
    fireEvent.click(screen.getByText('seleccionar primera'));
    fireEvent.click(screen.getByText('Rechazar (mock)'));

    await waitFor(() => expect(mockReject).toHaveBeenCalledWith('p2', 'u1'));
    expect(mockShowSuccess).toHaveBeenCalledWith('Propuesta rechazada');
  });
});
