import { describe, it, expect } from 'vitest';
import { mapPublication, TradePublicationDto } from './PublicationsService';

const BASE: TradePublicationDto = {
  id: 'pub-1',
  cardId: 'ARG10',
  initialCount: 5,
  remainingCount: 3,
  cardNumber: 10,
  status: 'ACTIVE',
  cardDescription: 'Lionel Messi',
  cardCountry: 'Argentina',
  cardTeam: 'Inter Miami',
  cardCategory: 'LEGENDARIO',
  publisherUserId: 'user-42',
  publisherName: 'Carlos García',
  publisherAvatarId: 'avatar_3',
};

describe('mapPublication — status', () => {
  it.each([
    ['ACTIVE', 'ACTIVA'],
    ['FINALIZED', 'FINALIZADA'],
    ['CANCELLED', 'CANCELADA'],
  ])('maps %s → %s', (be, fe) => {
    expect(mapPublication({ ...BASE, status: be }).status).toBe(fe);
  });

  it('falls back to ACTIVA for unknown status', () => {
    expect(mapPublication({ ...BASE, status: 'UNKNOWN' }).status).toBe('ACTIVA');
  });
});

describe('mapPublication — card fields', () => {
  it('maps id, number, description, country, team, category', () => {
    const { card } = mapPublication(BASE);
    expect(card.id).toBe('ARG10');
    expect(card.number).toBe(10);
    expect(card.description).toBe('Lionel Messi');
    expect(card.country).toBe('Argentina');
    expect(card.team).toBe('Inter Miami');
    expect(card.category).toBe('LEGENDARIO');
  });

  it('passes null country and team through', () => {
    const { card } = mapPublication({ ...BASE, cardCountry: null, cardTeam: null });
    expect(card.country).toBeNull();
    expect(card.team).toBeNull();
  });
});

describe('mapPublication — publisher', () => {
  it('maps id, name, avatarId; zeroes email and rating', () => {
    const { publisher } = mapPublication(BASE);
    expect(publisher.id).toBe('user-42');
    expect(publisher.name).toBe('Carlos García');
    expect(publisher.avatarId).toBe('avatar_3');
    expect(publisher.email).toBe('');
    expect(publisher.rating).toBeNull();
  });

  it('falls back to empty strings and avatar_1 when publisher fields are null', () => {
    const { publisher } = mapPublication({
      ...BASE,
      publisherUserId: null,
      publisherName: null,
      publisherAvatarId: null,
    });
    expect(publisher.id).toBe('');
    expect(publisher.name).toBe('');
    expect(publisher.avatarId).toBe('avatar_1');
  });
});

describe('mapPublication — counts', () => {
  it('preserves initialCount and remainingCount', () => {
    const pub = mapPublication(BASE);
    expect(pub.initialCount).toBe(5);
    expect(pub.remainingCount).toBe(3);
  });
});
