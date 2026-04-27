import { AuctionRule } from './auctionRule/AuctionRule';

export interface CreateAuctionRequest {
  cardId: number;
  publisherId: string;
  duration: number; // En horas
  rules: AuctionRule[];
}
