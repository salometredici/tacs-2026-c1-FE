import { Categoria } from '../Categoria';

export interface AddMissingCardRequest {
  numero: number;
  jugador: string;
  seleccion: string;
  equipo: string;
  descripcion?: string;
  categoria: Categoria;
}
