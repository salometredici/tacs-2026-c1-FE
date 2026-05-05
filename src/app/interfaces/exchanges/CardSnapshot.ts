/** Snapshot de una Card embebido en un Exchange. */
export interface CardSnapshot {
  cardId: string;
  number: number;
  description: string;
  country: string | null;
  team: string | null;
  category: string;
}
