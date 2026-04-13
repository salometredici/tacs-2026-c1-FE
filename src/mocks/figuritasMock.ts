import { SearchFiguritasResponse } from '../app/interfaces/SearchFiguritasResponse';
import { Figurita } from '../app/interfaces/Figurita';

// Datos mockeados para desarrollo
const mockFiguritas: Figurita[] = [
  {
    id: 1,
    numero: 1,
    jugador: 'Messi',
    seleccion: 'Argentina',
    equipo: 'PSG',
    categoria: 'LEGENDARIO',
  },
  {
    id: 2,
    numero: 7,
    jugador: 'Cristiano Ronaldo',
    seleccion: 'Portugal',
    equipo: 'Manchester United',
    categoria: 'LEGENDARIO',
  },
  {
    id: 3,
    numero: 10,
    jugador: 'Neymar',
    seleccion: 'Brasil',
    equipo: 'PSG',
    categoria: 'EPICO',
  },
  {
    id: 4,
    numero: 9,
    jugador: 'Mbappé',
    seleccion: 'Francia',
    equipo: 'PSG',
    categoria: 'EPICO',
  },
  {
    id: 5,
    numero: 5,
    jugador: 'Piqué',
    seleccion: 'España',
    equipo: 'Barcelona',
    categoria: 'COMUN',
  },
  {
    id: 6,
    numero: 23,
    jugador: 'Haaland',
    seleccion: 'Noruega',
    equipo: 'Manchester City',
    categoria: 'EPICO',
  },
  {
    id: 7,
    numero: 11,
    jugador: 'Salah',
    seleccion: 'Egipto',
    equipo: 'Liverpool',
    categoria: 'COMUN',
  },
  {
    id: 8,
    numero: 6,
    jugador: 'Benzema',
    seleccion: 'Francia',
    equipo: 'Real Madrid',
    categoria: 'COMUN',
  },
];

export const mockSearchFiguritas = (
  numero?: number,
  jugador?: string,
  seleccion?: string,
  equipo?: string,
  categoria?: string
): SearchFiguritasResponse => {
  let resultados = [...mockFiguritas];

  if (numero && numero > 0) {
    resultados = resultados.filter((f) => f.numero === numero);
  }

  if (jugador) {
    resultados = resultados.filter((f) =>
      f.jugador.toLowerCase().includes(jugador.toLowerCase())
    );
  }

  if (seleccion) {
    resultados = resultados.filter((f) =>
      f.seleccion.toLowerCase().includes(seleccion.toLowerCase())
    );
  }

  if (equipo) {
    resultados = resultados.filter((f) =>
      f.equipo.toLowerCase().includes(equipo.toLowerCase())
    );
  }

  if (categoria) {
    resultados = resultados.filter((f) =>
      f.categoria.toString().toLowerCase().includes(categoria.toLowerCase())
    );
  }

  return {
    figuritas: resultados,
    count: resultados.length,
  } as SearchFiguritasResponse;
};
