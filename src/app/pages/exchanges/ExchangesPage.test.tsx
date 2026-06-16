// @vitest-environment happy-dom
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import ExchangesPage from './ExchangesPage';
import type { User } from '../../interfaces/auth/User';

afterEach(cleanup);

const mockNavigate = vi.fn();
const mockRefreshCurrentUser = vi.fn();
const mockShowError = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useOutletContext: () => ({ currentUser: USER }),
}));
vi.mock('../../context/useUserContext', () => ({
  useUserContext: () => ({ refreshCurrentUser: mockRefreshCurrentUser }),
}));
vi.mock('../../context/useSnackbar', () => ({
  useSnackbar: () => ({ showError: mockShowError, showSuccess: vi.fn() }),
}));

vi.mock('../../api/ExchangesService', () => ({
  getExchangesByUserId: vi.fn(),
  submitFeedback: vi.fn(),
}));

// RatingStars: stub que expone los stars via botones para test
vi.mock('../../components/common/RatingStars', () => ({
  default: ({ onChange }: { value: number; onChange: (n: number) => void }) => (
    <div data-testid="rating-stars">
      <button onClick={() => onChange(5)}>5 estrellas</button>
      <button onClick={() => onChange(3)}>3 estrellas</button>
    </div>
  ),
}));

import { getExchangesByUserId, submitFeedback } from '../../api/ExchangesService';

const mockGetExchanges = getExchangesByUserId as ReturnType<typeof vi.fn>;
const mockSubmitFeedback = submitFeedback as ReturnType<typeof vi.fn>;

const USER: User = {
  id: 'u1', name: 'Pepe', email: 'pepe@test.com',
  role: 'USER', rating: null, exchangesAmount: 0,
  avatarId: 'avatar_1', creationDate: '2026-01-01',
};

// Helper para armar exchange. El current user (u1) puede ser A o B según necesidad del test.
const makeExchange = (id: string, opts: {
  amIA?: boolean;
  otherName?: string;
  origin?: 'PROPUESTA' | 'SUBASTA';
  myFeedback?: boolean;
  theirCard?: { number: number; description: string };
} = {}) => {
  const amIA = opts.amIA ?? true;
  const otherName = opts.otherName ?? 'Ana';
  const theirCard = opts.theirCard ?? { number: 10, description: 'Messi' };
  const feedback = opts.myFeedback ? { score: 5, comment: '' } : null;
  return {
    id,
    createdAt: '2026-06-01',
    origin: { type: opts.origin ?? 'PROPUESTA' },
    userA: amIA ? { userId: 'u1', name: 'Pepe' } : { userId: 'other', name: otherName },
    userB: amIA ? { userId: 'other', name: otherName } : { userId: 'u1', name: 'Pepe' },
    cardsFromA: amIA ? [{ number: 99, description: 'mía' }] : [theirCard],
    cardsFromB: amIA ? [theirCard] : [{ number: 99, description: 'mía' }],
    feedbackFromA: amIA ? feedback : null,
    feedbackFromB: amIA ? null : feedback,
  };
};

beforeEach(() => {
  vi.clearAllMocks();
  mockGetExchanges.mockResolvedValue([]);
});

// ─── Render básico ───────────────────────────────────────────────────────

