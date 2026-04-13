import { useContext } from 'react';
import { UserContext } from './UserContext';
import { UserContextType } from './UserContextType';

export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext debe ser usado dentro de UserProvider');
  }
  return context;
};
