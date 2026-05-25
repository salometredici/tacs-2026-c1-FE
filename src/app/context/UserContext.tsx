import { FC, ReactNode, createContext, useState } from 'react';
import { UserContextType } from './UserContextType';
import { User } from '../interfaces/auth/User';
import { clearCatalogCache } from '../api/CardsService';

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('currentUser');
    // localStorage puede devolver el string literal "undefined"/"null" si algún login viejo persistió un user vacío (JSON.stringify(undefined) === "undefined")
    if (!saved || saved === 'undefined' || saved === 'null') return null;
    try {
      return JSON.parse(saved);
    } catch {
      localStorage.removeItem('currentUser');
      return null;
    }
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
