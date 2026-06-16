// @vitest-environment happy-dom
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import AdminDashboardPage from './AdminDashboardPage';

afterEach(cleanup);

// ─── Mocks ───────────────────────────────────────────────────────────────

const mockNavigate = vi.fn();
const mockAdminLogout = vi.fn();
const mockShowSuccess = vi.fn();
const mockShowError = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));
vi.mock('../../context/useAdminContext', () => ({
  useAdminContext: () => ({ adminLogout: mockAdminLogout, setAdminLoggedIn: vi.fn() }),
}));
vi.mock('../../context/useSnackbar', () => ({
  useSnackbar: () => ({ showSuccess: mockShowSuccess, showError: mockShowError }),
}));

vi.mock('../../api/SettingsService', () => ({
  getSettings: vi.fn(),
  updateSettings: vi.fn(),
}));
vi.mock('../../api/BroadcastService', () => ({
  sendBroadcast: vi.fn(),
}));
vi.mock('../../api/AdminStatsService', () => ({
  getAdminOverview: vi.fn(),
  getAuctionsTimeseries: vi.fn(),
  getProposalsTimeseries: vi.fn(),
  getExchangesTimeseries: vi.fn(),
  getMostWantedCards: vi.fn(),
  getTopExchangedCards: vi.fn(),
  getTopAuctionByOffers: vi.fn(),
}));

vi.mock('../../components/feedback/ConfirmDialog', () => ({
  default: ({ open, onConfirm, onCancel, loading }: {
    open: boolean; onConfirm: () => void; onCancel: () => void; loading?: boolean;
  }) => open ? (
    <div data-testid="confirm-dialog">
      <button onClick={onConfirm} disabled={loading}>confirm-broadcast</button>
      <button onClick={onCancel}>cancel-broadcast</button>
    </div>
  ) : null,
}));

// Stubs de los 4 paneles (Capa 2/3). Sus tests viven aparte; acá sólo verificamos que
// la page los compone — evitamos importar recharts en tests de unidad de esta page.
vi.mock('./panels/TimeseriesPanel', () => ({
  default: ({ label }: { label: string }) => <div data-testid={`ts-${label}`}>ts-panel:{label}</div>,
}));
vi.mock('./panels/MostWantedCardsPanel', () => ({
  default: () => <div data-testid="most-wanted-panel" />,
}));
vi.mock('./panels/TopExchangedCardsPanel', () => ({
  default: () => <div data-testid="top-exchanged-panel" />,
}));
vi.mock('./panels/TopAuctionPanel', () => ({
  default: () => <div data-testid="top-auction-panel" />,
}));

import { getSettings, updateSettings } from '../../api/SettingsService';
import { sendBroadcast } from '../../api/BroadcastService';
import {
  getAdminOverview, getAuctionsTimeseries, getProposalsTimeseries, getExchangesTimeseries,
  getMostWantedCards, getTopExchangedCards, getTopAuctionByOffers,
} from '../../api/AdminStatsService';

const mockGetSettings = getSettings as ReturnType<typeof vi.fn>;
const mockUpdateSettings = updateSettings as ReturnType<typeof vi.fn>;
const mockSendBroadcast = sendBroadcast as ReturnType<typeof vi.fn>;
const mockGetOverview = getAdminOverview as ReturnType<typeof vi.fn>;
const mockAuctionsTs = getAuctionsTimeseries as ReturnType<typeof vi.fn>;
const mockProposalsTs = getProposalsTimeseries as ReturnType<typeof vi.fn>;
const mockExchangesTs = getExchangesTimeseries as ReturnType<typeof vi.fn>;
const mockMostWanted = getMostWantedCards as ReturnType<typeof vi.fn>;
const mockTopExchanged = getTopExchangedCards as ReturnType<typeof vi.fn>;
const mockTopAuction = getTopAuctionByOffers as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
  mockGetSettings.mockResolvedValue({ maxPendingProposals: 50, maxOffersPerAuction: 100 });
  mockGetOverview.mockResolvedValue({
    totalUsers: 42, activeAuctions: 5, activePublications: 7, totalExchanges: 13,
  });
  const tsEmpty = { period: 'week', total: 0, daily: [] };
  mockAuctionsTs.mockResolvedValue(tsEmpty);
  mockProposalsTs.mockResolvedValue(tsEmpty);
  mockExchangesTs.mockResolvedValue(tsEmpty);
  mockMostWanted.mockResolvedValue([]);
  mockTopExchanged.mockResolvedValue([]);
  mockTopAuction.mockResolvedValue(null);
});

