import { Propuesta } from '../app/interfaces/proposals/Propuesta';
import { PublicacionIntercambio } from '../app/interfaces/proposals/PublicacionIntercambio';
import { mockFiguritas } from './figuritasMock';
import { mockUsers } from './usersMock';

// Usuario logueado = mockUsers[0] (id: 1, Pepe Argento)

// Publicaciones activas propias del usuario logueado
export const mockMyPublications: PublicacionIntercambio[] = [
  {
    id: 11,
    figurita: mockFiguritas[2], // Neymar
    publicante: mockUsers[0],
    estado: 'ACTIVA',
    tipoParticipacion: 'INTERCAMBIO',
    cantidad: 2,
  },
  {
    id: 12,
    figurita: mockFiguritas[4], // Piqué
    publicante: mockUsers[0],
    estado: 'ACTIVA',
    tipoParticipacion: 'SUBASTA',
    cantidad: 1,
  },
  {
    id: 14,
    figurita: mockFiguritas[7], // Benzema
    publicante: mockUsers[0],
    estado: 'ACTIVA',
    tipoParticipacion: 'INTERCAMBIO',
    cantidad: 3,
  },
];

export const getMockedMyPublications = (userId: number): PublicacionIntercambio[] =>
  mockMyPublications.filter(p => p.publicante.id === userId);

// Propuestas RECIBIDAS
export const mockReceivedProposals: Propuesta[] = [
  {
    id: 201,
    publicacion: { id: 11, figurita: mockFiguritas[2], publicante: mockUsers[0], estado: 'ACTIVA', tipoParticipacion: 'INTERCAMBIO', cantidad: 2 },
    figuritasOfrecidas: [mockFiguritas[5]],
    postor: mockUsers[1],
    estado: 'PENDIENTE',
  },
  {
    id: 202,
    publicacion: { id: 12, figurita: mockFiguritas[4], publicante: mockUsers[0], estado: 'ACTIVA', tipoParticipacion: 'SUBASTA', cantidad: 1 },
    figuritasOfrecidas: [mockFiguritas[6], mockFiguritas[7]],
    postor: mockUsers[2],
    estado: 'PENDIENTE',
  },
  {
    id: 203,
    publicacion: { id: 13, figurita: mockFiguritas[0], publicante: mockUsers[0], estado: 'FINALIZADA', tipoParticipacion: 'INTERCAMBIO', cantidad: 1 },
    figuritasOfrecidas: [mockFiguritas[3]],
    postor: mockUsers[1],
    estado: 'ACEPTADA',
  },
  {
    id: 204,
    publicacion: { id: 14, figurita: mockFiguritas[2], publicante: mockUsers[0], estado: 'ACTIVA', tipoParticipacion: 'INTERCAMBIO', cantidad: 2 },
    figuritasOfrecidas: [mockFiguritas[1]],
    postor: mockUsers[2],
    estado: 'RECHAZADA',
  },
];

// Propuestas ENVIADAS
export const mockSentProposals: Propuesta[] = [
  {
    id: 301,
    publicacion: { id: 21, figurita: mockFiguritas[1], publicante: mockUsers[1], estado: 'ACTIVA', tipoParticipacion: 'INTERCAMBIO', cantidad: 1 },
    figuritasOfrecidas: [mockFiguritas[2]],
    postor: mockUsers[0],
    estado: 'PENDIENTE',
  },
  {
    id: 302,
    publicacion: { id: 22, figurita: mockFiguritas[5], publicante: mockUsers[2], estado: 'FINALIZADA', tipoParticipacion: 'INTERCAMBIO', cantidad: 1 },
    figuritasOfrecidas: [mockFiguritas[0]],
    postor: mockUsers[0],
    estado: 'ACEPTADA',
  },
  {
    id: 303,
    publicacion: { id: 23, figurita: mockFiguritas[3], publicante: mockUsers[1], estado: 'ACTIVA', tipoParticipacion: 'SUBASTA', cantidad: 1 },
    figuritasOfrecidas: [mockFiguritas[4], mockFiguritas[6]],
    postor: mockUsers[0],
    estado: 'RECHAZADA',
  },
];

export const getMockedReceivedProposals = (userId: number): Propuesta[] =>
  mockReceivedProposals.filter(p => p.publicacion.publicante.id === userId);

export const getMockedSentProposals = (userId: number): Propuesta[] =>
  mockSentProposals.filter(p => p.postor.id === userId);
