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
    initialCount: 3,
    remainingCount: 2,
  },
  {
    id: '14',
    card: mockFiguritas[7],
    publisher: mockUsers[0],
    status: 'ACTIVA',
    initialCount: 3,
    remainingCount: 3,
  },
  {
    id: '15',
    card: mockFiguritas[4],
    publisher: mockUsers[0],
    status: 'FINALIZADA',
    initialCount: 2,
    remainingCount: 0,
  },
];

// Publicaciones de otros usuarios (para visualizar el detalle como no-owner).
export const mockOtherPublications: Publication[] = [
  {
    id: '21',
    card: mockFiguritas[1],
    publisher: mockUsers[1],
    status: 'ACTIVA',
    initialCount: 1,
    remainingCount: 1,
  },
  {
    id: '22',
    card: mockFiguritas[5],
    publisher: mockUsers[2],
    status: 'FINALIZADA',
    initialCount: 1,
    remainingCount: 0,
  },
  {
    id: '23',
    card: mockFiguritas[3],
    publisher: mockUsers[1],
    status: 'ACTIVA',
    initialCount: 4,
    remainingCount: 2,
  },
];

const allMockPublications = (): Publication[] => [...mockMyPublications, ...mockOtherPublications];

// FE-only: ignoramos el userId para que cualquier usuario logueado vea las publis
// mientras no haya backend conectado. Cuando se reemplace por el call real, el BE
// se encarga del filtro.
export const getMockedMyPublications = (_userId: string): Publication[] =>
  mockMyPublications;

// asUserId opcional: si el id coincide con una publi "mía" del mock, sustituye el
// publisher.id por el del user que pregunta (truco FE-only para que isOwner funcione
// con users reales mientras no apuntemos al backend).
export const getMockedPublicationById = (id: string, asUserId?: string): Publication | null => {
  const pub = allMockPublications().find(p => p.id === id);
  if (!pub) return null;
  if (asUserId && mockMyPublications.some(p => p.id === id)) {
    return { ...pub, publisher: { ...pub.publisher, id: asUserId } };
  }
  return pub;
};

export const mockReceivedProposals: Proposal[] = [
  {
    id: '201',
    publication: { id: '11', card: mockFiguritas[2], publisher: mockUsers[0], status: 'ACTIVA', initialCount: 3, remainingCount: 2 },
    offeredCards: [mockFiguritas[5], mockFiguritas[5]],
    requestedCount: 2,
    bidder: mockUsers[1],
    status: 'PENDIENTE',
  },
  {
    id: '203',
    publication: { id: '13', card: mockFiguritas[0], publisher: mockUsers[0], status: 'FINALIZADA', initialCount: 1, remainingCount: 0 },
    offeredCards: [mockFiguritas[3]],
    requestedCount: 1,
    bidder: mockUsers[1],
    status: 'ACEPTADA',
  },
  {
    id: '204',
    publication: { id: '14', card: mockFiguritas[2], publisher: mockUsers[0], status: 'ACTIVA', initialCount: 3, remainingCount: 3 },
    offeredCards: [mockFiguritas[1]],
    requestedCount: 1,
    bidder: mockUsers[2],
    status: 'RECHAZADA',
  },
];

export const mockSentProposals: Proposal[] = [
  {
    id: '301',
    publication: { id: '21', card: mockFiguritas[1], publisher: mockUsers[1], status: 'ACTIVA', initialCount: 1, remainingCount: 1 },
    offeredCards: [mockFiguritas[2]],
    requestedCount: 1,
    bidder: mockUsers[0],
    status: 'PENDIENTE',
  },
  {
    id: '302',
    publication: { id: '22', card: mockFiguritas[5], publisher: mockUsers[2], status: 'FINALIZADA', initialCount: 1, remainingCount: 0 },
    offeredCards: [mockFiguritas[0]],
    requestedCount: 1,
    bidder: mockUsers[0],
    status: 'ACEPTADA',
  },
];

export const getMockedReceivedProposals = (userId: string): Proposal[] =>
  mockReceivedProposals.filter(p => p.publication.publisher.id === userId);

export const getMockedSentProposals = (userId: string): Proposal[] =>
  mockSentProposals.filter(p => p.bidder.id === userId);

export const getMockedProposalsByPublicationId = (publicationId: string): Proposal[] =>
  [...mockReceivedProposals, ...mockSentProposals].filter(p => p.publication.id === publicationId);
