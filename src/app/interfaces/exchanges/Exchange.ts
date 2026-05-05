import { CardSnapshot } from './CardSnapshot';
import { ExchangeOrigin } from './ExchangeOrigin';
import { Feedback } from './Feedback';
import { UserSnapshot } from './UserSnapshot';

export type ExchangeStatus = 'CONCRETADO';

/**
 * Registro histórico de un intercambio concretado entre dos usuarios.
 * Convención: A = publicante / lado que cedió la card publicada;
 * B = proponente / lado que cedió las offered cards.
 */
export interface Exchange {
  id: string;
  origin: ExchangeOrigin;
  userA: UserSnapshot;
  userB: UserSnapshot;
  figuritasDeA: CardSnapshot[];
  figuritasDeB: CardSnapshot[];
  status: ExchangeStatus;
  createdAt: string;
  feedbackFromA?: Feedback | null;
  feedbackFromB?: Feedback | null;
}
