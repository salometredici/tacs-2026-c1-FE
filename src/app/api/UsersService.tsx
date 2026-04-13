import axios from 'axios';
import { API_CONFIG } from '../config/apiConfig';
import { User } from '../interfaces/User';
import { Figurita } from '../interfaces/Figurita';
import { FiguritaColeccion } from '../interfaces/FiguritaColeccion';

const API_BASE_URL = API_CONFIG.usuarios.base;

// Todos los users (para la vista del admin)
export const getAll = async (): Promise<User[]> => {
  try {
    const response = await axios.get<User[]>(`${API_BASE_URL}`);
    return response.data;
  } catch (error) {
    console.error('Error al listar usuarios:', error);
    throw error;
  }
};

export const getById = async (userId: number): Promise<User> => {
  try {
    const response = await axios.get<User>(`${API_BASE_URL}/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error al buscar usuario ${userId}:`, error);
    throw error;
  }
};

export const buscarUsuarioPorId = async (usuarioId: number): Promise<User> => {
  return getById(usuarioId);
};

export const getUserMissingCards = async (userId: number): Promise<Figurita[]> => {
  try {
    const response = await axios.get<Figurita[]>(`${API_BASE_URL}/${userId}/faltantes`);
    return response.data;
  } catch (error) {
    console.error(`Error al listar faltantes del usuario ${userId}:`, error);
    throw error;
  }
};

export const listarFaltantes = async (usuarioId: number): Promise<Figurita[]> => {
  return getUserMissingCards(usuarioId);
};

export const listarRepetidas = async (usuarioId: number): Promise<FiguritaColeccion[]> => {
  try {
    const response = await axios.get<FiguritaColeccion[]>(`${API_BASE_URL}/${usuarioId}/repetidas`);
    return response.data;
  } catch (error) {
    console.error(`Error al listar repetidas del usuario ${usuarioId}:`, error);
    throw error;
  }
};