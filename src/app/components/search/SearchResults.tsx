import { useState } from 'react';
import { useUserContext } from '../../context/useUserContext';
import MakeProposalModal from '../proposals/MakeProposalModal';
import { Figurita } from '../../interfaces/figuritas/Figurita';
import {
  ResultsContainer,
  ResultsHeader,
  ResultCount,
  ResultsGrid,
  FiguritaCard,
  FiguritaNumber,
  FiguritaInfo,
  EmptyMessage,
  ProposeButton,
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
              <FiguritaNumber>#{figurita.number}</FiguritaNumber>
              <FiguritaInfo>
                <strong>{figurita.description}</strong>
              </FiguritaInfo>
              <FiguritaInfo>
                {figurita.country} - {figurita.team}
              </FiguritaInfo>
              <FiguritaInfo>{figurita.category}</FiguritaInfo>
              {currentUser && (
                <ProposeButton onClick={() => setModalFigurita(figurita)}>
                  Proponer intercambio
                </ProposeButton>
              )}
            </FiguritaCard>
          ))}
        </ResultsGrid>
      )}

      {modalFigurita && currentUser && (
        <MakeProposalModal
          userId={currentUser.id}
          figurita={modalFigurita}
          publicationId={String(modalFigurita.id)}
          onClose={() => setModalFigurita(null)}
          onSuccess={() => setModalFigurita(null)}
        />
      )}
    </ResultsContainer>
  );
}
