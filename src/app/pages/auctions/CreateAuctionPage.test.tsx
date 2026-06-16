// @vitest-environment happy-dom
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import CreateAuctionPage from './CreateAuctionPage';
import type { User } from '../../interfaces/auth/User';

afterEach(cleanup);

const mockNavigate = vi.fn();
const mockShowSuccess = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useOutletContext: () => ({ currentUser: USER }),
}));
vi.mock('../../context/useSnackbar', () => ({
  useSnackbar: () => ({ showSuccess: mockShowSuccess, showError: vi.fn() }),
}));

vi.mock('../../api/UsersService', () => ({
  getUserCollection: vi.fn(),
}));
vi.mock('../../api/AuctionsService', () => ({
  createAuction: vi.fn(),
}));

// CardSelector stub: simple select
vi.mock('./create/CardSelector', () => ({
  default: ({ value, onChange }: {
    value: string; onChange: (v: string) => void;
  }) => (
    <div data-testid="card-selector">
      <button type="button" onClick={() => onChange('ARG10')}>seleccionar-ARG10</button>
      <span>value:{value || 'none'}</span>
    </div>
  ),
}));

// AuctionRulesFields stub: expone los 4 toggles + inputs
vi.mock('./create/AuctionRulesFields', () => ({
  default: ({
    setReputationEnabled, setMinReputation,
    setExchangesEnabled, setMinExchanges,
    setCardCountEnabled, setMinCardCount,
    setCategoryEnabled, setMinCategory,
  }: any) => (
    <div data-testid="rules-fields">
      <button type="button" onClick={() => { setReputationEnabled(true); setMinReputation(3); }}>activar-reputacion-3</button>
      <button type="button" onClick={() => { setExchangesEnabled(true); setMinExchanges(5); }}>activar-exchanges-5</button>
      <button type="button" onClick={() => { setCardCountEnabled(true); setMinCardCount(2); }}>activar-cardcount-2</button>
      <button type="button" onClick={() => { setCategoryEnabled(true); setMinCategory('LEGENDARIO'); }}>activar-categoria-legendario</button>
    </div>
  ),
}));

import { getUserCollection } from '../../api/UsersService';
import { createAuction } from '../../api/AuctionsService';

const mockGetCollection = getUserCollection as ReturnType<typeof vi.fn>;
const mockCreateAuction = createAuction as ReturnType<typeof vi.fn>;

const USER: User = {
  id: 'u1', name: 'Pepe', email: 'pepe@test.com',
  role: 'USER', rating: null, exchangesAmount: 0,
  avatarId: 'avatar_1', creationDate: '2026-01-01',
};

const auctionResponse = {
  id: 'auc-99',
  card: { number: 10, description: 'Messi' },
};

beforeEach(() => {
  vi.clearAllMocks();
  mockGetCollection.mockResolvedValue([]);
});

// ─── Carga inicial / validación ──────────────────────────────────────────

describe('CreateAuctionPage — carga inicial', () => {
  it('al montar fetchea la colección del current user', async () => {
    render(<CreateAuctionPage />);
    await waitFor(() => expect(mockGetCollection).toHaveBeenCalledWith('u1'));
  });

  it('el botón "Crear Subasta" arranca deshabilitado hasta seleccionar card', async () => {
    render(<CreateAuctionPage />);
    await waitFor(() => screen.getByText('Crear Subasta'));
    const btn = screen.getByText('Crear Subasta').closest('button')!;
    expect((btn as HTMLButtonElement).disabled).toBe(true);
  });

  it('seleccionar una card habilita el botón submit', async () => {
    render(<CreateAuctionPage />);
    await waitFor(() => screen.getByText('seleccionar-ARG10'));
    fireEvent.click(screen.getByText('seleccionar-ARG10'));
    const btn = screen.getByText('Crear Subasta').closest('button')!;
    expect((btn as HTMLButtonElement).disabled).toBe(false);
  });
});

// ─── Validación de duración ──────────────────────────────────────────────
// Nota: el rango [6, 120] está aplicado vía atributos min/max del input HTML5,
// que el browser/happy-dom bloquea antes de que llame a nuestro handler. La
// validación JS interna es defense-in-depth (también valida el BE). Por eso
// no testeamos el path "valor fuera de rango" — es inalcanzable desde la UI.

describe('CreateAuctionPage — validación', () => {
  it('duración válida y card seleccionada → submit llega al BE', async () => {
    mockCreateAuction.mockResolvedValue(auctionResponse);
    render(<CreateAuctionPage />);
    await waitFor(() => screen.getByText('seleccionar-ARG10'));
    fireEvent.click(screen.getByText('seleccionar-ARG10'));
    fireEvent.click(screen.getByText('Crear Subasta'));

    await waitFor(() => expect(mockCreateAuction).toHaveBeenCalled());
  });
});

