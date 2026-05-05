import axios from 'axios';
import { API_CONFIG } from '../config/apiConfig';
import { Proposal } from '../interfaces/proposals/Proposal';
import { ProposalStatus } from '../interfaces/proposals/ProposalStatus';
import { Publication } from '../interfaces/publications/Publication';
import { Card } from '../interfaces/cards/Card';
import { User } from '../interfaces/auth/User';
import { CardType } from '../interfaces/CardType';
import { getPublicationById } from './PublicationsService';

const BASE = API_CONFIG.proposals.base;

const STATUS_BE_TO_FE: Record<string, ProposalStatus> = {
  PENDING: 'PENDIENTE',
  ACCEPTED: 'ACEPTADA',
  REJECTED: 'RECHAZADA',
  CANCELLED: 'CANCELADA',
};
const STATUS_FE_TO_BE: Record<ProposalStatus, string> = {
  PENDIENTE: 'PENDING',
  ACEPTADA: 'ACCEPTED',
  RECHAZADA: 'REJECTED',
  CANCELADA: 'CANCELLED',
};

interface TradeProposalDto {
  id: string;
  publicationId: string;
  cardIds: string[];
  requestedCount: number;
  proposerUserId: string;
  status: string;
  creationDate: string;
}

const stubCard = (id: string): Card => ({
  id, number: 0, type: 'JUGADOR' as CardType,
  description: '—', country: null, team: null, category: 'COMUN',
});

const stubUser = (id: string): User => ({
  id, name: '', email: '', rating: null,
  exchangesAmount: 0, avatarId: 'avatar_1', creationDate: '',
});

const stubPublication = (id: string): Publication => ({
  id, card: stubCard(''), publisher: stubUser(''),
  status: 'ACTIVA', initialCount: 0, remainingCount: 0,
});

const mapProposalDto = (dto: TradeProposalDto, pub: Publication | null): Proposal => ({
  id: dto.id,
  publication: pub ?? stubPublication(dto.publicationId),
  offeredCards: dto.cardIds.map(stubCard),  // BE devuelve solo ids; descripciones quedarán vacías
  requestedCount: dto.requestedCount,
  bidder: stubUser(dto.proposerUserId),
  status: STATUS_BE_TO_FE[dto.status] ?? 'PENDIENTE',
  creationDate: dto.creationDate,
});

const enrichProposals = async (dtos: TradeProposalDto[]): Promise<Proposal[]> => {
  // Fetch única por publicationId para no repetir requests
  const uniquePubIds = Array.from(new Set(dtos.map(d => d.publicationId)));
  const pubsById = new Map<string, Publication | null>();
  await Promise.all(uniquePubIds.map(async id => {
    pubsById.set(id, await getPublicationById(id));
  }));
  return dtos.map(d => mapProposalDto(d, pubsById.get(d.publicationId) ?? null));
};

/**
 * Lista propuestas. Pasar `publisherId` para recibidas, `bidderId` para enviadas.
 */
export const getProposals = async (publisherId: string = '', bidderId: string = '', status: string = ''): Promise<Proposal[]> => {
  try {
    const userId = publisherId || bidderId;
    if (!userId) return [];
    const role = publisherId ? 'publisher' : 'proposer';
    const params: Record<string, string> = { userId, role };
    if (status && status in STATUS_FE_TO_BE) params.status = STATUS_FE_TO_BE[status as ProposalStatus];
    const response = await axios.get<TradeProposalDto[]>(BASE, { params });
    return enrichProposals(response.data);
  } catch (error: any) {
    console.error('Error al obtener propuestas:', error?.response?.status, error?.response?.data ?? error?.message);
    return [];
  }
};

export const getProposalsByPublicationId = async (publicationId: string): Promise<Proposal[]> => {
  try {
    const response = await axios.get<TradeProposalDto[]>(BASE, { params: { publicationId } });
    return enrichProposals(response.data);
  } catch (error: any) {
    console.error(`Error al obtener propuestas de publicación ${publicationId}:`, error?.response?.status, error?.response?.data ?? error?.message);
    return [];
  }
};

export const makeProposal = async (
  publicationId: string,
  _userId: string,
  cardIds: string[],
  requestedCount: number,
): Promise<void> => {
  try {
    await axios.post(BASE, { publicationId, cardIds, requestedCount });
  } catch (error) {
    console.error('Error al realizar propuesta:', error);
    throw error;
  }
};

export const acceptProposal = async (proposalId: string, _userId: string): Promise<void> => {
  try {
    await axios.put(API_CONFIG.proposals.accept(proposalId));
  } catch (error) {
    console.error('Error al aceptar propuesta:', error);
    throw error;
  }
};

export const rejectProposal = async (proposalId: string, _userId: string): Promise<void> => {
  try {
    await axios.put(API_CONFIG.proposals.reject(proposalId));
  } catch (error) {
    console.error('Error al rechazar propuesta:', error);
    throw error;
  }
};

export const cancelProposal = async (proposalId: string, _userId: string): Promise<void> => {
  try {
    await axios.put(API_CONFIG.proposals.cancel(proposalId));
  } catch (error) {
    console.error('Error al cancelar propuesta:', error);
    throw error;
  }
};
