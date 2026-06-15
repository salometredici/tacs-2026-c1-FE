import axios from 'axios';
import { API_CONFIG } from '../config/apiConfig';

export interface AdminOverview {
  totalUsers: number;
  activeAuctions: number;
  activePublications: number;
  totalExchanges: number;
}

// Capa 1 del dashboard admin: counts puntuales del sistema. Cuatro count() server-side, live.
export const getAdminOverview = async (): Promise<AdminOverview> => {
  const res = await axios.get<AdminOverview>(API_CONFIG.adminStats.overview);
  return res.data;
};
