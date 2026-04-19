import axios from 'axios';
import { API_CONFIG } from '../config/apiConfig';
import { getMockedReceivedProposals } from '../../mocks/proposalsMock';
import { Proposal } from '../interfaces/proposals/Proposal';

/* Las propuestas existen únicamente involucrando a dos usuarios, por lo que muevo los endpoints a este service independiente del de usuarios
Además, las propuestas tienen que poder aceptarse, rechazarse, cancelarse, consultarse y crearse. Pienso que sería darle demasiada responsabilidad al controller de usuarios
*/

/* Consulta */

/* Para obtener propuestas por varios filtros (por ahora status, por ej)
Desde el perfil:
Tab propuestas enviadas: pueden obtenerse aquellas propuestas que creó el usuario sobre publicaciones de otros (con postorId=userId, el usuario es el ofertante)
Tab propuestas recibidas: pueden obtenerse aquellas propuestas enviadas al usuario sobre sus publicaciones (con publisherId=userId, el usuario creó la publicación sobre la que se hace la propuesta)
*/
export const getProposals = async (publisherId: string = '', postorId: string = '', status: string = ''): Promise<Proposal[]> => {
  try {
    /* En backend:  GET /api/proposals + params
    const response = await axios.get<Propuesta[]>(`${BASE_URL}/${userId}/proposals`); // corregir models!
    return response.data; */
    return getMockedReceivedProposals(publisherId);
  } catch (error) {
    console.error(`Error al obtener las propuestas: `, error);
    return [];
  }
};

/* Acciones */

// Para hacerle una propuesta a un usuario sobre alguna de sus publicaciones
export const makeProposal = async (publicacionId: string, userId: string, numFiguritas: number[]): Promise<void> => {
  try {
    /* En backend: POST /api/proposals
    await axios.post(`${API_CONFIG.baseUrl}/api/proposals`, { numfiguritas: numFiguritas }, { params: { userId } } // Idemmm! crear models
    ); */
    return;
  } catch (error) {
    console.error('Error al hacer la propuesta: ', error);
    throw error;
  }
}

// Para aceptar la propuesta que me hace un usuario (desde el tab del perfil o desde las notificaciones)
export const acceptProposal = async (proposalId: string, userId: string): Promise<void> => {
  try {
    /* En backend: PUT /api/proposals/{propuestaId}/accept
    await axios.put(`${API_CONFIG.baseUrl}/api/proposals/${propuestaId}/accept`, null, { params: { proposalId } } // Corregir ruta y agregar un model de request y response que sea mas representativo para la operacion, y tmb que nos sirva
    ); */
    return;
  } catch (error) {
    console.error('Error al aceptar la propuesta: ', error);
    throw error;
  }
};

// Para rechazar la propuesta que me hace un usuario (desde el tab del perfil o desde las notificaciones)
export const rejectProposal = async (proposalId: string, userId: string): Promise<void> => {
  try {
    /* En backend: PUT /api/proposals/{proposalId}/reject
    await axios.put(`${API_CONFIG.baseUrl}/api/proposals/${proposalId}/reject`, null, { params: { proposalId } } // idem anterior, proposalId en route y en body RejectProposalRequest
    ); */
    return;
  } catch (error) {
    console.error('Error al rechazar la propuesta: ', error);
    throw error;
  }
};

// Para cancelar la propuesta que hice a un usuario (desde el tab del perfil en propuestas enviadas)
// Un patch porque a diferencia del aceptar o rechazar, no vamos a tener que actualizar mas recursos que la propuesta hecha (en principio)
export const cancelProposal = async (proposalId: string, userId: string): Promise<void> => {
  try {
    await axios.patch(`${API_CONFIG.baseUrl}/api/proposals/${proposalId}/cancel`, null, { params: { userId } });
    return;
  } catch (error) {
    console.error('Error al cancelar la propuesta: ', error);
    throw error;
  }
};
