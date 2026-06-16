// @vitest-environment happy-dom
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import PublicationDetailPage from './PublicationDetailPage';
import type { User } from '../../interfaces/auth/User';

afterEach(cleanup);

const mockNavigate = vi.fn();
const mockRefreshCurrentUser = vi.fn();
const mockShowSuccess = vi.fn();
const mockShowError = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useOutletContext: () => ({ currentUser: USER }),
  useParams: () => ({ id: 'pub-1' }),
}));
vi.mock('../../context/useUserContext', () => ({
  useUserContext: () => ({ refreshCurrentUser: mockRefreshCurrentUser }),
}));
vi.mock('../../context/useSnackbar', () => ({
  useSnackbar: () => ({ showSuccess: mockShowSuccess, showError: mockShowError }),
}));

vi.mock('../../api/PublicationsService', () => ({
  getPublicationById: vi.fn(),
  cancelPublication: vi.fn(),
}));
vi.mock('../../api/ProposalsService', () => ({
  getProposalsByPublicationId: vi.fn(),
  acceptProposal: vi.fn(),
  rejectProposal: vi.fn(),
}));

// Sub-componentes stub
vi.mock('./detail/PublicationSummaryCard', () => ({
  default: ({ publication, isOwner, isActive, onCancelClick, onProposeClick }: {
    publication: { id: string; remainingCount: number; status: string };
    isOwner: boolean; isActive: boolean;
    onCancelClick: () => void; onProposeClick: () => void;
  }) => (
    <div data-testid="summary-card">
      pub:{publication.id} owner:{String(isOwner)} active:{String(isActive)}
      remaining:{publication.remainingCount} status:{publication.status}
      {isOwner && isActive && <button onClick={onCancelClick}>cancelar-pub</button>}
      {!isOwner && isActive && <button onClick={onProposeClick}>proponer</button>}
    </div>
  ),
}));
vi.mock('./detail/ProposalsList', () => ({
  default: ({ proposals, onAccept, onReject }: {
    proposals: { id: string; status: string }[];
    onAccept: (p: { id: string }) => void;
    onReject: (p: { id: string }) => void;
  }) => (
    <div data-testid="proposals-list">
      {proposals.map(p => (
        <div key={p.id} data-testid={`p-${p.id}`}>
          {p.id}:{p.status}
          {p.status === 'PENDIENTE' && <>
            <button onClick={() => onAccept(p)}>accept-{p.id}</button>
            <button onClick={() => onReject(p)}>reject-{p.id}</button>
          </>}
        </div>
      ))}
    </div>
  ),
}));
vi.mock('../../components/proposals/MakeProposalModal', () => ({
  default: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="propose-modal"><button onClick={onClose}>cerrar-modal</button></div>
  ),
}));
vi.mock('../../components/feedback/ConfirmDialog', () => ({
  default: ({ open, onConfirm, onCancel }: {
    open: boolean; onConfirm: () => void; onCancel: () => void;
  }) => open ? (
    <div data-testid="confirm-dialog">
      <button onClick={onConfirm}>confirm-cancel</button>
      <button onClick={onCancel}>back</button>
    </div>
  ) : null,
}));

import { getPublicationById, cancelPublication } from '../../api/PublicationsService';
import { getProposalsByPublicationId, acceptProposal, rejectProposal } from '../../api/ProposalsService';

const mockGetPub = getPublicationById as ReturnType<typeof vi.fn>;
const mockCancelPub = cancelPublication as ReturnType<typeof vi.fn>;
const mockGetProps = getProposalsByPublicationId as ReturnType<typeof vi.fn>;
const mockAccept = acceptProposal as ReturnType<typeof vi.fn>;
const mockReject = rejectProposal as ReturnType<typeof vi.fn>;

const USER: User = {
  id: 'u1', name: 'Pepe', email: 'pepe@test.com',
  role: 'USER', rating: null, exchangesAmount: 0,
  avatarId: 'avatar_1', creationDate: '2026-01-01',
};

const makePub = (opts: Partial<{
  status: 'ACTIVA' | 'CANCELADA' | 'FINALIZADA';
  publisherId: string;
  remainingCount: number;
}> = {}) => ({
  id: 'pub-1',
  status: opts.status ?? 'ACTIVA',
  remainingCount: opts.remainingCount ?? 5,
  initialCount: 10,
  publisher: { id: opts.publisherId ?? 'other-user', name: 'Publisher' },
  card: { id: 'ARG10', description: 'Messi' },
});

