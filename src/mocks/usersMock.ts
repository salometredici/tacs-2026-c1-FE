import { User } from '../app/interfaces/User';
import { Figurita } from '../app/interfaces/Figurita';
import { FiguritaColeccion } from '../app/interfaces/FiguritaColeccion';

export const mockUser: User = {
  id: 1,
  nombre: 'Juan Pérez',
  email: 'juan.perez@frba.utn.edu.ar',
  rating: 4.3,
  img: '../app/pages/profile/user-svgrepo-com.svg'
};

export const mockUserCollection: Figurita[] = [
  { id: 1, numero: 1, jugador: 'Emiliano Martínez', seleccion: 'Argentina', equipo: 'Aston Villa', categoria: 'EPICO' },
  { id: 5, numero: 5, jugador: 'Lautaro Martínez', seleccion: 'Argentina', equipo: 'Inter de Milán', categoria: 'EPICO' },
  { id: 8, numero: 8, jugador: 'Jude Bellingham', seleccion: 'Inglaterra', equipo: 'Real Madrid', categoria: 'EPICO' },
  { id: 14, numero: 14, jugador: 'Gavi', seleccion: 'España', equipo: 'FC Barcelona', categoria: 'COMUN' },
  { id: 21, numero: 21, jugador: 'Bukayo Saka', seleccion: 'Inglaterra', equipo: 'Arsenal', categoria: 'COMUN' },
  { id: 22, numero: 22, jugador: 'Rodri', seleccion: 'España', equipo: 'Manchester City', categoria: 'COMUN' },
  { id: 30, numero: 30, jugador: 'Rafael Leão', seleccion: 'Portugal', equipo: 'AC Milan', categoria: 'COMUN' },
  { id: 33, numero: 33, jugador: 'Rúben Dias', seleccion: 'Portugal', equipo: 'Manchester City', categoria: 'COMUN' },
];

export const mockUserRepetidas: FiguritaColeccion[] = [
  {
    id: 101,
    figurita: { id: 5, numero: 5, jugador: 'Lautaro Martínez', seleccion: 'Argentina', equipo: 'Inter de Milán', categoria: 'EPICO' },
    cantidad: 3,
    enVenta: true,
  },
  {
    id: 102,
    figurita: { id: 22, numero: 22, jugador: 'Rodri', seleccion: 'España', equipo: 'Manchester City', categoria: 'COMUN' },
    cantidad: 2,
    enVenta: false,
  },
  {
    id: 103,
    figurita: { id: 8, numero: 8, jugador: 'Jude Bellingham', seleccion: 'Inglaterra', equipo: 'Real Madrid', categoria: 'EPICO' },
    cantidad: 2,
    enVenta: true,
  },
  {
    id: 104,
    figurita: { id: 14, numero: 14, jugador: 'Gavi', seleccion: 'España', equipo: 'FC Barcelona', categoria: 'COMUN' },
    cantidad: 4,
    enVenta: false,
  },
];

export const mockUserMissingCards: Figurita[] = [
  { id: 2, numero: 2, jugador: 'Vinícius Jr.', seleccion: 'Brasil', equipo: 'Real Madrid', categoria: 'EPICO' },
  { id: 3, numero: 3, jugador: 'Florian Wirtz', seleccion: 'Alemania', equipo: 'Bayer Leverkusen', categoria: 'COMUN' },
  { id: 6, numero: 6, jugador: 'Sergi Roberto', seleccion: 'España', equipo: 'FC Barcelona', categoria: 'COMUN' },
  { id: 10, numero: 10, jugador: 'Khvicha Kvaratskhelia', seleccion: 'Georgia', equipo: 'Napoli', categoria: 'COMUN' },
];

export const mockUsers = [
  {
    id: 1,
    nombre: 'Pepe Argento',
    email: 'peperacing@gmail.com',
    rating: 4.5,
    img: ''
  },
  {
    id: 2,
    nombre: 'Mónica Argento',
    email: 'moniargento@gmail.com',
    rating: 4.8,
    img: ''
  },
  {
    id: 3,
    nombre: 'Homero Simpson',
    email: 'homero@outlook.com',
    rating: 5.0,
    img: ''
  },
];

export const getMockedUserCollection = (): FiguritaColeccion[] => {
  return mockUserRepetidas;
};

export const getMockedUserMissingCards = (): Figurita[] => {
  return mockUserMissingCards;
};

export const getMockedUser = (): User => {
  return mockUser;
}

export const getMockedUsers = (): User[] => {
  return mockUsers;
}