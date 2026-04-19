import { Auction } from '../interfaces/auctions/Auction';
import { UserBid } from '../interfaces/auctions/bid/UserBid';
import { getMockedActiveAuctions, getMockedAuctionById, getMockedCreatedAuctionResponse, getMockedUserAuctions, getMockedUserBids } from '../../mocks/auctionsMock';
import axios from 'axios';
import { API_CONFIG } from '../config/apiConfig';
import { CreateAuctionRequest } from '../interfaces/auctions/CreateAuctionRequest';
import { CreateAuctionResponse } from '../interfaces/auctions/CreateAuctionResponse';

// Para obtener las subastas activas
export const getActiveAuctions = async (): Promise<Auction[]> => {
  try {
    /* En backend: GET /api/auctions?status=active - Más adelante quizás un search genérico con params
    const result = await axios.get<Auction[]>(`${API_CONFIG.auctions.base}`, { params: { status: 'active' } });
    return result.data; */
    return getMockedActiveAuctions();
  } catch (error) {
    console.error('Error al obtener subastas activas:', error);
    return [];
  }
};

// Para crear una nueva subasta (a partir del botón)
export const createAuction = async (data: CreateAuctionRequest): Promise<CreateAuctionResponse> => {
  try {
    /* En backend: — POST /api/subastas/userId={userId} y body NuevaSubastaDto
    Hay un pequeño mismatch en el Request
    const response = await axios.post<string>(`${API_CONFIG.auctions.base}`, data);
    return response.data; */
    return getMockedCreatedAuctionResponse();
  } catch (error) {
    console.error('Error al crear la subasta:', error);
    throw error;
  }
};

// Para obtener las subastas del usuario logueado, visible en "Mis Subastas"
export const getAuctionsByUserId = async (userId: string): Promise<Auction[]> => {
  try {
    /* En backend: GET /api/auctions/{userId}
    const result = await axios.get<Auction[]>(`${API_CONFIG.auctions.base}/${userId}`);
    return result.data; */
    return getMockedUserAuctions(userId);
  } catch (error) {
    console.error(`Error al obtener subastas del usuario ${userId}:`, error);
    return [];
  }
};

// Para obtener el detalle de una subasta en particular cuando se hace click sobre la misma (desde donde sea)
export const getAuctionById = async (id: string): Promise<Auction | null> => {
  try {
    /* GET /api/auctions/:id
    const result = await axios.get<Auction>(`${API_CONFIG.auctions.base}/${id}`);
    return result.data; */
    return getMockedAuctionById(id) ?? null;
  } catch (error) {
    console.error(`Error al obtener la subasta ${id}:`, error);
    return null;
  }
};

// Para finalizar una subasta (cuando se selecciona un ganador entre los ofertantes)
export const endAuction = async (auctionId: string, winnerBidId: string): Promise<void> => {
  try {
    /* POST /api/auctions/:id/end  body: { winnerBidId }
    await axios.post(`${API_CONFIG.auctions.base}/${auctionId}/end`, { winnerBidId }); */
    return;
  } catch (error) {
    console.error(`Error al finalizar la subasta ${auctionId}:`, error);
    throw error;
  }
};

// Para cancelar una subasta, sin haber elegido ganadores (el que publicó se arrepintió, básicamente)
export const cancelAuction = async (auctionId: string): Promise<void> => {
  try {
    /* POST /api/auctions/:id/cancel
    await axios.post(`${API_CONFIG.auctions.base}/${auctionId}/cancel`); */
    return;
  } catch (error) {
    console.error(`Error al cancelar la subasta ${auctionId}:`, error);
    throw error;
  }
};

// Para poder ver las ofertas del usuario logueado en "Mis Ofertas"
// Retorna todas las subastas asociadas a ese userId, separado del search porque devuelve los campos para ser mostrados en el perfil (otro modelo)
export const getAuctionBidsByUserId = async (userId: string): Promise<UserBid[]> => {
  try {
    /* GET /api/auctions?postorId={userId}
    const result = await axios.get<UserBid[]>(`${API_CONFIG.auctions.base}`, { params: { postorId: userId } });
    return result.data; */
    return getMockedUserBids(userId);
  } catch (error) {
    console.error(`Error al obtener ofertas del usuario ${userId}:`, error);
    return [];
  }
};

// Para ofertar sobre una subasta (desde el detalle de la misma, con el botón "Ofertar")
export const placeBid = async (auctionId: string, userId: string, figuritasIds: string[]): Promise<void> => {
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
