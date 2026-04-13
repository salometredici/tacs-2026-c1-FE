import { Categoria } from '../Categoria';
import { TipoParticipacion } from '../proposals/PublicacionIntercambio';

export interface PublishFiguritaRequest {
  numero: number;
  jugador: string;
  seleccion: string;
  equipo: string;
  descripcion?: string;
  categoria: Categoria;
  cantidad: number;
  tipoParticipacion: TipoParticipacion;
}
