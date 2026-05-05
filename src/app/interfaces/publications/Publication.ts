import { Card } from '../cards/Card';
import { User } from '../auth/User';
import { PublicationStatus } from './publicationTypes';

export interface Publication {
  id: string;
  card: Card;
  publisher: User;
  status: PublicationStatus;
  initialCount: number;
  remainingCount: number;
}
