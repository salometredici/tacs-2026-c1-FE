import axios from 'axios';
import { API_CONFIG } from '../config/apiConfig';
import { Exchange } from '../interfaces/exchanges/Exchange';
import { FeedbackRequest } from '../interfaces/exchanges/FeedbackRequest';

const BASE = API_CONFIG.exchanges.base;

interface Paginated<T> { data: T[]; currentPage: number; totalPages: number }

export const getExchangesByUserId = async (userId: string): Promise<Exchange[]> => {
  try {
    const response = await axios.get<Paginated<Exchange>>(BASE, { params: { userId } });
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener intercambios:', error);
    return [];
  }
};

export const getExchangeById = async (id: string, _asUserId?: string): Promise<Exchange | null> => {
  try {
    const response = await axios.get<Exchange>(API_CONFIG.exchanges.byId(id));
    return response.data;
  } catch (error) {
    console.error(`Error al obtener intercambio ${id}:`, error);
    return null;
  }
};

export const submitFeedback = async (exchangeId: string, data: FeedbackRequest): Promise<void> => {
  try {
    await axios.post(API_CONFIG.exchanges.feedback(exchangeId), data);
  } catch (error) {
    console.error('Error al enviar feedback:', error);
    throw error;
  }
};
