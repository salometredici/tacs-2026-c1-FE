export interface AdminStats {
  totalUsuarios: number;
  figuritasPublicadas: number;
  propuestasRealizadas: number;
  subastasActivas: number;
  intercambiosConcretados: number;
}

export const adminStatsMock: AdminStats = {
  totalUsuarios: 142,
  figuritasPublicadas: 873,
  propuestasRealizadas: 310,
  subastasActivas: 18,
  intercambiosConcretados: 204,
};
