import { Categoria } from '../Categoria';

export interface AddMissingCardRequest {
  number: number;
  jugador: string;
  seleccion: string;
  equipo: string;
  descripcion?: string;
  categoria: Categoria;
}
