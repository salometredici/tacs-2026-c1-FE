import axios from 'axios';
import { API_CONFIG } from '../config/apiConfig';
import { Publication } from '../interfaces/publications/Publication';
import { PublicationStatus } from '../interfaces/publications/publicationTypes';
import { PublishCardRequest } from '../interfaces/exchanges/PublishCardRequest';
import { CreatedResponse } from '../interfaces/common/CreatedResponse';
import { CardType } from '../interfaces/CardType';

const BASE = API_CONFIG.publications.base;

const STATUS_BE_TO_FE: Record<string, PublicationStatus> = {
  ACTIVE: 'ACTIVA',
  FINALIZED: 'FINALIZADA',
  CANCELLED: 'CANCELADA',
};
const STATUS_FE_TO_BE: Record<PublicationStatus, string> = {
  ACTIVA: 'ACTIVE',
  FINALIZADA: 'FINALIZED',
  CANCELADA: 'CANCELLED',
};

export interface TradePublicationDto {
  id: string;
  cardId: string;
  initialCount: number;
  remainingCount: number;
  cardNumber: number;
  status: string;
  cardDescription: string;
  cardCountry: string | null;
  cardTeam: string | null;
  cardCategory: string;
  publisherUserId: string | null;
  publisherName: string | null;
  publisherAvatarId: string | null;
}
interface Paginated<T> { data: T[]; currentPage: number; totalPages: number }

export const mapPublication = (dto: TradePublicationDto): Publication => ({
  id: dto.id,
  card: {
    id: dto.cardId,
    number: dto.cardNumber,
    type: 'JUGADOR' as CardType,
    description: dto.cardDescription,
    country: dto.cardCountry,
    team: dto.cardTeam,
    category: dto.cardCategory as Publication['card']['category'],
  },
  publisher: {
    id: dto.publisherUserId ?? '',
    name: dto.publisherName ?? '',
    email: '',
    rating: null,
    exchangesAmount: 0,
    avatarId: (dto.publisherAvatarId as Publication['publisher']['avatarId']) ?? 'avatar_1',
    creationDate: '',
  },
  status: STATUS_BE_TO_FE[dto.status] ?? 'ACTIVA',
  initialCount: dto.initialCount,
  remainingCount: dto.remainingCount,
});

export interface SearchPublicationsParams {
  name?: string;
  country?: string;
  team?: string;
  category?: string;
}

export const searchActivePublications = async (params: SearchPublicationsParams): Promise<Publication[]> => {
  const cleaned: Record<string, string> = {};
  if (params.name?.trim()) cleaned.name = params.name.trim();
  if (params.country?.trim()) cleaned.country = params.country.trim();
  if (params.team?.trim()) cleaned.team = params.team.trim();
  if (params.category?.trim()) cleaned.category = params.category.trim().toUpperCase();
  const response = await axios.get<Paginated<TradePublicationDto> | TradePublicationDto[]>(BASE, { params: cleaned });
  const list = Array.isArray(response.data) ? response.data : (response.data?.data ?? []);
  return list.map(p => mapPublication(p));
};

export const getMyPublications = async (userId: string, status?: PublicationStatus): Promise<Publication[]> => {
  const params: Record<string, string> = { userId };
  if (status) params.status = STATUS_FE_TO_BE[status];
  const response = await axios.get<Paginated<TradePublicationDto> | TradePublicationDto[]>(BASE, { params });
  const list = Array.isArray(response.data) ? response.data : (response.data?.data ?? []);
  return list.map(mapPublication);
};

export const getPublicationById = async (id: string, _asUserId?: string): Promise<Publication | null> => {
  const res = await axios.get<TradePublicationDto>(API_CONFIG.publications.byId(id));
  return mapPublication(res.data);
};

export const publishFigurita = async (_userId: string, data: PublishCardRequest): Promise<Publication> => {
  const res = await axios.post<CreatedResponse<TradePublicationDto>>(BASE, { cardId: data.cardId, quantity: data.quantity });
  return mapPublication(res.data.data);
};

export const cancelPublication = async (id: string, _userId: string): Promise<void> => {
  await axios.delete(API_CONFIG.publications.byId(id));
};
