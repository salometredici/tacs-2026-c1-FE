import { Figurita } from '../Figurita';
import { User } from '../User';
import { Bid } from './bid/Bid';
import { AuctionRule } from './auctionRule/AuctionRule';
import { AuctionStatus } from './AuctionStatus';

export interface Auction {
  id: number;
  figurita: Figurita;
  publisherId: User;
  status: AuctionStatus;
  creationDate: string;
  endDate: string;
  rules: AuctionRule[];
  bids: Bid[];
  lastBidId?: string;
}