// ─── Overview (Capa 1) ───────────────────────────────────────────────────

describe('AdminDashboardPage — overview', () => {
  it('muestra los 4 stats con los counts del BE', async () => {
    render(<AdminDashboardPage />);
    await waitFor(() => expect(screen.getByText('42')).toBeTruthy());
    expect(screen.getByText('5')).toBeTruthy();
    expect(screen.getByText('7')).toBeTruthy();
    expect(screen.getByText('13')).toBeTruthy();
    expect(screen.getByText('Usuarios registrados')).toBeTruthy();
  });

  it('si overview falla, los stats muestran "N/D" (no rompe la página)', async () => {
    mockGetOverview.mockRejectedValue(new Error('boom'));
    render(<AdminDashboardPage />);
    await waitFor(() => expect(screen.getAllByText('N/D').length).toBeGreaterThanOrEqual(4));
  });
});

// ─── Settings ────────────────────────────────────────────────────────────

describe('AdminDashboardPage — settings', () => {
  it('precarga los valores actuales del BE en los inputs', async () => {
    render(<AdminDashboardPage />);
    await waitFor(() => {
      const inputs = screen.getAllByRole('spinbutton');
      expect((inputs[0] as HTMLInputElement).value).toBe('50');
      expect((inputs[1] as HTMLInputElement).value).toBe('100');
    });
  });

  it('guardar exitoso llama updateSettings + snackbar éxito', async () => {
    mockUpdateSettings.mockResolvedValue({ maxPendingProposals: 80, maxOffersPerAuction: 50 });
    render(<AdminDashboardPage />);
    await waitFor(() => screen.getAllByRole('spinbutton'));
    const [pending, offers] = screen.getAllByRole('spinbutton') as HTMLInputElement[];
    fireEvent.change(pending, { target: { value: '80' } });
    fireEvent.change(offers, { target: { value: '50' } });
    fireEvent.click(screen.getByText('Guardar'));

    await waitFor(() => expect(mockUpdateSettings).toHaveBeenCalledWith({
      maxPendingProposals: 80, maxOffersPerAuction: 50,
    }));
    await waitFor(() => expect(mockShowSuccess).toHaveBeenCalledWith('Configuración actualizada'));
  });

  it('rechaza valor fuera de [1, 100] con snackbar error y NO llama al BE', async () => {
    render(<AdminDashboardPage />);
    await waitFor(() => screen.getAllByRole('spinbutton'));
    const [pending] = screen.getAllByRole('spinbutton') as HTMLInputElement[];
    fireEvent.change(pending, { target: { value: '101' } });
    fireEvent.click(screen.getByText('Guardar'));

    await waitFor(() => expect(mockShowError).toHaveBeenCalledWith(expect.stringMatching(/propuestas.*entre 1 y 100/)));
    expect(mockUpdateSettings).not.toHaveBeenCalled();
  });

  it('falla del BE al guardar muestra snackbar error', async () => {
    mockUpdateSettings.mockRejectedValue(new Error('500'));
    render(<AdminDashboardPage />);
    await waitFor(() => screen.getAllByRole('spinbutton'));
    fireEvent.click(screen.getByText('Guardar'));

    await waitFor(() => expect(mockShowError).toHaveBeenCalledWith(expect.stringMatching(/No se pudo actualizar/)));
  });
});

