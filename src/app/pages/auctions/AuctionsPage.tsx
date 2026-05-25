import { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Auction } from '../../interfaces/auctions/Auction';
import { UserBid } from '../../interfaces/auctions/bid/UserBid';
import { getActiveAuctions, getAuctionsByUserId, getAuctionBidsByUserId, cancelOffer } from '../../api/AuctionsService';
import AuctionCard from '../../components/auctions/AuctionCard';
import PlaceBidModal from '../../components/auctions/PlaceBidModal';
import { AuthedOutletContext } from '../../components/layout/UserRoute';
import { useSnackbar } from '../../context/useSnackbar';
import {
  AuctionsContainer,
  AuctionsHeader,
  AuctionsTitle,
  AuctionsGrid,
  LoadingMessage,
  EmptyMessage,
  SectionActionButton,
} from '../../components/auctions/Auctions.styles';
import {
  TabNav, TabBtn, MyBidCard, StatusBadge,
  MyBidHeader, MyBidTitle, MyBidMeta, MyBidSubMeta, StrongInline, CancelBidButton,
} from './AuctionsPage.styles';

type Tab = 'active' | 'my-auctions' | 'my-bids';

export default function AuctionsPage() {
  const navigate = useNavigate();
  const { currentUser } = useOutletContext<AuthedOutletContext>();
  const { showSuccess, showError } = useSnackbar();
  const [activeTab, setActiveTab] = useState<Tab>('active');

  const [activeAuctions, setActiveAuctions] = useState<Auction[]>([]);
  const [myAuctions, setMyAuctions] = useState<Auction[]>([]);
  const [myBids, setMyBids] = useState<UserBid[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
  const [cancellingBidId, setCancellingBidId] = useState<string | null>(null);

  const handleCancelOffer = async (auctionId: string, bidId: string) => {
    if (!window.confirm('¿Cancelar esta oferta?')) return;
    setCancellingBidId(bidId);
    try {
      await cancelOffer(auctionId, bidId);
      setMyBids(prev => prev.filter(b => b.bidId !== bidId));
      showSuccess('Oferta cancelada');
    } catch {
      showError('No se pudo cancelar la oferta. Intentá de nuevo.');
    } finally {
      setCancellingBidId(null);
    }
  };

  useEffect(() => {
    setLoading(true);
    const userId = currentUser?.id ?? '';
    Promise.all([
      getActiveAuctions(),
      getAuctionsByUserId(userId),
      getAuctionBidsByUserId(userId),
    ])
      .then(([a, my, bids]) => {
        setActiveAuctions(a);
        setMyAuctions(my);
        setMyBids(bids);
      })
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
  }, [currentUser?.id]);

  return (
    <AuctionsContainer>
      <AuctionsHeader>
        <AuctionsTitle>Subastas</AuctionsTitle>
        <SectionActionButton onClick={() => navigate('/auctions/create')}>
          <span className="material-symbols-outlined" aria-hidden="true">gavel</span>
          Crear Subasta
        </SectionActionButton>
      </AuctionsHeader>

      <TabNav>
        <TabBtn $active={activeTab === 'active'} onClick={() => setActiveTab('active')}>
          Activas {!loading && `(${activeAuctions.length})`}
        </TabBtn>
        <TabBtn $active={activeTab === 'my-auctions'} onClick={() => setActiveTab('my-auctions')}>
          Mis Subastas {!loading && `(${myAuctions.length})`}
        </TabBtn>
        <TabBtn $active={activeTab === 'my-bids'} onClick={() => setActiveTab('my-bids')}>
          Mis Ofertas {!loading && `(${myBids.length})`}
        </TabBtn>
      </TabNav>

      {loading ? (
        <LoadingMessage>Cargando...</LoadingMessage>
      ) : loadError ? (
        <EmptyMessage>Ocurrió un error al cargar las subastas. Intentá de nuevo más tarde.</EmptyMessage>
      ) : (
        <>
          {activeTab === 'active' && (
            activeAuctions.length === 0 ? (
              <EmptyMessage>No hay subastas activas en este momento</EmptyMessage>
            ) : (
              <AuctionsGrid>
                {activeAuctions.map(s => (
                  <AuctionCard
                    key={s.id}
                    auction={s}
                    onBid={() => setSelectedAuction(s)}
                    hideBidButton={s.publisherId.id === currentUser?.id}
                  />
                ))}
              </AuctionsGrid>
            )
          )}

          {activeTab === 'my-auctions' && (
            myAuctions.length === 0 ? (
              <EmptyMessage>No tenés subastas publicadas</EmptyMessage>
            ) : (
              <AuctionsGrid>
                {myAuctions.map(s => (
                  <AuctionCard key={s.id} auction={s} onBid={() => navigate(`/auctions/${s.id}`)} hideBidButton />
                ))}
              </AuctionsGrid>
            )
          )}

          {activeTab === 'my-bids' && (
            myBids.length === 0 ? (
              <EmptyMessage>No realizaste ofertas en subastas</EmptyMessage>
            ) : (
              <AuctionsGrid>
                {myBids.map(o => {
                  const subtitle = [o.figurita.country, o.figurita.team].filter(Boolean).join(' · ');
                  const canCancel = o.bidStatus === 'ACTIVA' && o.auctionStatus === 'ACTIVA';
                  return (
                    <MyBidCard key={o.bidId} onClick={() => navigate(`/auctions/${o.auctionId}`)}>
                      <MyBidHeader>
                        <div>
                          <MyBidTitle>#{o.figurita.number} {o.figurita.description}</MyBidTitle>
                          {subtitle && (
                            <MyBidSubMeta>{subtitle}</MyBidSubMeta>
                          )}
                        </div>
                        <StatusBadge $status={o.bidStatus}>{o.bidStatus}</StatusBadge>
                      </MyBidHeader>
                      <MyBidMeta>
                        Subasta de: <StrongInline>{o.publisher.name}</StrongInline>
                      </MyBidMeta>
                      <MyBidMeta>
                        Ofrecí: <StrongInline>{o.offeredFiguritas.length} figurita(s)</StrongInline>
                        {' · '}{new Date(o.bidDate).toLocaleDateString('es-AR')}
                      </MyBidMeta>
                      <MyBidMeta>
                        Cierra: {new Date(o.closingDate).toLocaleDateString('es-AR', { year: 'numeric', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                      </MyBidMeta>
                      {canCancel && (
                        <CancelBidButton
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleCancelOffer(o.auctionId, o.bidId); }}
                          disabled={cancellingBidId === o.bidId}
                        >
                          {cancellingBidId === o.bidId ? 'Cancelando...' : 'Cancelar oferta'}
                        </CancelBidButton>
                      )}
                    </MyBidCard>
                  );
                })}
              </AuctionsGrid>
            )
          )}
        </>
      )}

      {selectedAuction && currentUser && (
        <PlaceBidModal
          userId={currentUser.id}
          card={selectedAuction.figurita}
          auctionId={selectedAuction.id}
          onClose={() => setSelectedAuction(null)}
          onSuccess={() => setSelectedAuction(null)}
        />
      )}
    </AuctionsContainer>
  );
}
