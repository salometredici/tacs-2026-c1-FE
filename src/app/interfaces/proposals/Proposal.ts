import { Figurita } from '../figuritas/Figurita';
import { User } from '../auth/User';
import { ProposalStatus } from './ProposalStatus';
import { Publicacion } from '../publicaciones/Publicacion';

export interface Proposal {
  id: string;
  publicacion: Publicacion; // Publicación sobre la que se hizo la propuesta
  offeredFiguritas: Figurita[];
  postor: User;
  status: ProposalStatus;
}
