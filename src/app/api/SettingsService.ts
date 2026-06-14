import axios from 'axios';
import { API_CONFIG } from '../config/apiConfig';

export interface AppSettings {
  maxPendingProposals: number;
}

// Configuración global (solo admin). GET para visualizar, PUT para modificar.
export const getSettings = async (): Promise<AppSettings> => {
  const res = await axios.get<AppSettings>(API_CONFIG.settings.base);
  return res.data;
};

export const updateSettings = async (maxPendingProposals: number): Promise<AppSettings> => {
  const res = await axios.put<AppSettings>(API_CONFIG.settings.base, { maxPendingProposals });
  return res.data;
};
