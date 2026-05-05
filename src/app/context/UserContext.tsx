import { FC, ReactNode, createContext, useState } from 'react';
import { UserContextType } from './UserContextType';
import { User } from '../interfaces/auth/User';
import { clearCatalogCache } from '../api/CardsService';

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (user: User, token: string) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    clearCatalogCache();
  };

  const contextValue: UserContextType = {
    currentUser,
    login,
    logout,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};
