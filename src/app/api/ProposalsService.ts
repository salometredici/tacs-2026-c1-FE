import axios from 'axios';
import { API_CONFIG } from '../config/apiConfig';
import { getMockedReceivedProposals, getMockedProposalsByPublicationId } from '../../mocks/proposalsMock';
import { Proposal } from '../interfaces/proposals/Proposal';

const BASE = API_CONFIG.proposals.base;

/**
 * BE no tiene endpoint de listar proposals (sólo GET por id; los lados embebidos están en la
 * publication). Mientras no exista, este caller usa mock.
 */
export const getProposals = async (publisherId: string = '', _bidderId: string = '', _status: string = ''): Promise<Proposal[]> => {
  return getMockedReceivedProposals(publisherId);
};

/** Idem: BE aún no expone listar por publicación. */
export const getProposalsByPublicationId = async (publicationId: string): Promise<Proposal[]> => {
  return getMockedProposalsByPublicationId(publicationId);
};

export const makeProposal = async (
  publicationId: string,
  _userId: string,
  cardIds: string[],
  requestedCount: number,
): Promise<void> => {
  try {
    await axios.post(BASE, { publicationId, cardIds, requestedCount });
  } catch (error) {
    console.error('Error al realizar propuesta:', error);
    throw error;
  }
};

export const acceptProposal = async (proposalId: string, _userId: string): Promise<void> => {
  try {
    await axios.put(API_CONFIG.proposals.accept(proposalId));
  } catch (error) {
    console.error('Error al aceptar propuesta:', error);
    throw error;
  }
};

export const rejectProposal = async (proposalId: string, _userId: string): Promise<void> => {
  try {
    await axios.put(API_CONFIG.proposals.reject(proposalId));
  } catch (error) {
    console.error('Error al rechazar propuesta:', error);
    throw error;
  }
};

export const cancelProposal = async (proposalId: string, _userId: string): Promise<void> => {
  try {
    await axios.put(API_CONFIG.proposals.cancel(proposalId));
  } catch (error) {
    console.error('Error al cancelar propuesta:', error);
    throw error;
  }
};
