import { FC, ReactNode, createContext, useState } from 'react';
import { AdminContextType } from './AdminContextType';
import { logout as logoutOnBackend } from '../api/AuthService';

export const AdminContext = createContext<AdminContextType | null>(null);

// Lee el role del usuario persistido en localStorage (lo guarda el UserContext al loguear).
// Reemplaza el decode del JWT: el BE ahora expone `role` en el UserDto.
const isPersistedAdmin = (): boolean => {
  try {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved).role === 'ADMIN' : false;
  } catch {
    return false;
  }
};

/**
 * Marca si la sesión actual es la de un administrador. No tiene login propio:
 * la autenticación pasa siempre por `/login`. El LoginPage, después de loguear contra el endpoint unificado, lee el `role` del usuario y llama a `setAdminLoggedIn(true)` si corresponde. Este context sirve para que `AdminRoute` decida si renderizar el panel
 */
export const AdminProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(isPersistedAdmin);

  const adminLogout = () => {
    logoutOnBackend(); // revoca la sesión en el back antes de limpiar el storage
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
