import { User } from '../interfaces/User';

export type UserContextType = {
  currentUser: User | null;
  login: (user: User) => void;
  logout: () => void;
};
