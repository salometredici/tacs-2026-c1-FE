import { FC, ReactNode, createContext, useState } from 'react';
import { AdminContextType } from './AdminContextType';
import { getRoleFromToken } from '../utils/jwt';

export const AdminContext = createContext<AdminContextType | null>(null);

/**
 * Marca si la sesión actual es la de un administrador. No tiene login propio:
 * la autenticación pasa siempre por `/login`. El LoginPage, después de loguear contra el endpoint unificado, lee el `role` del JWT y llama a `setAdminLoggedIn(true)` si corresponde. Este context sirve para que `AdminRoute` decida si renderizar el panel
 */
export const AdminProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => getRoleFromToken() === 'ADMIN');

  const adminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  };

  return (
    <AdminContext.Provider value={{ isAdminLoggedIn, setAdminLoggedIn: setIsAdminLoggedIn, adminLogout }}>
      {children}
    </AdminContext.Provider>
  );
};
