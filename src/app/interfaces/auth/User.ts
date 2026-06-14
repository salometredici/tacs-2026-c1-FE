export interface User {
  id: string;
  name: string;
  email: string;
  role?: 'USER' | 'ADMIN';
  rating: number | null;
  exchangesAmount: number;
  avatarId: 'avatar_1' | 'avatar_2' | 'avatar_3' | 'avatar_4' | 'avatar_5';
  creationDate: string;
}
