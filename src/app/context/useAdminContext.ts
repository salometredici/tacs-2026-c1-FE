import { useContext } from 'react';
import { AdminContext } from './AdminContext';
import { AdminContextType } from './AdminContextType';

export const useAdminContext = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdminContext must be used within an AdminProvider');
  }
  return context;
};
