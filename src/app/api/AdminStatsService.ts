import axios from 'axios';
import { API_CONFIG } from '../config/apiConfig';

export interface AdminOverview {
  totalUsers: number;
  activeAuctions: number;
  activePublications: number;
  totalExchanges: number;
}

export type StatsPeriod = 'day' | 'week' | 'month';

export interface DailyEntry {
  date: string; // ISO date (YYYY-MM-DD)
  count: number;
}

export interface Timeseries {
  period: StatsPeriod;
  total: number;
  daily: DailyEntry[];
}

// Capa 1 del dashboard admin: counts puntuales del sistema. Cuatro count() server-side, live.
export const getAdminOverview = async (): Promise<AdminOverview> => {
  const res = await axios.get<AdminOverview>(API_CONFIG.adminStats.overview);
  return res.data;
};

// Capa 2 del dashboard admin: counts por período. Snapshots diarios + delta del día en curso.
export const getAuctionsTimeseries = async (period: StatsPeriod): Promise<Timeseries> => {
  const res = await axios.get<Timeseries>(API_CONFIG.adminStats.auctions, { params: { period } });
  return res.data;
};

export const getProposalsTimeseries = async (period: StatsPeriod): Promise<Timeseries> => {
  const res = await axios.get<Timeseries>(API_CONFIG.adminStats.proposals, { params: { period } });
  return res.data;
};

export const getExchangesTimeseries = async (period: StatsPeriod): Promise<Timeseries> => {
  const res = await axios.get<Timeseries>(API_CONFIG.adminStats.exchanges, { params: { period } });
  return res.data;
};

// Capa 3 del dashboard admin: highlights (top-N) live + cache TTL 5min server-side.

export interface MostWantedCardEntry {
  cardId: string;
  cardNumber: number | null;
  cardDescription: string;
  userCount: number;
  periodDays: number;
}

export interface TopExchangedCardEntry {
  cardId: string;
  cardNumber: number | null;
  cardDescription: string;
  occurrences: number;
  periodDays: number;
}

export interface TopAuctionByOffersEntry {
  auctionId: string;
  cardId: string;
  cardDescription: string;
  publisherName: string;
  pendingOffers: number;
  totalOffers: number;
}

export const getMostWantedCards = async (days = 7): Promise<MostWantedCardEntry[]> => {
  const res = await axios.get<MostWantedCardEntry[]>(API_CONFIG.adminStats.mostWantedCards, { params: { days } });
  return res.data;
};

export const getTopExchangedCards = async (days = 7): Promise<TopExchangedCardEntry[]> => {
  const res = await axios.get<TopExchangedCardEntry[]>(API_CONFIG.adminStats.topExchangedCards, { params: { days } });
  return res.data;
};

// Devuelve null si no hay subastas activas con ofertas (BE retorna 204 No Content).
export const getTopAuctionByOffers = async (): Promise<TopAuctionByOffersEntry | null> => {
  const res = await axios.get<TopAuctionByOffersEntry | ''>(API_CONFIG.adminStats.topAuctionByOffers);
  if (res.status === 204 || !res.data) return null;
  return res.data as TopAuctionByOffersEntry;
};
