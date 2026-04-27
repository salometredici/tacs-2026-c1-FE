import { SearchFiguritasResponse } from '../app/interfaces/search/SearchFiguritasResponse';
import { Card } from '../app/interfaces/cards/Card';

export const mockFiguritas: Card[] = [
  { id: '1', number: 1,  type: 'JUGADOR', description: 'Messi',             country: 'Argentina', team: 'PSG',             category: 'LEGENDARIO' },
  { id: '2', number: 7,  type: 'JUGADOR', description: 'Cristiano Ronaldo', country: 'Portugal',  team: 'Manchester United',category: 'LEGENDARIO' },
  { id: '3', number: 10, type: 'JUGADOR', description: 'Neymar',            country: 'Brasil',    team: 'PSG',             category: 'EPICO' },
  { id: '4', number: 9,  type: 'JUGADOR', description: 'Mbappé',            country: 'Francia',   team: 'PSG',             category: 'EPICO' },
  { id: '5', number: 5,  type: 'JUGADOR', description: 'Piqué',             country: 'España',    team: 'Barcelona',       category: 'COMUN' },
  { id: '6', number: 23, type: 'JUGADOR', description: 'Haaland',           country: 'Noruega',   team: 'Manchester City', category: 'EPICO' },
  { id: '7', number: 11, type: 'JUGADOR', description: 'Salah',             country: 'Egipto',    team: 'Liverpool',       category: 'COMUN' },
  { id: '8', number: 6,  type: 'JUGADOR', description: 'Benzema',           country: 'Francia',   team: 'Real Madrid',     category: 'COMUN' },
];

export const mockSearchFiguritas = (): SearchFiguritasResponse => {
  return {
    content: mockFiguritas,
    page: 0,
    size: mockFiguritas.length,
    totalElements: mockFiguritas.length,
    totalPages: 1,
  };
};

export const mockAddMissingCardResponse = () => ({
  success: true,
  message: 'Figurita faltante registrada',
});
