import { Card } from '../cards/Card';
import { User } from '../auth/User';

export type ExchangeType = 'PROPUESTA' | 'SUBASTA';

export interface Exchange {
  id: number;
  type: ExchangeType;
  card: Card;
  otherUser: User;
  publicationId: number;
  date: Date;
  rated: boolean;
}
