import axios from 'axios';
import { API_CONFIG } from '../config/apiConfig';
import { User } from '../interfaces/User';
import { Figurita } from '../interfaces/Figurita';
import { FiguritaColeccion } from '../interfaces/FiguritaColeccion';
import { Propuesta } from '../interfaces/proposals/Propuesta';
import { PublicacionIntercambio } from '../interfaces/proposals/PublicacionIntercambio';
import { getMockedUserMissingCards, getMockedUserCollection, getMockedUsers, getMockedUser } from '../../mocks/usersMock';
import { getMockedReceivedProposals, getMockedSentProposals } from '../../mocks/proposalsMock';
import { getMockedSugerencias } from '../../mocks/sugerenciasMock';

// NOTA: UsuariosController está vacío en backend. Todos estos endpoints están pendientes de implementar.
// La ruta base /api/usuarios tampoco está registrada aún.

const BASE = API_CONFIG.users.base;

export const getAll = async (): Promise<User[]> => {
  try {
    /* En backend: ResponseEntity<List<UsuarioDTO>> — GET /api/users
     * NOTA: endpoint no existe aún.
    const response = await axios.get<User[]>(`${BASE}`);
    return response.data; */
    return getMockedUsers();
  } catch (error) {
    console.error('Error al listar usuarios:', error);
    return [];
  }
};

export const getById = async (userId: number): Promise<User | null> => {
  try {
    /* En backend: ResponseEntity<UsuarioDTO> — GET /api/users/{id}
     * NOTA: endpoint no existe aún.
    const response = await axios.get<User>(`${BASE}/${userId}`);
    return response.data; */
    return getMockedUser();
  } catch (error) {
    console.error(`Error al buscar usuario ${userId}:`, error);
    return null;
  }
};

export const getUserMissingCards = async (userId: number): Promise<Figurita[]> => {
  try {
    /* En backend: ResponseEntity<List<FiguritaDTO>> — GET /api/users/{id}/missing-cards
     * NOTA: endpoint no existe aún. Backend tiene la entidad faltantes en Usuario.
    const response = await axios.get<Figurita[]>(`${BASE}/${userId}/missing-cards`);
    return response.data; */
    return getMockedUserMissingCards();
  } catch (error) {
    console.error(`Error al listar faltantes del usuario ${userId}:`, error);
    return [];
  }
};

export const getUserCollection = async (userId: number): Promise<FiguritaColeccion[]> => {
  try {
    /* En backend: ResponseEntity<List<FiguritaColeccionDTO>> — GET /api/users/{id}/collection
     * NOTA: endpoint no existe aún. Backend tiene repetidas en Usuario.
    const response = await axios.get<FiguritaColeccion[]>(`${BASE}/${userId}/collection`);
    return response.data; */
    return getMockedUserCollection();
  } catch (error) {
    console.error(`Error al obtener colección del usuario ${userId}:`, error);
    return [];
  }
};

export const listarRepetidas = async (userId: number): Promise<FiguritaColeccion[]> => {
  try {
    /* En backend: ResponseEntity<List<FiguritaColeccionDTO>> — GET /api/users/{id}/repeated-cards
     * NOTA: endpoint no existe aún.
    const response = await axios.get<FiguritaColeccion[]>(`${BASE}/${userId}/repeated-cards`);
    return response.data; */
    return getMockedUserCollection();
  } catch (error) {
    console.error(`Error al listar repetidas del usuario ${userId}:`, error);
    return [];
  }
};

export const getReceivedProposals = async (userId: number): Promise<Propuesta[]> => {
  try {
    /* En backend: ResponseEntity<List<PropuestaDTO>> — GET /api/users/{id}/proposals/received
     * NOTA: endpoint no existe aún.
    const response = await axios.get<Propuesta[]>(`${BASE}/${userId}/proposals/received`);
    return response.data; */
    return getMockedReceivedProposals(userId);
  } catch (error) {
    console.error(`Error al obtener propuestas recibidas del usuario ${userId}:`, error);
    return [];
  }
};

export const getSentProposals = async (userId: number): Promise<Propuesta[]> => {
  try {
    /* En backend: ResponseEntity<List<PropuestaDTO>> — GET /api/users/{id}/proposals/sent
     * NOTA: endpoint no existe aún.
    const response = await axios.get<Propuesta[]>(`${BASE}/${userId}/proposals/sent`);
    return response.data; */
    return getMockedSentProposals(userId);
  } catch (error) {
    console.error(`Error al obtener propuestas enviadas del usuario ${userId}:`, error);
    return [];
  }
};

export const getSugerencias = async (userId: number): Promise<PublicacionIntercambio[]> => {
  try {
    // const response = await axios.get<PublicacionIntercambio[]>(`${API_BASE_URL}/${userId}/sugerencias`);
    // return response.data;
    return getMockedSugerencias(userId);
  } catch (error) {
    console.error(`Error al obtener sugerencias para el usuario ${userId}:`, error);
    throw error;
  }
};
