import axios from 'axios';
import { API_CONFIG } from '../config/apiConfig';
import { Auction } from '../interfaces/auctions/Auction';
import { AuctionStatus } from '../interfaces/auctions/AuctionStatus';
import { UserBid } from '../interfaces/auctions/bid/UserBid';
import { CreateAuctionRequest } from '../interfaces/auctions/CreateAuctionRequest';
import { CreatedResponse } from '../interfaces/common/CreatedResponse';
import { AuctionRule } from '../interfaces/auctions/auctionRule/AuctionRule';
import { Card } from '../interfaces/cards/Card';
import { User } from '../interfaces/auth/User';
import { CardType } from '../interfaces/CardType';

const BASE = API_CONFIG.auctions.base;

interface Paginated<T> { data: T[]; currentPage: number; totalPages: number }

export interface AuctionOfferDtoBE {
  offerId: string;
  auctionId: string;
  bidderUserId: string;
  bidderUserName: string;
  offeredItems: Array<{ cardId: string; cardNumber: number; cardDescription: string | null; amount: number }>;
  status: string;
  bidDate: string;
}

export interface AuctionDto {
  id: string;
  cardNumber: number;
  cardDescription: string;
  cardCountry: string | null;
  cardTeam: string | null;
  cardCategory: string;
  closeDate: string;
  status: string;
  bestOffer: { username: string; cards: Array<{ id: string; number: number; description: string }> } | null;
  publisherUserId: string | null;
  publisherName: string | null;
  publisherAvatarId: string | null;
  offers: AuctionOfferDtoBE[] | null;
}

const STATUS_BE_TO_FE: Record<string, AuctionStatus> = {
  ACTIVE: 'ACTIVA',
  AWARDED: 'FINALIZADA',
  CANCELLED: 'CANCELADA',
};

const OFFER_STATUS_BE_TO_FE: Record<string, 'ACTIVA' | 'SUPERADA' | 'GANADORA' | 'RECHAZADA'> = {
  PENDING: 'ACTIVA',
  ACCEPTED: 'GANADORA',
  REJECTED: 'RECHAZADA',
  CANCELLED: 'RECHAZADA',
};

export const mapAuction = (dto: AuctionDto): Auction => {
  const card: Card = {
    id: '',
    number: dto.cardNumber,
    type: 'JUGADOR' as CardType,
    description: dto.cardDescription,
    country: dto.cardCountry,
    team: dto.cardTeam,
    category: dto.cardCategory as Card['category'],
  };
  const publisher: User = {
    id: dto.publisherUserId ?? '',
    name: dto.publisherName ?? '',
    email: '',
    rating: null,
    exchangesAmount: 0,
    avatarId: (dto.publisherAvatarId as User['avatarId']) ?? 'avatar_1',
    creationDate: '',
  };
  const bids = (dto.offers ?? []).map(o => ({
    bidId: o.offerId,
    bidder: {
      userId: o.bidderUserId,
      name: o.bidderUserName,
      rating: 0,
      avatarId: 'avatar_1',
    },
    offeredFiguritas: o.offeredItems.flatMap(it =>
      Array(it.amount).fill({
        id: it.cardId,
        number: it.cardNumber,
        type: 'JUGADOR' as CardType,
        description: it.cardDescription ?? '',
        country: null,
        team: null,
        category: 'COMUN' as Card['category'],
      })
    ),
    status: OFFER_STATUS_BE_TO_FE[o.status] ?? 'ACTIVA',
    bidDate: o.bidDate,
  }));
  return {
    id: dto.id,
    figurita: card,
    publisherId: publisher,
    status: STATUS_BE_TO_FE[dto.status] ?? 'ACTIVA',
    creationDate: '',
    endDate: dto.closeDate,
    rules: [],
    bids,
  };
};

const mapRuleToCondition = (r: AuctionRule) => {
  switch (r.type) {
    case 'REPUTACION_MINIMA':         return { filterName: 'MIN_REPUTATION',  quantity: parseInt(r.value) };
    case 'INTERCAMBIOS_MINIMOS':      return { filterName: 'MIN_EXCHANGES',   quantity: parseInt(r.value) };
    case 'CANTIDAD_MINIMA_FIGURITAS': return { filterName: 'MIN_CARD_COUNT',  quantity: parseInt(r.value) };
    case 'CATEGORIA_MINIMA':          return { filterName: 'MIN_CATEGORY',    value: r.value };
    default:                          return { filterName: r.type, value: r.value };
  }
};

