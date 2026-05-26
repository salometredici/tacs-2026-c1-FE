import { useState } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { Bid } from '../../interfaces/auctions/bid/Bid';
import { getAuctionById, acceptOffer, rejectOffer, cancelAuction, cancelOffer } from '../../api/AuctionsService';
import PlaceBidModal from '../../components/auctions/PlaceBidModal';
import ConfirmDialog from '../../components/feedback/ConfirmDialog';
import { AuthedOutletContext } from '../../components/layout/UserRoute';
import { useSnackbar } from '../../context/useSnackbar';
import { useFetch } from '../../hooks/useFetch';
import { RULE_LABELS } from '../../interfaces/auctions/auctionRule/AuctionRule';
import { formatCountdown } from '../../utils/utils';
import {
  Page,
  BackButton,
  PageTitle,
  TopGrid,
  Card,
  FiguritaHeader,
  FiguritaNumero,
  FiguritaInfo,
  CategoriaBadge,
  EstadoBadge,
  SectionTitle,
  InfoRow,
  ReglaItem,
  OfertasGrid,
  OfertaCard,
  OfertaHeader,
  OfertaBidder,
  OfertaRating,
  OfertaFiguritas,
  OfertaDate,
  ChooseWinnerButton,
  RejectOfferButton,
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
  BadgeRow,
  RatingDecimal,
  InfoRowRight,
  InfoCaption,
  HintText,
  EmptyBidsText,
  DangerBidButton,
  OfferActions,
  FinalizeErrorText,
} from './AuctionDetailPage.styles';

