import { FC, ReactNode, createContext } from 'react';
import { Notification } from '../interfaces/Notification';
import { getNotifications, markAllAsRead as apiMarkAllAsRead, PaginatedResponse } from '../api/NotificationsService';
import { useUserContext } from './useUserContext';
import { useFetch } from '../hooks/useFetch';

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  hasMoreUnread: boolean;
  refetch: () => void;
  markAllAsRead: () => void;
}

export const NotificationsContext = createContext<NotificationsContextType | null>(null);

export const NotificationsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser } = useUserContext();
  const userId = currentUser?.id;

  const fetchNotifications = async (): Promise<PaginatedResponse<Notification>> => {
    if (!userId) return { data: [], currentPage: 1, totalPages: 1 };
    return getNotifications(userId, 1, 5, 'UNREAD');
  };

  const { data, refetch } = useFetch(fetchNotifications, [userId]);

  const notifications = data?.data ?? [];
  const hasMoreUnread = (data?.totalPages ?? 1) > 1;
  const unreadCount = hasMoreUnread ? 5 : notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    if (!userId) return;
    apiMarkAllAsRead(userId).then(() => refetch()).catch(() => {});
  };

  return (
    <NotificationsContext.Provider value={{ notifications, unreadCount, hasMoreUnread, refetch, markAllAsRead }}>
      {children}
    </NotificationsContext.Provider>
  );
};
