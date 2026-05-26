import { MissingCard } from '../cards/MissingCard';

export interface Suggestion {
  suggestedUserId: string;
  suggestedUserName: string;
  suggestedUserAvatarId: string;
  suggestedUserRating: number;
  obtainableCards: MissingCard[];
}
