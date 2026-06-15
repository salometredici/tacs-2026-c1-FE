import { useState } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { Bid } from '../../interfaces/auctions/bid/Bid';
import { getAuctionById, acceptOffer, rejectOffer, cancelAuction, cancelOffer } from '../../api/AuctionsService';
import PlaceBidModal from '../../components/auctions/PlaceBidModal';
import ConfirmDialog from '../../components/feedback/ConfirmDialog';
import { AuthedOutletContext } from '../../components/layout/UserRoute';
import { useSnackbar } from '../../context/useSnackbar';
import { useUserContext } from '../../context/useUserContext';
import { useFetch } from '../../hooks/useFetch';
import BackButton from '../../components/common/BackButton';
import AuctionSummaryCard from './detail/AuctionSummaryCard';
import AuctionRulesPanel from './detail/AuctionRulesPanel';
import AuctionBidsList from './detail/AuctionBidsList';
import CancelAuctionConfirmDialog from './detail/CancelAuctionConfirmDialog';
import AcceptOfferConfirmDialog from './detail/AcceptOfferConfirmDialog';
import { Page, PageTitle, TopGrid } from './AuctionDetailPage.styles';

export default function AuctionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useOutletContext<AuthedOutletContext>();
  const { refreshCurrentUser } = useUserContext();
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
      refreshCurrentUser();
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
      <BackButton onClick={() => navigate('/auctions')} label="Volver" />
      <p>Subasta no encontrada.</p>
    </Page>
  );

  const isActive = auction.status === 'ACTIVA';
  return (
    <Page>
      <BackButton onClick={() => navigate('/auctions')} label="Volver a subastas" />

      <PageTitle>Subasta #{auction.id}</PageTitle>

      <TopGrid>
        <AuctionSummaryCard auction={auction} />
        <AuctionRulesPanel
          rules={auction.rules}
          isOwner={isOwner}
          isActive={isActive}
          onPlaceBid={() => setShowBidModal(true)}
          onCancelAuction={() => setConfirmCancel(true)}
        />
      </TopGrid>

      <AuctionBidsList
        bids={auction.bids}
        lastBidId={auction.lastBidId}
        currentUserId={currentUser.id}
        isOwner={isOwner}
        isActive={isActive}
        finalizing={finalizing}
        rejectingBidId={rejectingBidId}
        cancellingOwnBid={cancellingOwnBid}
        finalizeError={finalizeError}
        onSelectBid={setPendingBid}
        onRejectBid={handleRejectOffer}
        onCancelOwnBid={setPendingCancelOwnBid}
      />

      <CancelAuctionConfirmDialog
        open={confirmCancel}
        auction={auction}
        loading={cancelling}
        onCancel={() => setConfirmCancel(false)}
        onConfirm={handleConfirmCancel}
      />

      <AcceptOfferConfirmDialog
        open={pendingBid !== null}
        auction={auction}
        bid={pendingBid}
        loading={finalizing}
        onCancel={() => setPendingBid(null)}
        onConfirm={handleConfirmFinalize}
      />

      {showBidModal && currentUser && (
        <PlaceBidModal
          userId={currentUser.id}
          card={auction.card}
          auctionId={auction.id}
          onClose={() => setShowBidModal(false)}
          onSuccess={() => { setShowBidModal(false); refreshAuction(); }}
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
