import { FC, ReactNode, createContext, useState } from 'react';
import { AdminContextType } from './AdminContextType';

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin123';

export const AdminContext = createContext<AdminContextType | null>(null);

export const AdminProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return !!localStorage.getItem('adminToken');
  });

  const adminLogin = async (username: string, password: string): Promise<boolean> => {
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      localStorage.setItem('adminToken', 'admin-session');
      setIsAdminLoggedIn(true);
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('adminToken');
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
