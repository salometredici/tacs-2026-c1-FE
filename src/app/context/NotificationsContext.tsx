import { FC, ReactNode, createContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { Notification } from '../interfaces/Notification';
import { API_CONFIG } from '../config/apiConfig';
import { useUserContext } from './useUserContext';

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  markAllAsRead: () => void;
}

export const NotificationsContext = createContext<NotificationsContextType | null>(null);

export const NotificationsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser } = useUserContext();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!currentUser) {
      setNotifications([]);
      return;
    }
    axios.get<Notification[]>(API_CONFIG.users.notifications(currentUser.id))
      .then(res => setNotifications(res.data))
      .catch(() => setNotifications([]));
  }, [currentUser?.id]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = useCallback(() => {
    if (!currentUser) return;
    axios.put(API_CONFIG.users.notificationsRead(currentUser.id)).catch(() => {});
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, [currentUser?.id]);

  return (
    <NotificationsContext.Provider value={{ notifications, unreadCount, markAllAsRead }}>
      {children}
    </NotificationsContext.Provider>
  );
};
