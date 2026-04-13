import { Figurita } from '../Figurita';
import { User } from '../User';
import { PublicacionIntercambio } from './PublicacionIntercambio';

export type EstadoPropuesta = 'PENDIENTE' | 'ACEPTADA' | 'RECHAZADA';

export interface Propuesta {
  id: number;
  publicacion: PublicacionIntercambio;
  figuritasOfrecidas: Figurita[];
  postor: User;
  estado: EstadoPropuesta;
}
