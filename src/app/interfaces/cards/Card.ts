import { Category } from '../Category';
import { CardType } from '../CardType';

export interface Card {
    id: string;
    number: number;
    type: CardType;
    description: string;
    country: string | null;
    team: string | null;
    category: Category;
    imageUrl?: string;
}