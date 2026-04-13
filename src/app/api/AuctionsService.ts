import { Auction as Auction } from '../interfaces/auction/Auction';
import { getMockedActiveAuctions, getMockedCreatedAuctionResponse, getMockedUserAuctions } from '../../mocks/auctionsMock';
import axios from 'axios';
import { API_CONFIG } from '../config/apiConfig';
import { CreateAuctionRequest } from '../interfaces/auction/CreateAuctionRequest';
import { CreateAuctionResponse } from '../interfaces/auction/CreateAuctionResponse';

export const getActiveAuctions = async (): Promise<Auction[]> => {
  try {
    /* Ésta es la llamada al backend, pero por esta entrega, usamos mocks
    const result = await axios.get<Auction[]>(`${API_CONFIG.auctions}&status=active`);
    return result.data; */
    return getMockedActiveAuctions();
  } catch (error) {
    console.error('Error al obtener subastas activas:', error);
    return [];
  }
};

export const createAuction = async (data: CreateAuctionRequest): Promise<CreateAuctionResponse> => {
  try {
    /* Ésta es la llamada al backend, pero por esta entrega, usamos mocks
    const response = await axios.post(`${API_CONFIG.auctions.base}`, data);
    return response.data; */
    return getMockedCreatedAuctionResponse();
  } catch (error) {
    console.error('Error al crear la subasta:', error);
    throw error;
  }
};

export const getAuctionsByUserId = async (userId: number): Promise<Auction[]> => {
  try {
    /* Ésta es la llamada al backend, pero por esta entrega, usamos mocks
    const result = await axios.get<Auction[]>(`${API_CONFIG.auctions.base}`, { params: { publicanteId: userId } });
    return result.data; */
    return getMockedUserAuctions(userId);
  } catch (error) {
    console.error(`Error al obtener subastas del usuario ${userId}:`, error);
    return [];
  }
};
