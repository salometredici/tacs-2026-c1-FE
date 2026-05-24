import axios from 'axios';
import { API_CONFIG } from '../config/apiConfig';
import { Exchange } from '../interfaces/exchanges/Exchange';
import { FeedbackRequest } from '../interfaces/exchanges/FeedbackRequest';

const BASE = API_CONFIG.exchanges.base;

interface Paginated<T> { data: T[]; currentPage: number; totalPages: number }

export const getExchangesByUserId = async (userId: string): Promise<Exchange[]> => {
  const response = await axios.get<Paginated<Exchange>>(BASE, { params: { userId } });
  return response.data.data;
};

export const getExchangeById = async (id: string, _asUserId?: string): Promise<Exchange | null> => {
  const response = await axios.get<Exchange>(API_CONFIG.exchanges.byId(id));
  return response.data;
};

export const submitFeedback = async (exchangeId: string, data: FeedbackRequest): Promise<void> => {
  await axios.post(API_CONFIG.exchanges.feedback(exchangeId), data);
};
