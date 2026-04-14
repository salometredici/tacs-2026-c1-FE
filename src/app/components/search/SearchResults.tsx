import { useState } from 'react';
import { useUserContext } from '../../context/useUserContext';
import MakeProposalModal from '../proposals/MakeProposalModal';
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
  const { currentUser } = useUserContext();
  const [modalFigurita, setModalFigurita] = useState<Figurita | null>(null);

  if (!searched || loading) {
    return null;
  }

  return (
    <ResultsContainer>
      <ResultsHeader>
        <ResultCount>
          {results.length === 0
            ? 'No se encontraron figuritas'
            : `Se encontraron ${results.length} figurita/s`}
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
              {currentUser && (
                <button onClick={() => setModalFigurita(figurita)}>
                  Proponer intercambio
                </button>
              )}
            </FiguritaCard>
          ))}
        </ResultsGrid>
      )}

      {modalFigurita && currentUser && (
        <MakeProposalModal
          userId={currentUser.id}
          figurita={modalFigurita}
          publicacionId={modalFigurita.id}
          onClose={() => setModalFigurita(null)}
          onSuccess={() => setModalFigurita(null)}
        />
      )}
    </ResultsContainer>
  );
}
