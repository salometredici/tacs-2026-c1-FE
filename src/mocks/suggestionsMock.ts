import { Publication } from '../app/interfaces/publications/Publication';

export const mockSuggestions: Publication[] = [
  {
    id: '201',
    figurita: { id: '2', number: 2, description: 'Vinícius Jr.', country: 'Brasil', team: 'Real Madrid', category: 'EPICO' },
    publisher: { id: 'user_2', name: 'Martín Gutiérrez', email: 'martin.gutierrez@gmail.com', rating: 4.7, exchangesAmount: 5, avatarId: 'avatar_2', creationDate: '2025-01-01T00:00:00Z' },
    status: 'ACTIVA',
    participationType: 'INTERCAMBIO',
    count: 2,
  },
  {
    id: '202',
    figurita: { id: '3', number: 3, description: 'Florian Wirtz', country: 'Alemania', team: 'Bayer Leverkusen', category: 'COMUN' },
    publisher: { id: 'user_3', name: 'Sofía Ramírez', email: 'sofia.ramirez@outlook.com', rating: 4.2, exchangesAmount: 3, avatarId: 'avatar_3', creationDate: '2025-01-01T00:00:00Z' },
    status: 'ACTIVA',
    participationType: 'INTERCAMBIO',
    count: 1,
  },
  {
    id: '203',
    figurita: { id: '6', number: 6, description: 'Sergi Roberto', country: 'España', team: 'FC Barcelona', category: 'COMUN' },
    publisher: { id: 'user_4', name: 'Lucas Fernández', email: 'lucas.fernandez@gmail.com', rating: 3.9, exchangesAmount: 2, avatarId: 'avatar_4', creationDate: '2025-01-01T00:00:00Z' },
    status: 'ACTIVA',
    participationType: 'INTERCAMBIO',
    count: 3,
  },
  {
    id: '204',
    figurita: { id: '10', number: 10, description: 'Khvicha Kvaratskhelia', country: 'Georgia', team: 'Napoli', category: 'COMUN' },
    publisher: { id: 'user_2', name: 'Martín Gutiérrez', email: 'martin.gutierrez@gmail.com', rating: 4.7, exchangesAmount: 5, avatarId: 'avatar_2', creationDate: '2025-01-01T00:00:00Z' },
    status: 'ACTIVA',
    participationType: 'INTERCAMBIO',
    count: 2,
  },
  {
    id: '205',
    figurita: { id: '17', number: 17, description: 'Erling Haaland', country: 'Noruega', team: 'Manchester City', category: 'LEGENDARIO' },
    publisher: { id: 'user_5', name: 'Valentina Torres', email: 'valentina.torres@gmail.com', rating: 5.0, exchangesAmount: 10, avatarId: 'avatar_5', creationDate: '2025-01-01T00:00:00Z' },
    status: 'ACTIVA',
    participationType: 'INTERCAMBIO',
    count: 1,
  },
  {
    id: '206',
    figurita: { id: '18', number: 18, description: 'Kylian Mbappé', country: 'Francia', team: 'Real Madrid', category: 'LEGENDARIO' },
    publisher: { id: 'user_3', name: 'Sofía Ramírez', email: 'sofia.ramirez@outlook.com', rating: 4.2, exchangesAmount: 3, avatarId: 'avatar_3', creationDate: '2025-01-01T00:00:00Z' },
    status: 'ACTIVA',
    participationType: 'INTERCAMBIO',
    count: 1,
  },
  {
    id: '207',
    figurita: { id: '19', number: 19, description: 'Federico Valverde', country: 'Uruguay', team: 'Real Madrid', category: 'EPICO' },
    publisher: { id: 'user_6', name: 'Agustín Morales', email: 'agustin.morales@gmail.com', rating: 4.5, exchangesAmount: 7, avatarId: 'avatar_1', creationDate: '2025-01-01T00:00:00Z' },
    status: 'ACTIVA',
    participationType: 'INTERCAMBIO',
    count: 2,
  },
  {
    id: '208',
    figurita: { id: '20', number: 20, description: 'Phil Foden', country: 'Inglaterra', team: 'Manchester City', category: 'EPICO' },
    publisher: { id: 'user_4', name: 'Lucas Fernández', email: 'lucas.fernandez@gmail.com', rating: 3.9, exchangesAmount: 2, avatarId: 'avatar_4', creationDate: '2025-01-01T00:00:00Z' },
    status: 'ACTIVA',
    participationType: 'INTERCAMBIO',
    count: 1,
  },
  {
    id: '209',
    figurita: { id: '23', number: 23, description: 'Bernardo Silva', country: 'Portugal', team: 'Manchester City', category: 'COMUN' },
    publisher: { id: 'user_5', name: 'Valentina Torres', email: 'valentina.torres@gmail.com', rating: 5.0, exchangesAmount: 10, avatarId: 'avatar_5', creationDate: '2025-01-01T00:00:00Z' },
    status: 'ACTIVA',
    participationType: 'INTERCAMBIO',
    count: 3,
  },
  {
    id: '210',
    figurita: { id: '25', number: 25, description: 'Pedri', country: 'España', team: 'FC Barcelona', category: 'EPICO' },
    publisher: { id: 'user_6', name: 'Agustín Morales', email: 'agustin.morales@gmail.com', rating: 4.5, exchangesAmount: 7, avatarId: 'avatar_1', creationDate: '2025-01-01T00:00:00Z' },
    status: 'ACTIVA',
    participationType: 'INTERCAMBIO',
    count: 2,
  },
];

export const getMockedSuggestions = (_userId: string): Publication[] => {
  return mockSuggestions;
};
