import { Figurita } from '../../Figurita';
import { User } from '../../User';
import { AuctionStatus } from '../AuctionStatus';
import { BidStatus } from './BidStatus';

// Para la vista de "Mis Ofertas", a fin de mostrar en el perfil o desde el tab sin cargar la subasta completa
export interface UserBid {
  auctionId: string;
  figurita: Figurita;
  publisher: User;
  auctionStatus: AuctionStatus;
  closingDate: string;
  bidId: string;
  offeredFiguritas: Figurita[];
  bidStatus: BidStatus;
  bidDate: string;
}
