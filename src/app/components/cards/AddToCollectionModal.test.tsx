// @vitest-environment happy-dom
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import AddToCollectionModal from './AddToCollectionModal';
import type { Card } from '../../interfaces/cards/Card';

afterEach(cleanup);

vi.mock('../../api/CardsService', () => ({ getCatalog: vi.fn() }));
vi.mock('../../api/UsersService', () => ({ addToUserCollection: vi.fn() }));
vi.mock('../../context/useSnackbar', () => ({
  useSnackbar: () => ({ showSuccess: vi.fn(), showError: vi.fn() }),
}));

import { getCatalog } from '../../api/CardsService';
import { addToUserCollection } from '../../api/UsersService';

const mockGetCatalog = getCatalog as ReturnType<typeof vi.fn>;
const mockAdd = addToUserCollection as ReturnType<typeof vi.fn>;

const card = (id: string, desc: string): Card => ({
  id, number: 1, type: 'JUGADOR', description: desc, country: 'Argentina', team: null, category: 'COMUN',
});

const baseProps = {
  userId: 'user-1',
  onClose: vi.fn(),
  onSuccess: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();
  baseProps.onClose = vi.fn();
  baseProps.onSuccess = vi.fn();
  mockGetCatalog.mockResolvedValue([card('ARG1', 'Messi'), card('BRA1', 'Pelé')]);
  mockAdd.mockResolvedValue(undefined);
});

describe('AddToCollectionModal — carga del catálogo', () => {
  it('muestra el catálogo tras cargar', async () => {
    render(<AddToCollectionModal {...baseProps} />);
    await waitFor(() => expect(screen.getByText('Messi')).toBeTruthy());
    expect(screen.getByText('Pelé')).toBeTruthy();
  });
});

describe('AddToCollectionModal — selección y cantidad', () => {
  it('al agregar, la figurita pasa a "Para agregar" y sale del listado de arriba', async () => {
    render(<AddToCollectionModal {...baseProps} />);
    await waitFor(() => screen.getByText('Messi'));
    fireEvent.click(screen.getAllByText('Agregar')[0]); // ARG1 / Messi
    await waitFor(() => expect(screen.getByText('Quitar')).toBeTruthy());
    expect(screen.getAllByText('Agregar').length).toBe(1); // solo queda Pelé arriba
    expect(screen.getByText(/Para agregar \(1\)/)).toBeTruthy();
  });

  it('el + incrementa la cantidad y el total se refleja en el botón Confirmar', async () => {
    render(<AddToCollectionModal {...baseProps} />);
    await waitFor(() => screen.getByText('Messi'));
    fireEvent.click(screen.getAllByText('Agregar')[0]);
    await waitFor(() => screen.getByText('Quitar'));
    fireEvent.click(screen.getByLabelText('Sumar una'));
    fireEvent.click(screen.getByLabelText('Sumar una'));
    expect(screen.getByText(/Para agregar \(3\)/)).toBeTruthy();
    expect(screen.getByText('Confirmar (3)')).toBeTruthy();
  });

  it('el − no baja de 1 (queda deshabilitado en 1)', async () => {
    render(<AddToCollectionModal {...baseProps} />);
    await waitFor(() => screen.getByText('Messi'));
    fireEvent.click(screen.getAllByText('Agregar')[0]);
    await waitFor(() => screen.getByText('Quitar'));
    const minus = screen.getByLabelText('Restar una') as HTMLButtonElement;
    expect(minus.disabled).toBe(true);
  });
});

describe('AddToCollectionModal — confirmar', () => {
  it('llama addToUserCollection una vez por figurita con la cantidad elegida', async () => {
    render(<AddToCollectionModal {...baseProps} />);
    await waitFor(() => screen.getByText('Messi'));
    fireEvent.click(screen.getAllByText('Agregar')[0]); // Messi (ARG1)
    await waitFor(() => screen.getByText('Quitar'));
    fireEvent.click(screen.getByLabelText('Sumar una')); // Messi qty=2
    fireEvent.click(screen.getByText('Agregar')); // Pelé (BRA1), único que queda arriba
    await waitFor(() => expect(screen.getAllByText('Quitar').length).toBe(2));

    fireEvent.click(screen.getByText('Confirmar (3)'));
    await waitFor(() => expect(mockAdd).toHaveBeenCalledTimes(2));
    expect(mockAdd).toHaveBeenCalledWith('user-1', 'ARG1', 2);
    expect(mockAdd).toHaveBeenCalledWith('user-1', 'BRA1', 1);
  });

  it('dispara onSuccess y onClose tras confirmar', async () => {
    render(<AddToCollectionModal {...baseProps} />);
    await waitFor(() => screen.getByText('Messi'));
    fireEvent.click(screen.getAllByText('Agregar')[0]);
    await waitFor(() => screen.getByText('Quitar'));
    fireEvent.click(screen.getByText('Confirmar (1)'));
    await waitFor(() => expect(baseProps.onSuccess).toHaveBeenCalled());
    expect(baseProps.onClose).toHaveBeenCalled();
  });
});