const makeProposal = (id: string, opts: Partial<{
  status: 'PENDIENTE' | 'ACEPTADA' | 'RECHAZADA' | 'CANCELADA';
  requestedCount: number;
}> = {}) => ({
  id,
  status: opts.status ?? 'PENDIENTE',
  requestedCount: opts.requestedCount ?? 1,
});

beforeEach(() => {
  vi.clearAllMocks();
  mockGetPub.mockResolvedValue(makePub());
  mockGetProps.mockResolvedValue([]);
});

// ─── Render / estados ────────────────────────────────────────────────────

describe('PublicationDetailPage — render', () => {
  it('muestra "Cargando..." mientras los fetchs están en curso', () => {
    mockGetPub.mockReturnValue(new Promise(() => {}));
    render(<PublicationDetailPage />);
    expect(screen.getByText('Cargando publicación...')).toBeTruthy();
  });

  it('muestra "Publicación no encontrada" si el BE devuelve null', async () => {
    mockGetPub.mockResolvedValue(null);
    render(<PublicationDetailPage />);
    await waitFor(() => expect(screen.getByText('Publicación no encontrada')).toBeTruthy());
  });

  it('isOwner=true cuando publisher.id coincide con currentUser', async () => {
    mockGetPub.mockResolvedValue(makePub({ publisherId: 'u1' }));
    render(<PublicationDetailPage />);
    await waitFor(() => expect(screen.getByTestId('summary-card').textContent).toContain('owner:true'));
  });

  it('isOwner=false cuando publisher.id es otro user', async () => {
    render(<PublicationDetailPage />);
    await waitFor(() => expect(screen.getByTestId('summary-card').textContent).toContain('owner:false'));
  });

  it('muestra ProposalsList sólo si hay propuestas', async () => {
    mockGetProps.mockResolvedValue([makeProposal('p1')]);
    render(<PublicationDetailPage />);
    await waitFor(() => expect(screen.getByTestId('proposals-list')).toBeTruthy());
  });
});

// ─── Cancelar publicación (solo owner) ───────────────────────────────────

describe('PublicationDetailPage — cancelar publicación', () => {
  beforeEach(() => {
    mockGetPub.mockResolvedValue(makePub({ publisherId: 'u1', status: 'ACTIVA' }));
    mockGetProps.mockResolvedValue([makeProposal('p1', { status: 'PENDIENTE' })]);
  });

  it('confirm-cancel: cancela pub + cascada de pendientes + snackbar', async () => {
    mockCancelPub.mockResolvedValue(undefined);
    render(<PublicationDetailPage />);
    await waitFor(() => screen.getByText('cancelar-pub'));
    fireEvent.click(screen.getByText('cancelar-pub'));
    fireEvent.click(screen.getByText('confirm-cancel'));

    await waitFor(() => expect(mockCancelPub).toHaveBeenCalledWith('pub-1', 'u1'));
    await waitFor(() => expect(mockShowSuccess).toHaveBeenCalledWith('Publicación cancelada'));
    // Optimistic: status pub → CANCELADA, status proposal pendiente → CANCELADA
    await waitFor(() => expect(screen.getByTestId('summary-card').textContent).toContain('status:CANCELADA'));
    expect(screen.getByTestId('p-p1').textContent).toContain('CANCELADA');
  });

  it('falla muestra snackbar error y NO cambia status', async () => {
    mockCancelPub.mockRejectedValue(new Error('500'));
    render(<PublicationDetailPage />);
    await waitFor(() => screen.getByText('cancelar-pub'));
    fireEvent.click(screen.getByText('cancelar-pub'));
    fireEvent.click(screen.getByText('confirm-cancel'));

    await waitFor(() => expect(mockShowError).toHaveBeenCalledWith(expect.stringMatching(/cancelar/i)));
    expect(screen.getByTestId('summary-card').textContent).toContain('status:ACTIVA');
  });
});

// ─── Aceptar propuesta ───────────────────────────────────────────────────

