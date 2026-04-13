import axios from "axios";
import { API_CONFIG } from "../config/apiConfig";
import { SearchFiguritasFilters } from "../interfaces/search/SearchFiguritasFilters";
import { SearchFiguritasResponse } from "../interfaces/search/SearchFiguritasResponse";
import { AddMissingCardRequest } from "../interfaces/figuritas/AddMissingCardRequest";
import { AddMissingCardResponse } from "../interfaces/figuritas/AddMissingCardResponse";
import { mockSearchFiguritas, mockAddMissingCardResponse } from "../../mocks/figuritasMock";

export const addMissingCard = async (userId: number, data: AddMissingCardRequest): Promise<AddMissingCardResponse> => {
    try {
        /* Ésta es la llamada al backend, pero por esta entrega, usamos mocks
        const response = await axios.post<AddMissingCardResponse>(
            `${API_CONFIG.figuritas.base}/registrar-faltante`,
            data,
            { params: { userId } }
        );
        return response.data; */
        return mockAddMissingCardResponse();
    } catch (error) {
        console.error('Error al registrar figurita faltante:', error);
        throw error;
    }
};

export const searchFiguritas = async (filters: SearchFiguritasFilters): Promise<SearchFiguritasResponse> => {
    try {
        const params = {
            numero: filters.numero,
            jugador: filters.jugador,
            seleccion: filters.seleccion,
            equipo: filters.equipo
        } as SearchFiguritasFilters;

        /* Ésta es la llamada al backend, pero por esta entrega, usamos mocks
        const result = await axios.get<SearchFiguritasResponse>(`${API_CONFIG.figuritas.search}`, { params });
        return result.data; */
        return mockSearchFiguritas();
    } catch (error) {
        console.error(`Error en la búsqueda de figuritas:`, error);
        return { figuritas: [], count: 0 } as SearchFiguritasResponse;
    }
};
