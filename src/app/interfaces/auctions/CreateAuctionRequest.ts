import { AuctionRule } from './auctionRule/AuctionRule';

export interface CreateAuctionRequest {
  cardId: string;          // MongoDB ObjectId (no el number de la card)
  duration: number;        // En horas
  rules: AuctionRule[];
}
