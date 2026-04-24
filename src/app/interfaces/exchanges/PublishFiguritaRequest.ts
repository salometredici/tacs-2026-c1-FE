import { Category } from '../Categoria';
import { ParticipationType } from '../publications/publicationTypes';

export interface PublishFiguritaRequest {
  number: number;
  player: string;
  country: string;
  team: string;
  description?: string;
  category: Category;
  quantity: number;
  participationType: ParticipationType;
}
