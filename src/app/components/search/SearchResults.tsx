import { useState } from 'react';
import { useUserContext } from '../../context/useUserContext';
import MakeProposalModal from '../proposals/MakeProposalModal';
import { Publication } from '../../interfaces/publications/Publication';
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
  results: Publication[];
  searched: boolean;
  loading: boolean;
}

export default function SearchResults({
  results,
  searched,
  loading,
}: SearchResultsProps) {
  const { currentUser } = useUserContext();
  const [selected, setSelected] = useState<Publication | null>(null);

  if (!searched || loading) {
    return null;
  }

  return (
    <ResultsContainer>
      <ResultsHeader>
        <ResultCount>
          {results.length === 0
            ? 'No se encontraron publicaciones activas'
            : `Se encontraron ${results.length} publicación/es activa/s`}
        </ResultCount>
      </ResultsHeader>

      {results.length === 0 ? (
        <EmptyMessage>Intenta con otros filtros de búsqueda</EmptyMessage>
      ) : (
        <ResultsGrid>
          {results.map((pub) => (
            <FiguritaCard key={pub.id}>
              <FiguritaNumber>#{pub.card.number}</FiguritaNumber>
              <FiguritaInfo>
                <strong>{pub.card.description}</strong>
              </FiguritaInfo>
              <FiguritaInfo>
                {[pub.card.country, pub.card.team].filter(Boolean).join(' - ')}
              </FiguritaInfo>
              <FiguritaInfo>{pub.card.category}</FiguritaInfo>
              <FiguritaInfo>
                Quedan <strong>{pub.remainingCount}</strong> de {pub.initialCount}
              </FiguritaInfo>
              {currentUser && pub.remainingCount > 0 && (
                <ProposeButton onClick={() => setSelected(pub)}>
                  Proponer intercambio
                </ProposeButton>
              )}
            </FiguritaCard>
          ))}
        </ResultsGrid>
      )}

      {selected && currentUser && (
        <MakeProposalModal
          userId={currentUser.id}
          card={selected.card}
          publicationId={selected.id}
          maxRequestable={selected.remainingCount}
          onClose={() => setSelected(null)}
          onSuccess={() => setSelected(null)}
        />
      )}
    </ResultsContainer>
  );
}
