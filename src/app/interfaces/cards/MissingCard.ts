export interface MissingCard {
  cardId: string;
  number: number;
  description: string;
  country: string | null;
  team: string | null;
  category: string;
}