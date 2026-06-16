// @vitest-environment happy-dom
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import NotificationsPage from './NotificationsPage';
import type { User } from '../../interfaces/auth/User';

afterEach(cleanup);

const mockNavigate = vi.fn();
const mockShowError = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useOutletContext: () => ({ currentUser: USER }),
}));
vi.mock('../../context/useSnackbar', () => ({
  useSnackbar: () => ({ showError: mockShowError, showSuccess: vi.fn() }),
}));

vi.mock('../../api/NotificationsService', () => ({
  getNotifications: vi.fn(),
  markAsRead: vi.fn(),
}));

import { getNotifications, markAsRead } from '../../api/NotificationsService';

const mockGetNotifs = getNotifications as ReturnType<typeof vi.fn>;
const mockMarkRead = markAsRead as ReturnType<typeof vi.fn>;

const USER: User = {
  id: 'u1', name: 'Pepe', email: 'pepe@test.com',
  role: 'USER', rating: null, exchangesAmount: 0,
  avatarId: 'avatar_1', creationDate: '2026-01-01',
};

const makeNotif = (id: string, opts: Partial<{
  type: string; read: boolean; referenceId: string | null; message: string;
}> = {}) => ({
  id,
  message: opts.message ?? `Notif ${id}`,
  type: opts.type ?? 'TRADE_PROPOSAL_RECEIVED',
  read: opts.read ?? false,
  referenceId: opts.referenceId === undefined ? `ref-${id}` : opts.referenceId,
  createdAt: '2026-06-01',
});

const page1 = (notifs: ReturnType<typeof makeNotif>[], totalPages = 1) => ({
  data: notifs,
  currentPage: 1,
  totalPages,
  totalElements: notifs.length,
});

beforeEach(() => {
  vi.clearAllMocks();
  mockGetNotifs.mockResolvedValue(page1([]));
});

// ─── Render / tabs ───────────────────────────────────────────────────────

describe('NotificationsPage — render y tabs', () => {
  it('arranca en tab "No leídas" y muestra empty state', async () => {
    render(<NotificationsPage />);
    await waitFor(() => expect(screen.getByText(/No tenés notificaciones sin leer/)).toBeTruthy());
  });

  it('cambiar a "Leídas" llama al service con filter READ', async () => {
    render(<NotificationsPage />);
    await waitFor(() => screen.getByText('Leídas'));
    fireEvent.click(screen.getByText('Leídas'));
    await waitFor(() => expect(mockGetNotifs).toHaveBeenLastCalledWith('u1', 1, 20, 'READ'));
    expect(screen.getByText(/No tenés notificaciones leídas/)).toBeTruthy();
  });

  it('lista las notificaciones con su mensaje y type label', async () => {
    mockGetNotifs.mockResolvedValue(page1([
      makeNotif('n1', { message: 'Hola pepe', type: 'TRADE_PROPOSAL_RECEIVED' }),
    ]));
    render(<NotificationsPage />);
    await waitFor(() => expect(screen.getByText('Hola pepe')).toBeTruthy());
    expect(screen.getByText('Propuesta de intercambio recibida')).toBeTruthy();
  });

  it('si el BE falla, muestra error global', async () => {
    mockGetNotifs.mockRejectedValue(new Error('boom'));
    render(<NotificationsPage />);
    await waitFor(() => expect(screen.getByText(/Ocurrió un error al cargar las notificaciones/)).toBeTruthy());
  });
});

// ─── Mark as read ────────────────────────────────────────────────────────

