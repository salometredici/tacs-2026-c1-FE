import axios from 'axios';
import { API_CONFIG } from '../config/apiConfig';
import { User } from '../interfaces/auth/User';
import { CollectionCard } from '../interfaces/cards/CollectionCard';
import { MissingCard } from '../interfaces/cards/MissingCard';
import { SuggestionResult } from '../interfaces/suggestions/SuggestionResult';

const BASE_URL = API_CONFIG.users.base;

export const getAll = async (): Promise<User[]> => {
  const response = await axios.get<User[]>(`${BASE_URL}`);
  return response.data;
};

export const getById = async (userId: string): Promise<User | null> => {
  const response = await axios.get<User>(`${BASE_URL}/${userId}`);
  return response.data;
};

export const getUserCollection = async (userId: string): Promise<CollectionCard[]> => {
  const response = await axios.get<CollectionCard[]>(`${BASE_URL}/${userId}/collection`);
  return response.data;
};

export const addToUserCollection = async (userId: string, cardId: string): Promise<void> => {
  await axios.post(`${BASE_URL}/${userId}/collection`, { cardId });
};

export const getUserMissingCards = async (userId: string): Promise<MissingCard[]> => {
  const response = await axios.get<MissingCard[]>(`${BASE_URL}/${userId}/missing-cards`);
  return response.data;
};

export const addMissingCard = async (userId: string, cardId: string): Promise<MissingCard> => {
  const response = await axios.post<MissingCard>(`${BASE_URL}/${userId}/missing-cards`, { cardId });
  return response.data;
};

export const removeMissingCard = async (userId: string, cardId: string): Promise<void> => {
  await axios.delete(`${BASE_URL}/${userId}/missing-cards/${cardId}`);
};

export const getUserSuggestions = async (userId: string): Promise<SuggestionResult[]> => {
  const response = await axios.get<SuggestionResult[]>(`${BASE_URL}/${userId}/suggestions`);
  return response.data;
};
