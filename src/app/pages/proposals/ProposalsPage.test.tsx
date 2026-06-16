// @vitest-environment happy-dom
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import ProposalsPage from './ProposalsPage';
import type { User } from '../../interfaces/auth/User';

afterEach(cleanup);

const mockNavigate = vi.fn();
const mockRefreshCurrentUser = vi.fn();
const mockShowSuccess = vi.fn();
const mockShowError = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useOutletContext: () => ({ currentUser: USER }),
}));
vi.mock('../../context/useUserContext', () => ({
  useUserContext: () => ({ refreshCurrentUser: mockRefreshCurrentUser }),
}));
vi.mock('../../context/useSnackbar', () => ({
  useSnackbar: () => ({ showSuccess: mockShowSuccess, showError: mockShowError }),
}));

vi.mock('../../api/ProposalsService', () => ({
  getProposals: vi.fn(),
  acceptProposal: vi.fn(),
  rejectProposal: vi.fn(),
  cancelProposal: vi.fn(),
}));

// Modal con mocks de callbacks para verificar qué acciones expone según el tab
vi.mock('../../components/proposals/ProposalDetailModal', () => ({
  default: ({ onAccept, onReject, onCancel }: {
    onAccept?: () => void; onReject?: () => void; onCancel?: () => void;
  }) => (
    <div data-testid="proposal-modal">
      {onAccept && <button onClick={onAccept}>modal-accept</button>}
      {onReject && <button onClick={onReject}>modal-reject</button>}
      {onCancel && <button onClick={onCancel}>modal-cancel</button>}
    </div>
  ),
}));

import { getProposals, acceptProposal, rejectProposal, cancelProposal } from '../../api/ProposalsService';

const mockGetProposals = getProposals as ReturnType<typeof vi.fn>;
const mockAccept = acceptProposal as ReturnType<typeof vi.fn>;
const mockReject = rejectProposal as ReturnType<typeof vi.fn>;
const mockCancel = cancelProposal as ReturnType<typeof vi.fn>;

const USER: User = {
  id: 'u1', name: 'Pepe', email: 'pepe@test.com',
  role: 'USER', rating: null, exchangesAmount: 0,
  avatarId: 'avatar_1', creationDate: '2026-01-01',
};

const makeProposal = (id: string, status: 'PENDIENTE' | 'ACEPTADA' | 'RECHAZADA' | 'CANCELADA' = 'PENDIENTE') => ({
  id,
  status,
  publication: {
    id: `pub-${id}`,
    card: { id: 'ARG10', description: 'Messi' },
    publisher: { id: 'publisher-id', name: 'Publisher Test' },
  },
  bidder: { id: 'bidder-id', name: 'Bidder Test' },
  offeredCards: [{ id: 'BRA7', description: 'Pelé' }],
  requestedCount: 2,
});

beforeEach(() => {
  vi.clearAllMocks();
  mockGetProposals.mockResolvedValue([]);
});

// ─── Render / tabs ───────────────────────────────────────────────────────

describe('ProposalsPage — tabs y contadores', () => {
  it('contadores de recibidas y enviadas según el query del service', async () => {
    mockGetProposals.mockImplementation((received: string, sent: string) => {
      if (received === 'u1') return Promise.resolve([makeProposal('p1'), makeProposal('p2')]);
      if (sent === 'u1') return Promise.resolve([makeProposal('p3')]);
      return Promise.resolve([]);
    });
    render(<ProposalsPage />);
    await waitFor(() => expect(screen.getByText(/Recibidas \(2\)/)).toBeTruthy());
    expect(screen.getByText(/Enviadas \(1\)/)).toBeTruthy();
  });

  it('cambia el contenido entre tabs', async () => {
    mockGetProposals.mockImplementation((received: string, sent: string) => {
      if (received === 'u1') return Promise.resolve([makeProposal('p-received')]);
      if (sent === 'u1') return Promise.resolve([makeProposal('p-sent')]);
      return Promise.resolve([]);
    });
    render(<ProposalsPage />);
    await waitFor(() => expect(screen.getByText(/Propuesta de Bidder Test/)).toBeTruthy());
    fireEvent.click(screen.getByText(/Enviadas/));
    expect(screen.getByText(/Publicado por Publisher Test/)).toBeTruthy();
  });

  it('empty state distinto según el tab', async () => {
    render(<ProposalsPage />);
    await waitFor(() => expect(screen.getByText(/No hay propuestas recibidas/)).toBeTruthy());
    fireEvent.click(screen.getByText(/Enviadas/));
    expect(screen.getByText(/No hay propuestas enviadas/)).toBeTruthy();
  });
});

// ─── Tab Recibidas: accept/reject ────────────────────────────────────────

