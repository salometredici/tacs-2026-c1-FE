import axios from 'axios';
import { API_CONFIG } from '../config/apiConfig';
import { Notification } from '../interfaces/Notification';

export interface PaginatedResponse<T> {
  data: T[];
  currentPage: number;
  totalPages: number;
}

export const getNotifications = async (
  userId: string,
  page: number = 1,
  perPage: number = 5,
  status: 'UNREAD' | 'READ' = 'UNREAD',
): Promise<PaginatedResponse<Notification>> => {
  const params: Record<string, string | number> = { page, per_page: perPage, status };
  const response = await axios.get<PaginatedResponse<Notification>>(
    API_CONFIG.users.notifications(userId),
    { params },
  );
  return response.data;
};

export const markAllAsRead = async (userId: string): Promise<void> => {
  await axios.put(API_CONFIG.users.notificationsRead(userId));
};

export const markAsRead = async (userId: string, notificationId: string): Promise<void> => {
  await axios.put(`${API_CONFIG.users.notifications(userId)}/${notificationId}/read`);
};
