import { FC, ReactNode, createContext, useCallback, useState } from 'react';
import { UserContextType } from './UserContextType';
import { User } from '../interfaces/auth/User';
import { clearCatalogCache } from '../api/CardsService';
import { logout as logoutOnBackend } from '../api/AuthService';
import { getById } from '../api/UsersService';

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
    // Revoca la sesión en el BACK (best-effort: lee el token antes de que lo borremos).
    logoutOnBackend();
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    clearCatalogCache();
  };

  // Refetchea el user actual desde el BE y reemplaza el del context + localStorage.
  // Llamar tras acciones que cambian rating o exchangesAmount (aceptar propuesta/oferta, feedback).
  const refreshCurrentUser = useCallback(async () => {
    if (!currentUser) return;
    try {
      const fresh = await getById(currentUser.id);
      if (!fresh) return;
      setCurrentUser(fresh);
      localStorage.setItem('currentUser', JSON.stringify(fresh));
    } catch {
      // silencioso: si falla, el FE sigue usando el currentUser stale (no rompe el flow del intercambio)
    }
  }, [currentUser]);

  const contextValue: UserContextType = {
    currentUser,
    login,
    logout,
    refreshCurrentUser,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};
