import { Figurita } from '../figuritas/Figurita';
import { User } from '../auth/User';
import { ProposalStatus } from './ProposalStatus';
import { Publication } from '../publications/Publication';

export interface Proposal {
  id: string;
  publication: Publication;
  offeredFiguritas: Figurita[];
  bidder: User;
  status: ProposalStatus;
}
