import { Notification } from '../app/interfaces/Notification';

export const getMockedNotifications = (): Notification[] => [
  { id: 1, message: 'La figurita #10 (Lionel Messi) que buscabas ya está disponible.', read: false },
  { id: 2, message: 'La subasta de #7 (Kylian Mbappé) cierra en menos de 30 minutos.', read: false },
  { id: 3, message: 'Recibiste una nueva propuesta de intercambio de Carlos Gómez.', read: false },
];
