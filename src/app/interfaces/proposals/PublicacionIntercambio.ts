import { Figurita } from '../Figurita';
import { User } from '../User';

export type EstadoPublicacion = 'ACTIVA' | 'FINALIZADA';
export type TipoParticipacion = 'INTERCAMBIO' | 'SUBASTA';

export interface PublicacionIntercambio {
  id: number;
  figurita: Figurita;
  publicante: User;
  estado: EstadoPublicacion;
  tipoParticipacion: TipoParticipacion;
  cantidad: number;
}
