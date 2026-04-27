import { Exchange } from '../app/interfaces/exchanges/Exchange';
import { mockFiguritas } from './figuritasMock';
import { mockUsers } from './usersMock';

// Usuario logueado = mockUsers[0] (id: 1)
export const mockExchanges: Exchange[] = [
  {
    id: 401,
    type: 'PROPUESTA',
    card: mockFiguritas[3], // Mbappé
    otherUser: mockUsers[1],   // Mónica Argento
    publicationId: 13,
    date: new Date(2026, 2, 20),
    rated: false,
  },
  {
    id: 402,
    type: 'SUBASTA',
    card: mockFiguritas[5], // Haaland
    otherUser: mockUsers[2],   // Homero Simpson
    publicationId: 22,
    date: new Date(2026, 2, 25),
    rated: true,
  },
  {
    id: 403,
    type: 'PROPUESTA',
    card: mockFiguritas[0], // Messi
    otherUser: mockUsers[1],
    publicationId: 21,
    date: new Date(2026, 3, 5),
    rated: false,
  },
];

export const getMockedExchanges = (_userId: string): Exchange[] => mockExchanges;
