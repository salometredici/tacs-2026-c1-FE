import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Auction } from '../../interfaces/auctions/Auction';
import { Bid } from '../../interfaces/auctions/bid/Bid';
import { getAuctionById, endAuction, cancelAuction } from '../../api/AuctionsService';
import PlaceBidModal from '../../components/auctions/PlaceBidModal';
import EditAuctionModal from '../../components/auctions/EditAuctionModal';
import { mockUsers } from '../../../mocks/usersMock';
import { theme } from '../../styles/theme';
import { RULE_LABELS } from '../../interfaces/auctions/auctionRule/AuctionRule';
import { formatCountdown } from '../../utils/utils';
import {
  Page,
  BackButton,
  Card,
  FiguritaHeader,
  FiguritaNumero,
  FiguritaInfo,
  CategoriaBadge,
  EstadoBadge,
  SectionTitle,
  InfoRow,
  ReglaItem,
  OfertaRow,
  OfertaEstadoBadge,
  ConfirmOverlay,
  ConfirmModal,
  ConfirmTitle,
  WarningBox,
  ExchangeSummary,
  ConfirmFooter,
  CancelBtn,
  ConfirmBtn,
  BidButton,
  Countdown,
} from './AuctionDetailPage.styles';

export default function AuctionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentUser = mockUsers[0];

  const [auction, setAuction] = useState<Auction | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBidModal, setShowBidModal] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [finalizeError, setFinalizeError] = useState<string | null>(null);
  const [pendingBid, setPendingBid] = useState<Bid | null>(null);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const isOwner = auction !== null && currentUser.id === auction.publisherId.id;

  useEffect(() => {
    getAuctionById(id!)
      .then(setAuction)
      .finally(() => setLoading(false));
  }, [id]);

  const handleConfirmCancel = async () => {
    if (!auction) return;
    setCancelling(true);
    try {
      await cancelAuction(auction.id);
      setConfirmCancel(false);
      const updated = await getAuctionById(auction.id);
      setAuction(updated);
    } catch {
      setFinalizeError('Error al cancelar la subasta. Intentá de nuevo.');
      setConfirmCancel(false);
    } finally {
      setCancelling(false);
    }
  };

  const handleConfirmFinalize = async () => {
    if (!auction || !pendingBid) return;
    setFinalizing(true);
    setFinalizeError(null);
    try {
      await endAuction(auction.id, pendingBid.bidId);
      setPendingBid(null);
      const updated = await getAuctionById(auction.id);
      setAuction(updated);
    } catch {
      setFinalizeError('Error al finalizar la subasta. Intentá de nuevo.');
      setPendingBid(null);
    } finally {
      setFinalizing(false);
    }
  };

  if (loading) return <Page><p>Cargando...</p></Page>;
  if (!auction) return <Page><BackButton onClick={() => navigate('/auctions')}>← Volver</BackButton><p>Subasta no encontrada.</p></Page>;

  const { texto: countdown, urgente } = formatCountdown(auction.endDate);
  const isActive = auction.status === 'ACTIVA';
  return (
    <Page>
      <BackButton onClick={() => navigate('/auctions')}>← Volver a subastas</BackButton>

      <Card>
        <FiguritaHeader>
          <FiguritaNumero>#{auction.figurita.number}</FiguritaNumero>
          <FiguritaInfo>
            <h2>{auction.figurita.description}</h2>
            <p>{auction.figurita.country} · {auction.figurita.team}</p>
            <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <CategoriaBadge $cat={auction.figurita.category}>{auction.figurita.category}</CategoriaBadge>
              <EstadoBadge $estado={auction.status}>{auction.status}</EstadoBadge>
            </div>
          </FiguritaInfo>
        </FiguritaHeader>

        <InfoRow>
          <span className="label">Publicante</span>
          <span className="value">
            {auction.publisherId.name}
            {' '}{'★'.repeat(Math.round(auction.publisherId.rating || 0))}
            <span style={{ color: theme.colors.textSecondary, fontWeight: 400 }}>
              {' '}({(auction.publisherId.rating ?? 0).toFixed(1)})
            </span>
          </span>
        </InfoRow>
        <InfoRow>
          <span className="label">Cierre</span>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.85rem', color: theme.colors.textSecondary }}>
              {new Date(auction.endDate).toLocaleString('es-AR')}
            </div>
            <Countdown $urgente={urgente}>{countdown}</Countdown>
          </div>
        </InfoRow>
        <InfoRow>
          <span className="label">Ofertas recibidas</span>
          <span className="value">{auction.bids.length}</span>
        </InfoRow>
      </Card>

      <Card>
        <SectionTitle>Condiciones de participación</SectionTitle>
        {auction.rules.length === 0 ? (
          <p style={{ color: theme.colors.textSecondary, fontSize: '0.9rem' }}>Sin restricciones — cualquiera puede ofertar.</p>
        ) : (
          auction.rules.map(r => (
            <ReglaItem key={r.type}>
              <strong>{RULE_LABELS[r.type] ?? r.type}:</strong> {r.value}
            </ReglaItem>
          ))
        )}
        {isActive && !isOwner && (
          <BidButton onClick={() => setShowBidModal(true)}>
            Hacer oferta
          </BidButton>
        )}
        {isActive && isOwner && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm, marginTop: theme.spacing.md }}>
            <BidButton style={{ marginTop: 0 }} onClick={() => setShowEditModal(true)}>
              Editar condiciones
            </BidButton>
            <BidButton style={{ background: theme.colors.danger, marginTop: 0 }} onClick={() => setConfirmCancel(true)}>
              Cancelar subasta
            </BidButton>
          </div>
        )}
      </Card>

      <Card>
        <SectionTitle>Ofertas ({auction.bids.length})</SectionTitle>
        {auction.bids.length === 0 ? (
          <p style={{ color: theme.colors.textSecondary, fontSize: '0.9rem' }}>
            {isOwner ? 'Todavía no recibiste ofertas.' : 'Todavía no hay ofertas. ¡Sé el primero!'}
          </p>
        ) : (
          <>
            {auction.bids
              .slice()
              .sort((a, b) => (b.bidId === auction.lastBidId ? 1 : 0) - (a.bidId === auction.lastBidId ? 1 : 0))
              .map((o: Bid) => (
                <OfertaRow key={o.bidId} $estado={o.status}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{o.bidder.name}</div>
                    <div style={{ fontSize: '0.85rem', color: theme.colors.textSecondary, marginTop: '0.2rem' }}>
                      {'★'.repeat(Math.round(o.bidder.rating))} ({o.bidder.rating.toFixed(1)})
                    </div>
                    <div style={{ fontSize: '0.85rem', marginTop: '0.4rem' }}>
                      {o.offeredFiguritas.length} figurita(s):{' '}
                      {o.offeredFiguritas.map(f => `#${f.number} ${f.description}`).join(', ')}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: theme.colors.textSecondary, marginTop: '0.2rem' }}>
                      {new Date(o.bidDate).toLocaleString('es-AR')}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                    <OfertaEstadoBadge $estado={o.status}>{o.status}</OfertaEstadoBadge>
                    {isOwner && isActive && o.status === 'ACTIVA' && (
                      <BidButton
                        style={{ width: 'auto', padding: '0.3rem 0.9rem', fontSize: '0.85rem', marginTop: 0 }}
                        onClick={() => setPendingBid(o)}
                        disabled={finalizing}
                      >
                        Elegir ganadora
                      </BidButton>
                    )}
                  </div>
                </OfertaRow>
              ))}
            {finalizeError && (
              <p style={{ color: theme.colors.danger, fontSize: '0.9rem', marginTop: '0.5rem' }}>{finalizeError}</p>
            )}
          </>
        )}
      </Card>

      {confirmCancel && auction && (
        <ConfirmOverlay>
          <ConfirmModal>
            <ConfirmTitle>¿Cancelar la subasta?</ConfirmTitle>
            <WarningBox>
              Esta acción es irreversible. La subasta quedará cancelada y todas las ofertas recibidas serán descartadas.
            </WarningBox>
            <ExchangeSummary>
              <div>
                <div className="label">Subasta</div>
                <div className="value">#{auction.figurita.number} {auction.figurita.description}</div>
              </div>
              <div>
                <div className="label">Ofertas que se descartarán</div>
                <div className="value">{auction.bids.filter(o => o.status === 'ACTIVA').length}</div>
              </div>
            </ExchangeSummary>
            <ConfirmFooter>
              <CancelBtn onClick={() => setConfirmCancel(false)} disabled={cancelling}>
                Volver
              </CancelBtn>
              <ConfirmBtn onClick={handleConfirmCancel} disabled={cancelling}>
                {cancelling ? 'Cancelando...' : 'Sí, cancelar subasta'}
              </ConfirmBtn>
            </ConfirmFooter>
          </ConfirmModal>
        </ConfirmOverlay>
      )}

      {pendingBid && auction && (
        <ConfirmOverlay>
          <ConfirmModal>
            <ConfirmTitle>¿Confirmar oferta ganadora?</ConfirmTitle>
            <WarningBox>
              Esta decisión es irreversible. Al confirmar, la subasta quedará finalizada
              y se generará un intercambio con el postor seleccionado.
            </WarningBox>
            <ExchangeSummary>
              <div>
                <div className="label">Vos entregás</div>
                <div className="value">#{auction.figurita.number} {auction.figurita.description}</div>
              </div>
              <div>
                <div className="label">Recibís de {pendingBid.bidder.name}</div>
                <div className="value">
                  {pendingBid.offeredFiguritas.map(f => `#${f.number} ${f.description}`).join(', ')}
                </div>
              </div>
              <div>
                <div className="label">Rating del postor</div>
                <div className="value">
                  {'★'.repeat(Math.round(pendingBid.bidder.rating))} ({pendingBid.bidder.rating.toFixed(1)})
                </div>
              </div>
            </ExchangeSummary>
            <ConfirmFooter>
              <CancelBtn onClick={() => setPendingBid(null)} disabled={finalizing}>
                Cancelar
              </CancelBtn>
              <ConfirmBtn onClick={handleConfirmFinalize} disabled={finalizing}>
                {finalizing ? 'Finalizando...' : 'Confirmar y finalizar'}
              </ConfirmBtn>
            </ConfirmFooter>
          </ConfirmModal>
        </ConfirmOverlay>
      )}

      {showEditModal && auction && (
        <EditAuctionModal
          auction={auction}
          onClose={() => setShowEditModal(false)}
          onSuccess={(updated) => { setAuction(updated); setShowEditModal(false); }}
        />
      )}

      {showBidModal && (
        <PlaceBidModal
          userId={currentUser.id}
          figurita={auction.figurita}
          auctionId={auction.id}
          onClose={() => setShowBidModal(false)}
          onSuccess={() => setShowBidModal(false)}
        />
      )}
    </Page>
  );
}
