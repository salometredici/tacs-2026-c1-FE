import axios from "axios";
import { API_CONFIG } from "../config/apiConfig";
import { Card } from "../interfaces/cards/Card";
import { mockSearchFiguritas } from "../../mocks/figuritasMock";
import { SearchFiguritasResponse } from "../interfaces/search/SearchFiguritasResponse";

const BASE_URL = API_CONFIG.cards;

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

/*
    Búsqueda de figuritas disponibles en publicaciones y subastas activas.
    Agrupa por cardId — devuelve una card por figurita con su disponibilidad.
    TODO: implementar cuando el backend migre PublicacionesService y SubastasService a mongo
    por ahora devuelve mock
*/
export const searchAvailable = async (number?: number, description?: string, country?: string,
                                      category?: string, type?: string): Promise<SearchFiguritasResponse> => {
    // TODO: descomentar cuando el backend implemente GET /figuritas/available
    // const response = await axios.get<Figurita[]>(`${BASE_URL.available}`, {
    //     params: { number, description, country, category, type }
    // });
    // return response.data;
    return mockSearchFiguritas();
};