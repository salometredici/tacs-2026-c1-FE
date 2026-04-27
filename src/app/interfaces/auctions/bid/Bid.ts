import { BidStatus } from './BidStatus';
import { Card } from '../../cards/Card';

export interface Bid {
  bidId: string;
  bidder: {
    userId: string;
    name: string;
    rating: number;
    avatarId: string;
  };
  offeredFiguritas: Card[];
  status: BidStatus;
  bidDate: string;
}
