import { Figurita } from '../figuritas/Figurita';
import { User } from '../auth/User';
import { PublicationStatus, ParticipationType } from './publicationTypes';

export interface Publication {
  id: string;
  figurita: Figurita;
  publisher: User;
  status: PublicationStatus;
  participationType: ParticipationType;
  count: number;
}
