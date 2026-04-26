import { BidStatus } from './BidStatus';
import { Figurita } from '../../figuritas/Figurita';

export interface Bid {
  bidId: string;
  bidder: {
    userId: string;
    name: string;
    rating: number;
    avatarId: string;
  };
  offeredFiguritas: Figurita[];
  status: BidStatus;
  bidDate: string;
}