export const getActiveAuctions = async (): Promise<Auction[]> => {
  const res = await axios.get<Paginated<AuctionDto>>(BASE);
  return (res.data?.data ?? []).map(mapAuction);
};

export const createAuction = async (data: CreateAuctionRequest): Promise<Auction> => {
  const body = {
    cardId: data.cardId,
    auctionDurationHours: data.duration,
    conditions: data.rules.map(mapRuleToCondition),
  };
  const res = await axios.post<CreatedResponse<AuctionDto>>(BASE, body);
  return mapAuction(res.data.data);
};

export const getAuctionsByUserId = async (userId: string): Promise<Auction[]> => {
  const res = await axios.get<Paginated<AuctionDto>>(BASE, { params: { userId } });
  return (res.data?.data ?? []).map(mapAuction);
};

export const getAuctionById = async (id: string): Promise<Auction | null> => {
  const res = await axios.get<AuctionDto>(`${BASE}/${id}`);
  return mapAuction(res.data);
};

export const acceptOffer = async (auctionId: string, winnerOfferId: string): Promise<void> => {
  await axios.put(`${BASE}/${auctionId}/offers/${winnerOfferId}/accept`);
};

export const rejectOffer = async (auctionId: string, offerId: string): Promise<void> => {
  await axios.put(`${BASE}/${auctionId}/offers/${offerId}/reject`);
};

export const cancelAuction = async (auctionId: string): Promise<void> => {
  await axios.delete(`${BASE}/${auctionId}`);
};

export const cancelOffer = async (auctionId: string, offerId: string): Promise<void> => {
  await axios.delete(`${BASE}/${auctionId}/offers/${offerId}`);
};

interface UserBidDtoBE {
  auctionId: string;
  cardNumber: number;
  cardDescription: string;
  cardCountry: string | null;
  cardTeam: string | null;
  publisherUserId: string | null;
  publisherName: string | null;
  auctionStatus: string;
  closeDate: string;
  offerId: string;
  offeredItems: Array<{ cardId: string | null; cardNumber: number | null; cardDescription: string | null; amount: number }>;
  offerStatus: string;
  bidDate: string;
}

export const getAuctionBidsByUserId = async (userId: string): Promise<UserBid[]> => {
  const res = await axios.get<UserBidDtoBE[]>(`${BASE}/offers`, { params: { userId } });
  return res.data.map(b => ({
    auctionId: b.auctionId,
    figurita: {
      id: '',
      number: b.cardNumber,
      type: 'JUGADOR' as CardType,
      description: b.cardDescription,
      country: b.cardCountry,
      team: b.cardTeam,
      category: 'COMUN' as Card['category'],
    },
    publisher: {
      id: b.publisherUserId ?? '',
      name: b.publisherName ?? '',
      email: '', rating: null, exchangesAmount: 0,
      avatarId: 'avatar_1' as User['avatarId'],
      creationDate: '',
    },
    auctionStatus: STATUS_BE_TO_FE[b.auctionStatus] ?? 'ACTIVA',
    closingDate: b.closeDate,
    bidId: b.offerId,
    offeredFiguritas: b.offeredItems.flatMap(it =>
      Array(it.amount).fill({
        id: it.cardId ?? '',
        number: it.cardNumber ?? 0,
        type: 'JUGADOR' as CardType,
        description: it.cardDescription ?? '',
        country: null, team: null, category: 'COMUN' as Card['category'],
      })
    ),
    bidStatus: OFFER_STATUS_BE_TO_FE[b.offerStatus] ?? 'ACTIVA',
    bidDate: b.bidDate,
  }));
};

/** BE no expone update de subasta. Pendiente endpoint. */
export const updateAuction = async (_auctionId: string, _data: { rules: AuctionRule[] }): Promise<void> => {
  return;
};

export const placeBid = async (auctionId: string, _userId: string, cardIds: string[]): Promise<AuctionOfferDtoBE> => {
  const grouped = cardIds.reduce<Record<string, number>>((acc, id) => {
    acc[id] = (acc[id] ?? 0) + 1;
    return acc;
  }, {});
  const items = Object.entries(grouped).map(([cardId, amount]) => ({ cardId, amount }));
  const res = await axios.post<CreatedResponse<AuctionOfferDtoBE>>(`${BASE}/${auctionId}/offers`, { auctionId, items });
  return res.data.data;
};
