import { describe, it, expect } from 'vitest';
import { mapAuction, AuctionDto } from './AuctionsService';

const BASE_DTO: AuctionDto = {
  id: 'auction-1',
  cardId: 'ARG10',
  cardNumber: 10,
  cardDescription: 'Lionel Messi',
  cardCountry: 'Argentina',
  cardTeam: 'Inter Miami',
  cardCategory: 'LEGENDARIO',
  closeDate: '2026-06-01T18:00:00Z',
  status: 'ACTIVE',
  bestOffer: null,
  publisherUserId: 'user-42',
  publisherName: 'Carlos García',
  publisherAvatarId: 'avatar_3',
  offers: [],
  conditions: [],
};

describe('mapAuction — status mapping', () => {
  it('maps ACTIVE to ACTIVA', () => {
    expect(mapAuction({ ...BASE_DTO, status: 'ACTIVE' }).status).toBe('ACTIVA');
  });

  it('maps AWARDED to FINALIZADA', () => {
    expect(mapAuction({ ...BASE_DTO, status: 'AWARDED' }).status).toBe('FINALIZADA');
  });

  it('maps CANCELLED to CANCELADA', () => {
    expect(mapAuction({ ...BASE_DTO, status: 'CANCELLED' }).status).toBe('CANCELADA');
  });

  it('falls back to ACTIVA for unknown status', () => {
    expect(mapAuction({ ...BASE_DTO, status: 'UNKNOWN' }).status).toBe('ACTIVA');
  });
});

describe('mapAuction — card fields', () => {
  it('maps card number and description', () => {
    const { card } = mapAuction(BASE_DTO);
    expect(card.number).toBe(10);
    expect(card.description).toBe('Lionel Messi');
    expect(card.country).toBe('Argentina');
    expect(card.team).toBe('Inter Miami');
    expect(card.category).toBe('LEGENDARIO');
  });

  it('handles null card country and team', () => {
    const { card } = mapAuction({ ...BASE_DTO, cardCountry: null, cardTeam: null });
    expect(card.country).toBeNull();
    expect(card.team).toBeNull();
  });
});

describe('mapAuction — publisher fields', () => {
  it('maps publisher name and avatarId', () => {
    const { publisherId } = mapAuction(BASE_DTO);
    expect(publisherId.name).toBe('Carlos García');
    expect(publisherId.avatarId).toBe('avatar_3');
  });

  it('falls back to empty string and avatar_1 when publisher fields are null', () => {
    const { publisherId } = mapAuction({ ...BASE_DTO, publisherUserId: null, publisherName: null, publisherAvatarId: null });
    expect(publisherId.name).toBe('');
    expect(publisherId.avatarId).toBe('avatar_1');
  });
});

describe('mapAuction — conditions mapping', () => {
  it('maps MIN_REPUTATION to REPUTACION_MINIMA', () => {
    const { rules } = mapAuction({ ...BASE_DTO, conditions: [{ filterName: 'MIN_REPUTATION', quantity: 3, value: null }] });
    expect(rules).toEqual([{ type: 'REPUTACION_MINIMA', value: '3' }]);
  });

  it('maps MIN_EXCHANGES to INTERCAMBIOS_MINIMOS', () => {
    const { rules } = mapAuction({ ...BASE_DTO, conditions: [{ filterName: 'MIN_EXCHANGES', quantity: 5, value: null }] });
    expect(rules).toEqual([{ type: 'INTERCAMBIOS_MINIMOS', value: '5' }]);
  });

  it('maps MIN_CARD_COUNT to CANTIDAD_MINIMA_FIGURITAS', () => {
    const { rules } = mapAuction({ ...BASE_DTO, conditions: [{ filterName: 'MIN_CARD_COUNT', quantity: 2, value: null }] });
    expect(rules).toEqual([{ type: 'CANTIDAD_MINIMA_FIGURITAS', value: '2' }]);
  });

  it('maps MIN_CATEGORY to CATEGORIA_MINIMA using the value field', () => {
    const { rules } = mapAuction({ ...BASE_DTO, conditions: [{ filterName: 'MIN_CATEGORY', quantity: null, value: 'EPICO' }] });
    expect(rules).toEqual([{ type: 'CATEGORIA_MINIMA', value: 'EPICO' }]);
  });

  it('returns empty rules when conditions is null', () => {
    const { rules } = mapAuction({ ...BASE_DTO, conditions: null });
    expect(rules).toEqual([]);
  });

  it('maps multiple conditions correctly', () => {
    const { rules } = mapAuction({
      ...BASE_DTO,
      conditions: [
        { filterName: 'MIN_REPUTATION', quantity: 4, value: null },
        { filterName: 'MIN_CATEGORY', quantity: null, value: 'LEGENDARIO' },
      ],
    });
    expect(rules).toHaveLength(2);
    expect(rules[0]).toEqual({ type: 'REPUTACION_MINIMA', value: '4' });
    expect(rules[1]).toEqual({ type: 'CATEGORIA_MINIMA', value: 'LEGENDARIO' });
  });
});

describe('mapAuction — bidder rating and avatarId fallback', () => {
  const OFFER_BASE = {
    id: 'offer-1',
    auctionId: 'auction-1',
    bidderUserId: 'user-99',
    bidderUserName: 'Postor Test',
    offeredItems: [],
    status: 'PENDING',
    bidDate: '2026-05-01T10:00:00Z',
  };

  it('uses real bidderRating when present', () => {
    const { bids } = mapAuction({ ...BASE_DTO, offers: [{ ...OFFER_BASE, bidderRating: 4.5, bidderAvatarId: 'avatar_2' }] });
    expect(bids[0].bidder.rating).toBe(4.5);
    expect(bids[0].bidder.avatarId).toBe('avatar_2');
  });

  it('falls back to 0 and avatar_1 when bidderRating and bidderAvatarId are null', () => {
    const { bids } = mapAuction({ ...BASE_DTO, offers: [{ ...OFFER_BASE, bidderRating: null, bidderAvatarId: null }] });
    expect(bids[0].bidder.rating).toBe(0);
    expect(bids[0].bidder.avatarId).toBe('avatar_1');
  });

  it('maps offer status PENDING to ACTIVA', () => {
    const { bids } = mapAuction({ ...BASE_DTO, offers: [{ ...OFFER_BASE, bidderRating: null, bidderAvatarId: null }] });
    expect(bids[0].status).toBe('ACTIVA');
  });

  it('maps offer status ACCEPTED to GANADORA', () => {
    const { bids } = mapAuction({ ...BASE_DTO, offers: [{ ...OFFER_BASE, status: 'ACCEPTED', bidderRating: null, bidderAvatarId: null }] });
    expect(bids[0].status).toBe('GANADORA');
  });
});