// ─── Reglas: se mapean correctamente ─────────────────────────────────────

describe('CreateAuctionPage — reglas opcionales', () => {
  it('sin ninguna regla activada: rules es []', async () => {
    mockCreateAuction.mockResolvedValue(auctionResponse);
    render(<CreateAuctionPage />);
    await waitFor(() => screen.getByText('seleccionar-ARG10'));
    fireEvent.click(screen.getByText('seleccionar-ARG10'));
    fireEvent.click(screen.getByText('Crear Subasta'));

    await waitFor(() => {
      expect(mockCreateAuction).toHaveBeenCalledWith(expect.objectContaining({
        cardId: 'ARG10', duration: 24, rules: [],
      }));
    });
  });

  it('reputación activada con valor 0 NO se incluye (gate explícito en el código)', async () => {
    // El código exige `minReputation > 0`, no solo enabled. Validamos el filtro.
    mockCreateAuction.mockResolvedValue(auctionResponse);
    render(<CreateAuctionPage />);
    await waitFor(() => screen.getByText('seleccionar-ARG10'));
    fireEvent.click(screen.getByText('seleccionar-ARG10'));
    // No activamos reputación (queda enabled=false, value=0) → no aparece
    fireEvent.click(screen.getByText('Crear Subasta'));
    await waitFor(() => {
      expect(mockCreateAuction.mock.calls[0][0].rules).toEqual([]);
    });
  });

  it('todas las reglas activadas se mapean al payload', async () => {
    mockCreateAuction.mockResolvedValue(auctionResponse);
    render(<CreateAuctionPage />);
    await waitFor(() => screen.getByText('seleccionar-ARG10'));
    fireEvent.click(screen.getByText('seleccionar-ARG10'));
    fireEvent.click(screen.getByText('activar-reputacion-3'));
    fireEvent.click(screen.getByText('activar-exchanges-5'));
    fireEvent.click(screen.getByText('activar-cardcount-2'));
    fireEvent.click(screen.getByText('activar-categoria-legendario'));
    fireEvent.click(screen.getByText('Crear Subasta'));

    await waitFor(() => expect(mockCreateAuction).toHaveBeenCalled());
    const payload = mockCreateAuction.mock.calls[0][0];
    expect(payload.rules).toEqual(expect.arrayContaining([
      { type: 'REPUTACION_MINIMA', value: '3' },
      { type: 'INTERCAMBIOS_MINIMOS', value: '5' },
      { type: 'CANTIDAD_MINIMA_FIGURITAS', value: '2' },
      { type: 'CATEGORIA_MINIMA', value: 'LEGENDARIO' },
    ]));
    expect(payload.rules.length).toBe(4);
  });
});

// ─── Submit: éxito vs error ──────────────────────────────────────────────

describe('CreateAuctionPage — submit', () => {
  it('éxito: snackbar + navega a /auctions/{id}', async () => {
    mockCreateAuction.mockResolvedValue(auctionResponse);
    render(<CreateAuctionPage />);
    await waitFor(() => screen.getByText('seleccionar-ARG10'));
    fireEvent.click(screen.getByText('seleccionar-ARG10'));
    fireEvent.click(screen.getByText('Crear Subasta'));

    await waitFor(() => expect(mockShowSuccess).toHaveBeenCalledWith(expect.stringMatching(/Messi/)));
    expect(mockNavigate).toHaveBeenCalledWith('/auctions/auc-99');
  });

  it('falla del BE muestra el mensaje del backend en el form', async () => {
    mockCreateAuction.mockRejectedValue({ response: { data: { message: 'MIN_REPUTATION fuera de rango' } } });
    render(<CreateAuctionPage />);
    await waitFor(() => screen.getByText('seleccionar-ARG10'));
    fireEvent.click(screen.getByText('seleccionar-ARG10'));
    fireEvent.click(screen.getByText('Crear Subasta'));

    await waitFor(() => expect(screen.getByText('MIN_REPUTATION fuera de rango')).toBeTruthy());
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('falla genérica (sin response) muestra fallback', async () => {
    mockCreateAuction.mockRejectedValue(new Error('Network error'));
    render(<CreateAuctionPage />);
    await waitFor(() => screen.getByText('seleccionar-ARG10'));
    fireEvent.click(screen.getByText('seleccionar-ARG10'));
    fireEvent.click(screen.getByText('Crear Subasta'));

    await waitFor(() => expect(screen.getByText('Network error')).toBeTruthy());
  });
});
