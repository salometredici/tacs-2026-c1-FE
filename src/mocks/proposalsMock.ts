import { Proposal } from '../app/interfaces/proposals/Proposal';
import { Publication } from '../app/interfaces/publications/Publication';
import { mockFiguritas } from './figuritasMock';
import { mockUsers } from './usersMock';

// Logged-in user = mockUsers[0] (id: 69e54c037de7f7e868da90f4, Pepe Argento)

export const mockMyPublications: Publication[] = [
  {
    id: '11',
    card: mockFiguritas[2],
    publisher: mockUsers[0],
    status: 'ACTIVA',
    participationType: 'INTERCAMBIO',
    count: 2,
  },
  {
    id: '12',
    card: mockFiguritas[4],
    publisher: mockUsers[0],
    status: 'ACTIVA',
    participationType: 'SUBASTA',
    count: 1,
  },
  {
    id: '14',
    card: mockFiguritas[7],
    publisher: mockUsers[0],
    status: 'ACTIVA',
    participationType: 'INTERCAMBIO',
    count: 3,
  },
];

export const getMockedMyPublications = (userId: string): Publication[] =>
  mockMyPublications.filter(p => p.publisher.id === userId);

export const mockReceivedProposals: Proposal[] = [
  {
    id: '201',
    publication: { id: '11', card: mockFiguritas[2], publisher: mockUsers[0], status: 'ACTIVA', participationType: 'INTERCAMBIO', count: 2 },
    offeredCards: [mockFiguritas[5]],
    bidder: mockUsers[1],
    status: 'PENDIENTE',
  },
  {
    id: '202',
    publication: { id: '12', card: mockFiguritas[4], publisher: mockUsers[0], status: 'ACTIVA', participationType: 'SUBASTA', count: 1 },
    offeredCards: [mockFiguritas[6], mockFiguritas[7]],
    bidder: mockUsers[2],
    status: 'PENDIENTE',
  },
  {
    id: '203',
    publication: { id: '13', card: mockFiguritas[0], publisher: mockUsers[0], status: 'FINALIZADA', participationType: 'INTERCAMBIO', count: 1 },
    offeredCards: [mockFiguritas[3]],
    bidder: mockUsers[1],
    status: 'ACEPTADA',
  },
  {
    id: '204',
    publication: { id: '14', card: mockFiguritas[2], publisher: mockUsers[0], status: 'ACTIVA', participationType: 'INTERCAMBIO', count: 2 },
    offeredCards: [mockFiguritas[1]],
    bidder: mockUsers[2],
    status: 'RECHAZADA',
  },
];

export const mockSentProposals: Proposal[] = [
  {
    id: '301',
    publication: { id: '21', card: mockFiguritas[1], publisher: mockUsers[1], status: 'ACTIVA', participationType: 'INTERCAMBIO', count: 1 },
    offeredCards: [mockFiguritas[2]],
    bidder: mockUsers[0],
    status: 'PENDIENTE',
  },
  {
    id: '302',
    publication: { id: '22', card: mockFiguritas[5], publisher: mockUsers[2], status: 'FINALIZADA', participationType: 'INTERCAMBIO', count: 1 },
    offeredCards: [mockFiguritas[0]],
    bidder: mockUsers[0],
    status: 'ACEPTADA',
  },
  {
    id: '303',
    publication: { id: '23', card: mockFiguritas[3], publisher: mockUsers[1], status: 'ACTIVA', participationType: 'SUBASTA', count: 1 },
    offeredCards: [mockFiguritas[4], mockFiguritas[6]],
    bidder: mockUsers[0],
    status: 'RECHAZADA',
  },
];

export const getMockedReceivedProposals = (userId: string): Proposal[] =>
  mockReceivedProposals.filter(p => p.publication.publisher.id === userId);

export const getMockedSentProposals = (userId: string): Proposal[] =>
  mockSentProposals.filter(p => p.bidder.id === userId);
