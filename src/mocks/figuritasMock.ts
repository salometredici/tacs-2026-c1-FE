import { SearchFiguritasResponse } from '../app/interfaces/search/SearchFiguritasResponse';
import { Figurita } from '../app/interfaces/Figurita';

export const mockFiguritas: Figurita[] = [
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

export const mockSearchFiguritas = (): SearchFiguritasResponse => {
  return {
    figuritas: mockFiguritas,
    count: mockFiguritas.length,
  };
};
