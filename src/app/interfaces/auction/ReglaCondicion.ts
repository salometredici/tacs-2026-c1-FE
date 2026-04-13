export type TipoRegla = 'REPUTATION_MINIMA' | 'INTERCAMBIOS_MINIMOS' | 'DURACION_MINIMA';

export interface ReglaCondicion {
  tipo: TipoRegla;
  valor: number;
}
