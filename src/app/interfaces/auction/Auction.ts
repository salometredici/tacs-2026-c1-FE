import { Figurita } from '../Figurita';
import { User } from '../User';
import { OfertaSubasta } from './OfertaSubasta';
import { ReglaCondicion } from './ReglaCondicion';

export interface Auction {
  id: number;
  figurita: Figurita;
  publicante: User;
  fechaCreacion: Date;
  fechaCierre: Date;
  condicionesMinimas: ReglaCondicion[];
  mejorApuesta?: OfertaSubasta;
}
