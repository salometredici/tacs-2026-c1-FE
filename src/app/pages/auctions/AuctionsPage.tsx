import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Auction } from '../../interfaces/auctions/Auction';
import { getActiveAuctions, getAuctionsByUserId, getAuctionBidsByUserId, cancelOffer } from '../../api/AuctionsService';
import AuctionCard from '../../components/auctions/AuctionCard';
import PlaceBidModal from '../../components/auctions/PlaceBidModal';
import ConfirmDialog from '../../components/feedback/ConfirmDialog';
import { AuthedOutletContext } from '../../components/layout/UserRoute';
import { useSnackbar } from '../../context/useSnackbar';
import { useFetch } from '../../hooks/useFetch';
import {
  AuctionsContainer,
  AuctionsHeader,
  AuctionsTitle,
  AuctionsGrid,
  SectionActionButton,
} from '../../components/auctions/Auctions.styles';
import EmptyState from '../../components/common/EmptyState';
import {
  TabNav, TabBtn, MyBidCard,
  MyBidHeader, MyBidTitle, MyBidMeta, MyBidSubMeta, StrongInline, CancelBidButton,
} from './AuctionsPage.styles';
import StatusBadge from '../../components/common/StatusBadge';
import { BID_STATUS_TONE as BID_TONE } from '../../interfaces/auctions/bid/BidStatus';


type Tab = 'active' | 'my-auctions' | 'my-bids';

export default function AuctionsPage() {
  const navigate = useNavigate();
  const { currentUser } = useOutletContext<AuthedOutletContext>();
  const { showSuccess, showError } = useSnackbar();
  const [activeTab, setActiveTab] = useState<Tab>('active');
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
  const [cancellingBidId, setCancellingBidId] = useState<string | null>(null);
  const [pendingCancel, setPendingCancel] = useState<{ auctionId: string; bidId: string } | null>(null);

  const userId = currentUser.id;
  const { data: activeData, isLoading: loadingActive, error: errorActive, refetch: refetchActive } = useFetch(
    () => getActiveAuctions(), [],
  );
  const { data: myAuctionsData, isLoading: loadingMyAuctions, error: errorMyAuctions } = useFetch(
    () => getAuctionsByUserId(userId), [userId],
  );
  const { data: myBidsData, isLoading: loadingMyBids, error: errorMyBids, setData: setMyBids, refetch: refetchMyBids } = useFetch(
    () => getAuctionBidsByUserId(userId), [userId],
  );

  const activeAuctions = activeData ?? [];
  const myAuctions = myAuctionsData ?? [];
  const myBids = myBidsData ?? [];
  const loading = loadingActive || loadingMyAuctions || loadingMyBids;
  const loadError = errorActive !== null || errorMyAuctions !== null || errorMyBids !== null;

  const confirmCancelOffer = async () => {
    if (!pendingCancel) return;
    const { auctionId, bidId } = pendingCancel;
    setCancellingBidId(bidId);
    setPendingCancel(null);
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
        <EmptyState>Cargando...</EmptyState>
      ) : loadError ? (
        <EmptyState>Ocurrió un error al cargar las subastas. Intentá de nuevo más tarde.</EmptyState>
      ) : (
        <>
          {activeTab === 'active' && (
            activeAuctions.length === 0 ? (
              <EmptyState>No hay subastas activas en este momento</EmptyState>
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
              <EmptyState>No tenés subastas publicadas</EmptyState>
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
              <EmptyState>No realizaste ofertas en subastas</EmptyState>
            ) : (
              <AuctionsGrid>
                {myBids.map(o => {
                  const subtitle = [o.card.country, o.card.team].filter(Boolean).join(' · ');
                  const canCancel = o.bidStatus === 'ACTIVA' && o.auctionStatus === 'ACTIVA';
                  return (
                    <MyBidCard key={o.bidId} onClick={() => navigate(`/auctions/${o.auctionId}`)}>
                      <MyBidHeader>
                        <div>
                          <MyBidTitle>{o.card.id} {o.card.description}</MyBidTitle>
                          {subtitle && (
                            <MyBidSubMeta>{subtitle}</MyBidSubMeta>
                          )}
                        </div>
                        <StatusBadge tone={BID_TONE[o.bidStatus] ?? 'neutral'}>{o.bidStatus}</StatusBadge>
                      </MyBidHeader>
                      <MyBidMeta>
                        Subasta de: <StrongInline>{o.publisher.name}</StrongInline>
                      </MyBidMeta>
                      <MyBidMeta>
                        Ofrecí: <StrongInline>{o.offeredCards.length} figurita(s)</StrongInline>
                        {' · '}{new Date(o.bidDate).toLocaleDateString('es-AR')}
                      </MyBidMeta>
                      <MyBidMeta>
                        Cierra: {new Date(o.closingDate).toLocaleDateString('es-AR', { year: 'numeric', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                      </MyBidMeta>
                      {canCancel && (
                        <CancelBidButton
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setPendingCancel({ auctionId: o.auctionId, bidId: o.bidId }); }}
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
          card={selectedAuction.card}
          auctionId={selectedAuction.id}
          onClose={() => setSelectedAuction(null)}
          onSuccess={() => { setSelectedAuction(null); refetchActive(); refetchMyBids(); }}
        />
      )}

      <ConfirmDialog
        open={pendingCancel !== null}
        title="¿Cancelar esta oferta?"
        confirmLabel="Sí, cancelar"
        cancelLabel="Volver"
        destructive
        onConfirm={confirmCancelOffer}
        onCancel={() => setPendingCancel(null)}
      />
    </AuctionsContainer>
  );
}
