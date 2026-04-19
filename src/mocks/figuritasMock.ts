import { SearchFiguritasResponse } from '../app/interfaces/search/SearchFiguritasResponse';
import { Figurita } from '../app/interfaces/Figurita';

export const mockFiguritas: Figurita[] = [
  { id: '1', number: 1,  description: 'Messi',             country: 'Argentina', team: 'PSG',             category: 'LEGENDARIO' },
  { id: '2', number: 7,  description: 'Cristiano Ronaldo', country: 'Portugal',  team: 'Manchester United',category: 'LEGENDARIO' },
  { id: '3', number: 10, description: 'Neymar',            country: 'Brasil',    team: 'PSG',             category: 'EPICO' },
  { id: '4', number: 9,  description: 'Mbappé',            country: 'Francia',   team: 'PSG',             category: 'EPICO' },
  { id: '5', number: 5,  description: 'Piqué',             country: 'España',    team: 'Barcelona',       category: 'COMUN' },
  { id: '6', number: 23, description: 'Haaland',           country: 'Noruega',   team: 'Manchester City', category: 'EPICO' },
  { id: '7', number: 11, description: 'Salah',             country: 'Egipto',    team: 'Liverpool',       category: 'COMUN' },
  { id: '8', number: 6,  description: 'Benzema',           country: 'Francia',   team: 'Real Madrid',     category: 'COMUN' },
];

export const mockSearchFiguritas = (): SearchFiguritasResponse => {
  return {
    figuritas: mockFiguritas,
    count: mockFiguritas.length,
  };
};

export const mockAddMissingCardResponse = () => ({
  success: true,
  message: 'Figurita faltante registrada',
});
