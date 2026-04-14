import { FC, ReactNode, createContext, useState } from 'react';
import { AdminContextType } from './AdminContextType';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

export const AdminContext = createContext<AdminContextType | null>(null);

export const AdminProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const adminLogin = (username: string, password: string): boolean => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAdminLoggedIn(true);
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminLoggedIn(false);
  };

  const contextValue: AdminContextType = {
    isAdminLoggedIn,
    adminLogin,
    adminLogout,
  };

  return (
    <AdminContext.Provider value={contextValue}>
      {children}
    </AdminContext.Provider>
  );
};
