import axios from 'axios';
import { FC, ReactNode, createContext, useState } from 'react';
import { AdminContextType } from './AdminContextType';
import { API_CONFIG } from '../config/apiConfig';

export const AdminContext = createContext<AdminContextType | null>(null);

export const AdminProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return !!localStorage.getItem('adminToken');
  });

  // Para descomentar cuando el backend tenga el endpoint de admin
  const adminLogin = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post(API_CONFIG.auth.adminLogin, { username, password });
      const { token } = response.data;
      localStorage.setItem('adminToken', token);
      setIsAdminLoggedIn(true);
      return true;
    } catch {
      return false;
    }
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
