import { Figurita } from '../Figurita';
import { User } from '../auth/User';
import { PublicacionStatus, TIPO_PARTICIPACION } from './publicacionTypes';

export interface Publicacion {
  id: string;
  figurita: Figurita;
  publisher: User;
  status: PublicacionStatus;
  participationType: TIPO_PARTICIPACION;
  count: number;
}