// ─── Broadcast ───────────────────────────────────────────────────────────

describe('AdminDashboardPage — broadcast', () => {
  it('botón deshabilitado mientras el mensaje está vacío', async () => {
    render(<AdminDashboardPage />);
    await waitFor(() => screen.getByText('Enviar a todos'));
    const btn = screen.getByText('Enviar a todos').closest('button')!;
    expect((btn as HTMLButtonElement).disabled).toBe(true);
  });

  it('habilita el botón cuando hay mensaje y abre el confirm', async () => {
    render(<AdminDashboardPage />);
    await waitFor(() => screen.getByText('Enviar a todos'));
    const textarea = screen.getByPlaceholderText(/Mantenimiento programado/);
    fireEvent.change(textarea, { target: { value: 'Aviso importante' } });

    fireEvent.click(screen.getByText('Enviar a todos'));
    expect(screen.getByTestId('confirm-dialog')).toBeTruthy();
  });

  it('confirmar envía el mensaje (trimmed) y muestra snackbar éxito + limpia el textarea', async () => {
    mockSendBroadcast.mockResolvedValue(undefined);
    render(<AdminDashboardPage />);
    await waitFor(() => screen.getByText('Enviar a todos'));
    const textarea = screen.getByPlaceholderText(/Mantenimiento programado/) as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: '  Aviso importante  ' } });
    fireEvent.click(screen.getByText('Enviar a todos'));
    fireEvent.click(screen.getByText('confirm-broadcast'));

    await waitFor(() => expect(mockSendBroadcast).toHaveBeenCalledWith('Aviso importante'));
    await waitFor(() => expect(mockShowSuccess).toHaveBeenCalledWith(expect.stringMatching(/enviada/)));
    expect(textarea.value).toBe('');
  });

  it('falla del envío muestra snackbar error y NO limpia el textarea', async () => {
    mockSendBroadcast.mockRejectedValue(new Error('500'));
    render(<AdminDashboardPage />);
    await waitFor(() => screen.getByText('Enviar a todos'));
    const textarea = screen.getByPlaceholderText(/Mantenimiento programado/) as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'Hola' } });
    fireEvent.click(screen.getByText('Enviar a todos'));
    fireEvent.click(screen.getByText('confirm-broadcast'));

    await waitFor(() => expect(mockShowError).toHaveBeenCalledWith(expect.stringMatching(/No se pudo enviar/)));
    expect(textarea.value).toBe('Hola');
  });
});

// ─── Logout ──────────────────────────────────────────────────────────────

describe('AdminDashboardPage — logout', () => {
  it('llama adminLogout + navega a /login', async () => {
    render(<AdminDashboardPage />);
    await waitFor(() => screen.getByText(/Cerrar sesión/));
    fireEvent.click(screen.getByText(/Cerrar sesión/));
    expect(mockAdminLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});

// ─── Composición de paneles ──────────────────────────────────────────────
// El comportamiento interno de cada panel vive en sus propios tests / verificación manual.
// Acá sólo validamos que la page los compone con los labels correctos.

describe('AdminDashboardPage — composición de paneles', () => {
  it('compone los 3 timeseries (Subastas/Propuestas/Intercambios) + los 3 highlights', async () => {
    render(<AdminDashboardPage />);
    await waitFor(() => expect(screen.getByTestId('ts-Subastas creadas')).toBeTruthy());
    expect(screen.getByTestId('ts-Propuestas creadas')).toBeTruthy();
    expect(screen.getByTestId('ts-Intercambios concretados')).toBeTruthy();
    expect(screen.getByTestId('most-wanted-panel')).toBeTruthy();
    expect(screen.getByTestId('top-exchanged-panel')).toBeTruthy();
    expect(screen.getByTestId('top-auction-panel')).toBeTruthy();
  });
});
