import axios from 'axios';
import { API_CONFIG } from '../config/apiConfig';
import { User } from '../interfaces/auth/User';
import { Figurita } from '../interfaces/Figurita';
import { FiguritaColeccion } from '../interfaces/FiguritaColeccion';
import { Proposal } from '../interfaces/proposals/Proposal';
import { Publicacion } from '../interfaces/publicaciones/Publicacion';
import { getMockedUserMissingCards, getMockedUserCollection, getMockedUsers, getMockedUser } from '../../mocks/usersMock';
import { getMockedReceivedProposals, getMockedSentProposals } from '../../mocks/proposalsMock';
import { getMockedSugerencias } from '../../mocks/sugerenciasMock';

const BASE_URL = API_CONFIG.users.base;

// Puede ser útil en la vista del administrador, el usuario no va a necesitar info de otros usuarios
export const getAll = async (): Promise<User[]> => {
  try {
    /* En backend: GET /api/users
    const response = await axios.get<User[]>(`${BASE_URL}`);
    return response.data; */
    return getMockedUsers();
  } catch (error) {
    console.error('Error al listar los usuarios: ', error);
    return [];
  }
};

// Para obtener un usuario por id (para el perfil)
export const getById = async (userId: string): Promise<User | null> => {
  try {
    /* En backend: GET /api/users/{id}
    const response = await axios.get<User>(`${BASE_URL}/${userId}`);
    return response.data; */
    return getMockedUser();
  } catch (error) {
    console.error(`Error al buscar usuario ${userId}:`, error);
    return null;
  }
};

/* Funciones para obtener items del usuario logueado (exclusivas del perfil, no se acceden desde otro lado) */

// Para obtener las figuritas que el usuario posee (desde el perfil)
export const getUserCollection = async (userId: string): Promise<FiguritaColeccion[]> => {
  try {
    /* En backend: GET /api/users/{id}/collection
    const response = await axios.get<FiguritaColeccion[]>(`${BASE_URL}/${userId}/collection`);
    return response.data; */
    return getMockedUserCollection();
  } catch (error) {
    console.error(`Error al obtener colección del usuario ${userId}:`, error);
    return [];
  }
};

// Para obtener las figuritas faltantes asociadas al usuario (desde el tab en su perfil)
export const getUserMissingCards = async (userId: string): Promise<Figurita[]> => {
  try {
    /* En backend: GET /api/users/{id}/missing-cards
    const response = await axios.get<Figurita[]>(`${BASE_URL}/${userId}/missing-cards`);
    return response.data; */
    return getMockedUserMissingCards();
  } catch (error) {
    console.error(`Error al listar faltantes del usuario ${userId}:`, error);
    return [];
  }
};

// Para obtener las sugerencias en el home basadas en los intereses del usuario (suscripciones, faltantes, etc)
export const getUserSuggestions = async (userId: string): Promise<Publicacion[]> => {
  try {
    // const response = await axios.get<PublicacionIntercambio[]>(`${BASE_URL}/${userId}/sugerencias`);
    // return response.data;
    return getMockedSugerencias(userId);
  } catch (error) {
    console.error(`Error al obtener sugerencias para el usuario ${userId}:`, error);
    throw error;
  }
};