export default function AuctionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useOutletContext<AuthedOutletContext>();
  const { showSuccess } = useSnackbar();

  const [showBidModal, setShowBidModal] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [finalizeError, setFinalizeError] = useState<string | null>(null);
  const [pendingBid, setPendingBid] = useState<Bid | null>(null);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [rejectingBidId, setRejectingBidId] = useState<string | null>(null);
  const [pendingCancelOwnBid, setPendingCancelOwnBid] = useState<string | null>(null);
  const [cancellingOwnBid, setCancellingOwnBid] = useState(false);

  const { data: auction, isLoading: loading, setData: setAuction } = useFetch(
    () => getAuctionById(id!), [id],
  );
  // Tras cada mutación, re-fetcheamos el auction completo y lo aplicamos con setData
  // (en vez de refetch()) para evitar el flicker del isLoading transitorio
  const refreshAuction = async () => {
    const updated = await getAuctionById(id!);
    if (updated) setAuction(() => updated);
  };

  const isOwner = auction !== null && currentUser?.id === auction.publisherId.id;

  const handleConfirmCancel = async () => {
    if (!auction) return;
    setCancelling(true);
    try {
      await cancelAuction(auction.id);
      setConfirmCancel(false);
      await refreshAuction();
      showSuccess('Subasta cancelada');
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
      await acceptOffer(auction.id, pendingBid.bidId);
      setPendingBid(null);
      await refreshAuction();
      showSuccess('Oferta aceptada — Subasta finalizada');
    } catch {
      setFinalizeError('Error al finalizar la subasta. Intentá de nuevo.');
      setPendingBid(null);
    } finally {
      setFinalizing(false);
    }
  };

  const handleConfirmCancelOwnBid = async () => {
    if (!auction || !pendingCancelOwnBid) return;
    const bidId = pendingCancelOwnBid;
    setPendingCancelOwnBid(null);
    setCancellingOwnBid(true);
    try {
      await cancelOffer(auction.id, bidId);
      await refreshAuction();
      showSuccess('Oferta cancelada');
    } catch {
      setFinalizeError('Error al cancelar la oferta. Intentá de nuevo.');
    } finally {
      setCancellingOwnBid(false);
    }
  };

  const handleRejectOffer = async (bidId: string) => {
    if (!auction) return;
    setRejectingBidId(bidId);
    setFinalizeError(null);
    try {
      await rejectOffer(auction.id, bidId);
      await refreshAuction();
      showSuccess('Oferta rechazada');
    } catch {
      setFinalizeError('Error al rechazar la oferta. Intentá de nuevo.');
    } finally {
      setRejectingBidId(null);
    }
  };

  if (loading) return <Page><p>Cargando...</p></Page>;
  if (!auction) return (
    <Page>
      <BackButton onClick={() => navigate('/auctions')}>
        <span className="material-symbols-outlined" aria-hidden="true">arrow_back</span>
        Volver
      </BackButton>
      <p>Subasta no encontrada.</p>
    </Page>
  );

  const { text: countdown, urgent } = formatCountdown(auction.endDate);
  const isActive = auction.status === 'ACTIVA';
  return (
    <Page>
      <BackButton onClick={() => navigate('/auctions')}>
        <span className="material-symbols-outlined" aria-hidden="true">arrow_back</span>
        Volver a subastas
      </BackButton>

      <PageTitle>Subasta #{auction.id}</PageTitle>

      <TopGrid>
        <Card>
          <FiguritaHeader>
            <FiguritaNumero>#{auction.figurita.number}</FiguritaNumero>
            <FiguritaInfo>
              <h2>{auction.figurita.description}</h2>
              <p>{auction.figurita.country} · {auction.figurita.team}</p>
              <BadgeRow>
                <CategoriaBadge $cat={auction.figurita.category}>{auction.figurita.category}</CategoriaBadge>
                <EstadoBadge $estado={auction.status}>{auction.status}</EstadoBadge>
              </BadgeRow>
            </FiguritaInfo>
          </FiguritaHeader>

          <InfoRow>
            <span className="label">Publicante</span>
            <span className="value">
              {auction.publisherId.name}
              {' '}{'★'.repeat(Math.round(auction.publisherId.rating || 0))}
              <RatingDecimal>
                {' '}({(auction.publisherId.rating ?? 0).toFixed(1)})
              </RatingDecimal>
            </span>
          </InfoRow>
          <InfoRow>
            <span className="label">Cierre</span>
            <InfoRowRight>
              <InfoCaption>
                {new Date(auction.endDate).toLocaleString('es-AR')}
              </InfoCaption>
              <Countdown $urgente={urgent}>{countdown}</Countdown>
            </InfoRowRight>
          </InfoRow>
          <InfoRow>
            <span className="label">Ofertas recibidas</span>
            <span className="value">{auction.bids.length}</span>
          </InfoRow>
        </Card>

        <Card>
          <SectionTitle>Condiciones de participación</SectionTitle>
          {auction.rules.length === 0 ? (
            <HintText>Sin restricciones — cualquiera puede ofertar.</HintText>
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
            <DangerBidButton onClick={() => setConfirmCancel(true)}>
              Cancelar subasta
            </DangerBidButton>
          )}
        </Card>
      </TopGrid>

      <Card>
        <SectionTitle>Ofertas ({auction.bids.length})</SectionTitle>
        {auction.bids.length === 0 ? (
          <EmptyBidsText>
            {isOwner ? 'Todavía no recibiste ofertas.' : 'Todavía no hay ofertas. ¡Sé el primero!'}
          </EmptyBidsText>
        ) : (
          <>
            <OfertasGrid>
              {auction.bids
                .slice()
                .sort((a, b) => (b.bidId === auction.lastBidId ? 1 : 0) - (a.bidId === auction.lastBidId ? 1 : 0))
                .map((o: Bid) => (
                  <OfertaCard key={o.bidId} $estado={o.status}>
                    <OfertaHeader>
                      <div>
                        <OfertaBidder>{o.bidder.name}</OfertaBidder>
                        <OfertaRating>
                          {'★'.repeat(Math.round(o.bidder.rating))}
                          <span className="num">({o.bidder.rating.toFixed(1)})</span>
                        </OfertaRating>
                      </div>
                      <OfertaEstadoBadge $estado={o.status}>{o.status}</OfertaEstadoBadge>
                    </OfertaHeader>
                    <OfertaFiguritas>
                      <strong>{o.offeredFiguritas.length} figurita(s):</strong>{' '}
                      {o.offeredFiguritas.map(f => `#${f.number} ${f.description}`).join(', ')}
                    </OfertaFiguritas>
                    <OfertaDate>{new Date(o.bidDate).toLocaleString('es-AR')}</OfertaDate>
                    {isOwner && isActive && o.status === 'ACTIVA' && (
                      <OfferActions>
                        <ChooseWinnerButton
                          onClick={() => setPendingBid(o)}
                          disabled={finalizing || rejectingBidId !== null}
                        >
                          Elegir ganadora
                        </ChooseWinnerButton>
                        <RejectOfferButton
                          onClick={() => handleRejectOffer(o.bidId)}
                          disabled={finalizing || rejectingBidId !== null}
                        >
                          {rejectingBidId === o.bidId ? 'Rechazando...' : 'Rechazar'}
                        </RejectOfferButton>
                      </OfferActions>
                    )}
                    {!isOwner && o.bidder.userId === currentUser.id && isActive && o.status === 'ACTIVA' && (
                      <OfferActions>
                        <RejectOfferButton
                          onClick={() => setPendingCancelOwnBid(o.bidId)}
                          disabled={cancellingOwnBid}
                        >
                          {cancellingOwnBid ? 'Cancelando...' : 'Cancelar oferta'}
                        </RejectOfferButton>
                      </OfferActions>
                    )}
                  </OfertaCard>
                ))}
            </OfertasGrid>
            {finalizeError && (
              <FinalizeErrorText>{finalizeError}</FinalizeErrorText>
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

      {showBidModal && currentUser && (
        <PlaceBidModal
          userId={currentUser.id}
          card={auction.figurita}
          auctionId={auction.id}
          onClose={() => setShowBidModal(false)}
          onSuccess={() => setShowBidModal(false)}
        />
      )}

      <ConfirmDialog
        open={pendingCancelOwnBid !== null}
        title="¿Cancelar tu oferta?"
        message="Las figuritas ofrecidas vuelven a estar disponibles en tu colección."
        confirmLabel="Sí, cancelar"
        cancelLabel="Volver"
        destructive
        onConfirm={handleConfirmCancelOwnBid}
        onCancel={() => setPendingCancelOwnBid(null)}
      />
    </Page>
  );
}