describe('NotificationsPage — mark as read', () => {
  it('botón "Marcar como leída" solo visible en notifs no leídas', async () => {
    mockGetNotifs.mockResolvedValue(page1([
      makeNotif('n1', { read: false }),
      makeNotif('n2', { read: true }),
    ]));
    render(<NotificationsPage />);
    await waitFor(() => expect(screen.getAllByText('Marcar como leída').length).toBe(1));
  });

  it('click llama markAsRead + refetch', async () => {
    mockGetNotifs.mockResolvedValue(page1([makeNotif('n1', { read: false })]));
    mockMarkRead.mockResolvedValue(undefined);
    render(<NotificationsPage />);
    await waitFor(() => screen.getByText('Marcar como leída'));
    const callsBefore = mockGetNotifs.mock.calls.length;
    fireEvent.click(screen.getByText('Marcar como leída'));

    await waitFor(() => expect(mockMarkRead).toHaveBeenCalledWith('u1', 'n1'));
    // refetch dispara otra llamada al service
    await waitFor(() => expect(mockGetNotifs.mock.calls.length).toBeGreaterThan(callsBefore));
  });

  it('falla muestra snackbar error', async () => {
    mockGetNotifs.mockResolvedValue(page1([makeNotif('n1', { read: false })]));
    mockMarkRead.mockRejectedValue(new Error('500'));
    render(<NotificationsPage />);
    await waitFor(() => screen.getByText('Marcar como leída'));
    fireEvent.click(screen.getByText('Marcar como leída'));
    await waitFor(() => expect(mockShowError).toHaveBeenCalledWith(expect.stringMatching(/marcar/i)));
  });
});

// ─── Navegación contextual por tipo ──────────────────────────────────────

describe('NotificationsPage — navegación contextual', () => {
  it('TRADE_PROPOSAL_RECEIVED navega a /proposals', async () => {
    mockGetNotifs.mockResolvedValue(page1([
      makeNotif('n1', { type: 'TRADE_PROPOSAL_RECEIVED' }),
    ]));
    render(<NotificationsPage />);
    await waitFor(() => screen.getByText('Ir a propuestas'));
    fireEvent.click(screen.getByText('Ir a propuestas'));
    expect(mockNavigate).toHaveBeenCalledWith('/proposals');
  });

  it('AUCTION_OFFER_RECEIVED con referenceId navega a /auctions/{id}', async () => {
    mockGetNotifs.mockResolvedValue(page1([
      makeNotif('n1', { type: 'AUCTION_OFFER_RECEIVED', referenceId: 'auc-99' }),
    ]));
    render(<NotificationsPage />);
    await waitFor(() => screen.getByText('Ir a subasta'));
    fireEvent.click(screen.getByText('Ir a subasta'));
    expect(mockNavigate).toHaveBeenCalledWith('/auctions/auc-99');
  });

  it('WANTED_CARD_AVAILABLE_IN_PUBLICATION navega a /publications/{id}', async () => {
    mockGetNotifs.mockResolvedValue(page1([
      makeNotif('n1', { type: 'WANTED_CARD_AVAILABLE_IN_PUBLICATION', referenceId: 'pub-7' }),
    ]));
    render(<NotificationsPage />);
    await waitFor(() => screen.getByText('Ir a publicación'));
    fireEvent.click(screen.getByText('Ir a publicación'));
    expect(mockNavigate).toHaveBeenCalledWith('/publications/pub-7');
  });

  it('sin referenceId no muestra botón de navegar (auction)', async () => {
    mockGetNotifs.mockResolvedValue(page1([
      makeNotif('n1', { type: 'AUCTION_OFFER_RECEIVED', referenceId: null }),
    ]));
    render(<NotificationsPage />);
    await waitFor(() => screen.getByText(/Notif n1/));
    expect(screen.queryByText('Ir a subasta')).toBeNull();
  });
});

// ─── Paginación ──────────────────────────────────────────────────────────

describe('NotificationsPage — paginación', () => {
  it('no muestra controles si solo hay 1 página', async () => {
    mockGetNotifs.mockResolvedValue(page1([makeNotif('n1')], 1));
    render(<NotificationsPage />);
    await waitFor(() => screen.getByText(/Notif n1/));
    expect(screen.queryByLabelText('Primera página')).toBeNull();
  });

  it('muestra ellipsis cuando totalPages > 7', async () => {
    mockGetNotifs.mockResolvedValue(page1([makeNotif('n1')], 20));
    render(<NotificationsPage />);
    await waitFor(() => expect(screen.getByText('…')).toBeTruthy());
  });

  it('click en página llama al service con el page nuevo', async () => {
    mockGetNotifs.mockResolvedValue(page1([makeNotif('n1')], 5));
    render(<NotificationsPage />);
    await waitFor(() => screen.getByLabelText('Ir a página 3'));
    fireEvent.click(screen.getByLabelText('Ir a página 3'));
    await waitFor(() => expect(mockGetNotifs).toHaveBeenLastCalledWith('u1', 3, 20, 'UNREAD'));
  });
});
