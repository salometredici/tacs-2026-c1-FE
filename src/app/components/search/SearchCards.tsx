import React, { useState } from 'react';
import { defaultSearchFilters, SearchFiguritasFilters } from '../../interfaces/search/SearchFiguritasFilters';
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
  onSearch: (filters: SearchFiguritasFilters) => void;
  onReset: () => void;
  loading: boolean;
}

export default function SearchFiguritas({ onSearch, onReset, loading }: SearchFiguritasProps) {
  const [filters, setFilters] = useState<SearchFiguritasFilters>(defaultSearchFilters);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: name === 'number' ? (value ? parseInt(value) : undefined) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleReset = () => {
    setFilters(defaultSearchFilters);
    onReset();
  };

  return (
    <SearchContainer>
      <SearchTitle>Búsqueda de Figuritas</SearchTitle>

      <FilterSection>
        <form onSubmit={handleSubmit}>
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
