import axios from "axios";
import { API_CONFIG } from "../config/apiConfig";
import { Card } from "../interfaces/cards/Card";
import { Publication } from "../interfaces/publications/Publication";
import { Auction } from "../interfaces/auctions/Auction";
import { mapPublication, TradePublicationDto } from "./PublicationsService";
import { mapAuction, AuctionDto } from "./AuctionsService";

const BASE_URL = API_CONFIG.cards;

export interface Paginated<T> {
  data: T[];
  currentPage: number;
  totalPages: number;
}

export interface SearchAvailableResponse {
  publications: Paginated<Publication>;
  auctions: Paginated<Auction>;
}

export interface SearchAvailableFilters {
  number?: number;
  description?: string;
  country?: string;
  team?: string;
  category?: string;
  cardType?: string;
  pubPage?: number;
  pubPerPage?: number;
  aucPage?: number;
  aucPerPage?: number;
}

const CATALOG_KEY = 'figuritas_catalog';

export const getCatalog = async (): Promise<Card[]> => {
  const cached = sessionStorage.getItem(CATALOG_KEY);
  if (cached) return JSON.parse(cached) as Card[];
  const response = await axios.get<Card[]>(BASE_URL.catalog);
  sessionStorage.setItem(CATALOG_KEY, JSON.stringify(response.data));
  return response.data;
};

export const clearCatalogCache = () => sessionStorage.removeItem(CATALOG_KEY);

export const getCatalogCardById = async (id: string): Promise<Card | null> => {
  const response = await axios.get<Card>(`${BASE_URL.catalog}/${id}`);
  return response.data;
};

interface BackendPaginated<T> {
  data: T[];
  currentPage: number;
  totalPages: number;
}

export const searchAvailable = async (filters: SearchAvailableFilters): Promise<SearchAvailableResponse> => {
  const params: Record<string, string | number> = {};
  if (filters.number != null) params.number = filters.number;
  if (filters.description?.trim()) params.description = filters.description.trim();
  if (filters.country?.trim()) params.country = filters.country.trim();
  if (filters.team?.trim()) params.team = filters.team.trim();
  if (filters.category?.trim()) params.category = filters.category.trim().toUpperCase();
  if (filters.cardType?.trim()) params.cardType = filters.cardType.trim().toUpperCase();
  if (filters.pubPage != null) params.pubPage = filters.pubPage;
  if (filters.pubPerPage != null) params.pubPerPage = filters.pubPerPage;
  if (filters.aucPage != null) params.aucPage = filters.aucPage;
  if (filters.aucPerPage != null) params.aucPerPage = filters.aucPerPage;

  const response = await axios.get<{
    publications: BackendPaginated<TradePublicationDto>;
    auctions: BackendPaginated<AuctionDto>;
  }>(BASE_URL.search, { params });

  const pubs = response.data?.publications;
  const aucs = response.data?.auctions;
  return {
    publications: {
      data: (pubs?.data ?? []).map(mapPublication),
      currentPage: pubs?.currentPage ?? 1,
      totalPages: pubs?.totalPages ?? 0,
    },
    auctions: {
      data: (aucs?.data ?? []).map(mapAuction),
      currentPage: aucs?.currentPage ?? 1,
      totalPages: aucs?.totalPages ?? 0,
    },
  };
};