describe('ExchangesPage — render', () => {
  it('empty state cuando no hay intercambios', async () => {
    render(<ExchangesPage />);
    await waitFor(() => expect(screen.getByText(/No tenés intercambios concretados todavía/)).toBeTruthy());
  });

  it('lista intercambios con título "#número · descripción" + nombre del other', async () => {
    mockGetExchanges.mockResolvedValue([makeExchange('e1', { otherName: 'Ana' })]);
    render(<ExchangesPage />);
    await waitFor(() => expect(screen.getByText(/#10 · Messi/)).toBeTruthy());
    expect(screen.getByText(/Con Ana/)).toBeTruthy();
  });

  it('"(+N)" cuando recibí más de una card en el intercambio', async () => {
    const e = makeExchange('e1');
    e.cardsFromB = [
      { number: 1, description: 'a' },
      { number: 2, description: 'b' },
      { number: 3, description: 'c' },
    ];
    mockGetExchanges.mockResolvedValue([e]);
    render(<ExchangesPage />);
    await waitFor(() => expect(screen.getByText(/\(\+2\)/)).toBeTruthy());
  });

  it('si ya califiqué muestra "✓ Calificado", si no muestra botón "Calificar"', async () => {
    mockGetExchanges.mockResolvedValue([
      makeExchange('e1', { myFeedback: true }),
      makeExchange('e2', { myFeedback: false }),
    ]);
    render(<ExchangesPage />);
    await waitFor(() => expect(screen.getByText(/✓ Calificado/)).toBeTruthy());
    expect(screen.getByText('Calificar')).toBeTruthy();
  });
});

// ─── Modal de calificación ───────────────────────────────────────────────

describe('ExchangesPage — modal de calificación', () => {
  it('abrir el modal muestra "Calificar a {other.name}"', async () => {
    mockGetExchanges.mockResolvedValue([makeExchange('e1', { otherName: 'Ana' })]);
    render(<ExchangesPage />);
    await waitFor(() => screen.getByText('Calificar'));
    fireEvent.click(screen.getByText('Calificar'));
    expect(screen.getByText('Calificar a Ana')).toBeTruthy();
  });

  it('botón Confirmar deshabilitado mientras stars=0', async () => {
    mockGetExchanges.mockResolvedValue([makeExchange('e1')]);
    render(<ExchangesPage />);
    await waitFor(() => screen.getByText('Calificar'));
    fireEvent.click(screen.getByText('Calificar'));
    const confirmBtn = screen.getByText('Confirmar').closest('button')!;
    expect((confirmBtn as HTMLButtonElement).disabled).toBe(true);
  });

  it('seleccionar estrellas habilita Confirmar', async () => {
    mockGetExchanges.mockResolvedValue([makeExchange('e1')]);
    render(<ExchangesPage />);
    await waitFor(() => screen.getByText('Calificar'));
    fireEvent.click(screen.getByText('Calificar'));
    fireEvent.click(screen.getByText('5 estrellas'));
    const confirmBtn = screen.getByText('Confirmar').closest('button')!;
    expect((confirmBtn as HTMLButtonElement).disabled).toBe(false);
  });

  it('Confirmar envía feedback, refresca currentUser, marca como Calificado (optimistic)', async () => {
    mockGetExchanges.mockResolvedValue([makeExchange('e1', { amIA: true })]);
    mockSubmitFeedback.mockResolvedValue(undefined);
    render(<ExchangesPage />);
    await waitFor(() => screen.getByText('Calificar'));
    fireEvent.click(screen.getByText('Calificar'));
    fireEvent.click(screen.getByText('5 estrellas'));
    fireEvent.change(screen.getByPlaceholderText('Comentario opcional...'), { target: { value: '  Excelente  ' } });
    fireEvent.click(screen.getByText('Confirmar'));

    // El comentario va trimmed; el undefined cae si quedó vacío post-trim
    await waitFor(() => expect(mockSubmitFeedback).toHaveBeenCalledWith('e1', { score: 5, comment: 'Excelente' }));
    await waitFor(() => expect(mockRefreshCurrentUser).toHaveBeenCalled());
    await waitFor(() => expect(screen.getByText(/✓ Calificado/)).toBeTruthy());
  });

  it('comentario vacío se manda como undefined', async () => {
    mockGetExchanges.mockResolvedValue([makeExchange('e1')]);
    mockSubmitFeedback.mockResolvedValue(undefined);
    render(<ExchangesPage />);
    await waitFor(() => screen.getByText('Calificar'));
    fireEvent.click(screen.getByText('Calificar'));
    fireEvent.click(screen.getByText('3 estrellas'));
    fireEvent.click(screen.getByText('Confirmar'));

    await waitFor(() => expect(mockSubmitFeedback).toHaveBeenCalledWith('e1', { score: 3, comment: undefined }));
  });

  it('falla del envío muestra snackbar error y NO marca como calificado', async () => {
    mockGetExchanges.mockResolvedValue([makeExchange('e1')]);
    mockSubmitFeedback.mockRejectedValue(new Error('500'));
    render(<ExchangesPage />);
    await waitFor(() => screen.getByText('Calificar'));
    fireEvent.click(screen.getByText('Calificar'));
    fireEvent.click(screen.getByText('5 estrellas'));
    fireEvent.click(screen.getByText('Confirmar'));

    await waitFor(() => expect(mockShowError).toHaveBeenCalledWith(expect.stringMatching(/calificación/i)));
    expect(mockRefreshCurrentUser).not.toHaveBeenCalled();
    expect(screen.queryByText(/✓ Calificado/)).toBeNull();
  });

  it('Cancelar cierra el modal sin enviar feedback', async () => {
    mockGetExchanges.mockResolvedValue([makeExchange('e1')]);
    render(<ExchangesPage />);
    await waitFor(() => screen.getByText('Calificar'));
    fireEvent.click(screen.getByText('Calificar'));
    fireEvent.click(screen.getByText('Cancelar'));

    expect(screen.queryByText(/Calificar a /)).toBeNull();
    expect(mockSubmitFeedback).not.toHaveBeenCalled();
  });
});
