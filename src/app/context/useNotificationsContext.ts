import { useContext } from 'react';
import { NotificationsContext } from './NotificationsContext';

export const useNotificationsContext = () => {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotificationsContext must be used within NotificationsProvider');
  return ctx;
};
