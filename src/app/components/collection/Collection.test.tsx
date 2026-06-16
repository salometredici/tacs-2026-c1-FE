// @vitest-environment happy-dom
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import Collection from './Collection';
import type { CollectionCard } from '../../interfaces/cards/CollectionCard';
import type { Card } from '../../interfaces/cards/Card';

afterEach(cleanup);

vi.mock('../../api/UsersService', () => ({ getUserCollection: vi.fn() }));
vi.mock('../../api/CardsService', () => ({ getCatalog: vi.fn() }));

import { getUserCollection } from '../../api/UsersService';
import { getCatalog } from '../../api/CardsService';

const mockGetCollection = getUserCollection as ReturnType<typeof vi.fn>;
const mockGetCatalog = getCatalog as ReturnType<typeof vi.fn>;

const cc = (cardId: string, quantity: number): CollectionCard => ({
  cardId, number: 1, description: `Card ${cardId}`,
  country: null, team: null, category: 'COMUN',
  quantity, compromisedCount: 0,
});

const catalogOf = (n: number): Card[] =>
  Array.from({ length: n }, (_, i) => ({
    id: `C${i}`, number: i, type: 'JUGADOR', description: `Card ${i}`,
    country: null, team: null, category: 'COMUN',
  }));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Collection — completitud', () => {
  it('muestra N/total con N = distintas con quantity>0 y total = tamaño del catálogo', async () => {
    mockGetCollection.mockResolvedValue([cc('A', 2), cc('B', 1), cc('Z', 0)]); // Z se filtra
    mockGetCatalog.mockResolvedValue(catalogOf(5));
    render(<Collection userId="user-1" />);
    await waitFor(() => expect(screen.getByText('2/5')).toBeTruthy());
  });

  it('no muestra completitud si el catálogo no cargó (total 0)', async () => {
    mockGetCollection.mockResolvedValue([cc('A', 1)]);
    mockGetCatalog.mockResolvedValue([]);
    render(<Collection userId="user-1" />);
    await waitFor(() => screen.getByText(/Todas/));
    expect(screen.queryByText(/\/0/)).toBeNull();
  });
});

describe('Collection — contadores de tabs', () => {
  it('Todas cuenta las poseídas (quantity>0) y Repetidas las de quantity>1', async () => {
    mockGetCollection.mockResolvedValue([cc('A', 3), cc('B', 1), cc('C', 2), cc('Z', 0)]);
    mockGetCatalog.mockResolvedValue(catalogOf(10));
    render(<Collection userId="user-1" />);
    // owned = A,B,C (3); duplicates = A,C (2)
    await waitFor(() => expect(screen.getByText('Todas (3)')).toBeTruthy());
    expect(screen.getByText('Repetidas (2)')).toBeTruthy();
  });
});
