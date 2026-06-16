import axios from 'axios';
import { API_CONFIG } from '../config/apiConfig';

export interface BroadcastRequest {
  type: 'GLOBAL_ANNOUNCEMENT';
  message: string;
}

// Envía una notificación global a todos los users (sólo admin). El BE persiste una global
// stateless y la enlaza en la cola de cada user con un updateMulti server-side.
export const sendBroadcast = async (message: string): Promise<void> => {
  const body: BroadcastRequest = { type: 'GLOBAL_ANNOUNCEMENT', message };
  await axios.post(API_CONFIG.broadcast.base, body);
};
