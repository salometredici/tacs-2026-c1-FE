import axios from 'axios';
import { API_CONFIG } from '../config/apiConfig';

export interface AppSettings {
  maxPendingProposals: number;
  maxOffersPerAuction: number;
}

// Configuración global (solo admin). GET para visualizar, PUT para modificar.
// El PUT es full-replace: hay que mandar ambos campos.
export const getSettings = async (): Promise<AppSettings> => {
  const res = await axios.get<AppSettings>(API_CONFIG.settings.base);
  return res.data;
};

export const updateSettings = async (settings: AppSettings): Promise<AppSettings> => {
  const res = await axios.put<AppSettings>(API_CONFIG.settings.base, settings);
  return res.data;
};
