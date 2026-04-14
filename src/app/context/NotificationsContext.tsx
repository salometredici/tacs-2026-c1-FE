import { FC, ReactNode, createContext, useState } from 'react';
import { Notification } from '../interfaces/Notification';
import { getMockedNotifications } from '../../mocks/notificationsMock';

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  markAllAsRead: () => void;
  // enabled: boolean — reservado para el toggle de ProfilePage (US11 futuro)
  // setEnabled: (v: boolean) => void;
}

export const NotificationsContext = createContext<NotificationsContextType | null>(null);

export const NotificationsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(getMockedNotifications());

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <NotificationsContext.Provider value={{ notifications, unreadCount, markAllAsRead }}>
      {children}
    </NotificationsContext.Provider>
  );
};
