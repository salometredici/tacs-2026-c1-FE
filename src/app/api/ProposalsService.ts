import axios from 'axios';
import { API_CONFIG } from '../config/apiConfig';

export const acceptProposal = async (
  publicacionId: number,
  propuestaId: number,
  userId: number
): Promise<void> => {
  try {
    /* En backend: ResponseEntity<Void> — PUT /api/proposals/{propuestaId}/accept
     * NOTA: backend actual usa /api/publicaciones/intercambios/{publicacionId}/propuestas/{propuestaId}/aceptar
     * Pendiente: alinear rutas en backend a algo similar a
    await axios.put(
      `${API_CONFIG.baseUrl}/api/proposals/${propuestaId}/accept`,
      null,
      { params: { userId } }
    ); */
    return;
  } catch (error) {
    console.error('Error al aceptar propuesta:', error);
    throw error;
  }
};

export const rejectProposal = async (
  publicacionId: number,
  propuestaId: number,
  userId: number
): Promise<void> => {
  try {
    /* En backend: ResponseEntity<Void> — PUT /api/proposals/{propuestaId}/reject
     * NOTA: backend actual usa /api/publicaciones/intercambios/{publicacionId}/propuestas/{propuestaId}/rechazar
     * Pendiente: alinear rutas en backend.
    await axios.put(
      `${API_CONFIG.baseUrl}/api/proposals/${propuestaId}/reject`,
      null,
      { params: { userId } }
    ); */
    return;
  } catch (error) {
    console.error('Error al rechazar propuesta:', error);
    throw error;
  }
};

export const makeProposal = async (
  publicacionId: number,
  userId: number,
  numFiguritas: number[]
): Promise<void> => {
  try {
    /* En backend: POST /api/publicaciones/intercambios/{publicacionId}/propuestas?userId=
    await axios.post(
      `${API_CONFIG.baseUrl}/api/publicaciones/intercambios/${publicacionId}/propuestas`,
      { numfiguritas: numFiguritas },
      { params: { userId } }
    ); */
    return;
  } catch (error) {
    console.error('Error al enviar propuesta:', error);
    throw error;
  }
};
