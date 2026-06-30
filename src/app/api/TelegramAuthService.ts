import axios from 'axios';
import { getTelegram } from '../utils/telegram';

const BOT_BASE_URL = import.meta.env.VITE_BOT_BASE_URL || 'http://localhost:8081';

// Instancia propia SIN los interceptores globales: un 401 del bot NO debe
// borrar el token del backend ni redirigir a /login.
const botClient = axios.create({ baseURL: BOT_BASE_URL });

export type VerifyResponse = { linked: boolean; token: string | null; userId: string | null };

export const verifyTelegramSession = async (): Promise<VerifyResponse> => {
  const initData = getTelegram()?.initData ?? '';
  const { data } = await botClient.post<VerifyResponse>('/tma/verify', { initData });
  return data;
};

export const linkTelegramSession = async (token: string, userId: string): Promise<void> => {
  const initData = getTelegram()?.initData ?? '';
  await botClient.post('/tma/link', { initData, token, userId });
};
