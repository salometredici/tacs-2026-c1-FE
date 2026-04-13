import { Exchange } from '../app/interfaces/exchanges/Exchange';
import { mockFiguritas } from './figuritasMock';
import { mockUsers } from './usersMock';

// Usuario logueado = mockUsers[0] (id: 1)
export const mockExchanges: Exchange[] = [
  {
    id: 401,
    type: 'PROPUESTA',
    figurita: mockFiguritas[3], // Mbappé
    otherUser: mockUsers[1],   // Mónica Argento
    publicacionId: 13,
    date: new Date(2026, 2, 20),
    rated: false,
  },
  {
    id: 402,
    type: 'SUBASTA',
    figurita: mockFiguritas[5], // Haaland
    otherUser: mockUsers[2],   // Homero Simpson
    publicacionId: 22,
    date: new Date(2026, 2, 25),
    rated: true,
  },
  {
    id: 403,
    type: 'PROPUESTA',
    figurita: mockFiguritas[0], // Messi
    otherUser: mockUsers[1],
    publicacionId: 21,
    date: new Date(2026, 3, 5),
    rated: false,
  },
];

export const getMockedExchanges = (userId: number): Exchange[] => mockExchanges;
