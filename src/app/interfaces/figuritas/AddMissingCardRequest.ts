import { Category } from '../Categoria';

export interface AddMissingCardRequest {
  number: number;
  player: string;
  country: string;
  team: string;
  description?: string;
  category: Category;
}
