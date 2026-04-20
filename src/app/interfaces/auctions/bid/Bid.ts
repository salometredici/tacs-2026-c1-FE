import { BidStatus } from './BidStatus';
import { Figurita } from '../../figuritas/Figurita';

export interface Bid {
  bidId: string;
  postor: {
    userId: string;
    name: string;
    rating: number;
    avatarId: string;
  };
  offeredFiguritas: Figurita[];
  status: BidStatus;
  bidDate: string;
}
