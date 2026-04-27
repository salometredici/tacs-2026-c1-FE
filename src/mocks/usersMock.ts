import { User } from '../app/interfaces/auth/User';
import { Card } from '../app/interfaces/cards/Card';
import { CollectionCard } from '../app/interfaces/cards/CollectionCard';

export const mockUser: User = {
  id: '69e54c037de7f7e868da90f4',
  name: 'Juan Pérez',
  email: 'juan.perez@frba.utn.edu.ar',
  rating: 4.3,
  exchangesAmount: 12,
  avatarId: 'avatar_1',
  creationDate: '2025-01-15T00:00:00Z',
};

export const mockUserCollection: Card[] = [
  { id: 'fig_001', number: 1,  type: 'JUGADOR', description: 'Emiliano Martínez',      country: 'Argentina', team: 'Aston Villa',     category: 'EPICO' },
  { id: 'fig_005', number: 5,  type: 'JUGADOR', description: 'Lautaro Martínez',       country: 'Argentina', team: 'Inter de Milán',  category: 'EPICO' },
  { id: 'fig_008', number: 8,  type: 'JUGADOR', description: 'Jude Bellingham',        country: 'Inglaterra',team: 'Real Madrid',     category: 'EPICO' },
  { id: 'fig_014', number: 14, type: 'JUGADOR', description: 'Gavi',                   country: 'España',    team: 'FC Barcelona',    category: 'COMUN' },
  { id: 'fig_021', number: 21, type: 'JUGADOR', description: 'Bukayo Saka',            country: 'Inglaterra',team: 'Arsenal',         category: 'COMUN' },
  { id: 'fig_022', number: 22, type: 'JUGADOR', description: 'Rodri',                  country: 'España',    team: 'Manchester City', category: 'COMUN' },
  { id: 'fig_030', number: 30, type: 'JUGADOR', description: 'Rafael Leão',            country: 'Portugal',  team: 'AC Milan',        category: 'COMUN' },
  { id: 'fig_033', number: 33, type: 'JUGADOR', description: 'Rúben Dias',             country: 'Portugal',  team: 'Manchester City', category: 'COMUN' },
];

export const mockUserRepetidas: CollectionCard[] = [
  { cardId: 'fig_005', number: 5,  description: 'Lautaro Martínez', country: 'Argentina', team: 'Inter de Milán',  category: 'EPICO', quantity: 3, compromisedCount: 0 },
  { cardId: 'fig_022', number: 22, description: 'Rodri',            country: 'España',    team: 'Manchester City', category: 'COMUN', quantity: 2, compromisedCount: 0 },
  { cardId: 'fig_008', number: 8,  description: 'Jude Bellingham',  country: 'Inglaterra',team: 'Real Madrid',     category: 'EPICO', quantity: 2, compromisedCount: 0 },
  { cardId: 'fig_014', number: 14, description: 'Gavi',             country: 'España',    team: 'FC Barcelona',    category: 'COMUN', quantity: 4, compromisedCount: 0 },
];

export const mockUserMissingCards: Card[] = [
  { id: 'fig_002', number: 2,  type: 'JUGADOR', description: 'Vinícius Jr.',          country: 'Brasil',   team: 'Real Madrid',      category: 'EPICO' },
  { id: 'fig_003', number: 3,  type: 'JUGADOR', description: 'Florian Wirtz',         country: 'Alemania', team: 'Bayer Leverkusen', category: 'COMUN' },
  { id: 'fig_006', number: 6,  type: 'JUGADOR', description: 'Sergi Roberto',         country: 'España',   team: 'FC Barcelona',     category: 'COMUN' },
  { id: 'fig_010', number: 10, type: 'JUGADOR', description: 'Khvicha Kvaratskhelia', country: 'Georgia',  team: 'Napoli',           category: 'COMUN' },
];

export const mockUsers: User[] = [
  {
    id: '69e54c037de7f7e868da90f4',
    name: 'Pepe Argento',
    email: 'peperacing@gmail.com',
    rating: 4.5,
    exchangesAmount: 8,
    avatarId: 'avatar_2',
    creationDate: '2025-02-01T00:00:00Z',
  },
  {
    id: 'user_2',
    name: 'Mónica Argento',
    email: 'moniargento@gmail.com',
    rating: 4.8,
    exchangesAmount: 15,
    avatarId: 'avatar_3',
    creationDate: '2025-02-01T00:00:00Z',
  },
  {
    id: 'user_3',
    name: 'Homero Simpson',
    email: 'homero@outlook.com',
    rating: 5.0,
    exchangesAmount: 3,
    avatarId: 'avatar_4',
    creationDate: '2025-03-10T00:00:00Z',
  },
  {
    id: '69e54c037de7f7e868da90f5',
    name: "Test User",
    email: "user@test.com",
    avatarId: "avatar_1",
    rating: 4.2,
    exchangesAmount: 0,
    creationDate: Date.now().toLocaleString()
  }
];

export const getMockedUserCollection = (): CollectionCard[] => mockUserRepetidas;
export const getMockedUserMissingCards = (): Card[] => mockUserMissingCards;
export const getMockedUser = (): User => mockUser;
export const getMockedUsers = (): User[] => mockUsers;
