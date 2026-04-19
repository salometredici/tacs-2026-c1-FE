import { User } from '../interfaces/auth/User';

export type UserContextType = {
  currentUser: User | null;
  login: (user: User, token: string) => void;
  logout: () => void;
};
