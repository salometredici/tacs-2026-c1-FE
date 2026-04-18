import { AuctionRule } from './auctionRule/AuctionRule';

export interface CreateAuctionRequest {
  figuritaId: number;
  publisherId: number;
  duration: number; // En horas
  rules: AuctionRule[];
}
