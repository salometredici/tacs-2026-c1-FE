// @vitest-environment happy-dom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProposalDetailModal from './ProposalDetailModal';
import type { Proposal } from '../../interfaces/proposals/Proposal';

afterEach(cleanup);

const makeProposal = (overrides: Partial<Proposal> = {}): Proposal => ({
  id: 'prop-abcdef',
  publication: {
    id: 'pub-1',
    card: { id: 'ARG10', number: 10, type: 'JUGADOR', description: 'Messi', country: 'Argentina', team: null, category: 'LEGENDARIO' },
    publisher: { id: 'u1', name: 'Editor', email: '', rating: null, exchangesAmount: 0, avatarId: 'avatar_1', creationDate: '' },
    status: 'ACTIVA',
    initialCount: 2,
    remainingCount: 2,
  },
  offeredCards: [
    { id: 'BRA7', number: 7, type: 'JUGADOR', description: 'Neymar', country: 'Brasil', team: null, category: 'EPICO' },
  ],
  requestedCount: 1,
  bidder: { id: 'u2', name: 'Proponente', email: '', rating: null, exchangesAmount: 0, avatarId: 'avatar_2', creationDate: '' },
  status: 'PENDIENTE',
  creationDate: '2026-01-01T10:00:00Z',
  ...overrides,
});

const wrap = (proposal: Proposal, extraProps = {}) =>
  render(
    <MemoryRouter>
      <ProposalDetailModal proposal={proposal} onClose={vi.fn()} {...extraProps} />
    </MemoryRouter>,
  );

describe('ProposalDetailModal — content', () => {
  it('renders the proposal id suffix in the title', () => {
    wrap(makeProposal());
    expect(screen.getByText(/Propuesta #abcdef/)).toBeTruthy();
  });

  it('renders the status badge label', () => {
    wrap(makeProposal());
    expect(screen.getByText('Pendiente')).toBeTruthy();
  });

  it('renders offered cards', () => {
    wrap(makeProposal());
    expect(screen.getByText(/Neymar/)).toBeTruthy();
  });

  it('shows "Sin figuritas" when offeredCards is empty', () => {
    wrap(makeProposal({ offeredCards: [] }));
    expect(screen.getByText('Sin figuritas')).toBeTruthy();
  });

  it('shows the column label and publication card id', () => {
    wrap(makeProposal());
    expect(screen.getByText('Pidió')).toBeTruthy();
    expect(screen.getByText('ARG10')).toBeTruthy(); // inside <strong>, unique text node
  });
});

describe('ProposalDetailModal — action buttons (PENDIENTE)', () => {
  it('shows Aceptar and Rechazar when onAccept+onReject are provided and status=PENDIENTE', () => {
    wrap(makeProposal(), { onAccept: vi.fn(), onReject: vi.fn() });
    expect(screen.getByText('Aceptar')).toBeTruthy();
    expect(screen.getByText('Rechazar')).toBeTruthy();
  });

  it('hides action buttons when status is not PENDIENTE', () => {
    wrap(makeProposal({ status: 'ACEPTADA' }), { onAccept: vi.fn(), onReject: vi.fn() });
    expect(screen.queryByText('Aceptar')).toBeNull();
    expect(screen.queryByText('Rechazar')).toBeNull();
  });

  it('shows "Cancelar propuesta" when onCancel provided and status=PENDIENTE', () => {
    wrap(makeProposal(), { onCancel: vi.fn() });
    expect(screen.getByText('Cancelar propuesta')).toBeTruthy();
  });

  it('calls onAccept and then closes when Aceptar clicked', async () => {
    const onAccept = vi.fn().mockResolvedValue(undefined);
    const onClose = vi.fn();
    render(
      <MemoryRouter>
        <ProposalDetailModal proposal={makeProposal()} onClose={onClose} onAccept={onAccept} onReject={vi.fn()} />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByText('Aceptar'));
    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(onAccept).toHaveBeenCalledOnce();
  });

  it('calls onReject and then closes when Rechazar clicked', async () => {
    const onReject = vi.fn().mockResolvedValue(undefined);
    const onClose = vi.fn();
    render(
      <MemoryRouter>
        <ProposalDetailModal proposal={makeProposal()} onClose={onClose} onAccept={vi.fn()} onReject={onReject} />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByText('Rechazar'));
    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(onReject).toHaveBeenCalledOnce();
  });
});

describe('ProposalDetailModal — close', () => {
  it('calls onClose when Cerrar clicked', () => {
    const onClose = vi.fn();
    render(
      <MemoryRouter>
        <ProposalDetailModal proposal={makeProposal()} onClose={onClose} />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByText('Cerrar'));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
