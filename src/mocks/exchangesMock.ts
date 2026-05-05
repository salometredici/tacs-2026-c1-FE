import { Exchange } from '../app/interfaces/exchanges/Exchange';
import { CardSnapshot } from '../app/interfaces/exchanges/CardSnapshot';
import { UserSnapshot } from '../app/interfaces/exchanges/UserSnapshot';
import { mockFiguritas } from './figuritasMock';
import { mockUsers } from './usersMock';

const cardSnap = (i: number): CardSnapshot => {
  const c = mockFiguritas[i];
  return {
    cardId: c.id,
    number: c.number,
    description: c.description,
    country: c.country ?? null,
    team: c.team ?? null,
    category: c.category,
  };
};

const userSnap = (i: number): UserSnapshot => {
  const u = mockUsers[i];
  return { userId: u.id, name: u.name, avatarId: u.avatarId };
};

// Convención: A = publicante (cedió la card publicada), B = proponente (cedió offered cards).
// El logueado es mockUsers[0] (Pepe). Para visualizar ambos lados:
// - Exchange #401: Pepe es A (publicó), recibió 2 figuritas de Mónica.
// - Exchange #402: Pepe es B (propuso), cedió 1 a Homero por #5.
// - Exchange #403: Pepe es A; ambos lados ya dejaron feedback.
export const mockExchanges: Exchange[] = [
  {
    id: '401',
    origin: { type: 'PROPUESTA', id: '13' },
    userA: userSnap(0),
    userB: userSnap(1),
    figuritasDeA: [cardSnap(3)],
    figuritasDeB: [cardSnap(5), cardSnap(7)],
    status: 'CONCRETADO',
    createdAt: '2026-03-20T14:30:00',
    feedbackFromA: null,
    feedbackFromB: null,
  },
  {
    id: '402',
    origin: { type: 'SUBASTA', id: 'auct-22' },
    userA: userSnap(2),
    userB: userSnap(0),
    figuritasDeA: [cardSnap(5)],
    figuritasDeB: [cardSnap(0), cardSnap(1)],
    status: 'CONCRETADO',
    createdAt: '2026-03-25T18:05:00',
    feedbackFromA: { score: 4, comment: 'Buen intercambio, todo en orden.', createdAt: '2026-03-26T10:00:00' },
    feedbackFromB: null,
  },
  {
    id: '403',
    origin: { type: 'PROPUESTA', id: '11' },
    userA: userSnap(0),
    userB: userSnap(1),
    figuritasDeA: [cardSnap(2)],
    figuritasDeB: [cardSnap(6)],
    status: 'CONCRETADO',
    createdAt: '2026-04-05T09:15:00',
    feedbackFromA: { score: 5, comment: '¡Genial!', createdAt: '2026-04-05T11:00:00' },
    feedbackFromB: { score: 5, createdAt: '2026-04-05T12:30:00' },
  },
];

// FE-only mientras no haya BE conectado: si el userId pedido no coincide con
// mockUsers[0] (Pepe, dueño de los mock exchanges), sustituimos el slot de Pepe
// por el userId pedido para que el usuario logueado real "se vea" en sus
// intercambios. Cuando se reemplace por el call real, el BE filtra por userId.
const PEPE_ID = mockUsers[0].id;

const swapPepeFor = (asUserId: string) => (ex: Exchange): Exchange => {
  if (ex.userA.userId === PEPE_ID) return { ...ex, userA: { ...ex.userA, userId: asUserId } };
  if (ex.userB.userId === PEPE_ID) return { ...ex, userB: { ...ex.userB, userId: asUserId } };
  return ex;
};

export const getMockedExchanges = (userId: string): Exchange[] => {
  if (!userId || userId === PEPE_ID) return mockExchanges;
  return mockExchanges.map(swapPepeFor(userId));
};

export const getMockedExchangeById = (id: string, asUserId?: string): Exchange | null => {
  const ex = mockExchanges.find(e => e.id === id);
  if (!ex) return null;
  return asUserId ? swapPepeFor(asUserId)(ex) : ex;
};
