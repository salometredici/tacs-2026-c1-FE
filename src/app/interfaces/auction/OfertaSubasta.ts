import { Figurita } from '../Figurita';
import { User } from '../User';

export interface OfertaSubasta {
  id: number;
  postor: User;
  figuritasOfrecidas: Figurita[];
  fecha?: Date;
}
