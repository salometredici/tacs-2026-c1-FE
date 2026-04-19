import { Categoria } from '../Categoria';
import { TIPO_PARTICIPACION } from '../publicaciones/publicacionTypes';

export interface PublishFiguritaRequest {
  number: number;
  jugador: string;
  seleccion: string;
  equipo: string;
  descripcion?: string;
  categoria: Categoria;
  cantidad: number;
  tipoParticipacion: TIPO_PARTICIPACION;
}
