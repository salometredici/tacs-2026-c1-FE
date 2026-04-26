import { Exchange } from '../interfaces/exchanges/Exchange';
import { FeedbackRequest } from '../interfaces/exchanges/FeedbackRequest';
import { PublishFiguritaRequest } from '../interfaces/exchanges/PublishFiguritaRequest';
import { Publication } from '../interfaces/publications/Publication';
import { getMockedExchanges } from '../../mocks/exchangesMock';
import { getMockedMyPublications } from '../../mocks/proposalsMock';
import { PublicationStatus } from '../interfaces/publications/publicationTypes';

export const getExchangesByUserId = async (userId: string): Promise<Exchange[]> => {
  try {
    /* GET /api/exchanges?userId=
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
  status?: PublicationStatus
): Promise<Publication[]> => {
  try {
    /* GET /api/exchanges/publications?userId=&status=
    const response = await axios.get<Publication[]>(
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

export const publishFigurita = async (_userId: string, _data: PublishFiguritaRequest): Promise<void> => {
  try {
    /* POST /api/exchanges/publications
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

export const submitFeedback = async (_exchangeId: number, _data: FeedbackRequest): Promise<void> => {
  try {
    /* POST /api/exchanges/{exchangeId}/rating
    await axios.post(`${API_CONFIG.baseUrl}/api/exchanges/${exchangeId}/rating`, data); */
    return;
  } catch (error) {
    console.error('Error al enviar feedback:', error);
    throw error;
  }
};
