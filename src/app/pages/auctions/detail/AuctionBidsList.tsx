import { Bid } from '../../../interfaces/auctions/bid/Bid';
import StatusBadge from '../../../components/common/StatusBadge';
import { BID_STATUS_TONE as BID_TONE } from '../../../interfaces/auctions/bid/BidStatus';
import {
  Card, SectionTitle, EmptyBidsText, OffersGrid, OfferCard, OfferHeader,
  OfferBidder, OfferRating, OfferedCards, OfferDate, OfferActions,
  ChooseWinnerButton, RejectOfferButton, FinalizeErrorText,
} from '../AuctionDetailPage.styles';


interface Props {
  bids: Bid[];
  lastBidId?: string;
  currentUserId: string;
  isOwner: boolean;
  isActive: boolean;
  finalizing: boolean;
  rejectingBidId: string | null;
  cancellingOwnBid: boolean;
  finalizeError: string | null;
  onSelectBid: (bid: Bid) => void;
  onRejectBid: (bidId: string) => void;
  onCancelOwnBid: (bidId: string) => void;
}

export default function AuctionBidsList({
  bids, lastBidId, currentUserId, isOwner, isActive,
  finalizing, rejectingBidId, cancellingOwnBid, finalizeError,
  onSelectBid, onRejectBid, onCancelOwnBid,
}: Props) {
  return (
    <Card>
      <SectionTitle>Ofertas ({bids.length})</SectionTitle>
      {bids.length === 0 ? (
        <EmptyBidsText>
          {isOwner ? 'Todavía no recibiste ofertas.' : 'Todavía no hay ofertas. ¡Sé el primero!'}
        </EmptyBidsText>
      ) : (
        <>
          <OffersGrid>
            {bids
              .slice()
              .sort((a, b) => (b.bidId === lastBidId ? 1 : 0) - (a.bidId === lastBidId ? 1 : 0))
              .map((o: Bid) => (
                <OfferCard key={o.bidId} $status={o.status}>
                  <OfferHeader>
                    <div>
                      <OfferBidder>{o.bidder.name}</OfferBidder>
                      <OfferRating>
                        {'★'.repeat(Math.round(o.bidder.rating))}
                        <span className="num">({o.bidder.rating.toFixed(1)})</span>
                      </OfferRating>
                    </div>
                    <StatusBadge tone={BID_TONE[o.status] ?? 'neutral'}>{o.status}</StatusBadge>
                  </OfferHeader>
                  <OfferedCards>
                    <strong>{o.offeredCards.length} figurita(s):</strong>{' '}
                    {o.offeredCards.map(f => `${f.id} - ${f.description}`).join(', ')}
                  </OfferedCards>
                  <OfferDate>{new Date(o.bidDate).toLocaleString('es-AR')}</OfferDate>
                  {isOwner && isActive && o.status === 'ACTIVA' && (
                    <OfferActions>
                      <ChooseWinnerButton
                        onClick={() => onSelectBid(o)}
                        disabled={finalizing || rejectingBidId !== null}
                      >
                        Elegir ganadora
                      </ChooseWinnerButton>
                      <RejectOfferButton
                        onClick={() => onRejectBid(o.bidId)}
                        disabled={finalizing || rejectingBidId !== null}
                      >
                        {rejectingBidId === o.bidId ? 'Rechazando...' : 'Rechazar'}
                      </RejectOfferButton>
                    </OfferActions>
                  )}
                  {!isOwner && o.bidder.userId === currentUserId && isActive && o.status === 'ACTIVA' && (
                    <OfferActions>
                      <RejectOfferButton
                        onClick={() => onCancelOwnBid(o.bidId)}
                        disabled={cancellingOwnBid}
                      >
                        {cancellingOwnBid ? 'Cancelando...' : 'Cancelar oferta'}
                      </RejectOfferButton>
                    </OfferActions>
                  )}
                </OfferCard>
              ))}
          </OffersGrid>
          {finalizeError && (
            <FinalizeErrorText>{finalizeError}</FinalizeErrorText>
          )}
        </>
      )}
    </Card>
  );
}
