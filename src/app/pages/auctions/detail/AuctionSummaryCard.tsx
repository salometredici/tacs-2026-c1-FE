import { Auction } from '../../../interfaces/auctions/Auction';
import { formatCountdown } from '../../../utils/utils';
import StatusBadge from '../../../components/common/StatusBadge';
import { AUCTION_STATUS_TONE as AUCTION_TONE } from '../../../interfaces/auctions/AuctionStatus';
import {
  Card, CardHeader, CardNumber, CardInfo, CategoryBadge, BadgeRow,
  InfoRow, RatingDecimal, InfoRowRight, InfoCaption, Countdown,
} from '../AuctionDetailPage.styles';


interface Props {
  auction: Auction;
}

export default function AuctionSummaryCard({ auction }: Props) {
  const { text: countdown, urgent } = formatCountdown(auction.endDate);
  return (
    <Card>
      <CardHeader>
        <CardNumber>{auction.card.id}</CardNumber>
        <CardInfo>
          <h2>{auction.card.description}</h2>
          <p>{[auction.card.country, auction.card.team].filter(Boolean).join(' · ')}</p>
          <BadgeRow>
            <CategoryBadge $category={auction.card.category}>{auction.card.category}</CategoryBadge>
            <StatusBadge tone={AUCTION_TONE[auction.status] ?? 'neutral'} size="md">{auction.status}</StatusBadge>
          </BadgeRow>
        </CardInfo>
      </CardHeader>

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
  );
}
