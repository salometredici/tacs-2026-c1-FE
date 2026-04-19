import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auction } from '../../interfaces/auctions/Auction';
import { UserBid } from '../../interfaces/auctions/bid/UserBid';
import { getActiveAuctions, getAuctionsByUserId, getAuctionBidsByUserId } from '../../api/AuctionsService';
import AuctionCard from '../../components/auctions/AuctionCard';
import PlaceBidModal from '../../components/auctions/PlaceBidModal';
import { useUserContext } from '../../context/useUserContext';
import {
  AuctionsContainer,
  AuctionsHeader,
  AuctionsTitle,
  CreateButton,
  AuctionsGrid,
  LoadingMessage,
  EmptyMessage,
} from '../../components/auctions/Auctions.styles';
import { theme } from '../../styles/theme';
import { TabNav, TabBtn, MiOfertaCard, EstadoBadge } from './AuctionsPage.styles';

type Tab = 'activas' | 'mis-subastas' | 'mis-ofertas';

export default function AuctionsPage() {
  const navigate = useNavigate();
  const { currentUser } = useUserContext();
  const [activeTab, setActiveTab] = useState<Tab>('activas');

  const [activas, setActivas] = useState<Auction[]>([]);
  const [misSubastas, setMisSubastas] = useState<Auction[]>([]);
  const [misOfertas, setMisOfertas] = useState<UserBid[]>([]);
  const [loading, setLoading] = useState(true);
  const [subastaSeleccionada, setSubastaSeleccionada] = useState<Auction | null>(null);

  useEffect(() => {
    setLoading(true);
    const userId = currentUser?.id ?? '';
    Promise.all([
      getActiveAuctions(),
      getAuctionsByUserId(userId),
      getAuctionBidsByUserId(userId),
    ])
      .then(([a, mis, bids]) => {
        setActivas(a);
        setMisSubastas(mis);
        setMisOfertas(bids);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [currentUser?.id]);

  return (
    <AuctionsContainer>
      <AuctionsHeader>
        <AuctionsTitle>Subastas</AuctionsTitle>
        <CreateButton onClick={() => navigate('/auctions/create')}>+ Crear Subasta</CreateButton>
      </AuctionsHeader>

      <TabNav>
        <TabBtn $active={activeTab === 'activas'} onClick={() => setActiveTab('activas')}>
          Activas {!loading && `(${activas.length})`}
        </TabBtn>
        <TabBtn $active={activeTab === 'mis-subastas'} onClick={() => setActiveTab('mis-subastas')}>
          Mis Subastas {!loading && `(${misSubastas.length})`}
        </TabBtn>
        <TabBtn $active={activeTab === 'mis-ofertas'} onClick={() => setActiveTab('mis-ofertas')}>
          Mis Ofertas {!loading && `(${misOfertas.length})`}
        </TabBtn>
      </TabNav>

      {loading ? (
        <LoadingMessage>Cargando...</LoadingMessage>
      ) : (
        <>
          {/* Activas */}
          {activeTab === 'activas' && (
            activas.length === 0 ? (
              <EmptyMessage>No hay subastas activas en este momento</EmptyMessage>
            ) : (
              <AuctionsGrid>
                {activas.map(s => (
                  <AuctionCard key={s.id} auction={s} onBid={() => setSubastaSeleccionada(s)} />
                ))}
              </AuctionsGrid>
            )
          )}

          {/* Mis Subastas */}
          {activeTab === 'mis-subastas' && (
            misSubastas.length === 0 ? (
              <EmptyMessage>No tenés subastas publicadas</EmptyMessage>
            ) : (
              <AuctionsGrid>
                {misSubastas.map(s => (
                  <AuctionCard key={s.id} auction={s} onBid={() => navigate(`/auctions/${s.id}`)} hideBidButton />
                ))}
              </AuctionsGrid>
            )
          )}

          {/* Mis Ofertas */}
          {activeTab === 'mis-ofertas' && (
            misOfertas.length === 0 ? (
              <EmptyMessage>No realizaste ofertas en subastas</EmptyMessage>
            ) : (
              <AuctionsGrid>
                {misOfertas.map(o => (
                  <MiOfertaCard key={o.bidId} onClick={() => navigate(`/auctions/${o.auctionId}`)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <strong style={{ fontSize: '1.1rem' }}>#{o.figurita.number} {o.figurita.description}</strong>
                        <div style={{ fontSize: '0.85rem', color: theme.colors.textSecondary, marginTop: '0.25rem' }}>
                          {o.figurita.country} · {o.figurita.team}
                        </div>
                      </div>
                      <EstadoBadge $estado={o.bidStatus}>{o.bidStatus}</EstadoBadge>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: theme.colors.textSecondary }}>
                      Publicante: <strong style={{ color: theme.colors.text }}>{o.publisher.name}</strong>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: theme.colors.textSecondary }}>
                      Ofrecí: <strong style={{ color: theme.colors.text }}>{o.offeredFiguritas.length} figurita(s)</strong>
                      {' · '}{new Date(o.bidDate).toLocaleDateString('es-AR')}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: theme.colors.textSecondary }}>
                      Cierra: {new Date(o.closingDate).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </MiOfertaCard>
                ))}
              </AuctionsGrid>
            )
          )}
        </>
      )}

      {subastaSeleccionada && currentUser && (
        <PlaceBidModal
          userId={currentUser.id}
          figurita={subastaSeleccionada.figurita}
          auctionId={subastaSeleccionada.id}
          onClose={() => setSubastaSeleccionada(null)}
          onSuccess={() => setSubastaSeleccionada(null)}
        />
      )}
    </AuctionsContainer>
  );
}
