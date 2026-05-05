import React, { useState } from 'react';
import { defaultSearchFilters, SearchFiguritasFilters } from '../../interfaces/search/SearchFiguritasFilters';
import { Publication } from '../../interfaces/publications/Publication';
import { searchActivePublications } from '../../api/PublicationsService';
import {
  SearchContainer,
  SearchTitle,
  FilterSection,
  FiltersGrid,
  FilterGroup,
  Label,
  Input,
  ButtonGroup,
  Button,
  LoadingMessage,
} from './Search.styles';

interface SearchFiguritasProps {
  onSearch: (results: Publication[], searched: boolean, loading: boolean) => void;
}

export default function SearchFiguritas({ onSearch }: SearchFiguritasProps) {
  const [filters, setFilters] = useState<SearchFiguritasFilters>(defaultSearchFilters);
  const [loading, setLoading] = useState(false);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: name === 'number' ? (value ? parseInt(value) : undefined) : value,
    }));
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const pubs = await searchActivePublications({
      name: filters.description,
      country: filters.country,
      category: filters.category,
    });
    // El backend de publications no filtra por número; lo aplico en cliente.
    const filtered = filters.number != null
      ? pubs.filter(p => p.card.number === filters.number)
      : pubs;
    setLoading(false);
    onSearch(filtered, true, false);
  };

  const handleReset = () => {
    setFilters(defaultSearchFilters);
    onSearch([], false, false);
  };

  return (
    <SearchContainer>
      <SearchTitle>Búsqueda de Figuritas</SearchTitle>

      <FilterSection>
        <form onSubmit={handleSearch}>
          <FiltersGrid>
            <FilterGroup>
              <Label htmlFor="number">Número de Figurita</Label>
              <Input
                id="number"
                type="number"
                name="number"
                value={filters.number || ''}
                onChange={handleFilterChange}
                placeholder="Ej: 1, 10, 23..."
                min="0"
              />
            </FilterGroup>

            <FilterGroup>
              <Label htmlFor="description">Jugador / Descripción</Label>
              <Input
                id="description"
                type="text"
                name="description"
                value={filters.description || ''}
                onChange={handleFilterChange}
                placeholder="Ej: Messi, Ronaldo..."
              />
            </FilterGroup>

            <FilterGroup>
              <Label htmlFor="country">Selección</Label>
              <Input
                id="country"
                type="text"
                name="country"
                value={filters.country || ''}
                onChange={handleFilterChange}
                placeholder="Ej: Argentina, Francia..."
              />
            </FilterGroup>

            <FilterGroup>
              <Label htmlFor="category">Categoría</Label>
              <Input
                id="category"
                type="text"
                name="category"
                value={filters.category || ''}
                onChange={handleFilterChange}
                placeholder="Ej: COMUN, EPICO..."
              />
            </FilterGroup>
          </FiltersGrid>

          <ButtonGroup>
            <Button type="submit" variant="primary">Buscar</Button>
            <Button type="button" variant="secondary" onClick={handleReset}>Limpiar</Button>
          </ButtonGroup>
        </form>
      </FilterSection>

      {loading && <LoadingMessage>Buscando figuritas...</LoadingMessage>}
    </SearchContainer>
  );
}
