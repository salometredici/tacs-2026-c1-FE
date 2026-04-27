import { Card } from '../cards/Card';
import { User } from '../auth/User';
import { PublicationStatus, ParticipationType } from './publicationTypes';

export interface Publication {
  id: string;
  card: Card;
  publisher: User;
  status: PublicationStatus;
  participationType: ParticipationType;
  count: number;
}
