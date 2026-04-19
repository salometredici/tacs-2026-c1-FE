import axios from 'axios';
import { Exchange } from '../interfaces/exchanges/Exchange';
import { FeedbackRequest } from '../interfaces/exchanges/FeedbackRequest';
import { PublishFiguritaRequest } from '../interfaces/exchanges/PublishFiguritaRequest';
import { Publicacion } from '../interfaces/publicaciones/Publicacion';
import { getMockedExchanges } from '../../mocks/exchangesMock';
import { getMockedMyPublications } from '../../mocks/proposalsMock';
import { API_CONFIG } from '../config/apiConfig';
import { PublicacionStatus } from '../interfaces/publicaciones/publicacionTypes';

// NOTA: la ruta usada en el FE es /exchanges.
// El backend actual usa rutas distintas (/publicaciones/intercambios, /feedback, etc.).
// Pendiente: alinear rutas en backenda

export const getExchangesByUserId = async (userId: string): Promise<Exchange[]> => {
  try {
    /* En backend: ResponseEntity<List<IntercambioDTO>> — GET /api/exchanges?userId=
    const response = await axios.get<Exchange[]>(`${API_CONFIG.baseUrl}/api/exchanges`, { params: { userId } });
    return response.data; */
    return getMockedExchanges(userId);
  } catch (error) {
    console.error('Error al obtener intercambios:', error);
    return [];
  }
};

export const getCardsForExchangeByUserId = async (
  userId: string,
  status?: PublicacionStatus
): Promise<Publicacion[]> => {
  try {
    /* En backend: ResponseEntity<List<PublicacionIntercambioDTO>> — GET /api/exchanges/publications?userId=&status=
    const response = await axios.get<PublicacionIntercambio[]>(
      `${API_CONFIG.baseUrl}/api/exchanges/publications`,
      { params: { userId, ...(status && { status }) } }
    );
    return response.data; */
    const all = getMockedMyPublications(userId);
    return status ? all.filter(p => p.status === status) : all;
  } catch (error) {
    console.error('Error al obtener publicaciones de intercambio:', error);
    return [];
  }
};

// Crea una publicación de intercambio para una figurita que ya existe la colección del usuario
export const publishFigurita = async (userId: string, data: PublishFiguritaRequest): Promise<void> => {
  try {
    /* En backend: ResponseEntity<PublicacionIntercambioDTO> — POST /api/exchanges/publications
    await axios.post(
      `${API_CONFIG.baseUrl}/api/exchanges/publications`,
      data,
      { params: { userId } }
    ); */
    return;
  } catch (error) {
    console.error('Error al publicar figurita para intercambio:', error);
    throw error;
  }
};

export const submitFeedback = async (exchangeId: number, data: FeedbackRequest): Promise<void> => {
  try {
    /* En backend: ResponseEntity<Void> — POST /api/exchanges/{exchangeId}/rating
    await axios.post(`${API_CONFIG.baseUrl}/api/exchanges/${exchangeId}/rating`, data); */
    return;
  } catch (error) {
    console.error('Error al enviar calificación:', error);
    throw error;
  }
};
