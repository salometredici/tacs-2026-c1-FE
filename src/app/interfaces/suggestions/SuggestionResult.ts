/**
 * Sugerencia generada por el cron de matching del BE. Apunta a una publicación o subasta
 * concreta — desde el FE, click en una sugerencia navega a `/publications/${sourceId}`
 * o `/auctions/${sourceId}` según `sourceType`
 */
export type SuggestionSourceType = 'PUBLICATION' | 'AUCTION';

export interface SuggestionResult {
  sourceType: SuggestionSourceType;
  sourceId: string;

  cardId: string;
  cardNumber: number;
  cardDescription: string;
  cardCountry: string | null;
  cardTeam: string | null;
  cardCategory: string;

  publisherUserId: string;
  publisherName: string;
  publisherAvatarId: string;

  generatedAt: string;
}
