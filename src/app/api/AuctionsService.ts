import { Auction as Auction } from '../interfaces/auction/Auction';
import { getMockedActiveAuctions, getMockedCreatedAuctionResponse, getMockedUserAuctions, getMockedUserBids } from '../../mocks/auctionsMock';
import axios from 'axios';
import { API_CONFIG } from '../config/apiConfig';
import { CreateAuctionRequest } from '../interfaces/auction/CreateAuctionRequest';
import { CreateAuctionResponse } from '../interfaces/auction/CreateAuctionResponse';

export const getActiveAuctions = async (): Promise<Auction[]> => {
  try {
    /* En backend: ResponseEntity<List<SubastaDTO>> — GET /api/auctions?status=active
     * NOTA: endpoint no existe aún en backend
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
    /* En backend: ResponseEntity<String> — POST /api/subastas/userId={userId} y body NuevaSubastaDto
    Hay un pequeño mismatch en el Request (falta agregar el rating en BE y el cantMinFiguritas en FE)
    const response = await axios.post<string>(`${API_CONFIG.auctions.base}`, data);
    return response.data; */
    return getMockedCreatedAuctionResponse();
  } catch (error) {
    console.error('Error al crear la subasta:', error);
    throw error;
  }
};

export const getAuctionsByUserId = async (userId: number): Promise<Auction[]> => {
  try {
    /* En backend: ResponseEntity<List<SubastaDTO>> — GET /api/auctions/{userId}
     * NOTA: endpoint no existe aún en backend
    const result = await axios.get<Auction[]>(`${API_CONFIG.auctions.base}/${userId}`);
    return result.data; */
    return getMockedUserAuctions(userId);
  } catch (error) {
    console.error(`Error al obtener subastas del usuario ${userId}:`, error);
    return [];
  }
};

export const getAuctionBidsByUserId = async (userId: number): Promise<Auction[]> => {
  try {
    /* GET /api/auctions?postorId={userId}
    const result = await axios.get<Auction[]>(`${API_CONFIG.auctions.base}`, { params: { postorId: userId } });
    return result.data; */
    return getMockedUserBids(userId);
  } catch (error) {
    console.error(`Error al obtener ofertas del usuario ${userId}:`, error);
    return [];
  }
};

export const placeBid = async (auctionId: number, userId: number, figuritasIds: number[]): Promise<void> => {
  try {
    /* En backend: ResponseEntity<String>
      Pendiente: alinear rutas en backend.
    await axios.post(
      `${API_CONFIG.baseUrl}/api/{subastaId}/ofertas}`,
      NuevaSubastaOfertaDto,
      { params: { userId } }
    ); */
    return;

  } catch (e) {
    console.error('Error al realizar la oferta:', e);
    throw e;
  }
}
