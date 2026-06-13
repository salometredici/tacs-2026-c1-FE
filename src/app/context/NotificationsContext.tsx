import { FC, ReactNode, createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Notification } from '../interfaces/Notification';
import { PaginatedResponse, markAsRead as markAsReadApi } from '../api/NotificationsService';
import { API_CONFIG } from '../config/apiConfig';
import { useUserContext } from './useUserContext';

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  hasMoreUnread: boolean;
  refetch: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

export const NotificationsContext = createContext<NotificationsContextType | null>(null);

const PAGE_SIZE = 5;

export const NotificationsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser } = useUserContext();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasMoreUnread, setHasMoreUnread] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const refetch = useCallback(() => {
    setReloadKey(k => k + 1);
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setNotifications([]);
      setHasMoreUnread(false);
      return;
    }
    axios.get<PaginatedResponse<Notification>>(
      API_CONFIG.users.notifications(currentUser.id),
      { params: { page: 1, per_page: PAGE_SIZE, status: 'UNREAD' } },
    )
      .then(res => {
        setNotifications(res.data.data ?? []);
        setHasMoreUnread((res.data.totalPages ?? 1) > 1);
      })
      .catch(() => {
        setNotifications([]);
        setHasMoreUnread(false);
      });
  }, [currentUser?.id, reloadKey]);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Optimistic local update: marca una notificación como leída in-memory y dispara el PUT.
  // El badge del navbar refleja el cambio al instante; si el BE falla, el próximo refetch corrige.
  const markAsRead = useCallback((id: string) => {
    if (!currentUser) return;
    markAsReadApi(currentUser.id, id).catch(() => {});
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, [currentUser?.id]);

  // Optimistic local update: marca todas como leídas in-memory y dispara el PUT en paralelo.
  // Si el BE falla, el siguiente refetch corrige; trade-off aceptable por UX.
  const markAllAsRead = useCallback(() => {
    if (!currentUser) return;
    axios.put(API_CONFIG.users.notificationsRead(currentUser.id)).catch(() => {});
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setHasMoreUnread(false);
  }, [currentUser?.id]);

  return (
    <NotificationsContext.Provider value={{ notifications, unreadCount, hasMoreUnread, refetch, markAsRead, markAllAsRead }}>
      {children}
    </NotificationsContext.Provider>
  );
};
