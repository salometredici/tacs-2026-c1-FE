import axios from 'axios';
import { API_CONFIG } from '../config/apiConfig';
import { User } from '../interfaces/auth/User';
import { FiguritaColeccion } from '../interfaces/figuritas/FiguritaColeccion';
import { Publicacion } from '../interfaces/publicaciones/Publicacion';
import { getMockedSugerencias } from '../../mocks/sugerenciasMock';
import { MissingCard } from '../interfaces/figuritas/MissingCard';

const BASE_URL = API_CONFIG.users.base;

// Puede ser útil en la vista del administrador, el usuario no va a necesitar info de otros usuarios
export const getAll = async (): Promise<User[]> => {
  try {
    const response = await axios.get<User[]>(`${BASE_URL}`);
    return response.data;
  } catch (error) {
    console.error('Error al listar los usuarios: ', error);
    return [];
  }
};

// Para obtener un usuario por id (para el perfil)
export const getById = async (userId: string): Promise<User | null> => {
  try {
    const response = await axios.get<User>(`${BASE_URL}/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error al buscar usuario ${userId}:`, error);
    return null;
  }
};

/* Funciones para obtener items del usuario logueado (exclusivas del perfil, no se acceden desde otro lado) */

// Para obtener las figuritas que el usuario posee (desde el perfil)
export const getUserCollection = async (userId: string): Promise<FiguritaColeccion[]> => {
  try {
    const response = await axios.get<FiguritaColeccion[]>(`${BASE_URL}/${userId}/collection`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener colección del usuario ${userId}:`, error);
    return [];
  }
};

// Para agregar una figurita del catálogo a la colección del usuario
export const addToUserCollection = async (userId: string, figuritaId: string): Promise<void> => {
  await axios.post(`${BASE_URL}/${userId}/collection`, { figuritaId });
};

// Para obtener las figuritas faltantes asociadas al usuario (desde el tab en su perfil)
export const getUserMissingCards = async (userId: string): Promise<MissingCard[]> => {
  try {
    const response = await axios.get<MissingCard[]>(`${BASE_URL}/${userId}/missing-cards`);
    return response.data;
  } catch (error) {
    console.error(`Error al listar faltantes del usuario ${userId}:`, error);
    return [];
  }
};

// Para agregar una figurita a los faltantes del usuario
export const addMissingCard = async (userId: string, figuritaId: string): Promise<MissingCard> => {
  const response = await axios.post<MissingCard>(`${BASE_URL}/${userId}/missing-cards`, { figuritaId });
  return response.data;
};

// Para obtener las sugerencias en el home basadas en los intereses del usuario (suscripciones, faltantes, etc)
export const getUserSuggestions = async (userId: string): Promise<Publicacion[]> => {
  try {
  // El backend resuelve los IDs internamente y devuelve las publicaciones/subastas completas
  // TODO: descomentar cuando GeneradorSugerencias y PublicacionesService estén migrados
  // const response = await axios.get<Publicacion[]>(`${BASE_URL}/${userId}/suggestions`);
    return getMockedSugerencias(userId);
  } catch (error) {
    console.error(`Error al obtener sugerencias para el usuario ${userId}:`, error);
    throw error;
  }
};
