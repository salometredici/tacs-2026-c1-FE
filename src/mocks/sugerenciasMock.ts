import { PublicacionIntercambio } from '../app/interfaces/proposals/PublicacionIntercambio';

export const mockSugerencias: PublicacionIntercambio[] = [
  {
    id: 201,
    figurita: { id: 2, numero: 2, jugador: 'Vinícius Jr.', seleccion: 'Brasil', equipo: 'Real Madrid', categoria: 'EPICO' },
    publicante: { id: 2, nombre: 'Martín Gutiérrez', email: 'martin.gutierrez@gmail.com', rating: 4.7 },
    estado: 'ACTIVA',
    tipoParticipacion: 'INTERCAMBIO',
    cantidad: 2,
  },
  {
    id: 202,
    figurita: { id: 3, numero: 3, jugador: 'Florian Wirtz', seleccion: 'Alemania', equipo: 'Bayer Leverkusen', categoria: 'COMUN' },
    publicante: { id: 3, nombre: 'Sofía Ramírez', email: 'sofia.ramirez@outlook.com', rating: 4.2 },
    estado: 'ACTIVA',
    tipoParticipacion: 'INTERCAMBIO',
    cantidad: 1,
  },
  {
    id: 203,
    figurita: { id: 6, numero: 6, jugador: 'Sergi Roberto', seleccion: 'España', equipo: 'FC Barcelona', categoria: 'COMUN' },
    publicante: { id: 4, nombre: 'Lucas Fernández', email: 'lucas.fernandez@gmail.com', rating: 3.9 },
    estado: 'ACTIVA',
    tipoParticipacion: 'INTERCAMBIO',
    cantidad: 3,
  },
  {
    id: 204,
    figurita: { id: 10, numero: 10, jugador: 'Khvicha Kvaratskhelia', seleccion: 'Georgia', equipo: 'Napoli', categoria: 'COMUN' },
    publicante: { id: 2, nombre: 'Martín Gutiérrez', email: 'martin.gutierrez@gmail.com', rating: 4.7 },
    estado: 'ACTIVA',
    tipoParticipacion: 'INTERCAMBIO',
    cantidad: 2,
  },
  {
    id: 205,
    figurita: { id: 17, numero: 17, jugador: 'Erling Haaland', seleccion: 'Noruega', equipo: 'Manchester City', categoria: 'LEGENDARIO' },
    publicante: { id: 5, nombre: 'Valentina Torres', email: 'valentina.torres@gmail.com', rating: 5.0 },
    estado: 'ACTIVA',
    tipoParticipacion: 'INTERCAMBIO',
    cantidad: 1,
  },
  {
    id: 206,
    figurita: { id: 18, numero: 18, jugador: 'Kylian Mbappé', seleccion: 'Francia', equipo: 'Real Madrid', categoria: 'LEGENDARIO' },
    publicante: { id: 3, nombre: 'Sofía Ramírez', email: 'sofia.ramirez@outlook.com', rating: 4.2 },
    estado: 'ACTIVA',
    tipoParticipacion: 'INTERCAMBIO',
    cantidad: 1,
  },
  {
    id: 207,
    figurita: { id: 19, numero: 19, jugador: 'Federico Valverde', seleccion: 'Uruguay', equipo: 'Real Madrid', categoria: 'EPICO' },
    publicante: { id: 6, nombre: 'Agustín Morales', email: 'agustin.morales@gmail.com', rating: 4.5 },
    estado: 'ACTIVA',
    tipoParticipacion: 'INTERCAMBIO',
    cantidad: 2,
  },
  {
    id: 208,
    figurita: { id: 20, numero: 20, jugador: 'Phil Foden', seleccion: 'Inglaterra', equipo: 'Manchester City', categoria: 'EPICO' },
    publicante: { id: 4, nombre: 'Lucas Fernández', email: 'lucas.fernandez@gmail.com', rating: 3.9 },
    estado: 'ACTIVA',
    tipoParticipacion: 'INTERCAMBIO',
    cantidad: 1,
  },
  {
    id: 209,
    figurita: { id: 23, numero: 23, jugador: 'Bernardo Silva', seleccion: 'Portugal', equipo: 'Manchester City', categoria: 'COMUN' },
    publicante: { id: 5, nombre: 'Valentina Torres', email: 'valentina.torres@gmail.com', rating: 5.0 },
    estado: 'ACTIVA',
    tipoParticipacion: 'INTERCAMBIO',
    cantidad: 3,
  },
  {
    id: 210,
    figurita: { id: 25, numero: 25, jugador: 'Pedri', seleccion: 'España', equipo: 'FC Barcelona', categoria: 'EPICO' },
    publicante: { id: 6, nombre: 'Agustín Morales', email: 'agustin.morales@gmail.com', rating: 4.5 },
    estado: 'ACTIVA',
    tipoParticipacion: 'INTERCAMBIO',
    cantidad: 2,
  },
];

export const getMockedSugerencias = (_userId: number): PublicacionIntercambio[] => {
  return mockSugerencias;
};
