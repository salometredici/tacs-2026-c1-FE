import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../context/useUserContext';
import MakeProposalModal from '../proposals/MakeProposalModal';
import PlaceBidModal from '../auctions/PlaceBidModal';
import { Publication } from '../../interfaces/publications/Publication';
import { Auction } from '../../interfaces/auctions/Auction';
import { SearchAvailableResponse } from '../../api/CardsService';
import {
  ResultsContainer,
  ResultsHeader,
  ResultCount,
  ResultsGrid,
  SearchResultCard,
  CardNumber,
  CardInfo,
  ProposeButton,
  Pagination,
  PageButton,
  PageInfo,
} from './Search.styles';
import EmptyState from '../common/EmptyState';

interface SearchResultsProps {
  results: SearchAvailableResponse;
  searched: boolean;
  loading: boolean;
  onPubPageChange: (page: number) => void;
  onAucPageChange: (page: number) => void;
}

interface Paginator {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function PaginationControls({ currentPage, totalPages, onPageChange }: Paginator) {
  if (totalPages <= 1) return null;
  return (
    <Pagination>
      <PageButton onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1}>
        ← Anterior
      </PageButton>
      <PageInfo>
        Página {currentPage} de {totalPages}
      </PageInfo>
      <PageButton onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages}>
        Siguiente →
      </PageButton>
    </Pagination>
  );
}

export default function SearchResults({
  results,
  searched,
  loading,
  onPubPageChange,
  onAucPageChange,
}: SearchResultsProps) {
  const navigate = useNavigate();
  const { currentUser } = useUserContext();
  const [selectedPub, setSelectedPub] = useState<Publication | null>(null);
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);

  if (!searched || loading) return null;

  const pubs = results.publications;
  const aucs = results.auctions;
  const total = pubs.data.length + aucs.data.length;

  if (total === 0) {
    return (
      <ResultsContainer>
        <ResultsHeader>
          <ResultCount>No se encontraron publicaciones ni subastas activas</ResultCount>
        </ResultsHeader>
        <EmptyState>Intentá con otros filtros de búsqueda</EmptyState>
      </ResultsContainer>
    );
  }

  return (
    <ResultsContainer>
      {pubs.data.length > 0 && (
        <>
          <ResultsHeader>
            <ResultCount>Publicaciones ({pubs.data.length})</ResultCount>
          </ResultsHeader>
          <ResultsGrid>
            {pubs.data.map(pub => (
              <SearchResultCard key={`pub-${pub.id}`} onClick={() => navigate(`/publications/${pub.id}`)} $clickable>
                <CardNumber>{pub.card.id}</CardNumber>
                <CardInfo><strong>{pub.card.description}</strong></CardInfo>
                <CardInfo>
                  {[pub.card.country, pub.card.team].filter(Boolean).join(' - ')}
                </CardInfo>
                <CardInfo>{pub.card.category}</CardInfo>
                <CardInfo>
                  Ofrecida por <strong>{pub.publisher.name}</strong>
                </CardInfo>
                <CardInfo>
                  Quedan <strong>{pub.remainingCount}</strong> de {pub.initialCount}
                </CardInfo>
                {currentUser && pub.remainingCount > 0 && pub.publisher.id !== currentUser.id && (
                  <ProposeButton onClick={(e) => { e.stopPropagation(); setSelectedPub(pub); }}>
                    Proponer intercambio
                  </ProposeButton>
                )}
              </SearchResultCard>
            ))}
          </ResultsGrid>
          <PaginationControls
            currentPage={pubs.currentPage}
            totalPages={pubs.totalPages}
            onPageChange={onPubPageChange}
          />
        </>
      )}

      {aucs.data.length > 0 && (
        <>
          <ResultsHeader>
            <ResultCount>Subastas ({aucs.data.length})</ResultCount>
          </ResultsHeader>
          <ResultsGrid>
            {aucs.data.map(a => (
              <SearchResultCard key={`auc-${a.id}`} onClick={() => navigate(`/auctions/${a.id}`)} $clickable>
                <CardNumber>{a.card.id}</CardNumber>
                <CardInfo><strong>{a.card.description}</strong></CardInfo>
                <CardInfo>
                  {[a.card.country, a.card.team].filter(Boolean).join(' - ')}
                </CardInfo>
                <CardInfo>{a.card.category}</CardInfo>
                <CardInfo>
                  Subastada por <strong>{a.publisherId.name}</strong>
                </CardInfo>
                <CardInfo>
                  Cierra: {new Date(a.endDate).toLocaleDateString('es-AR', {
                    year: 'numeric', day: '2-digit', month: '2-digit',
                    hour: '2-digit', minute: '2-digit',
                  })}
                </CardInfo>
                {currentUser && a.publisherId.id !== currentUser.id && a.status === 'ACTIVA' && (
                  <ProposeButton onClick={(e) => { e.stopPropagation(); setSelectedAuction(a); }}>
                    Hacer oferta
                  </ProposeButton>
                )}
                {currentUser && a.publisherId.id === currentUser.id && (
                  <ProposeButton onClick={(e) => { e.stopPropagation(); navigate(`/auctions/${a.id}`); }}>
                    Ver mi subasta
                  </ProposeButton>
                )}
              </SearchResultCard>
            ))}
          </ResultsGrid>
          <PaginationControls
            currentPage={aucs.currentPage}
            totalPages={aucs.totalPages}
            onPageChange={onAucPageChange}
          />
        </>
      )}

      {selectedPub && currentUser && (
        <MakeProposalModal
          userId={currentUser.id}
          card={selectedPub.card}
          publicationId={selectedPub.id}
          maxRequestable={selectedPub.remainingCount}
          onClose={() => setSelectedPub(null)}
          onSuccess={() => setSelectedPub(null)}
        />
      )}

      {selectedAuction && currentUser && (
        <PlaceBidModal
          userId={currentUser.id}
          card={selectedAuction.card}
          auctionId={selectedAuction.id}
          onClose={() => setSelectedAuction(null)}
          onSuccess={() => setSelectedAuction(null)}
        />
      )}
    </ResultsContainer>
  );
}
