import { Proposal } from '../app/interfaces/proposals/Proposal';
import { Publicacion } from '../app/interfaces/publicaciones/Publicacion';
import { mockFiguritas } from './figuritasMock';
import { mockUsers } from './usersMock';

// Usuario logueado = mockUsers[0] (id: user_1, Pepe Argento)

// Publicaciones activas propias del usuario logueado
export const mockMyPublications: Publicacion[] = [
  {
    id: '11',
    figurita: mockFiguritas[2], // Neymar
    publisher: mockUsers[0],
    status: 'ACTIVA',
    participationType: 'INTERCAMBIO',
    count: 2,
  },
  {
    id: '12',
    figurita: mockFiguritas[4], // Piqué
    publisher: mockUsers[0],
    status: 'ACTIVA',
    participationType: 'SUBASTA',
    count: 1,
  },
  {
    id: '14',
    figurita: mockFiguritas[7], // Benzema
    publisher: mockUsers[0],
    status: 'ACTIVA',
    participationType: 'INTERCAMBIO',
    count: 3,
  },
];

export const getMockedMyPublications = (userId: string): Publicacion[] =>
  mockMyPublications.filter(p => p.publisher.id === userId);

// Propuestas RECIBIDAS
export const mockReceivedProposals: Proposal[] = [
  {
    id: '201',
    publicacion: { id: '11', figurita: mockFiguritas[2], publisher: mockUsers[0], status: 'ACTIVA', participationType: 'INTERCAMBIO', count: 2 },
    offeredFiguritas: [mockFiguritas[5]],
    postor: mockUsers[1],
    status: 'PENDIENTE',
  },
  {
    id: '202',
    publicacion: { id: '12', figurita: mockFiguritas[4], publisher: mockUsers[0], status: 'ACTIVA', participationType: 'SUBASTA', count: 1 },
    offeredFiguritas: [mockFiguritas[6], mockFiguritas[7]],
    postor: mockUsers[2],
    status: 'PENDIENTE',
  },
  {
    id: '203',
    publicacion: { id: '13', figurita: mockFiguritas[0], publisher: mockUsers[0], status: 'FINALIZADA', participationType: 'INTERCAMBIO', count: 1 },
    offeredFiguritas: [mockFiguritas[3]],
    postor: mockUsers[1],
    status: 'ACEPTADA',
  },
  {
    id: '204',
    publicacion: { id: '14', figurita: mockFiguritas[2], publisher: mockUsers[0], status: 'ACTIVA', participationType: 'INTERCAMBIO', count: 2 },
    offeredFiguritas: [mockFiguritas[1]],
    postor: mockUsers[2],
    status: 'RECHAZADA',
  },
];

// Propuestas ENVIADAS
export const mockSentProposals: Proposal[] = [
  {
    id: '301',
    publicacion: { id: '21', figurita: mockFiguritas[1], publisher: mockUsers[1], status: 'ACTIVA', participationType: 'INTERCAMBIO', count: 1 },
    offeredFiguritas: [mockFiguritas[2]],
    postor: mockUsers[0],
    status: 'PENDIENTE',
  },
  {
    id: '302',
    publicacion: { id: '22', figurita: mockFiguritas[5], publisher: mockUsers[2], status: 'FINALIZADA', participationType: 'INTERCAMBIO', count: 1 },
    offeredFiguritas: [mockFiguritas[0]],
    postor: mockUsers[0],
    status: 'ACEPTADA',
  },
  {
    id: '303',
    publicacion: { id: '23', figurita: mockFiguritas[3], publisher: mockUsers[1], status: 'ACTIVA', participationType: 'SUBASTA', count: 1 },
    offeredFiguritas: [mockFiguritas[4], mockFiguritas[6]],
    postor: mockUsers[0],
    status: 'RECHAZADA',
  },
];

export const getMockedReceivedProposals = (userId: string): Proposal[] =>
  mockReceivedProposals.filter(p => p.publicacion.publisher.id === userId);

export const getMockedSentProposals = (userId: string): Proposal[] =>
  mockSentProposals.filter(p => p.postor.id === userId);
