import { describe, it, expect } from 'vitest';
import { viewAs } from './exchangeView';
import type { Exchange } from '../interfaces/exchanges/Exchange';
import type { CardSnapshot } from '../interfaces/exchanges/CardSnapshot';
import type { UserSnapshot } from '../interfaces/exchanges/UserSnapshot';

const userA: UserSnapshot = { userId: 'A', name: 'Ana', avatarId: 'a1' };
const userB: UserSnapshot = { userId: 'B', name: 'Beto', avatarId: 'a2' };

const card = (cardId: string): CardSnapshot => ({
  cardId, number: 1, description: `Card ${cardId}`, country: null, team: null, category: 'COMUN',
});

const baseExchange: Exchange = {
  id: 'ex-1',
  origin: { type: 'PROPUESTA', id: 'prop-1' },
  userA, userB,
  cardsFromA: [card('A1')],
  cardsFromB: [card('B1'), card('B2')],
  status: 'CONCRETADO',
  createdAt: '2026-01-01T10:00:00Z',
  feedbackFromA: { score: 5, comment: 'genial', createdAt: '2026-01-02T10:00:00Z' },
  feedbackFromB: null,
};

describe('viewAs — desde el lado de userA', () => {
  const v = viewAs(baseExchange, 'A');

  it('identifica isUserA y me/other', () => {
    expect(v.isUserA).toBe(true);
    expect(v.me).toBe(userA);
    expect(v.other).toBe(userB);
  });

  it('mapea myCards = cardsFromA y theirCards = cardsFromB', () => {
    expect(v.myCards.map(c => c.cardId)).toEqual(['A1']);
    expect(v.theirCards.map(c => c.cardId)).toEqual(['B1', 'B2']);
  });

  it('mapea myFeedback = feedbackFromA y theirFeedback = feedbackFromB', () => {
    expect(v.myFeedback?.score).toBe(5);
    expect(v.theirFeedback).toBeNull();
  });
});

describe('viewAs — desde el lado de userB (perspectiva invertida)', () => {
  const v = viewAs(baseExchange, 'B');

  it('identifica isUserA=false y me/other invertidos', () => {
    expect(v.isUserA).toBe(false);
    expect(v.me).toBe(userB);
    expect(v.other).toBe(userA);
  });

  it('invierte las cards: myCards = cardsFromB, theirCards = cardsFromA', () => {
    expect(v.myCards.map(c => c.cardId)).toEqual(['B1', 'B2']);
    expect(v.theirCards.map(c => c.cardId)).toEqual(['A1']);
  });

  it('invierte el feedback: myFeedback = feedbackFromB (null), theirFeedback = feedbackFromA', () => {
    expect(v.myFeedback).toBeNull();
    expect(v.theirFeedback?.score).toBe(5);
  });
});

describe('viewAs — bordes', () => {
  it('cards en null caen a arrays vacíos', () => {
    const ex: Exchange = { ...baseExchange, cardsFromA: null, cardsFromB: null };
    const v = viewAs(ex, 'A');
    expect(v.myCards).toEqual([]);
    expect(v.theirCards).toEqual([]);
  });

  it('feedback undefined cae a null en ambos lados', () => {
    const ex: Exchange = { ...baseExchange, feedbackFromA: undefined, feedbackFromB: undefined };
    const v = viewAs(ex, 'A');
    expect(v.myFeedback).toBeNull();
    expect(v.theirFeedback).toBeNull();
  });
});
