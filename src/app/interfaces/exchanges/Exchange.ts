import { Figurita } from '../figuritas/Figurita';
import { User } from '../auth/User';

export type ExchangeType = 'PROPUESTA' | 'SUBASTA';

export interface Exchange {
  id: number;
  type: ExchangeType;
  figurita: Figurita;
  otherUser: User;
  publicacionId: number;
  date: Date;
  rated: boolean;
}
