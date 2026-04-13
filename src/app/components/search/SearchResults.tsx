import React from 'react';
import { Figurita } from '../../interfaces/Figurita';
import {
  ResultsContainer,
  ResultsHeader,
  ResultCount,
  ResultsGrid,
  FiguritaCard,
  FiguritaNumber,
  FiguritaInfo,
  EmptyMessage,
} from './Search.styles';

interface SearchResultsProps {
  results: Figurita[];
  searched: boolean;
  loading: boolean;
}

export default function SearchResults({
  results,
  searched,
  loading,
}: SearchResultsProps) {
  if (!searched || loading) {
    return null;
  }

  return (
    <ResultsContainer>
      <ResultsHeader>
        <ResultCount>
          {results.length === 0
            ? 'No se encontraron figuritas'
            : `Se encontraron ${results.length} figurita${
                results.length !== 1 ? 's' : ''
              }`}
        </ResultCount>
      </ResultsHeader>

      {results.length === 0 ? (
        <EmptyMessage>Intenta con otros filtros de búsqueda</EmptyMessage>
      ) : (
        <ResultsGrid>
          {results.map((figurita) => (
            <FiguritaCard key={figurita.id}>
              <FiguritaNumber>#{figurita.numero}</FiguritaNumber>
              <FiguritaInfo>
                <strong>{figurita.jugador}</strong>
              </FiguritaInfo>
              <FiguritaInfo>
                {figurita.seleccion} - {figurita.equipo}
              </FiguritaInfo>
              <FiguritaInfo>{figurita.categoria}</FiguritaInfo>
            </FiguritaCard>
          ))}
        </ResultsGrid>
      )}
    </ResultsContainer>
  );
}
