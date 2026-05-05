import axios from 'axios';
import { API_CONFIG } from '../config/apiConfig';
import { Publication } from '../interfaces/publications/Publication';
import { PublicationStatus } from '../interfaces/publications/publicationTypes';
import { PublishCardRequest } from '../interfaces/exchanges/PublishCardRequest';
import { CardType } from '../interfaces/CardType';

const BASE = API_CONFIG.publications.base;

// BE PublicationStatus enum (ACTIVE/FINALIZED/CANCELLED) → FE labels (ACTIVA/...)
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

interface TradePublicationDto {
  publicationId: string;
  initialCount: number;
  remainingCount: number;
  cardNumber: number;
  status: string;
  cardDescription: string;
  cardCountry: string | null;
  cardTeam: string | null;
  cardCategory: string;
}
interface Paginated<T> { data: T[]; currentPage: number; totalPages: number }

// TradePublicationDto no expone `publisher` ni `cardId` — placeholders.
// `ownerId` viene del flujo (filtro por userId o intersección con getMyPublications).
const mapPublication = (dto: TradePublicationDto, ownerId?: string): Publication => ({
  id: dto.publicationId,
  card: {
    id: '',
    number: dto.cardNumber,
    type: 'JUGADOR' as CardType,
    description: dto.cardDescription,
    country: dto.cardCountry,
    team: dto.cardTeam,
    category: dto.cardCategory as Publication['card']['category'],
  },
  publisher: {
    id: ownerId ?? '',
    name: '',
    email: '',
    rating: null,
    exchangesAmount: 0,
    avatarId: 'avatar_1',
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
  try {
    const cleaned: Record<string, string> = {};
    if (params.name?.trim()) cleaned.name = params.name.trim();
    if (params.country?.trim()) cleaned.country = params.country.trim();
    if (params.team?.trim()) cleaned.team = params.team.trim();
    if (params.category?.trim()) cleaned.category = params.category.trim().toUpperCase();
    const response = await axios.get<Paginated<TradePublicationDto> | TradePublicationDto[]>(BASE, { params: cleaned });
    const list = Array.isArray(response.data) ? response.data : (response.data?.data ?? []);
    return list.map(p => mapPublication(p));
  } catch (error: any) {
    console.error('Error al buscar publicaciones:', error?.response?.status, error?.response?.data ?? error?.message);
    return [];
  }
};

export const getMyPublications = async (userId: string, status?: PublicationStatus): Promise<Publication[]> => {
  try {
    const params: Record<string, string> = { userId };
    if (status) params.status = STATUS_FE_TO_BE[status];
    const response = await axios.get<Paginated<TradePublicationDto> | TradePublicationDto[]>(BASE, { params });
    const list = Array.isArray(response.data) ? response.data : (response.data?.data ?? []);
    return list.map(p => mapPublication(p, userId));
  } catch (error: any) {
    console.error(
      'Error al obtener publicaciones del usuario:',
      error?.response?.status,
      error?.response?.data ?? error?.message,
    );
    return [];
  }
};

export const getPublicationById = async (id: string, asUserId?: string): Promise<Publication | null> => {
  try {
    const [pubRes, mineRes] = await Promise.all([
      axios.get<TradePublicationDto>(API_CONFIG.publications.byId(id)),
      asUserId
        ? axios.get<Paginated<TradePublicationDto>>(BASE, { params: { userId: asUserId } }).catch(() => null)
        : Promise.resolve(null),
    ]);
    const isMine = mineRes?.data.data.some(p => p.publicationId === id) ?? false;
    return mapPublication(pubRes.data, isMine ? asUserId : undefined);
  } catch (error) {
    console.error(`Error al obtener publicación ${id}:`, error);
    return null;
  }
};

export const publishFigurita = async (_userId: string, data: PublishCardRequest): Promise<void> => {
  try {
    await axios.post(BASE, { cardId: data.cardId, quantity: data.quantity });
  } catch (error) {
    console.error('Error al publicar figurita:', error);
    throw error;
  }
};

export const cancelPublication = async (id: string, _userId: string): Promise<void> => {
  try {
    await axios.delete(API_CONFIG.publications.byId(id));
  } catch (error) {
    console.error('Error al cancelar publicación:', error);
    throw error;
  }
};