describe('ProposalsPage — tab Recibidas: acciones', () => {
  beforeEach(() => {
    mockGetProposals.mockImplementation((received: string) =>
      Promise.resolve(received === 'u1' ? [makeProposal('p1', 'PENDIENTE')] : []),
    );
  });

  it('Aceptar: llama service + optimistic ACEPTADA + snackbar + refreshCurrentUser', async () => {
    mockAccept.mockResolvedValue(undefined);
    render(<ProposalsPage />);
    await waitFor(() => screen.getByText('Aceptar'));
    fireEvent.click(screen.getByText('Aceptar'));

    await waitFor(() => expect(mockAccept).toHaveBeenCalledWith('p1', 'u1'));
    await waitFor(() => expect(mockShowSuccess).toHaveBeenCalledWith('Propuesta aceptada'));
    expect(mockRefreshCurrentUser).toHaveBeenCalled();
    // Optimistic: el botón Aceptar desaparece (status ya no es PENDIENTE)
    expect(screen.queryByText('Aceptar')).toBeNull();
  });

  it('Rechazar: llama service + optimistic RECHAZADA + snackbar (NO refresca currentUser)', async () => {
    mockReject.mockResolvedValue(undefined);
    render(<ProposalsPage />);
    await waitFor(() => screen.getByText('Rechazar'));
    fireEvent.click(screen.getByText('Rechazar'));

    await waitFor(() => expect(mockReject).toHaveBeenCalledWith('p1', 'u1'));
    await waitFor(() => expect(mockShowSuccess).toHaveBeenCalledWith('Propuesta rechazada'));
    expect(mockRefreshCurrentUser).not.toHaveBeenCalled();
  });

  it('falla del accept muestra error y NO cambia status', async () => {
    mockAccept.mockRejectedValue(new Error('boom'));
    render(<ProposalsPage />);
    await waitFor(() => screen.getByText('Aceptar'));
    fireEvent.click(screen.getByText('Aceptar'));

    await waitFor(() => expect(mockShowError).toHaveBeenCalledWith(expect.stringMatching(/aceptar/i)));
    // Sigue PENDIENTE → botones siguen visibles
    expect(screen.getByText('Aceptar')).toBeTruthy();
  });

  it('NO muestra botones de acción si la propuesta ya no está PENDIENTE', async () => {
    mockGetProposals.mockImplementation((received: string) =>
      Promise.resolve(received === 'u1' ? [makeProposal('p1', 'ACEPTADA')] : []),
    );
    render(<ProposalsPage />);
    await waitFor(() => screen.getByText(/Propuesta de Bidder/));
    expect(screen.queryByText('Aceptar')).toBeNull();
    expect(screen.queryByText('Rechazar')).toBeNull();
  });
});

// ─── Tab Enviadas: cancel ────────────────────────────────────────────────

describe('ProposalsPage — tab Enviadas: cancelar', () => {
  beforeEach(() => {
    mockGetProposals.mockImplementation((_received: string, sent: string) =>
      Promise.resolve(sent === 'u1' ? [makeProposal('p1', 'PENDIENTE')] : []),
    );
  });

  it('Cancelar: llama service + optimistic CANCELADA + snackbar', async () => {
    mockCancel.mockResolvedValue(undefined);
    render(<ProposalsPage />);
    await waitFor(() => screen.getByText(/Enviadas/));
    fireEvent.click(screen.getByText(/Enviadas/));
    fireEvent.click(screen.getByText('Cancelar'));

    await waitFor(() => expect(mockCancel).toHaveBeenCalledWith('p1', 'u1'));
    await waitFor(() => expect(mockShowSuccess).toHaveBeenCalledWith('Propuesta cancelada'));
    expect(screen.queryByText('Cancelar')).toBeNull();
  });
});

// ─── Modal: callbacks correctos según tab ────────────────────────────────

describe('ProposalsPage — modal de detalle', () => {
  it('en Recibidas el modal expone accept/reject (no cancel)', async () => {
    mockGetProposals.mockImplementation((received: string) =>
      Promise.resolve(received === 'u1' ? [makeProposal('p1')] : []),
    );
    render(<ProposalsPage />);
    await waitFor(() => screen.getByText(/Propuesta de Bidder/));
    fireEvent.click(screen.getByText(/Propuesta de Bidder/));

    expect(screen.getByText('modal-accept')).toBeTruthy();
    expect(screen.getByText('modal-reject')).toBeTruthy();
    expect(screen.queryByText('modal-cancel')).toBeNull();
  });

  it('en Enviadas el modal expone cancel (no accept/reject)', async () => {
    mockGetProposals.mockImplementation((_received: string, sent: string) =>
      Promise.resolve(sent === 'u1' ? [makeProposal('p1')] : []),
    );
    render(<ProposalsPage />);
    await waitFor(() => screen.getByText(/Enviadas/));
    fireEvent.click(screen.getByText(/Enviadas/));
    fireEvent.click(screen.getByText(/Publicado por Publisher/));

    expect(screen.queryByText('modal-accept')).toBeNull();
    expect(screen.queryByText('modal-reject')).toBeNull();
    expect(screen.getByText('modal-cancel')).toBeTruthy();
  });
});

// ─── Error global / navegación ───────────────────────────────────────────

describe('ProposalsPage — error global y nav', () => {
  it('si CUALQUIER fetch falla, muestra error global', async () => {
    mockGetProposals.mockImplementation((received: string) =>
      received === 'u1' ? Promise.reject(new Error('boom')) : Promise.resolve([]),
    );
    render(<ProposalsPage />);
    await waitFor(() => expect(screen.getByText(/Ocurrió un error al cargar las propuestas/)).toBeTruthy());
  });

  it('"Ver publicación" navega al detalle de la pub', async () => {
    mockGetProposals.mockImplementation((received: string) =>
      Promise.resolve(received === 'u1' ? [makeProposal('p1')] : []),
    );
    render(<ProposalsPage />);
    await waitFor(() => screen.getByText('Ver publicación'));
    fireEvent.click(screen.getByText('Ver publicación'));
    expect(mockNavigate).toHaveBeenCalledWith('/publications/pub-p1');
  });
});
