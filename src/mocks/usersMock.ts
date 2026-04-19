import { User } from '../app/interfaces/auth/User';
import { Figurita } from '../app/interfaces/Figurita';
import { FiguritaColeccion } from '../app/interfaces/FiguritaColeccion';

export const mockUser: User = {
  id: 'user_1',
  name: 'Juan Pérez',
  email: 'juan.perez@frba.utn.edu.ar',
  rating: 4.3,
  exchangesAmount: 12,
  avatarId: 'avatar_1',
  creationDate: '2025-01-15T00:00:00Z',
};

export const mockUserCollection: Figurita[] = [
  { id: '1',  number: 1,  description: 'Emiliano Martínez',      country: 'Argentina', team: 'Aston Villa',     category: 'EPICO' },
  { id: '5',  number: 5,  description: 'Lautaro Martínez',       country: 'Argentina', team: 'Inter de Milán',  category: 'EPICO' },
  { id: '8',  number: 8,  description: 'Jude Bellingham',        country: 'Inglaterra',team: 'Real Madrid',     category: 'EPICO' },
  { id: '14', number: 14, description: 'Gavi',                   country: 'España',    team: 'FC Barcelona',    category: 'COMUN' },
  { id: '21', number: 21, description: 'Bukayo Saka',            country: 'Inglaterra',team: 'Arsenal',         category: 'COMUN' },
  { id: '22', number: 22, description: 'Rodri',                  country: 'España',    team: 'Manchester City', category: 'COMUN' },
  { id: '30', number: 30, description: 'Rafael Leão',            country: 'Portugal',  team: 'AC Milan',        category: 'COMUN' },
  { id: '33', number: 33, description: 'Rúben Dias',             country: 'Portugal',  team: 'Manchester City', category: 'COMUN' },
];

export const mockUserRepetidas: FiguritaColeccion[] = [
  {
    id: 101,
    figurita: { id: '5',  number: 5,  description: 'Lautaro Martínez', country: 'Argentina', team: 'Inter de Milán',  category: 'EPICO' },
    cantidad: 3,
    enVenta: true,
  },
  {
    id: 102,
    figurita: { id: '22', number: 22, description: 'Rodri',            country: 'España',    team: 'Manchester City', category: 'COMUN' },
    cantidad: 2,
    enVenta: false,
  },
  {
    id: 103,
    figurita: { id: '8',  number: 8,  description: 'Jude Bellingham',  country: 'Inglaterra',team: 'Real Madrid',     category: 'EPICO' },
    cantidad: 2,
    enVenta: true,
  },
  {
    id: 104,
    figurita: { id: '14', number: 14, description: 'Gavi',             country: 'España',    team: 'FC Barcelona',    category: 'COMUN' },
    cantidad: 4,
    enVenta: false,
  },
];

export const mockUserMissingCards: Figurita[] = [
  { id: '2',  number: 2,  description: 'Vinícius Jr.',          country: 'Brasil',    team: 'Real Madrid',        category: 'EPICO' },
  { id: '3',  number: 3,  description: 'Florian Wirtz',         country: 'Alemania',  team: 'Bayer Leverkusen',   category: 'COMUN' },
  { id: '6',  number: 6,  description: 'Sergi Roberto',         country: 'España',    team: 'FC Barcelona',       category: 'COMUN' },
  { id: '10', number: 10, description: 'Khvicha Kvaratskhelia', country: 'Georgia',   team: 'Napoli',             category: 'COMUN' },
];

export const mockUsers: User[] = [
  {
    id: 'user_1',
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
];

export const getMockedUserCollection = (): FiguritaColeccion[] => mockUserRepetidas;
export const getMockedUserMissingCards = (): Figurita[] => mockUserMissingCards;
export const getMockedUser = (): User => mockUser;
export const getMockedUsers = (): User[] => mockUsers;
