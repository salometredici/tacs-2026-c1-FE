import { useNavigate } from 'react-router-dom';
import { Auction } from '../../interfaces/auctions/Auction';
import { getRemainingTime } from '../../utils/auctionUtils';
import {
  AuctionCard,
  CardInfo,
  CardNumber,
  CardDetails,
  CardImage,
  CategoryChip,
  SellerInfo,
  AuctionStatus,
  TimeRemaining,
  BestBidInfo,
  RequirmentsInfo,
  BidButton,
  MutedText,
  MutedItalic,
  CaptionText,
} from './Auctions.styles';

interface AuctionCardProps {
  auction: Auction;
  onBid: () => void;
  hideBidButton?: boolean;
}


export default function AuctionCardComponent({ auction, onBid, hideBidButton = false }: AuctionCardProps) {
  const navigate = useNavigate();

  const remaining = getRemainingTime(auction.endDate);
  const minReputation = auction.rules.find(c => c.type === 'REPUTACION_MINIMA')?.value;

  return (
    <AuctionCard onClick={() => navigate(`/auctions/${auction.id}`)}>
      <CardInfo>
        <CardNumber>{auction.card.id}</CardNumber>
        <CardDetails>
          <p>
            <strong>{auction.card.description}</strong>
          </p>
          <p>{[auction.card.country, auction.card.team].filter(Boolean).join(' - ')}</p>
          <CategoryChip $category={auction.card.category}>
            {auction.card.category}
          </CategoryChip>
        </CardDetails>
        <CardImage
          $imageUrl={auction.card.imageUrl}
          $category={auction.card.category}
        >
          {!auction.card.imageUrl && (
            <span className="material-symbols-outlined" aria-hidden="true">
              sports_soccer
            </span>
          )}
        </CardImage>
      </CardInfo>

      <SellerInfo>
        <span>Publicante:</span>
        <span className="seller-name">{auction.publisherId.name}</span>
        <span className="reputation">
          {auction.publisherId.rating ? (
            <>
              {'★'.repeat(Math.round(auction.publisherId.rating))}
              {' '}
              <MutedText>
                ({auction.publisherId.rating.toFixed(1)})
              </MutedText>
            </>
          ) : (
            <MutedItalic>
              Sin calificaciones aún
            </MutedItalic>
          )}
        </span>
      </SellerInfo>

      <AuctionStatus>
        <span>Tiempo restante:</span>
        <TimeRemaining color={remaining.color}>
          {remaining.text}
        </TimeRemaining>
      </AuctionStatus>

      {auction.lastBidId && (() => {
        const lastBid = auction.bids.find(o => o.bidId === auction.lastBidId);
        return lastBid ? (
          <BestBidInfo>
            <div className="bid-label">Última oferta:</div>
            <div className="bid-details">
              {lastBid.offeredCards.length} figurita(s) ofrecidas
            </div>
            <CaptionText>
              Por {lastBid.bidder.name}
            </CaptionText>
          </BestBidInfo>
        ) : null;
      })()}

      <RequirmentsInfo>
        {minReputation && (
          <div className="requirement">
            <span className="label">Reputación mínima:</span>
            <span className="value">{minReputation} ⭐</span>
          </div>
        )}
        {auction.rules.find(r => r.type === 'INTERCAMBIOS_MINIMOS') && (
          <div className="requirement">
            <span className="label">Intercambios mínimos:</span>
            <span className="value">{auction.rules.find(r => r.type === 'INTERCAMBIOS_MINIMOS')!.value}</span>
          </div>
        )}
        {auction.rules.find(r => r.type === 'CANTIDAD_MINIMA_FIGURITAS') && (
          <div className="requirement">
            <span className="label">Figuritas mínimas en oferta:</span>
            <span className="value">{auction.rules.find(r => r.type === 'CANTIDAD_MINIMA_FIGURITAS')!.value}</span>
          </div>
        )}
        {auction.rules.find(r => r.type === 'CATEGORIA_MINIMA') && (
          <div className="requirement">
            <span className="label">Categoría mínima:</span>
            <span className="value">{auction.rules.find(r => r.type === 'CATEGORIA_MINIMA')!.value}</span>
          </div>
        )}
        {auction.rules.length === 0 && (
          <div className="requirement">
            <span className="label">Sin restricciones</span>
          </div>
        )}
      </RequirmentsInfo>
      {!hideBidButton && (
        <BidButton onClick={e => { e.stopPropagation(); onBid(); }}>
          Ofertar
        </BidButton>
      )}
    </AuctionCard>
  );
}
