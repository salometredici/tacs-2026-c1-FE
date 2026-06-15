import axios from 'axios';
import { API_CONFIG } from '../config/apiConfig';
import { Proposal } from '../interfaces/proposals/Proposal';
import { ProposalStatus } from '../interfaces/proposals/ProposalStatus';
import { Publication } from '../interfaces/publications/Publication';
import { Card } from '../interfaces/cards/Card';
import { User } from '../interfaces/auth/User';
import { CardType } from '../interfaces/CardType';
import { CreatedResponse } from '../interfaces/common/CreatedResponse';
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

interface CardDtoBE {
  number: number;
  player: string;
  country: string | null;
  team: string | null;
  description: string;
  category: string;
}

interface UserDtoBE {
  id: string;
  name: string;
  email: string;
  rating: number | null;
  exchangesAmount: number;
  avatarId: string;
  creationDate: string;
}

interface TradeProposalDto {
  id: string;
  publicationId: string;
  cardIds: string[];
  // El BE devuelve la info completa de cada card en paralelo a cardIds (cards[i] corresponde a cardIds[i])
  cards?: CardDtoBE[];
  requestedCount: number;
  proposer?: UserDtoBE;
  status: string;
  creationDate: string;
}

const stubCard = (id: string): Card => ({
  id, number: 0, type: 'JUGADOR' as CardType,
  description: '—', country: null, team: null, category: 'COMUN',
});

const mapCardDtoBE = (id: string, dto: CardDtoBE): Card => ({
  id,
  number: dto.number,
  type: 'JUGADOR' as CardType,
  description: dto.description,
  country: dto.country,
  team: dto.team,
  category: dto.category as Card['category'],
});

const stubUser = (id: string): User => ({
  id, name: '', email: '', rating: null,
  exchangesAmount: 0, avatarId: 'avatar_1', creationDate: '',
});

const mapUserDtoBE = (dto: UserDtoBE): User => ({
  id: dto.id,
  name: dto.name,
  email: dto.email,
  rating: dto.rating,
  exchangesAmount: dto.exchangesAmount,
  avatarId: dto.avatarId as User['avatarId'],
  creationDate: dto.creationDate,
});

const stubPublication = (id: string): Publication => ({
  id, card: stubCard(''), publisher: stubUser(''),
  status: 'ACTIVA', initialCount: 0, remainingCount: 0,
});

const mapProposalDto = (dto: TradeProposalDto, pub: Publication | null): Proposal => ({
  id: dto.id,
  publication: pub ?? stubPublication(dto.publicationId),
  offeredCards: dto.cards
    ? dto.cards.map((c, i) => mapCardDtoBE(dto.cardIds[i] ?? '', c))
    : dto.cardIds.map(stubCard),
  requestedCount: dto.requestedCount,
  bidder: dto.proposer ? mapUserDtoBE(dto.proposer) : stubUser(''),
  status: STATUS_BE_TO_FE[dto.status] ?? 'PENDIENTE',
  creationDate: dto.creationDate,
});

const enrichProposals = async (dtos: TradeProposalDto[]): Promise<Proposal[]> => {
  const uniquePubIds = Array.from(new Set(dtos.map(d => d.publicationId)));
  const pubsById = new Map<string, Publication | null>();
  // allSettled (no all): si una publication falla (404, 5xx transitorio, etc.) las demás siguen
  // resolviéndose y las proposals huérfanas caen al fallback `stubPublication` del mapper.
  const results = await Promise.allSettled(uniquePubIds.map(id => getPublicationById(id)));
  uniquePubIds.forEach((id, idx) => {
    const r = results[idx];
    pubsById.set(id, r.status === 'fulfilled' ? r.value : null);
  });
  return dtos.map(d => mapProposalDto(d, pubsById.get(d.publicationId) ?? null));
};

export const getProposals = async (publisherId: string = '', bidderId: string = '', status: string = ''): Promise<Proposal[]> => {
  const userId = publisherId || bidderId;
  if (!userId) return [];
  const role = publisherId ? 'publisher' : 'proposer';
  const params: Record<string, string> = { userId, role };
  if (status && status in STATUS_FE_TO_BE) params.status = STATUS_FE_TO_BE[status as ProposalStatus];
  const response = await axios.get<TradeProposalDto[]>(BASE, { params });
  return enrichProposals(response.data);
};

export const getProposalsByPublicationId = async (publicationId: string): Promise<Proposal[]> => {
  const response = await axios.get<TradeProposalDto[]>(BASE, { params: { publicationId } });
  return enrichProposals(response.data);
};

export const makeProposal = async (
  publicationId: string,
  _userId: string,
  cardIds: string[],
  requestedCount: number,
): Promise<Proposal> => {
  const res = await axios.post<CreatedResponse<TradeProposalDto>>(BASE, { publicationId, cardIds, requestedCount });
  return mapProposalDto(res.data.data, null);
};

export const acceptProposal = async (proposalId: string, _userId: string): Promise<void> => {
  await axios.put(API_CONFIG.proposals.accept(proposalId));
};

export const rejectProposal = async (proposalId: string, _userId: string): Promise<void> => {
  await axios.put(API_CONFIG.proposals.reject(proposalId));
};

export const cancelProposal = async (proposalId: string, _userId: string): Promise<void> => {
  await axios.put(API_CONFIG.proposals.cancel(proposalId));
};
