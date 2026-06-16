import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { makeProposal } from './ProposalsService';

vi.mock('axios');

const CARD_DTO = {
  number: 10,
  player: 'Messi',
  country: 'Argentina',
  team: null,
  description: 'Lionel Messi',
  category: 'LEGENDARIO',
};

const PROPOSER_DTO = {
  id: 'user-1',
  name: 'Juan',
  email: 'j@x.com',
  rating: 4.0,
  exchangesAmount: 5,
  avatarId: 'avatar_2',
  creationDate: '2025-01-01',
};

const BASE_DTO = {
  id: 'prop-1',
  publicationId: 'pub-1',
  cardIds: ['ARG10'],
  cards: [CARD_DTO],
  requestedCount: 1,
  proposer: PROPOSER_DTO,
  status: 'PENDING',
  creationDate: '2026-01-01T10:00:00Z',
};

function mockPost(dto: object) {
  (axios.post as ReturnType<typeof vi.fn>).mockResolvedValue({ data: { data: dto } });
}

beforeEach(() => { vi.clearAllMocks(); });

describe('makeProposal — status mapping', () => {
  it.each([
    ['PENDING', 'PENDIENTE'],
    ['ACCEPTED', 'ACEPTADA'],
    ['REJECTED', 'RECHAZADA'],
    ['CANCELLED', 'CANCELADA'],
  ])('BE %s → FE %s', async (be, fe) => {
    mockPost({ ...BASE_DTO, status: be });
    expect((await makeProposal('pub-1', 'user-1', ['ARG10'], 1)).status).toBe(fe);
  });

  it('falls back to PENDIENTE for unknown status', async () => {
    mockPost({ ...BASE_DTO, status: 'UNKNOWN' });
    expect((await makeProposal('pub-1', 'user-1', ['ARG10'], 1)).status).toBe('PENDIENTE');
  });
});

describe('makeProposal — card mapping', () => {
  it('maps cards from cards[] when present', async () => {
    mockPost({ ...BASE_DTO, cardIds: ['ARG10', 'BRA7'], cards: [CARD_DTO, { ...CARD_DTO, number: 7, description: 'Neymar' }] });
    const { offeredCards } = await makeProposal('pub-1', 'user-1', ['ARG10', 'BRA7'], 1);
    expect(offeredCards).toHaveLength(2);
    expect(offeredCards[0].description).toBe('Lionel Messi');
    expect(offeredCards[1].description).toBe('Neymar');
  });

  it('uses stub cards when cards field is absent', async () => {
    mockPost({ ...BASE_DTO, cards: undefined });
    const { offeredCards } = await makeProposal('pub-1', 'user-1', ['ARG10'], 1);
    expect(offeredCards[0].id).toBe('ARG10');
    expect(offeredCards[0].description).toBe('—');
  });

  it('maps card fields from CardDtoBE', async () => {
    mockPost(BASE_DTO);
    const { offeredCards } = await makeProposal('pub-1', 'user-1', ['ARG10'], 1);
    expect(offeredCards[0].number).toBe(10);
    expect(offeredCards[0].country).toBe('Argentina');
    expect(offeredCards[0].category).toBe('LEGENDARIO');
  });
});

describe('makeProposal — proposer mapping', () => {
  it('maps proposer when present', async () => {
    mockPost(BASE_DTO);
    const { bidder } = await makeProposal('pub-1', 'user-1', ['ARG10'], 1);
    expect(bidder.id).toBe('user-1');
    expect(bidder.name).toBe('Juan');
    expect(bidder.rating).toBe(4.0);
    expect(bidder.avatarId).toBe('avatar_2');
  });

  it('uses stub user when proposer is absent', async () => {
    mockPost({ ...BASE_DTO, proposer: undefined });
    const { bidder } = await makeProposal('pub-1', 'user-1', ['ARG10'], 1);
    expect(bidder.id).toBe('');
    expect(bidder.name).toBe('');
  });
});

describe('makeProposal — other fields', () => {
  it('maps requestedCount and id', async () => {
    mockPost({ ...BASE_DTO, requestedCount: 3 });
    const proposal = await makeProposal('pub-1', 'user-1', ['ARG10'], 3);
    expect(proposal.id).toBe('prop-1');
    expect(proposal.requestedCount).toBe(3);
  });

  it('publication is stub when mapProposalDto receives null', async () => {
    mockPost(BASE_DTO);
    const { publication } = await makeProposal('pub-1', 'user-1', ['ARG10'], 1);
    expect(publication.id).toBe('pub-1');
  });
});