describe('PublicationDetailPage — aceptar propuesta', () => {
  beforeEach(() => {
    mockGetPub.mockResolvedValue(makePub({ publisherId: 'u1', remainingCount: 5 }));
  });

  it('aceptar exitoso: descuenta remainingCount + snackbar normal + refreshCurrentUser', async () => {
    mockGetProps.mockResolvedValue([makeProposal('p1', { requestedCount: 2 })]);
    mockAccept.mockResolvedValue(undefined);

    render(<PublicationDetailPage />);
    await waitFor(() => screen.getByText('accept-p1'));
    fireEvent.click(screen.getByText('accept-p1'));

    await waitFor(() => expect(mockAccept).toHaveBeenCalledWith('p1', 'u1'));
    await waitFor(() => expect(screen.getByTestId('summary-card').textContent).toContain('remaining:3'));
    expect(mockShowSuccess).toHaveBeenCalledWith('Propuesta aceptada');
    expect(mockRefreshCurrentUser).toHaveBeenCalled();
  });

  it('aceptar la última: marca FINALIZADA + snackbar específico', async () => {
    mockGetPub.mockResolvedValue(makePub({ publisherId: 'u1', remainingCount: 2 }));
    mockGetProps.mockResolvedValue([
      makeProposal('p1', { requestedCount: 2 }),
      makeProposal('p2', { requestedCount: 1 }),
    ]);
    mockAccept.mockResolvedValue(undefined);

    render(<PublicationDetailPage />);
    await waitFor(() => screen.getByText('accept-p1'));
    fireEvent.click(screen.getByText('accept-p1'));

    await waitFor(() => expect(screen.getByTestId('summary-card').textContent).toContain('status:FINALIZADA'));
    expect(mockShowSuccess).toHaveBeenCalledWith('Propuesta aceptada — Publicación finalizada');
    // Cascada: la otra pendiente queda CANCELADA
    await waitFor(() => expect(screen.getByTestId('p-p2').textContent).toContain('CANCELADA'));
  });

  it('aceptar una propuesta más cara que remainingCount → snackbar error, NO llama BE', async () => {
    mockGetProps.mockResolvedValue([makeProposal('p1', { requestedCount: 10 })]);
    render(<PublicationDetailPage />);
    await waitFor(() => screen.getByText('accept-p1'));
    fireEvent.click(screen.getByText('accept-p1'));

    await waitFor(() => expect(mockShowError).toHaveBeenCalledWith(expect.stringMatching(/quedan 5/)));
    expect(mockAccept).not.toHaveBeenCalled();
  });

  it('cascada: propuesta pendiente que ya no entra (requestedCount > newRemaining) se cancela', async () => {
    mockGetPub.mockResolvedValue(makePub({ publisherId: 'u1', remainingCount: 3 }));
    mockGetProps.mockResolvedValue([
      makeProposal('p1', { requestedCount: 2 }),
      makeProposal('p2', { requestedCount: 2 }), // 2 > 1 después de aceptar p1 → cae
      makeProposal('p3', { requestedCount: 1 }), // 1 ≤ 1 → se queda PENDIENTE
    ]);
    mockAccept.mockResolvedValue(undefined);

    render(<PublicationDetailPage />);
    await waitFor(() => screen.getByText('accept-p1'));
    fireEvent.click(screen.getByText('accept-p1'));

    await waitFor(() => expect(screen.getByTestId('p-p2').textContent).toContain('CANCELADA'));
    expect(screen.getByTestId('p-p3').textContent).toContain('PENDIENTE');
  });
});

// ─── Rechazar propuesta ──────────────────────────────────────────────────

describe('PublicationDetailPage — rechazar propuesta', () => {
  it('rechazar exitoso: optimistic RECHAZADA + snackbar (NO refresca currentUser)', async () => {
    mockGetPub.mockResolvedValue(makePub({ publisherId: 'u1' }));
    mockGetProps.mockResolvedValue([makeProposal('p1')]);
    mockReject.mockResolvedValue(undefined);

    render(<PublicationDetailPage />);
    await waitFor(() => screen.getByText('reject-p1'));
    fireEvent.click(screen.getByText('reject-p1'));

    await waitFor(() => expect(mockReject).toHaveBeenCalledWith('p1', 'u1'));
    await waitFor(() => expect(screen.getByTestId('p-p1').textContent).toContain('RECHAZADA'));
    expect(mockShowSuccess).toHaveBeenCalledWith('Propuesta rechazada');
    expect(mockRefreshCurrentUser).not.toHaveBeenCalled();
  });
});
