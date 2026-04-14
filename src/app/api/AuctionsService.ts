import { Auction as Auction } from '../interfaces/auction/Auction';
import { getMockedActiveAuctions, getMockedCreatedAuctionResponse, getMockedUserAuctions } from '../../mocks/auctionsMock';
import axios from 'axios';
import { API_CONFIG } from '../config/apiConfig';
import { CreateAuctionRequest } from '../interfaces/auction/CreateAuctionRequest';
import { CreateAuctionResponse } from '../interfaces/auction/CreateAuctionResponse';

export const getActiveAuctions = async (): Promise<Auction[]> => {
  try {
    /* En backend: ResponseEntity<List<SubastaDTO>> — GET /api/auctions?status=active
     * NOTA: endpoint no existe aún en backend. Subasta no es @Entity ni tiene controller/service.
    const result = await axios.get<Auction[]>(`${API_CONFIG.auctions.base}`, { params: { status: 'active' } });
    return result.data; */
    return getMockedActiveAuctions();
  } catch (error) {
    console.error('Error al obtener subastas activas:', error);
    return [];
  }
};

export const createAuction = async (data: CreateAuctionRequest): Promise<CreateAuctionResponse> => {
  try {
    /* En backend: ResponseEntity<SubastaDTO> — POST /api/auctions
     * NOTA: endpoint no existe aún en backend.
    const response = await axios.post<CreateAuctionResponse>(`${API_CONFIG.auctions.base}`, data);
    return response.data; */
    return getMockedCreatedAuctionResponse();
  } catch (error) {
    console.error('Error al crear la subasta:', error);
    throw error;
  }
};

export const getAuctionsByUserId = async (userId: number): Promise<Auction[]> => {
  try {
    /* En backend: ResponseEntity<List<SubastaDTO>> — GET /api/auctions?publicanteId=
     * NOTA: endpoint no existe aún en backend.
    const result = await axios.get<Auction[]>(`${API_CONFIG.auctions.base}`, { params: { publicanteId: userId } });
    return result.data; */
    return getMockedUserAuctions(userId);
  } catch (error) {
    console.error(`Error al obtener subastas del usuario ${userId}:`, error);
    return [];
  }
};



export const placeBid = async (auctionId: number, userId: number, figuritasIds: number[]): Promise<void> => {
  try {
    /* En backend: ResponseEntity<Void> — post ...
     * Pendiente: alinear rutas en backend.
    await axios.post(
      `${API_CONFIG.baseUrl}/api/falta`,
      null,
      { params: { auctionId, userId, figuritasIds } }
    ); */
    return;

  } catch (e) {
    console.error('Error al realizar la oferta:', e);
    throw e;
  }
}
