// @vitest-environment happy-dom
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import SearchPage from './SearchPage';
import type { SearchFiguritasFilters } from '../../interfaces/search/SearchFiguritasFilters';

afterEach(cleanup);

// ─── Mocks ───────────────────────────────────────────────────────────────

const mockShowError = vi.fn();

vi.mock('../../context/useSnackbar', () => ({
  useSnackbar: () => ({ showError: mockShowError }),
}));

vi.mock('../../api/CardsService', () => ({
  searchAvailable: vi.fn(),
}));

// SearchCards como stub: expone un botón que dispara onSearch + refleja loading
vi.mock('../../components/search/SearchCards', () => ({
  default: ({ onSearch, loading }: {
    onSearch: (f: SearchFiguritasFilters) => void; loading: boolean;
  }) => (
    <div data-testid="search-cards">
      loading:{String(loading)}
      <button onClick={() => onSearch({ number: 1 } as SearchFiguritasFilters)}>buscar</button>
    </div>
  ),
}));

// SearchResults como stub: refleja loading para verificar que no quede colgado
vi.mock('../../components/search/SearchResults', () => ({
  default: ({ loading }: { loading: boolean }) => (
    <div data-testid="search-results">results-loading:{String(loading)}</div>
  ),
}));

import { searchAvailable } from '../../api/CardsService';

const mockSearch = searchAvailable as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
});

describe('SearchPage — manejo de error en runSearch', () => {
  it('si searchAvailable falla, muestra snackbar de error y sale de loading', async () => {
    mockSearch.mockRejectedValue(new Error('boom'));

    render(<SearchPage />);
    fireEvent.click(screen.getByText('buscar'));

    await waitFor(() => expect(mockShowError).toHaveBeenCalledWith(expect.stringMatching(/búsqueda/)));
    // El finally siempre apaga el loading → no queda colgado
    await waitFor(() => expect(screen.getByTestId('search-cards').textContent).toContain('loading:false'));
    expect(screen.getByTestId('search-results').textContent).toContain('results-loading:false');
  });

  it('búsqueda exitosa no dispara snackbar de error', async () => {
    mockSearch.mockResolvedValue({
      publications: { data: [], currentPage: 1, totalPages: 0 },
      auctions: { data: [], currentPage: 1, totalPages: 0 },
    });

    render(<SearchPage />);
    fireEvent.click(screen.getByText('buscar'));

    await waitFor(() => expect(mockSearch).toHaveBeenCalled());
    expect(mockShowError).not.toHaveBeenCalled();
    await waitFor(() => expect(screen.getByTestId('search-cards').textContent).toContain('loading:false'));
  });
});
