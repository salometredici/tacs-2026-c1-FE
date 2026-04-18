import { Auction } from '../app/interfaces/auction/Auction';
import { UserBid } from '../app/interfaces/auction/bid/UserBid';
import { CreateAuctionResponse } from '../app/interfaces/auction/CreateAuctionResponse';
import { mockFiguritas } from './figuritasMock';
import { mockUsers } from './usersMock';

export const mockAuctions: Auction[] = [
  {
    id: 1,
    figurita: mockFiguritas[0], // Messi
    publisherId: mockUsers[0],   // Pepe (id=1)
    status: 'ACTIVA',
    creationDate: '2026-04-13T10:00:00',
    endDate: '2026-04-28T15:30:00',
    rules: [
      { type: 'REPUTACION_MINIMA', value: '4' },
      { type: 'CANTIDAD_MINIMA_FIGURITAS', value: '2' },
    ],
    bids: [
      {
        bidId: 'o-1',
        postor: { userId: '2', name: 'Mónica Argento', rating: 4.8, avatarId: 'avatar_2' },
        offeredFiguritas: [mockFiguritas[2], mockFiguritas[4]],
        status: 'ACTIVA',
        bidDate: '2026-04-15T10:00:00',
      },
    ],
    lastBidId: 'o-1',
  },
  {
    id: 2,
    figurita: mockFiguritas[1], // Cristiano Ronaldo
    publisherId: mockUsers[1],   // Mónica (id=2)
    status: 'ACTIVA',
    creationDate: '2026-04-12T09:00:00',
    endDate: '2026-04-29T20:00:00',
    rules: [
      { type: 'REPUTACION_MINIMA', value: '4' },
      { type: 'CATEGORIA_MINIMA', value: 'EPICO' },
    ],
    bids: [
      {
        bidId: 'o-2',
        postor: { userId: '3', name: 'Homero Simpson', rating: 5.0, avatarId: 'avatar_3' },
        offeredFiguritas: [mockFiguritas[5]],
        status: 'ACTIVA',
        bidDate: '2026-04-16T14:30:00',
      },
    ],
    lastBidId: 'o-2',
  },
  {
    id: 3,
    figurita: mockFiguritas[3], // Mbappé
    publisherId: mockUsers[2],   // Homero (id=3)
    status: 'ACTIVA',
    creationDate: '2026-04-14T12:00:00',
    endDate: '2026-04-27T18:00:00',
    rules: [],
    bids: [],
    lastBidId: undefined,
  },
];

export const getMockedActiveAuctions = (): Auction[] => {
  return mockAuctions.filter(s => s.status === 'ACTIVA');
};

export const getMockedCreatedAuctionResponse = (): CreateAuctionResponse => ({
  success: true,
  message: 'Subasta creada exitosamente',
  auctionId: 321,
});

export const getMockedAuctionById = (id: number): Auction | undefined => {
  return mockAuctions.find(a => a.id === id);
};

// Subastas creadas por el usuario
export const getMockedUserAuctions = (userId: number): Auction[] => {
  return mockAuctions.filter(a => a.publisherId.id === userId);
};

// Vista aplanada de mis ofertas (subastas donde el usuario ofertó)
export const getMockedUserBids = (userId: number): UserBid[] => {
  const result: UserBid[] = [];
  for (const subasta of mockAuctions) {
    const oferta = subasta.bids.find(o => o.postor.userId === String(userId));
    if (oferta) {
      result.push({
        auctionId: String(subasta.id),
        figurita: subasta.figurita,
        publisher: subasta.publisherId,
        auctionStatus: subasta.status,
        closingDate: subasta.endDate,
        bidId: oferta.bidId,
        offeredFiguritas: oferta.offeredFiguritas,
        bidStatus: oferta.status,
        bidDate: oferta.bidDate,
      });
    }
  }
  return result;
};
