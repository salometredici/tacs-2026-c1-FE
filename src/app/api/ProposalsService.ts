import axios from 'axios';
import { API_CONFIG } from '../config/apiConfig';
import { getMockedReceivedProposals } from '../../mocks/proposalsMock';
import { Proposal } from '../interfaces/proposals/Proposal';

export const getProposals = async (publisherId: string = '', _bidderId: string = '', _status: string = ''): Promise<Proposal[]> => {
  try {
    /* GET /api/proposals + params
    const response = await axios.get<Proposal[]>(`${API_CONFIG.baseUrl}/api/proposals`, { params: { publisherId, bidderId, status } });
    return response.data; */
    return getMockedReceivedProposals(publisherId);
  } catch (error) {
    console.error('Error al obtener propuestas:', error);
    return [];
  }
};

export const makeProposal = async (_publicationId: string, _userId: string, _numFiguritas: number[]): Promise<void> => {
  try {
    /* POST /api/proposals
    await axios.post(`${API_CONFIG.baseUrl}/api/proposals`, { figuritaNumbers: numFiguritas }, { params: { userId } });
    */
    return;
  } catch (error) {
    console.error('Error al realizar propuesta:', error);
    throw error;
  }
};

export const acceptProposal = async (_proposalId: string, _userId: string): Promise<void> => {
  try {
    /* PUT /api/proposals/{proposalId}/accept
    await axios.put(`${API_CONFIG.baseUrl}/api/proposals/${proposalId}/accept`, null, { params: { userId } });
    */
    return;
  } catch (error) {
    console.error('Error al aceptar propuesta:', error);
    throw error;
  }
};

export const rejectProposal = async (_proposalId: string, _userId: string): Promise<void> => {
  try {
    /* PUT /api/proposals/{proposalId}/reject
    await axios.put(`${API_CONFIG.baseUrl}/api/proposals/${proposalId}/reject`, null, { params: { userId } });
    */
    return;
  } catch (error) {
    console.error('Error al rechazar propuesta:', error);
    throw error;
  }
};

export const cancelProposal = async (proposalId: string, userId: string): Promise<void> => {
  try {
    await axios.patch(`${API_CONFIG.baseUrl}/api/proposals/${proposalId}/cancel`, null, { params: { userId } });
    return;
  } catch (error) {
    console.error('Error al cancelar propuesta:', error);
    throw error;
  }
};
