import React, { useState } from 'react';
import { mockSearchFiguritas } from '../../../mocks/figuritasMock';
import { Figurita } from '../../interfaces/Figurita';
import { SearchFiguritasFilters } from '../../interfaces/SearchFiguritasFilters';
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
  onSearch: (results: Figurita[], searched: boolean, loading: boolean) => void;
}

export default function SearchFiguritas({
  onSearch,
}: SearchFiguritasProps) {
  const [filters, setFilters] = useState<SearchFiguritasFilters>({
    numero: 0,
    jugador: '',
    seleccion: '',
    equipo: '',
  });
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: name === 'numero' ? (value ? parseInt(value) : 0) : value,
    }));
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);

    try {
      // TODO: Cambiar a comentarios reales cuando backend esté disponible
      // const response = await searchFiguritas(filters);
      // onSearch(response.figuritas, true, false);

      // Por ahora usar mock
      const response = mockSearchFiguritas(
        filters.numero > 0 ? filters.numero : undefined,
        filters.jugador || undefined,
        filters.seleccion || undefined,
        filters.equipo || undefined
      );
      setLoading(false);
      onSearch(response.figuritas, true, false);
    } catch (error) {
      console.error('Error en búsqueda:', error);
      setLoading(false);
      onSearch([], true, false);
    }
  };

  const handleReset = () => {
    setFilters({
      numero: 0,
      jugador: '',
      seleccion: '',
      equipo: '',
    });
    setSearched(false);
    onSearch([], false, false);
  };

  return (
    <SearchContainer>
      <SearchTitle>Búsqueda de Figuritas</SearchTitle>

      <FilterSection>
        <form onSubmit={handleSearch}>
          <FiltersGrid>
            <FilterGroup>
              <Label htmlFor="numero">Número de Figurita</Label>
              <Input
                id="numero"
                type="number"
                name="numero"
                value={filters.numero || ''}
                onChange={handleFilterChange}
                placeholder="Ej: 1, 10, 23..."
                min="0"
              />
            </FilterGroup>

            <FilterGroup>
              <Label htmlFor="jugador">Jugador / Descripción</Label>
              <Input
                id="jugador"
                type="text"
                name="jugador"
                value={filters.jugador}
                onChange={handleFilterChange}
                placeholder="Ej: Messi, Ronaldo..."
              />
            </FilterGroup>

            <FilterGroup>
              <Label htmlFor="seleccion">Selección</Label>
              <Input
                id="seleccion"
                type="text"
                name="seleccion"
                value={filters.seleccion}
                onChange={handleFilterChange}
                placeholder="Ej: Argentina, Francia..."
              />
            </FilterGroup>

            <FilterGroup>
              <Label htmlFor="equipo">Equipo</Label>
              <Input
                id="equipo"
                type="text"
                name="equipo"
                value={filters.equipo}
                onChange={handleFilterChange}
                placeholder="Ej: PSG, Manchester United..."
              />
            </FilterGroup>
          </FiltersGrid>

          <ButtonGroup>
            <Button type="submit" variant="primary">
              Buscar
            </Button>
            <Button type="button" variant="secondary" onClick={handleReset}>
              Limpiar
            </Button>
          </ButtonGroup>
        </form>
      </FilterSection>

      {loading && <LoadingMessage>Buscando figuritas...</LoadingMessage>}
    </SearchContainer>
  );
}
