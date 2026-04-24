import axios from 'axios';
import { API_CONFIG } from '../config/apiConfig';
import { User } from '../interfaces/auth/User';
import { FiguritaColeccion } from '../interfaces/figuritas/FiguritaColeccion';
import { Publication } from '../interfaces/publications/Publication';
import { getMockedSuggestions } from '../../mocks/suggestionsMock';
import { MissingCard } from '../interfaces/figuritas/MissingCard';

const BASE_URL = API_CONFIG.users.base;

export const getAll = async (): Promise<User[]> => {
  try {
    const response = await axios.get<User[]>(`${BASE_URL}`);
    return response.data;
  } catch (error) {
    console.error('Error al listar usuarios:', error);
    return [];
  }
};

export const getById = async (userId: string): Promise<User | null> => {
  try {
    const response = await axios.get<User>(`${BASE_URL}/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el usuario ${userId}:`, error);
    return null;
  }
};

export const getUserCollection = async (userId: string): Promise<FiguritaColeccion[]> => {
  try {
    const response = await axios.get<FiguritaColeccion[]>(`${BASE_URL}/${userId}/collection`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener la colección del usuario ${userId}:`, error);
    return [];
  }
};

export const addToUserCollection = async (userId: string, figuritaId: string): Promise<void> => {
  await axios.post(`${BASE_URL}/${userId}/collection`, { figuritaId });
};

export const getUserMissingCards = async (userId: string): Promise<MissingCard[]> => {
  try {
    const response = await axios.get<MissingCard[]>(`${BASE_URL}/${userId}/missing-cards`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener faltantes del usuario ${userId}:`, error);
    return [];
  }
};

export const addMissingCard = async (userId: string, figuritaId: string): Promise<MissingCard> => {
  const response = await axios.post<MissingCard>(`${BASE_URL}/${userId}/missing-cards`, { figuritaId });
  return response.data;
};

export const getUserSuggestions = async (userId: string): Promise<Publication[]> => {
  try {
    /* GET /api/users/{userId}/suggestions
    const response = await axios.get<Publication[]>(`${BASE_URL}/${userId}/suggestions`);
    return response.data; */
    return getMockedSuggestions(userId);
  } catch (error) {
    console.error(`Error al obtener sugerencias para el usuario ${userId}:`, error);
    throw error;
  }
};
