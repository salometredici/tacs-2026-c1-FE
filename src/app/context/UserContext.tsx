import { FC, ReactNode, createContext, useState } from 'react';
import { UserContextType } from './UserContextType';
import { User } from '../interfaces/auth/User';
import { clearCatalogCache } from '../api/FiguritasService';

export const UserContext = createContext<UserContextType | null>(null);

// Para descomentar cuando haga auth: eliminar MOCK_USER y restaurar la lógica de localStorage
const MOCK_USER: User = {
  id: '69e54c037de7f7e868da90f4',
  name: 'Usuario de prueba',
  email: 'test@tacs.com',
  rating: null,
  exchangesAmount: 0,
  avatarId: 'avatar_1',
  creationDate: '2026-01-01',
};

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
