import { Card } from '../cards/Card';
import { User } from '../auth/User';
import { ProposalStatus } from './ProposalStatus';
import { Publication } from '../publications/Publication';

export interface Proposal {
  id: string;
  publication: Publication;
  offeredCards: Card[];
  requestedCount: number;
  bidder: User;
  status: ProposalStatus;
}
