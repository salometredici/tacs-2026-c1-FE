import { AuctionRule } from './auctionRule/AuctionRule';

export interface CreateAuctionRequest {
  figuritaId: number;
  publisherId: string;
  duration: number; // En horas
  rules: AuctionRule[];
}
