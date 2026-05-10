import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auction } from '../../interfaces/auctions/Auction';
import { UserBid } from '../../interfaces/auctions/bid/UserBid';
import { getActiveAuctions, getAuctionsByUserId, getAuctionBidsByUserId, cancelOffer } from '../../api/AuctionsService';
import AuctionCard from '../../components/auctions/AuctionCard';
import PlaceBidModal from '../../components/auctions/PlaceBidModal';
import { useUserContext } from '../../context/useUserContext';
import {
  AuctionsContainer,
  AuctionsHeader,
  AuctionsTitle,
  AuctionsGrid,
  LoadingMessage,
  EmptyMessage,
  SectionActionButton,
} from '../../components/auctions/Auctions.styles';
import { theme } from '../../styles/theme';
import { TabNav, TabBtn, MyBidCard, StatusBadge } from './AuctionsPage.styles';

type Tab = 'active' | 'my-auctions' | 'my-bids';

export default function AuctionsPage() {
  const navigate = useNavigate();
  const { currentUser } = useUserContext();
  const [activeTab, setActiveTab] = useState<Tab>('active');

  const [activeAuctions, setActiveAuctions] = useState<Auction[]>([]);
  const [myAuctions, setMyAuctions] = useState<Auction[]>([]);
  const [myBids, setMyBids] = useState<UserBid[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
  const [cancellingBidId, setCancellingBidId] = useState<string | null>(null);

  const handleCancelOffer = async (auctionId: string, bidId: string) => {
    if (!window.confirm('¿Cancelar esta oferta?')) return;
    setCancellingBidId(bidId);
    try {
      await cancelOffer(auctionId, bidId);
      setMyBids(prev => prev.filter(b => b.bidId !== bidId));
    } catch {
      window.alert('No se pudo cancelar la oferta. Intentá de nuevo.');
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
      .catch(() => {})
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
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <strong style={{ fontSize: '1.1rem' }}>#{o.figurita.number} {o.figurita.description}</strong>
                          {subtitle && (
                            <div style={{ fontSize: '0.85rem', color: theme.colors.textSecondary, marginTop: '0.25rem' }}>
                              {subtitle}
                            </div>
                          )}
                        </div>
                        <StatusBadge $status={o.bidStatus}>{o.bidStatus}</StatusBadge>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: theme.colors.textSecondary }}>
                        Subasta de: <strong style={{ color: theme.colors.text }}>{o.publisher.name}</strong>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: theme.colors.textSecondary }}>
                        Ofrecí: <strong style={{ color: theme.colors.text }}>{o.offeredFiguritas.length} figurita(s)</strong>
                        {' · '}{new Date(o.bidDate).toLocaleDateString('es-AR')}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: theme.colors.textSecondary }}>
                        Cierra: {new Date(o.closingDate).toLocaleDateString('es-AR', { year: 'numeric', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                      </div>
                      {canCancel && (
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleCancelOffer(o.auctionId, o.bidId); }}
                          disabled={cancellingBidId === o.bidId}
                          style={{
                            alignSelf: 'flex-start',
                            marginTop: '0.25rem',
                            padding: '0.35rem 0.85rem',
                            background: 'transparent',
                            border: `1px solid ${theme.colors.outlineVariant}`,
                            borderRadius: theme.shape.full,
                            color: theme.colors.error,
                            fontSize: '0.8rem',
                            fontWeight: 500,
                            cursor: cancellingBidId === o.bidId ? 'wait' : 'pointer',
                          }}
                        >
                          {cancellingBidId === o.bidId ? 'Cancelando...' : 'Cancelar oferta'}
                        </button>
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
          figurita={selectedAuction.figurita}
          auctionId={selectedAuction.id}
          onClose={() => setSelectedAuction(null)}
          onSuccess={() => setSelectedAuction(null)}
        />
      )}
    </AuctionsContainer>
  );
}
