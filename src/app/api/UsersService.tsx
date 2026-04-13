import axios from 'axios';
import { API_CONFIG } from '../config/apiConfig';
import { User } from '../interfaces/User';
import { Figurita } from '../interfaces/Figurita';
import { FiguritaColeccion } from '../interfaces/FiguritaColeccion';
import { getMockedUserMissingCards, getMockedUserCollection, getMockedUsers, getMockedUser } from '../../mocks/usersMock';

const API_BASE_URL = API_CONFIG.users.base;

// Todos los users (para la vista del admin)
export const getAll = async (): Promise<User[]> => {
  try {
    // const response = await axios.get<User[]>(`${API_BASE_URL}`);
    // return response.data;
    return getMockedUsers();
  } catch (error) {
    console.error('Error al listar usuarios:', error);
    throw error;
  }
};

export const getById = async (userId: number): Promise<User> => {
  try {
    // const response = await axios.get<User>(`${API_BASE_URL}/${userId}`);
    // return response.data;
    return getMockedUser();
  } catch (error) {
    console.error(`Error al buscar usuario ${userId}:`, error);
    throw error;
  }
};

export const getUserMissingCards = async (userId: number): Promise<Figurita[]> => {
  try {
    // const response = await axios.get<Figurita[]>(`${API_BASE_URL}/${userId}/faltantes`);
    // return response.data;
    return getMockedUserMissingCards();
  } catch (error) {
    console.error(`Error al listar faltantes del usuario ${userId}:`, error);
    throw error;
  }
};

// Retorna todas las figuritas que posee el usuario
export const getUserCollection = async (userId: number): Promise<FiguritaColeccion[]> => {
  try {
    // const response = await axios.get<FiguritaColeccion[]>(`${API_BASE_URL}/${userId}/collection`);
    // return response.data;
    return getMockedUserCollection();
  } catch (error) {
    console.error(`Error al obtener las figuritas repetidas para el usuario ${userId}:`, error);
    throw error;
  }
};

export const listarRepetidas = async (userId: number): Promise<FiguritaColeccion[]> => {
  try {
    // const response = await axios.get<FiguritaColeccion[]>(`${API_BASE_URL}/${userId}/repetidas`);
    // return response.data;
    return getMockedUserCollection(); // Usamos la misma que para la general porque debería ser el mismo tipo de items, sólo que filtrados por cantidad
  } catch (error) {
    console.error(`Error al listar repetidas del usuario ${userId}:`, error);
    throw error;
  }
};