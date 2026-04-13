import { Auction } from '../app/interfaces/auction/Auction';
import { CreateAuctionResponse } from '../app/interfaces/auction/CreateAuctionResponse';
import { mockFiguritas } from './figuritasMock';
import { mockUsers } from './usersMock';

export const mockAuctions: Auction[] = [
  {
    id: 1,
    figurita: mockFiguritas[0], // Messi
    publicante: mockUsers[0],
    fechaCreacion: new Date(2026, 3, 13),
    fechaCierre: new Date(2026, 3, 18, 15, 30),
    condicionesMinimas: [
      { tipo: 'REPUTATION_MINIMA', valor: 4 },
    ],
    mejorApuesta: {
      id: 1,
      postor: mockUsers[1],
      figuritasOfrecidas: [mockFiguritas[2], mockFiguritas[4]],
      fecha: new Date(2026, 3, 15, 10, 0),
    },
  },
  {
    id: 2,
    figurita: mockFiguritas[1], // Cristiano Ronaldo
    publicante: mockUsers[1],
    fechaCreacion: new Date(2026, 3, 12),
    fechaCierre: new Date(2026, 3, 19, 20, 0),
    condicionesMinimas: [
      { tipo: 'REPUTATION_MINIMA', valor: 4.5 },
    ],
    mejorApuesta: {
      id: 2,
      postor: mockUsers[2],
      figuritasOfrecidas: [mockFiguritas[5]],
      fecha: new Date(2026, 3, 16, 14, 30),
    },
  },
  {
    id: 3,
    figurita: mockFiguritas[3], // Mbappé
    publicante: mockUsers[2],
    fechaCreacion: new Date(2026, 3, 14),
    fechaCierre: new Date(2026, 3, 17, 18, 0),
    condicionesMinimas: [
      { tipo: 'REPUTATION_MINIMA', valor: 4 },
    ],
  },
];

export const getMockedActiveAuctions = (): Auction[] => {
  const ahora = new Date();
  return mockAuctions.filter(s => new Date(s.fechaCierre) > ahora);
};

export const getMockedCreatedAuctionResponse = (): CreateAuctionResponse => {
  return {
    success: true,
    message: "Subasta creada exitosamente",
    auctionId: 321
  };
}
