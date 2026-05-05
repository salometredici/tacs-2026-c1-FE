import axios from 'axios';
import { API_CONFIG } from '../config/apiConfig';
import { Auction } from '../interfaces/auctions/Auction';
import { AuctionStatus } from '../interfaces/auctions/AuctionStatus';
import { UserBid } from '../interfaces/auctions/bid/UserBid';
import { CreateAuctionRequest } from '../interfaces/auctions/CreateAuctionRequest';
import { CreateAuctionResponse } from '../interfaces/auctions/CreateAuctionResponse';
import { AuctionRule } from '../interfaces/auctions/auctionRule/AuctionRule';
import { Card } from '../interfaces/cards/Card';
import { User } from '../interfaces/auth/User';
import { CardType } from '../interfaces/CardType';

const BASE = API_CONFIG.auctions.base;

interface Paginated<T> { data: T[]; currentPage: number; totalPages: number }

interface AuctionDto {
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
}

const STATUS_BE_TO_FE: Record<string, AuctionStatus> = {
  ACTIVE: 'ACTIVA',
  AWARDED: 'FINALIZADA',
  CANCELLED: 'CANCELADA',
};

const mapAuction = (dto: AuctionDto): Auction => {
  const figurita: Card = {
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
  return {
    id: dto.id,
    figurita,
    publisherId: publisher,
    status: STATUS_BE_TO_FE[dto.status] ?? 'ACTIVA',
    creationDate: '',              // no en DTO
    endDate: dto.closeDate,
    rules: [],                     // no en DTO
    bids: [],                      // no en DTO (sólo bestOffer summary)
  };
};

const mapRuleToCondition = (r: AuctionRule) => {
  switch (r.type) {
    case 'REPUTACION_MINIMA':       return { filterName: 'MIN_REPUTATION',  quantity: parseInt(r.value) };
    case 'INTERCAMBIOS_MINIMOS':    return { filterName: 'MIN_EXCHANGES',   quantity: parseInt(r.value) };
    case 'CANTIDAD_MINIMA_FIGURITAS': return { filterName: 'MIN_CARD_COUNT', quantity: parseInt(r.value) };
    case 'CATEGORIA_MINIMA':        return { filterName: 'MIN_CATEGORY',    value: r.value };
    default:                         return { filterName: r.type, value: r.value };
  }
};

export const getActiveAuctions = async (): Promise<Auction[]> => {
  try {
    const res = await axios.get<Paginated<AuctionDto>>(BASE);
    return (res.data?.data ?? []).map(mapAuction);
  } catch (error: any) {
    console.error('Error al obtener subastas activas:', error?.response?.status, error?.response?.data ?? error?.message);
    return [];
  }
};

export const createAuction = async (data: CreateAuctionRequest): Promise<CreateAuctionResponse> => {
  const body = {
    cardId: data.cardId,
    auctionDurationHours: data.duration,
    conditions: data.rules.map(mapRuleToCondition),
  };
  const res = await axios.post<{ auctionId: string; message?: string }>(BASE, body);
  return { success: true, message: res.data.message ?? 'OK', auctionId: res.data.auctionId };
};

export const getAuctionsByUserId = async (_userId: string): Promise<Auction[]> => {
  try {
    // BE: GET /api/auctions/createdByMe — usa currentUser del JWT
    const res = await axios.get<Paginated<AuctionDto>>(`${BASE}/createdByMe`);
    return (res.data?.data ?? []).map(mapAuction);
  } catch (error: any) {
    console.error('Error al obtener subastas del usuario:', error?.response?.status, error?.response?.data ?? error?.message);
    return [];
  }
};

export const getAuctionById = async (id: string): Promise<Auction | null> => {
  try {
    const res = await axios.get<AuctionDto>(`${BASE}/${id}`);
    return mapAuction(res.data);
  } catch (error: any) {
    console.error(`Error al obtener la subasta ${id}:`, error?.response?.status, error?.response?.data ?? error?.message);
    return null;
  }
};

export const endAuction = async (auctionId: string, winnerOfferId: string): Promise<void> => {
  try {
    await axios.put(`${BASE}/${auctionId}/offers/${winnerOfferId}/best`);
  } catch (error) {
    console.error(`Error al finalizar la subasta ${auctionId}:`, error);
    throw error;
  }
};

export const cancelAuction = async (auctionId: string): Promise<void> => {
  try {
    await axios.delete(`${BASE}/${auctionId}`);
  } catch (error) {
    console.error(`Error al cancelar la subasta ${auctionId}:`, error);
    throw error;
  }
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

const OFFER_STATUS_BE_TO_FE: Record<string, 'ACTIVA' | 'SUPERADA' | 'GANADORA' | 'RECHAZADA'> = {
  PENDING: 'ACTIVA',
  ACCEPTED: 'GANADORA',
  REJECTED: 'RECHAZADA',
  CANCELLED: 'RECHAZADA',
};

export const getAuctionBidsByUserId = async (_userId: string): Promise<UserBid[]> => {
  try {
    const res = await axios.get<UserBidDtoBE[]>(`${BASE}/myOffers`);
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
  } catch (error: any) {
    console.error('Error al obtener ofertas del usuario:', error?.response?.status, error?.response?.data ?? error?.message);
    return [];
  }
};

/** BE no expone update de subasta. Pendiente endpoint. */
export const updateAuction = async (_auctionId: string, _data: { rules: AuctionRule[] }): Promise<void> => {
  return;
};

export const placeBid = async (auctionId: string, _userId: string, cardIds: string[]): Promise<void> => {
  try {
    // Agrupamos por cardId para mandar { cardId, amount } en cada item.
    const grouped = cardIds.reduce<Record<string, number>>((acc, id) => {
      acc[id] = (acc[id] ?? 0) + 1;
      return acc;
    }, {});
    const items = Object.entries(grouped).map(([cardId, amount]) => ({ cardId, amount }));
    await axios.post(`${BASE}/${auctionId}/offers`, { auctionId, items });
  } catch (e) {
    console.error('Error al realizar la oferta:', e);
    throw e;
  }
};
