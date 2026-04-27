import { Card } from '../cards/Card';
import { User } from '../auth/User';
import { PublicacionStatus, TIPO_PARTICIPACION } from './publicacionTypes';

export interface Publicacion {
  id: string;
  card: Card;
  publisher: User;
  status: PublicacionStatus;
  participationType: TIPO_PARTICIPACION;
  count: number;
}
