import axios from "axios";
import { API_CONFIG } from "../config/apiConfig";
import { Card } from "../interfaces/cards/Card";
import { Publication } from "../interfaces/publications/Publication";
import { Auction } from "../interfaces/auctions/Auction";
import { mapPublication, TradePublicationDto } from "./PublicationsService";
import { mapAuction, AuctionDto } from "./AuctionsService";

const BASE_URL = API_CONFIG.cards;

/** Una página de resultados (data + metadata de paginación). */
export interface Paginated<T> {
  data: T[];
  currentPage: number;
  totalPages: number;
}

/** Resultado de la búsqueda de figuritas: combina publicaciones y subastas activas. */
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

// Catálogo completo — se cachea en sessionStorage para no repetir el request
// El filtrado se hace en el FE sobre los datos cacheados
const CATALOG_KEY = 'figuritas_catalog';
export const getCatalog = async (): Promise<Card[]> => {
    const cached = sessionStorage.getItem(CATALOG_KEY);
    if (cached) return JSON.parse(cached) as Card[];
    try {
        const response = await axios.get<Card[]>(BASE_URL.catalog);
        sessionStorage.setItem(CATALOG_KEY, JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        console.error("Error al obtener el catálogo: ", error);
        return [];
    }
};
export const clearCatalogCache = () => sessionStorage.removeItem(CATALOG_KEY);

export const getCatalogCardById = async (id: string): Promise<Card | null> => {
    try {
        const response = await axios.get<Card>(`${BASE_URL.catalog}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener figurita ${id}:`, error);
        return null;
    }
};

/**
 * Búsqueda de figuritas disponibles en publicaciones y subastas activas.
 * Devuelve dos listas paralelas para que el FE pueda renderear cada origen con
 * sus acciones específicas (proponer intercambio en publi, hacer oferta en subasta).
 */
interface BackendPaginated<T> {
    data: T[];
    currentPage: number;
    totalPages: number;
}

const emptyPage = <T,>(): Paginated<T> => ({ data: [], currentPage: 1, totalPages: 0 });

export const searchAvailable = async (filters: SearchAvailableFilters): Promise<SearchAvailableResponse> => {
    try {
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
    } catch (error: any) {
        console.error('Error al buscar figuritas disponibles:', error?.response?.status, error?.response?.data ?? error?.message);
        return { publications: emptyPage<Publication>(), auctions: emptyPage<Auction>() };
    }
};