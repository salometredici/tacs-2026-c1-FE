// @vitest-environment happy-dom
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import PublicationsPage from './PublicationsPage';
import type { User } from '../../interfaces/auth/User';

afterEach(cleanup);

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

vi.mock('../../api/PublicationsService', () => ({
  getMyPublications: vi.fn(),
  cancelPublication: vi.fn(),
}));

vi.mock('../../components/feedback/ConfirmDialog', () => ({
  default: ({ open, onConfirm, onCancel }: {
    open: boolean; onConfirm: () => void; onCancel: () => void;
  }) => open ? (
    <div data-testid="confirm-dialog">
      <button onClick={onConfirm}>confirm-cancel</button>
      <button onClick={onCancel}>volver</button>
    </div>
  ) : null,
}));

import { getMyPublications, cancelPublication } from '../../api/PublicationsService';

const mockGetMy = getMyPublications as ReturnType<typeof vi.fn>;
const mockCancel = cancelPublication as ReturnType<typeof vi.fn>;

const USER: User = {
  id: 'u1', name: 'Pepe', email: 'pepe@test.com',
  role: 'USER', rating: null, exchangesAmount: 0,
  avatarId: 'avatar_1', creationDate: '2026-01-01',
};

const makePub = (id: string, status: 'ACTIVA' | 'CANCELADA' | 'FINALIZADA', remaining = 2) => ({
  id, status, remainingCount: remaining, initialCount: 5,
  card: { id: `card-${id}`, description: `Card ${id}` },
});

beforeEach(() => {
  vi.clearAllMocks();
  mockGetMy.mockResolvedValue([]);
});

// ─── Render / tabs ───────────────────────────────────────────────────────

describe('PublicationsPage — render y tabs', () => {
  it('arranca en tab "Activas" y muestra el contador correcto', async () => {
    mockGetMy.mockResolvedValue([
      makePub('p1', 'ACTIVA'), makePub('p2', 'ACTIVA'), makePub('p3', 'CANCELADA'),
    ]);
    render(<PublicationsPage />);
    await waitFor(() => expect(screen.getByText(/Activas \(2\)/)).toBeTruthy());
    expect(screen.getByText(/Todas \(3\)/)).toBeTruthy();
  });

  it('tab "Activas" filtra las que no están activas', async () => {
    mockGetMy.mockResolvedValue([
      makePub('p1', 'ACTIVA'),
      makePub('p2', 'CANCELADA'),
    ]);
    render(<PublicationsPage />);
    await waitFor(() => expect(screen.getByText(/Card p1/)).toBeTruthy());
    expect(screen.queryByText(/Card p2/)).toBeNull();
  });

  it('tab "Todas" incluye CANCELADA y FINALIZADA', async () => {
    mockGetMy.mockResolvedValue([
      makePub('p1', 'ACTIVA'),
      makePub('p2', 'CANCELADA'),
      makePub('p3', 'FINALIZADA'),
    ]);
    render(<PublicationsPage />);
    await waitFor(() => screen.getByText(/Activas/));
    fireEvent.click(screen.getByText(/Todas/));
    expect(screen.getByText(/Card p1/)).toBeTruthy();
    expect(screen.getByText(/Card p2/)).toBeTruthy();
    expect(screen.getByText(/Card p3/)).toBeTruthy();
  });

  it('empty state distinto entre tabs (activas vs todas)', async () => {
    render(<PublicationsPage />);
    await waitFor(() => expect(screen.getByText(/No tenés publicaciones activas/)).toBeTruthy());
    fireEvent.click(screen.getByText(/Todas/));
    expect(screen.getByText(/No tenés publicaciones \./)).toBeTruthy();
  });
});

// ─── Loading / error ─────────────────────────────────────────────────────

describe('PublicationsPage — estados de carga', () => {
  it('si el BE falla, muestra error', async () => {
    mockGetMy.mockRejectedValue(new Error('boom'));
    render(<PublicationsPage />);
    await waitFor(() => expect(screen.getByText(/Ocurrió un error al cargar las publicaciones/)).toBeTruthy());
  });
});

// ─── Cancelar publicación ────────────────────────────────────────────────

describe('PublicationsPage — cancelar', () => {
  beforeEach(() => {
    mockGetMy.mockResolvedValue([makePub('p1', 'ACTIVA')]);
  });

  it('botón Cancelar solo visible en publicaciones ACTIVA', async () => {
    mockGetMy.mockResolvedValueOnce([
      makePub('p1', 'ACTIVA'),
      makePub('p2', 'CANCELADA'),
    ]);
    render(<PublicationsPage />);
    await waitFor(() => screen.getByText(/Todas/));
    fireEvent.click(screen.getByText(/Todas/));
    // Solo 1 botón "Cancelar" (el de p1)
    expect(screen.getAllByText('Cancelar').length).toBe(1);
  });

  it('click en cancelar abre ConfirmDialog', async () => {
    render(<PublicationsPage />);
    await waitFor(() => screen.getByText('Cancelar'));
    fireEvent.click(screen.getByText('Cancelar'));
    expect(screen.getByTestId('confirm-dialog')).toBeTruthy();
  });

  it('confirm-cancel llama service + optimistic update + snackbar éxito', async () => {
    mockCancel.mockResolvedValue(undefined);
    render(<PublicationsPage />);
    await waitFor(() => screen.getByText('Cancelar'));
    fireEvent.click(screen.getByText('Cancelar'));
    fireEvent.click(screen.getByText('confirm-cancel'));

    await waitFor(() => expect(mockCancel).toHaveBeenCalledWith('p1', 'u1'));
    await waitFor(() => expect(mockShowSuccess).toHaveBeenCalledWith('Publicación cancelada'));
    // Optimistic: contador "Activas" baja a 0
    await waitFor(() => expect(screen.getByText(/Activas \(0\)/)).toBeTruthy());
  });

  it('falla del cancel muestra snackbar error y NO cambia status', async () => {
    mockCancel.mockRejectedValue(new Error('500'));
    render(<PublicationsPage />);
    await waitFor(() => screen.getByText('Cancelar'));
    fireEvent.click(screen.getByText('Cancelar'));
    fireEvent.click(screen.getByText('confirm-cancel'));

    await waitFor(() => expect(mockShowError).toHaveBeenCalledWith(expect.stringMatching(/cancelar/i)));
    // Contador sigue en 1 (sin optimistic update)
    expect(screen.getByText(/Activas \(1\)/)).toBeTruthy();
  });

  it('volver del confirm cierra el dialog sin llamar al BE', async () => {
    render(<PublicationsPage />);
    await waitFor(() => screen.getByText('Cancelar'));
    fireEvent.click(screen.getByText('Cancelar'));
    fireEvent.click(screen.getByText('volver'));

    expect(screen.queryByTestId('confirm-dialog')).toBeNull();
    expect(mockCancel).not.toHaveBeenCalled();
  });
});

// ─── Navegación ──────────────────────────────────────────────────────────

describe('PublicationsPage — navegación', () => {
  it('click en una card navega al detalle', async () => {
    mockGetMy.mockResolvedValue([makePub('p1', 'ACTIVA')]);
    render(<PublicationsPage />);
    await waitFor(() => screen.getByText(/Card p1/));
    fireEvent.click(screen.getByText(/Card p1/));
    expect(mockNavigate).toHaveBeenCalledWith('/publications/p1');
  });
});
