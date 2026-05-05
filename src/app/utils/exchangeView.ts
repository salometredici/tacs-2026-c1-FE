import { Exchange } from '../interfaces/exchanges/Exchange';
import { CardSnapshot } from '../interfaces/exchanges/CardSnapshot';
import { UserSnapshot } from '../interfaces/exchanges/UserSnapshot';
import { Feedback } from '../interfaces/exchanges/Feedback';

/**
 * Vista per-user de un Exchange. Resuelve "mi lado" vs "el otro" según el userId
 * del usuario logueado, sin que la UI tenga que conocer la convención A/B.
 */
export interface ExchangeView {
  isUserA: boolean;
  me: UserSnapshot;
  other: UserSnapshot;
  myCards: CardSnapshot[];
  theirCards: CardSnapshot[];
  myFeedback: Feedback | null;
  theirFeedback: Feedback | null;
}

export function viewAs(exchange: Exchange, userId: string): ExchangeView {
  const isUserA = exchange.userA.userId === userId;
  return {
    isUserA,
    me: isUserA ? exchange.userA : exchange.userB,
    other: isUserA ? exchange.userB : exchange.userA,
    myCards: isUserA ? exchange.figuritasDeA : exchange.figuritasDeB,
    theirCards: isUserA ? exchange.figuritasDeB : exchange.figuritasDeA,
    myFeedback: (isUserA ? exchange.feedbackFromA : exchange.feedbackFromB) ?? null,
    theirFeedback: (isUserA ? exchange.feedbackFromB : exchange.feedbackFromA) ?? null,
  };
}
